
from motor.motor_asyncio import AsyncIOMotorClient
from .config import MONGO_URI, DB_NAME
from bson import ObjectId
from typing import Any
# MongoDB Client
client = AsyncIOMotorClient(
    MONGO_URI,
    tls=True,
    tlsAllowInvalidCertificates=False
)

# Database
db = client[DB_NAME]

# Collections
users_collection = db["users"]
doctors_collection = db["doctors"]
appointments_collection = db["appointments"]
patients_collection = db["patients"] 
chats_collection = db["chats"]            # stores chat sessions
subadmins_collection = db["subadmins"]    # receptionists / human agents
messages_collection = db["messages"] 
calls_collection = db["calls"]  # New collection for calls

# Helper to convert ObjectId to string
def convert_objectid(data: Any) -> Any:
    if isinstance(data, list):
        return [convert_objectid(item) for item in data]
    elif isinstance(data, dict):
        return {key: convert_objectid(value) for key, value in data.items()}
    elif isinstance(data, ObjectId):
        return str(data)
    return data