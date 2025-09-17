# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from bson import ObjectId
# from datetime import datetime
# from app.database import chats_collection, subadmins_collection
# from app.models import Message, Chat

# router = APIRouter(prefix="/chat", tags=["Chat"])


# # ---------------- Helper ----------------
# def serialize_doc(doc):
#     doc["_id"] = str(doc["_id"])
#     return doc


# async def find_available_receptionist():
#     """Find a receptionist who is online and not overloaded"""
#     receptionist = await subadmins_collection.find_one(
#         {"is_online": True, "active_chats": {"$lt": 5}}  # ✅ max 5 chats load
#     )
#     return receptionist


# # ---------------- Routes ----------------
# @router.post("/start")
# async def start_chat(user_id: str, mode: str = "AI"):
#     # If human mode → find available receptionist
#     subadmin_id = None
#     if mode == "human":
#         receptionist = await find_available_receptionist()
#         if not receptionist:
#             # fallback AI if no receptionist
#             mode = "AI"
#         else:
#             subadmin_id = str(receptionist["_id"])
#             await subadmins_collection.update_one(
#                 {"_id": receptionist["_id"]},
#                 {"$inc": {"active_chats": 1}}
#             )

#     chat_data = {
#         "user_id": user_id,
#         "subadmin_id": subadmin_id,
#         "mode": mode,
#         "messages": [],
#         "created_at": datetime.utcnow()
#     }

#     result = await chats_collection.insert_one(chat_data)
#     chat_data["_id"] = str(result.inserted_id)

#     return {"msg": "Chat started", "chat": chat_data}


# @router.post("/{chat_id}/send")
# async def send_message(chat_id: str, message: Message):
#     chat = await chats_collection.find_one({"_id": ObjectId(chat_id)})
#     if not chat:
#         raise HTTPException(status_code=404, detail="Chat not found")

#     msg_dict = message.dict()
#     msg_dict["timestamp"] = datetime.utcnow()

#     await chats_collection.update_one(
#         {"_id": ObjectId(chat_id)},
#         {"$push": {"messages": msg_dict}}
#     )

#     return {"msg": "Message sent", "message": msg_dict}


# @router.get("/{chat_id}/history")
# async def get_chat_history(chat_id: str):
#     chat = await chats_collection.find_one({"_id": ObjectId(chat_id)})
#     if not chat:
#         raise HTTPException(status_code=404, detail="Chat not found")
#     return serialize_doc(chat)


# @router.put("/{chat_id}/toggle")
# async def toggle_chat_mode(chat_id: str, mode: str):
#     if mode not in ["AI", "human"]:
#         raise HTTPException(status_code=400, detail="Invalid mode")

#     chat = await chats_collection.find_one({"_id": ObjectId(chat_id)})
#     if not chat:
#         raise HTTPException(status_code=404, detail="Chat not found")

#     subadmin_id = None
#     if mode == "human":
#         receptionist = await find_available_receptionist()
#         if not receptionist:
#             raise HTTPException(status_code=400, detail="No receptionist available")
#         subadmin_id = str(receptionist["_id"])
#         await subadmins_collection.update_one(
#             {"_id": receptionist["_id"]},
#             {"$inc": {"active_chats": 1}}
#         )

#     await chats_collection.update_one(
#         {"_id": ObjectId(chat_id)},
#         {"$set": {"mode": mode, "subadmin_id": subadmin_id}}
#     )

#     return {"msg": f"Chat switched to {mode}"}
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime
from typing import List, Optional
from app.database import chats_collection, subadmins_collection
from app.models import Message

router = APIRouter(prefix="/chat", tags=["Chat"])

# ---------------- Helper ----------------
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc


async def find_available_receptionist():
    """Find a receptionist who is online and not overloaded"""
    receptionist = await subadmins_collection.find_one(
        {"is_online": True, "active_chats": {"$lt": 5}}  # ✅ max 5 chats load
    )
    return receptionist


# ---------------- REST APIs ----------------
@router.post("/start")
async def start_chat(user_id: str, mode: str = "AI"):
    subadmin_id = None
    if mode == "human":
        receptionist = await find_available_receptionist()
        if not receptionist:
            # fallback AI if no receptionist
            mode = "AI"
        else:
            subadmin_id = str(receptionist["_id"])
            await subadmins_collection.update_one(
                {"_id": receptionist["_id"]},
                {"$inc": {"active_chats": 1}}
            )

    chat_data = {
        "user_id": user_id,
        "subadmin_id": subadmin_id,
        "mode": mode,
        "messages": [],
        "created_at": datetime.utcnow()
    }

    result = await chats_collection.insert_one(chat_data)
    chat_data["_id"] = str(result.inserted_id)

    return {"msg": "Chat started", "chat": chat_data}


@router.get("/{chat_id}/history")
async def get_chat_history(chat_id: str):
    chat = await chats_collection.find_one({"_id": ObjectId(chat_id)})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return serialize_doc(chat)


@router.put("/{chat_id}/toggle")
async def toggle_chat_mode(chat_id: str, mode: str):
    if mode not in ["AI", "human"]:
        raise HTTPException(status_code=400, detail="Invalid mode")

    chat = await chats_collection.find_one({"_id": ObjectId(chat_id)})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    subadmin_id = None
    if mode == "human":
        receptionist = await find_available_receptionist()
        if not receptionist:
            raise HTTPException(status_code=400, detail="No receptionist available")
        subadmin_id = str(receptionist["_id"])
        await subadmins_collection.update_one(
            {"_id": receptionist["_id"]},
            {"$inc": {"active_chats": 1}}
        )

    await chats_collection.update_one(
        {"_id": ObjectId(chat_id)},
        {"$set": {"mode": mode, "subadmin_id": subadmin_id}}
    )

    return {"msg": f"Chat switched to {mode}"}


# ---------------- WebSocket ----------------
active_connections: dict = {}  # chat_id -> [ws1, ws2...]

async def send_to_chat(chat_id: str, message: dict):
    """Broadcast message to all clients in a chat"""
    if chat_id in active_connections:
        for ws in active_connections[chat_id]:
            await ws.send_json(message)


@router.websocket("/ws/{chat_id}")
async def chat_ws(websocket: WebSocket, chat_id: str):
    await websocket.accept()

    if chat_id not in active_connections:
        active_connections[chat_id] = []
    active_connections[chat_id].append(websocket)

    try:
        while True:
            data = await websocket.receive_json()

            msg = {
                "sender_id": data["sender_id"],
                "sender_role": data["sender_role"],  # "user" or "subadmin"
                "text": data["text"],
                "timestamp": datetime.utcnow()
            }

            # Save in DB
            await chats_collection.update_one(
                {"_id": ObjectId(chat_id)},
                {"$push": {"messages": msg}}
            )

            # Broadcast to all clients
            await send_to_chat(chat_id, {"event": "new_message", "message": msg})

    except WebSocketDisconnect:
        active_connections[chat_id].remove(websocket)
