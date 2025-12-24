import re
class PipelineCleaner:
    def __init__(self):
        pass

    def load_file(self, path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
        
    def detect_type(self, content):
        if "pipeline {" in content:
            return "declaritive"
        return "scripted"
    
    def detect_agent(self, content):
        match = re.search(r"agent\s*\{([^}]*)\}", content, re.DOTALL)
        return match.group(1).strip() if match else "not found"
    
    def extract_environment(self, content):
        match = re.search(r"environment\s*\{([^}]*)\}", content, re.DOTALL)
        return match.group(1).strip() if match else "not found"
    
    def extract_stages(self, content):
        stages = re.findall(r"stage\s*\(['\"]?(.*?)['\"]?\)\s*\{([^}]*)\}", content, re.DOTALL)
        return [{"name": s[0], "content": s[1].strip()} for s in stages]
    
    def extract_steps(self, stage_content):
        steps = re.findall(r"steps\s*\{([^}]*)\}", stage_content, re.DOTALL)
        if steps:
            return steps[0].strip()
        return "no steps block found"
    def extract_tools(self, content):
        match = re.search(r"tools\s*\{([^}]*)\}", content, re.DOTALL)
        return match.group(1).strip() if match else "not found"