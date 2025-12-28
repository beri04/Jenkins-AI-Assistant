from src.file_upload.jenkinfileparser import parse_jenkins
from src.file_upload.parse_logs import parse_logs
from src.file_upload.parse_yaml import parse_yaml
from src.file_upload.parse_adoc import parse_adoc
from src.ingestion.chunker import Chunker
chunker = Chunker()
def detect_file(filename: str):
    filename = filename.lower()
    if filename.endswith(".groovy"):
        return "jenkinsfile"
    
    if filename.endswith(".txt") or filename.endswith(".log"):
        return "logs"
    
    if filename.endswith((".md","adoc")):
        return "docs"
    
    if filename.endswith((".yml",".yaml")):
        return "yaml"
    
    return "undefined file"


def process_uploaded_file(filename: str, raw_content: str):
    file_type = detect_file(filename)

    if not file_type:
        raise ValueError("Unsupported file type")
    
    if file_type == "jenkinsfile":
        parsed_text = parse_jenkins(raw_content)
    
    if file_type == "logs":
        parsed_text = parse_logs(raw_content)
    
    if file_type == "yaml":
        parsed_text = parse_yaml(raw_content)
    
    if file_type == "docs":
        parsed_text = parse_adoc(raw_content)
    
    else:
        parsed_text = raw_content
    chunks = chunker.chunk_text(parsed_text)
    return {
        "type":file_type,
        "chunks":chunks
    }