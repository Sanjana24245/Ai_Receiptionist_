# from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
# from fastapi.responses import JSONResponse
# from datetime import datetime
# from motor.motor_asyncio import AsyncIOMotorClient
# import json
# from manager import  ConnectionManager 
# from app.database import chats_collection, messages_collection

# router = APIRouter(prefix="/chat", tags=["Chat"])


# # ✅ Get chat history for a user
# @router.get("/{user_id}")
# async def get_chat(user_id: str):
#     chat = await chats_collection.find_one({"user_id": user_id})
#     if not chat:
#         return {"messages": []}

#     messages_cursor = messages_collection.find(
#         {"chat_id": str(chat["_id"])}
#     ).sort("timestamp", 1)

#     messages = []
#     async for msg in messages_cursor:
#         messages.append({
#             "id": str(msg["_id"]),
#             "from": msg["sender_role"],
#             "sender_id": msg["sender_id"],
#             "to": msg.get("receiver_id"),
#             "content": msg.get("content"),
#             "type": msg.get("type", "text"),
#             "timestamp": msg["timestamp"].isoformat()
#         })

#     return {"messages": messages}


# # ✅ Create or get existing chat session
# async def get_or_create_chat(user_id: str, subadmin_id: str):
#     chat = await chats_collection.find_one({"user_id": user_id, "subadmin_id": subadmin_id})
#     if chat:
#         return chat

#     new_chat = {
#         "user_id": user_id,
#         "subadmin_id": subadmin_id,
#         "created_at": datetime.utcnow()
#     }
#     result = await chats_collection.insert_one(new_chat)
#     new_chat["_id"] = result.inserted_id
#     return new_chat


# # ✅ Save a new message

#     # Ensure chat exists
#  # app/routes/chat.py

# async def save_message(user_id, subadmin_id, sender, content):
#     chat = await get_or_create_chat(user_id, subadmin_id)

#     msg_doc = {
#         "chat_id": str(chat["_id"]),
#         "sender_id": user_id if sender == "user" else subadmin_id,
#         "sender_role": sender,   # 👈 important: "user" or "subadmin"
#         "receiver_id": subadmin_id if sender == "user" else user_id,
#         "content": content,
#         "type": "text",
#         "timestamp": datetime.utcnow(),
#     }
#     result = await messages_collection.insert_one(msg_doc)
#     msg_doc["_id"] = result.inserted_id

#     # Normalize for return
#     return {
#         "id": str(result.inserted_id),
#         "chat_id": msg_doc["chat_id"],
#         "from": sender,
#         "sender_id": msg_doc["sender_id"],
#         "to": msg_doc["receiver_id"],
#         "content": content,
#         "type": "text",
#         "timestamp": msg_doc["timestamp"].isoformat(),
#     }


# @router.get("/unread_counts/{subadmin_id}")
# async def get_unread_counts_api(subadmin_id: str, manager: ConnectionManager = Depends()):
#     counts = await manager.get_unread_counts(subadmin_id)
#     return JSONResponse(content={"counts": counts})

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from fastapi.responses import JSONResponse
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
import json
from manager import ConnectionManager 
from app.database import chats_collection, messages_collection
from app.database import db  # your MongoDB client

def get_manager():
    return ConnectionManager(db)
router = APIRouter(prefix="/chat", tags=["Chat"])

# ✅ Get chat history for a user
@router.get("/{user_id}")
async def get_chat(user_id: str):
    chat = await chats_collection.find_one({"user_id": user_id})
    if not chat:
        return {"messages": []}

    messages_cursor = messages_collection.find(
        {"chat_id": str(chat["_id"])}
    ).sort("timestamp", 1)

    messages = []
    async for msg in messages_cursor:
        messages.append({
            "id": str(msg["_id"]),
            "from": msg["sender_role"],
            "sender_id": msg["sender_id"],
            "to": msg.get("receiver_id"),
            "content": msg.get("content"),
            "type": msg.get("type", "text"),
            "timestamp": msg["timestamp"].isoformat()
        })

    return {"messages": messages}


# ✅ Create or get existing chat session
async def get_or_create_chat(user_id: str, subadmin_id: str):
    chat = await chats_collection.find_one({"user_id": user_id, "subadmin_id": subadmin_id})
    if chat:
        return chat

    new_chat = {
        "user_id": user_id,
        "subadmin_id": subadmin_id,
        "created_at": datetime.utcnow()
    }
    result = await chats_collection.insert_one(new_chat)
    new_chat["_id"] = result.inserted_id
    return new_chat


# ✅ Save a new message
async def save_message(user_id, subadmin_id, sender, content):
    chat = await get_or_create_chat(user_id, subadmin_id)

    msg_doc = {
        "chat_id": str(chat["_id"]),
        "sender_id": user_id if sender == "user" else subadmin_id,
        "sender_role": sender,   # "user" or "subadmin"
        "receiver_id": subadmin_id if sender == "user" else user_id,
        "content": content,
        "type": "text",
        "timestamp": datetime.utcnow(),
    }
    result = await messages_collection.insert_one(msg_doc)
    msg_doc["_id"] = result.inserted_id

    # Normalize for return
    return {
        "id": str(result.inserted_id),
        "chat_id": msg_doc["chat_id"],
        "from": sender,
        "sender_id": msg_doc["sender_id"],
        "to": msg_doc["receiver_id"],
        "content": content,
        "type": "text",
        "timestamp": msg_doc["timestamp"].isoformat(),
    }


# ✅ Unread counts for all users for a subadmin
@router.get("/unread_counts/{subadmin_id}")
async def get_unread_counts_api(subadmin_id: str, manager: ConnectionManager = Depends()):
    counts = await manager.get_unread_counts(subadmin_id)
    return JSONResponse(content={"counts": counts})


# ✅ NEW: Get last messages for all users
@router.get("/last_messages")
async def get_last_messages():
    """
    Returns the last message for each user.
    """
    chats = await chats_collection.find({}).to_list(length=None)
    last_messages = {}

    for chat in chats:
        chat_id = str(chat["_id"])
        user_id = chat["user_id"]

        last_msg_doc = await messages_collection.find(
            {"chat_id": chat_id}
        ).sort("timestamp", -1).limit(1).to_list(length=1)

        if last_msg_doc:
            msg = last_msg_doc[0]
            last_messages[user_id] = {
                "content": msg.get("content"),
                "timestamp": msg.get("timestamp").isoformat() if msg.get("timestamp") else None,
                "from": msg.get("sender_role")
            }

    return JSONResponse(content={"last_messages": last_messages})
