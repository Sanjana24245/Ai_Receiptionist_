import sys
import asyncio
from sentence_transformers import SentenceTransformer
from pathlib import Path
import certifi
from motor.motor_asyncio import AsyncIOMotorClient

# --- Ensure project root is in sys.path to import app.config ---
project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.append(str(project_root))

# --- Import Mongo config ---
from app.config import MONGO_URI, DB_NAME  # only URI and DB name

# --- Create Mongo client ---
client = AsyncIOMotorClient(MONGO_URI, tls=True, tlsCAFile=certifi.where())
db = client[DB_NAME]
doctors_collection = db["doctors"]
patients_collection = db["patients"]

# --- Load embedding model ---
model_name = "all-MiniLM-L6-v2"
print(f"🔄 Loading model: {model_name} ...")
model = SentenceTransformer(model_name)
print(f"✅ Model loaded successfully!")

# --- Async function to generate embedding ---
async def generate_embedding(text: str):
    return await asyncio.to_thread(lambda: model.encode(text, normalize_embeddings=True).tolist())

# --- Async function to rebuild embeddings ---
async def rebuild_doctor_embeddings():
    async for doc in doctors_collection.find({}):
        name = doc.get("name", "")
        specialty = doc.get("specialty", "")
        experience = doc.get("experience", "")
        description = doc.get("description", "")

        text = (
            f"Dr. {name} is a {specialty} specialist at our hospital. "
            f"They treat patients with {specialty} conditions. "
            f"{description} {experience}"
        )

        embedding = await generate_embedding(text)
        await doctors_collection.update_one(
            {"_id": doc["_id"]},
            {"$set": {"embedding": embedding}}
        )
        print(f"✅ Updated embedding for {name}")

    print("🏁 All doctor embeddings rebuilt successfully!")

# --- Run the async rebuild ---
if __name__ == "__main__":
    asyncio.run(rebuild_doctor_embeddings())

