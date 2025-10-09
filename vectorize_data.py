import asyncio
import os
import sys
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
import certifi

# --- Sentence Transformers Imports ---
# Ollama ki jagah hum yeh library use karenge for local embeddings.
from sentence_transformers import SentenceTransformer

# --- CRITICAL CONFIG IMPORT ---
try:
    # Set up path to allow importing app.config
    project_root = Path(__file__).resolve().parent
    if str(project_root) not in sys.path:
        sys.path.append(str(project_root))
    
    # Import config variables
    from app.config import MONGO_URI, DB_NAME
    
except ImportError as e:
    print("----------------------------------------------------------------------")
    print(f"❌ CRITICAL CONFIGURATION ERROR: Failed to import MONGO_URI and DB_NAME from app.config: {e}")
    print("Ensure app/config.py exists and is accessible.")
    print("----------------------------------------------------------------------")
    sys.exit(1)

# --- Model & Client Initialization (Synchronous Client) ---
# Sentence-transformers model initialization.
# all-MiniLM-L6-v2 is a small, fast, and high-quality model (384 dimensions).
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
try:
    # 🚨 NOTE: Yeh step pehli baar chalne par model ko download karega.
    st_sync_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    print(f"✅ Loaded Sentence Transformer Model: {EMBEDDING_MODEL_NAME}")
except Exception as e:
    print(f"❌ CRITICAL Model Loading Error: {e}")
    print("Please check internet connection or model name.")
    sys.exit(1)


# --- MongoDB Connection ---
print(f"Attempting to connect to DB: {DB_NAME}")
try:
    client = AsyncIOMotorClient(
        MONGO_URI,
        tls=True,
        tlsCAFile=certifi.where()
    )
    db = client[DB_NAME]
    doctors_collection = db["doctors"]
    patients_collection = db["patients"]
except Exception as e:
    print(f"❌ MongoDB Connection Error: {e}")
    sys.exit(1)


# --- Embedding Function (Uses Synchronous Model via Thread) ---
async def generate_embedding_async(text: str) -> list[float] | None:
    """
    Runs the stable synchronous SentenceTransformer.encode() function in a separate thread.
    """
    
    def sync_embed(text_to_embed):
        # Sentence Transformer ko seedhe text dekar encode karte hain.
        # convert_to_tensor=False is used for a standard Python list output.
        return st_sync_model.encode(
            text_to_embed, 
            convert_to_tensor=False
        ).tolist()

    try:
        # Run the synchronous function in a separate thread to prevent blocking
        embedding = await asyncio.to_thread(sync_embed, text)
        
        # Check if the result is a list of floats (the embedding vector)
        if isinstance(embedding, list) and len(embedding) > 0 and isinstance(embedding[0], float):
            return embedding
        
        print(f"❌ Sentence Transformer returned an invalid embedding type: {type(embedding)}")
        return None
            
    except Exception as e:
        # Ab koi Ollama error nahi aayega, yeh sirf general error hoga
        print(f"❌ CRITICAL Embedding Thread Error: {type(e).__name__}: {e}")
        return None

# ----------------------------------------------------------------------
# --- Vectorization Logic (No Change Here) ---
# ----------------------------------------------------------------------

async def vectorize_collection(collection, text_fields: list[str], identifier_field: str):
    """
    Iterates through a collection, combines specified fields, generates an embedding, 
    and updates the document with the 'embedding' field.
    """
    print(f"\n🚀 Starting vectorization for collection: {collection.name}")
    
    # Find documents that are missing the 'embedding' field
    async for doc in collection.find({"embedding": {"$exists": False}}):
        
        # Combine relevant text fields
        text_to_embed = " | ".join([str(doc.get(field, "")) for field in text_fields if doc.get(field) is not None])
        
        doc_id_display = doc.get(identifier_field, str(doc["_id"])) # Use name or _id for logging
        
        if not text_to_embed.strip():
            print(f"   Skipping document {doc_id_display}: No text fields found.")
            continue
            
        # Generate the embedding
        embedding = await generate_embedding_async(text_to_embed) 
        
        if embedding:
            # Update the document with the new vector
            result = await collection.update_one(
                {"_id": doc["_id"]},
                {"$set": {"embedding": embedding}}
            )
            print(f"   ✅ Updated document {doc_id_display} with embedding. ({result.modified_count} modified)")
        else:
            print(f"   ❌ Failed to generate embedding for document {doc_id_display}.")

# --- Main Runner ---

async def main_vectorize():
    
    # DOCTORS: Embed based on name, specialty, and description
    await vectorize_collection(
        collection=doctors_collection,
        text_fields=["name", "specialty", "description"],
        identifier_field="name" 
    )

    # PATIENTS: Embed based on name, medical history summary, and contact info (for lookup)
    await vectorize_collection(
        collection=patients_collection,
        text_fields=["name", "medical_history_summary", "contact_number"], 
        identifier_field="name"
    )
    
    print("\n🏁 Vectorization process finished.")
    
if __name__ == "__main__":
    asyncio.run(main_vectorize())
