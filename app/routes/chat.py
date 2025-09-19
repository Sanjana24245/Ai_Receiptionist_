
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Depends, Query
from bson import ObjectId
from datetime import datetime
from typing import Optional
from app.database import chats_collection, subadmins_collection
from app.manager import manager
from app.middleware.auth_middleware import authenticate
from app.models import Message, Chat   # ✅ import models
from fastapi import WebSocket, Query
from jose import jwt, JWTError
router = APIRouter(prefix="/chat", tags=["Chat"])


# Helper to serialize MongoDB docs
def serialize_doc(doc):
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc


# ---------------- Find Available Receptionist ----------------
async def find_available_receptionist():
    return await subadmins_collection.find_one(
        {"is_online": True, "active_chats": {"$lt": 5}}
    )


# ---------------- Start Chat ----------------
@router.post("/start")
async def start_chat(current_user=Depends(authenticate), mode: str = "human"):
    user_id = str(current_user["id"])
    subadmin_id: Optional[str] = None

    if mode == "human":
        receptionist = await find_available_receptionist()
        if receptionist:
            subadmin_id = str(receptionist["_id"])
            await subadmins_collection.update_one(
                {"_id": receptionist["_id"]},
                {"$inc": {"active_chats": 1}}
            )
        else:
            mode = "AI"

    # ✅ Use Chat model instead of dict
    chat = Chat(
        user_id=user_id,
        subadmin_id=subadmin_id,
        mode=mode,
        messages=[],
    )

    result = await chats_collection.insert_one(chat.dict())
    chat.id = str(result.inserted_id)

    return {"msg": "Chat started", "chat": chat.dict()}


# ---------------- Get Messages ----------------
@router.get("/{chat_id}/messages")
async def get_chat_messages(chat_id: str, current_user=Depends(authenticate)):
    chat = await chats_collection.find_one({"_id": ObjectId(chat_id)})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"messages": chat.get("messages", [])}


# ---------------- Send Message ----------------
@router.post("/{chat_id}/message")
async def send_chat_message(chat_id: str, message: Message, current_user=Depends(authenticate)):
    chat = await chats_collection.find_one({"_id": ObjectId(chat_id)})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # ✅ Populate sender details
    message.sender_id = str(current_user["id"])
    message.sender_role = current_user["role"]
    message.timestamp = datetime.utcnow()

    message_data = message.dict()
    message_data["_id"] = str(ObjectId())

    await chats_collection.update_one(
        {"_id": ObjectId(chat_id)},
        {"$push": {"messages": message_data}}
    )

    # Broadcast via WebSocket
    await manager.broadcast_to_chat(chat_id, {"event": "new_message", "message": message_data})

    return {"msg": "Message sent", "message": message_data}


# ---------------- WebSocket ----------------


@router.websocket("/ws/{chat_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: str, token: str = Query(...)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        await websocket.close(code=1008)
        return

    user_id = str(payload["id"])
    role = payload["role"]

    await manager.connect(websocket, chat_id, role, user_id)
