def parse_logs(content:str):
    lines = content.splitlines()
    important = []

    for line in lines:
        lower = line.lower()
        if any(k in lower for k in ["erroe","failed","exception"]):
            important.append(line)

    return {
        "type":"logs",
        "content":"\n".join(important[:200])
    }