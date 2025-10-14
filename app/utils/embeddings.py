# app/utils/embeddings.py
from sentence_transformers import SentenceTransformer
import asyncio

EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
st_sync_model = SentenceTransformer(EMBEDDING_MODEL_NAME)

async def get_embedding_vector(text: str):
    def sync_embed(txt):
        return st_sync_model.encode(txt, convert_to_tensor=False).tolist()
    return await asyncio.to_thread(sync_embed, text)
