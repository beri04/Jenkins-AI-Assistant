from src.config.settings import FAISS_INDEX, CHUNK_IDS
from src.embeddings.embedder import EmbeddingGenerator

generator = EmbeddingGenerator()

embeddings = generator.generate_embeddings_for_chunks()

generator.save_embeddings_to_faiss(
    embeddings,
    index_file=FAISS_INDEX,
    mapping_file=CHUNK_IDS
)
