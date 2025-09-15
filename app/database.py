from motor.motor_asyncio import AsyncIOMotorClient
from .config import MONGO_URI, DB_NAME

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
