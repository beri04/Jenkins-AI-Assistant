import os
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent.parent

RAW_DOCS_DIR = BASE_DIR / "data" / "raw_docs"

CLEANED_DOCS_DIR = BASE_DIR / "data" / "cleaned_docs"

JENKINS_PIPELINES_DOCS = BASE_DIR / "data" / "jenkins_pipeline_docs"

CHUNK_FILE = BASE_DIR / "embeddings" / "chunks.json"

FAISS_INDEX = BASE_DIR / "embeddings" / "faiss_index.bin"

CHUNK_IDS = BASE_DIR / "embeddings" / "chunk_ids.json"

EMBEDDING_MODEL = "BAAI/bge-small-en"

SAVE_JENKINS_UPLOADS = BASE_DIR / "data" / "pipeline_docs"

LOGS = BASE_DIR / "logs"