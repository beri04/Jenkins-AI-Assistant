import os
from src.config.settings import CLEANED_DOCS_DIR , CHUNK_FILE
import json

class Chunker:
    def __init__(self,chunk_size = 400, overlap = 150):
        self.chunk_size = chunk_size
        self.overlap = overlap
    
    def chunk_text(self,text):
        chunks = []
        start = 0

        while start < len(text):
            end = start + self.chunk_size
            chunk = text[start:end]
            chunks.append(chunk)
            start = end - self.overlap
        
        return chunks
    
    def process_all_files(self):
        all_chunks = {}
        chunk_id = 0

        for filename in os.listdir(CLEANED_DOCS_DIR):
            # if not filename.endswith(".txt"):
            #     continue
            file_path = CLEANED_DOCS_DIR / filename
            with open(file_path, "r", encoding = "utf-8") as f:
                text = f.read()
            chunks = self.chunk_text(text)
            for chunk in chunks:
                all_chunks[str(chunk_id)] = {
                    "source_file": filename,
                    "text" : chunk
                }
                chunk_id += 1
            
        with open(CHUNK_FILE,"w",encoding="utf-8") as f:
            json.dump(all_chunks, f, indent = 2)
        return all_chunks
if __name__ == "__main__":
    chunker = Chunker()
    data = chunker.process_all_files()
    print(f"Total chunks created: {len(data)}")