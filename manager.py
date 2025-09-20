from typing import Dict
from fastapi import WebSocket
import json
from datetime import datetime



 

class ConnectionManager:
    def __init__(self, db):
        self.db = db
        self.users: Dict[str, WebSocket] = {}
        self.subadmins: Dict[str, WebSocket] = {}

    async def connect_user(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.users[user_id] = websocket
        print(f"✅ User connected: {user_id}")
        await self.notify_subadmins_user_list()

    async def connect_subadmin(self, subadmin_id: str, websocket: WebSocket):
        await websocket.accept()
        self.subadmins[subadmin_id] = websocket
        print(f"✅ Subadmin connected: {subadmin_id}")
        await self.notify_subadmins_user_list()

    async def disconnect(self, websocket: WebSocket):
        for uid, ws in list(self.users.items()):
            if ws == websocket:
                del self.users[uid]
                print(f"❌ User disconnected: {uid}")
        for sid, ws in list(self.subadmins.items()):
            if ws == websocket:
                del self.subadmins[sid]
                print(f"❌ Subadmin disconnected: {sid}")
        await self.notify_subadmins_user_list()

    async def notify_subadmins_user_list(self):
        payload = {"type": "users_list", "users": list(self.users.keys())}
        for ws in list(self.subadmins.values()):
            try:
                await ws.send_text(json.dumps(payload))
            except:
                pass

    # ✅ This must be indented inside the class
    async def route_message(self, message: dict):
        sender_from = message.get("from")

        if isinstance(message.get("timestamp"), datetime):
            message["timestamp"] = message["timestamp"].isoformat()

        msg_doc = {
            "sender_id": message["sender_id"],
            "sender_role": message["from"],
            "text": message.get("content"),
            "file_url": message.get("file_url"),
            "type": message.get("type", "text"),
            "timestamp": datetime.utcnow()
        }
        result = await self.db["messages"].insert_one(msg_doc)
        msg_id = str(result.inserted_id)
        msg_out = {**msg_doc, "_id": msg_id, "timestamp": msg_doc["timestamp"].isoformat()}
        # also attach to chat
        user_id = message["sender_id"] if sender_from == "user" else message.get("to")
        subadmin_id = message["sender_id"] if sender_from == "subadmin" else None
        if user_id:
            await self.db["chats"].update_one(
                {"user_id": user_id},
                {
                    "$setOnInsert": {
                        "user_id": user_id,
                        "subadmin_id": subadmin_id,
                        "created_at": datetime.utcnow(),
                        "mode": "human"
                    },
                    "$push": {"messages": msg_doc}
                },
                upsert=True
            )

        if sender_from == "user":
            txt = json.dumps({"type": "chat", **msg_out})
            for ws in list(self.subadmins.values()):
                try:
                    await ws.send_text(txt)
                except:
                    pass
        elif sender_from == "subadmin":
            target_user = message.get("to")
            ws = self.users.get(target_user)
            if ws:
                try:
                    await ws.send_text(json.dumps({"type": "chat", **msg_out}))
                except:
                    del self.users[target_user]
