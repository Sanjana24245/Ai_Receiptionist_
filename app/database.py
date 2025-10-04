

from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import Any
from .config import MONGO_URI, DB_NAME
import certifi

# ---------------------- MongoDB Connection ----------------------
# Using TLS with certificate verification (recommended for Atlas)
client = AsyncIOMotorClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where()
)

# ---------------------- Database ----------------------
db = client[DB_NAME]

# ---------------------- Collections ----------------------
users_collection = db["users"]
doctors_collection = db["doctors"]
appointments_collection = db["appointments"]
patients_collection = db["patients"]
chats_collection = db["chats"]
subadmins_collection = db["subadmins"]
messages_collection = db["messages"]
calls_collection = db["calls"]

# ---------------------- ObjectId Helper ----------------------
def convert_objectid(data: Any) -> Any:
    """Recursively convert ObjectId instances to strings for JSON output."""
    if isinstance(data, list):
        return [convert_objectid(item) for item in data]
    elif isinstance(data, dict):
        return {key: convert_objectid(value) for key, value in data.items()}
    elif isinstance(data, ObjectId):
        return str(data)
    return data
