from src.pipeline.parser import PipelineCleaner
from src.llm.groq_client import GroqClient

class PipelineAnalyzer:
    def __init__(self):
        self.parser = PipelineCleaner()
        self.client = GroqClient() 

    def analyze(self, filepath):
        content = self.parser.load_file(filepath)

        pipeline_type = self.parser.detect_type(content)
        agent = self.parser.detect_agent(content)
        env = self.parser.extract_environment(content)
        tools = self.parser.extract_tools(content)

        stages_raw = self.parser.extract_stages(content)


        stages = []
        for s in stages_raw:
            steps = self.parser.extract_steps(s["content"])
            stages.append({
                "stage":s["name"],
                "steps":steps
            })

        summary = {
            "pipeline_type": pipeline_type,
            "agent": agent,
            "environment": env,
            "tools": tools,
            "stages": stages
        }