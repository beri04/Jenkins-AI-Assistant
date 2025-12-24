import os
import json
import faiss
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModel
from src.config.settings import EMBEDDING_MODEL,FAISS_INDEX, CHUNK_IDS, CHUNK_FILE

class EmbeddingGenerator:
    def __init__(self):
        # print(f"[INFO] Loading embedding model: {EMBEDDING_MODEL}")

        self.tokenizer = AutoTokenizer.from_pretrained(EMBEDDING_MODEL)
        self.model = AutoModel.from_pretrained(EMBEDDING_MODEL)

        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        # print(f"[Info] Using Device:{self.device}")

    
    def mean_pooling(self, model_output, attention_mask):
        token_embeddings = model_output.last_hidden_state
        mask = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
        return (token_embeddings * mask).sum(1) / mask.sum(1)

    def get_embedding(self,text):
        inputs = self.tokenizer(text, return_tensors = "pt", truncation = True, padding = True).to(self.device)

        with torch.no_grad():
            outputs = self.model(**inputs)

        embedding = self.mean_pooling(outputs,inputs["attention_mask"])
        return embedding.squeeze().cpu().numpy()
    
    def generate_embeddings_for_chunks(self):
        print(f"[INFO] Gathering all tha data from {CHUNK_FILE}")

        with open(CHUNK_FILE,"r",encoding = "utf-8") as f:
            chunks = json.load(f)
        
        all_embeddings = {}

        for i,(chunk_id, chunk_data) in enumerate(chunks.items(), start = 1):
            vector = self.get_embedding(chunk_data['text'] )
            all_embeddings[chunk_id] = vector

            if i % 500 == 0:
                print(f"[INFO] Processed {i} chunks..")
            
        print(f"[INFO] Total Embeddings generated: {len(all_embeddings)}")
        return all_embeddings
    

    def save_embeddings_to_faiss(self, all_embeddings, index_file, mapping_file):
        print("[INFO] Saving Embeddings to Faiss Index")

        vectors = np.array(list(all_embeddings.values())).astype("float32")

        dim = vectors.shape[1]
        index = faiss.IndexFlatL2(dim)

        index.add(vectors)

        faiss.write_index(index, str(index_file))
        print(f"[Info] Saved faiss index to {index_file}")

        chunk_ids = list(all_embeddings.keys())
        with open(mapping_file,"w",encoding = "utf-8") as f:
            json.dump(chunk_ids, f)

        print(f"[INFO] Saved chunk ID mapping to {mapping_file}")

        print(f"[DONE] Faiss Index + Mapping saved successfully!")

    def search(self, query, top_k = 1):
        print(query,"\n")
        query_vec = self.get_embedding(query).astype("float32")
        query_vec = np.expand_dims(query_vec,axis=0)

        index = faiss.read_index(str(FAISS_INDEX))
        
        distances, indices = index.search(query_vec,top_k)

        chunk_ids = json.load(open(str(CHUNK_IDS),"r"))

        chunks = json.load(open(str(CHUNK_FILE),"r"))

        results=[]

        for idx in indices[0]:
            chunk_id = chunk_ids[idx]
            results.append({
                "chunk_id":chunk_id,
                "text":chunks[chunk_id]["text"]
            })
        return results


if __name__ == "__main__":
    generator = EmbeddingGenerator() 
    # generator.generate_embeddings_for_chunks()
    # print(generator.search("What is Jenkinsfile?"))
    # print("[Done] Embeddings created successfully")