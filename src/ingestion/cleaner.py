import os 
import re

def read_raw_text(file_path):
    try:
        with open(file_path,"r",encoding="utf-8",errors="ignore") as f:
            return f.read() or ""
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return ""   # NEVER return None


def clean_text(text):
    # 1. Remove AsciiDoc comment blocks //// ... ////
    text = re.sub(r"////.*?////", "", text, flags=re.DOTALL)

    # 2. Remove NOTE blocks (they start with [NOTE])
    text = re.sub(r"\[NOTE\]\n.*?====", "", text, flags=re.DOTALL)

    # 3. Remove ifdef / endif blocks
    text = re.sub(r"ifdef::.*?\[]", "", text)
    text = re.sub(r"endif::\[]", "", text)

    # 4. Remove section titles ====  (like Blue Ocean status blocks)
    text = re.sub(r"^====$", "", text, flags=re.MULTILINE)

    # 5. Remove AsciiDoc headers (= , == , ===)
    text = re.sub(r"^=+ .*", "", text, flags=re.MULTILINE)

    # 6. Remove lines starting with ':' such as :toc: :icons:
    text = re.sub(r"^:.*", "", text, flags=re.MULTILINE)

    # 7. Remove include statements
    text = re.sub(r"include::.*\[\]", "", text)

    # 8. Remove [source,groovy] or [source,java] etc
    text = re.sub(r"\[source.*?\]", "", text)

    # 9. Remove link:...[] macros
    text = re.sub(r"link:[^\[]*\[[^\]]*\]", "", text)

    # 10. Remove image::...[] macros
    text = re.sub(r"image:.*\[[^\]]*\]", "", text)

    # 11. Remove code block delimiters ----
    text = text.replace("----", "")

    # 12. Remove HTML links inside <>
    text = re.sub(r"<https?://[^>]+>", "", text)
    text = text.replace("\\http", "http")

    # 13. Remove multiple blank lines
    text = re.sub(r"\n\s*\n\s*\n+", "\n\n", text)

    # 14. Remove trailing whitespace
    text = re.sub(r"[ \t]+$", "", text, flags=re.MULTILINE)

    # 15. Remove AsciiDoc line continuation '+'
    text = re.sub(r"^\+\s*", "", text, flags=re.MULTILINE)
    
    # 16. Remove AsciiDoc anchor IDs like [[_something]]
    text = re.sub(r"\[\[_.*?\]\]", "", text)

    # 17. Remove single-dot list markers at beginning of line
    text = re.sub(r"^\.\s+", "", text, flags=re.MULTILINE)

    # 18. Remove the --- lines and *** stars
    text = re.sub(r"^[-*]{3,}$", "", text, flags=re.MULTILINE)

    # 19. Removes the extra Speace b/t numbers
    text = re.sub(r"<(\d+)>\s*", r"<\1> ", text)

    # 20. Removed the [setup-wizard]
    text = re.sub(r"\[\[_.*?\]\]", "", text)

    # 21. Removes the +
    text = re.sub(r"^\s*\+\s*$", "", text, flags=re.MULTILINE)

    # 22 Removes the credentials like password or any sensitive-info
    text = re.sub(r'(?i)(password\s*=\s*["\'].*?["\'])', 'password = "[REDACTED]"', text)
    text = re.sub(r'(?i)(token\s*=\s*["\'].*?["\'])', 'token = "[REDACTED]"', text)
    text = re.sub(r'(?i)(secret\s*=\s*["\'].*?["\'])', 'secret = "[REDACTED]"', text)
    text = re.sub(r'credentials\s*\(.+?\)', 'credentials("[REDACTED]")', text) 


    return text.strip()





def save_cleaned_data(file_name,output_folder,text):
    os.makedirs(output_folder,exist_ok=True)

    output_path = os.path.join(output_folder,file_name)
    with open(output_path,"w",encoding="utf-8",errors="ignore") as f:
        f.write(text)
    print(f"Cleaned:{output_path}")

def run_cleaner():
    print("Cleaning Documentation")
    raw_folder = "data/raw_docs/"
    cleaned_folder = "data/cleaned_docs/"

    raw_files = [i for i in os.listdir(raw_folder) if i.endswith(".txt")]

    for file_name in raw_files:
        raw_path = os.path.join(raw_folder,file_name)

        raw_text = read_raw_text(raw_path)
        if not raw_text.strip():
            print(f"Skipping empty file: {file_name}")
            continue

        cleaned_text = clean_text(raw_text)

        save_cleaned_data(file_name, cleaned_folder, cleaned_text)






if __name__ == "__main__":
    run_cleaner()