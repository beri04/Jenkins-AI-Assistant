import re 
def parse_adoc(content: str):
    
    content = re.sub(r"```.*?```", "", content, flags=re.DOTALL)

    # Remove inline code
    content = re.sub(r"`([^`]*)`", r"\1", content)

    # Remove markdown headings symbols
    content = re.sub(r"^#+\s*", "", content, flags=re.MULTILINE)

    # Remove AsciiDoc headings
    content = re.sub(r"^=+\s*", "", content, flags=re.MULTILINE)

    # Collapse extra whitespace
    content = re.sub(r"\n{2,}", "\n", content)

    return {
        "type": "docs",
        "content": content.strip()
    }