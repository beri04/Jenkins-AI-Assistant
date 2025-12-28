import yaml
def parse_yaml(content: str):
    try:
        data = yaml.safe_load(content)

    except Exception :
        return {
            "type":"yaml",
            "content":content
        }
    
    if not data:
        return {
            "type":"yaml",
            "content":""
        }
    
    readable_lines = []

    def walk(obj, prefix=""):
        if isinstance(obj, dict):
            for k, v in obj.items():
                walk(v, f"{prefix}{k}: ")

        elif isinstance(obj, list):
            for item in list:
                walk(item, prefix)
        
        else:
            readable_lines.append(f"{prefix}{obj}")

        walk(data)

        return {
            "type":"yaml",
            "content":"\n".join(readable_lines)
        }