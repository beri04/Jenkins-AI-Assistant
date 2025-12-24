import os
def collect_adoc_paths(base_dir):
    adoc_files = []

    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".adoc"):
                full_path = os.path.join(root,file)
                adoc_files.append(full_path)
    return adoc_files

def read_adoc_files(file_path):
    try:
        with open(file_path, "r",encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        print(f"Error in reading the {file_path} : {e}")
        return ""

def save_raw_text(file_name,output_folder,text):
    os.makedirs(output_folder, exist_ok=True)

    output_file = file_name.replace(".adoc", ".txt")

    output_path = os.path.join(output_folder,output_file)

    try:
        with open(output_path,"w", encoding="utf-8")as f:
            f.write(text)
            print(f"Saved in :{output_path}")
    except Exception as e:
        print(f"Error in saving {output_path}: {e}")

def run_parser():
    print("Jenkins Parser is Running")

    base_dir = "jenkins.io/content/doc/"

    output_folder = "data/raw_docs"

    adoc_files = collect_adoc_paths(base_dir)
    # print("Looking in folder:", os.path.abspath(base_dir))
    # print(f"Found {len(adoc_files)} .adoc files")

    for file_path in adoc_files:
        file_name = os.path.basename(file_path)
        print(file_name)

    #     raw_text = read_adoc_files(file_path)

    #     save_raw_text(file_name,output_folder,raw_text)

if __name__ == "__main__":
    run_parser()