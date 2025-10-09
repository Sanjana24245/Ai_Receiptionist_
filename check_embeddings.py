import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# --- CORRECTION: Import config from the 'app' directory ---

# 1. Add the parent directory (which contains 'app') to the path
# This allows Python to find the 'app' package.
# We are currently running from D:\Ai_Receiptionist>, so 'app' is relative to here.
current_dir = os.path.dirname(os.path.abspath(__file__))
# Check if the script is running from the intended project root
if not os.path.exists(os.path.join(current_dir, 'app')):
    # If the script is NOT in the root, you might need to adjust this path
    print("Warning: 'app' directory not found in the script's directory. Check file location.")
# Add the project root to the path
sys.path.append(current_dir)

# Now, we can import from 'app.config' as if the script was part of the app package
try:
    # Use an absolute import from the project structure
    from app.config import MONGO_URI, DB_NAME 
    print(f"Configuration imported from app.config. DB Name: {DB_NAME}")
except ImportError as e:
    print(f"❌ Critical Error: Could not import MONGO_URI and DB_NAME from app.config. Make sure the file exists and has these variables. Error: {e}")
    # Fallback to .env just in case the app.config import fails but the .env is correct
    load_dotenv()
    MONGO_URI = os.getenv("MONGO_URI")
    DB_NAME = os.getenv("DB_NAME", "your_db_name") # Use a sensible default

# --- END CORRECTION ---

async def check_embeddings():
    # Only proceed if MONGO_URI was successfully loaded from config or .env
    if not MONGO_URI:
        print("Error: MONGO_URI is still not defined. Check your .env or app/config.py.")
        return

    print("Connecting to MongoDB...")
    # NOTE: You must replace 'doctors' with the actual name of your doctor collection if it's different.
    COLLECTION_NAME = "doctors" 
    
    try:
        client = AsyncIOMotorClient(MONGO_URI)
        db = client[DB_NAME]
        doctors_collection = db[COLLECTION_NAME] 
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB or select DB/Collection: {e}")
        return

    # Query for documents that have the 'embedding' field
    print(f"Querying for 5 documents in '{COLLECTION_NAME}' with an 'embedding' field...")
    
    # Use an explicit dictionary for the query to ensure compatibility
    query_filter = {"embedding": {"$exists": True}} 
    cursor = doctors_collection.find(query_filter).limit(5)

    try:
        results = await cursor.to_list(length=5)
    except Exception as e:
        print(f"❌ MongoDB Query Error (Check connection or collection name): {e}")
        client.close()
        return

    if results:
        print(f"\n✅ Found {len(results)} doctors with embeddings:")
        for doc in results:
            embedding_size = len(doc.get('embedding', []))
            # Check the vector size—it should be a large number (e.g., 768 or 1024)
            print(f"  ID: {doc['_id']}, Name: {doc.get('name', 'N/A')}, Specialty: {doc.get('specialty', 'N/A')}, Vector Size: **{embedding_size}**")
    else:
        print("\n❌ No documents found with an 'embedding' field.")
        print("ACTION REQUIRED: You need to **run your vectorization script** (e.g., `vectorize_data.py`) to create these embeddings.")

    client.close()

if __name__ == "__main__":
    # Ensure the script runs using asyncio
    asyncio.run(check_embeddings())