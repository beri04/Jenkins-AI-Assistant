def parse_jenkins(content: str):
    lines = content.splitlines()
    cleaned = []

    for line in lines:
        line = line.strip()
        if not line:
            continue
        if line.startswith("//"):
            continue
        cleaned.append(line)

    return {
        "type":"jenkinsfile",
        "content":"\n".join(cleaned)
    }