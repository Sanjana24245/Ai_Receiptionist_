from motor.motor_asyncio import AsyncIOMotorClient
from .config import MONGO_URI, DB_NAME

client = AsyncIOMotorClient(
    MONGO_URI,
    tls=True,
    tlsAllowInvalidCertificates=False
)

db = client[DB_NAME]
users_collection = db["users"]
doctors_collection = db["doctors"]
