
from typing import Dict, List
from fastapi import WebSocket
import json
from datetime import datetime
from bson import ObjectId 

class ConnectionManager:
    def __init__(self, db):
        self.db = db
        self.users: Dict[str, WebSocket] = {}         # user_id -> websocket
        self.subadmins: Dict[str, List[WebSocket]] = {}  # subadmin_id -> list of websockets

    # ---------------- CONNECT / DISCONNECT ----------------
    async def connect_user(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.users[user_id] = websocket
        print(f"✅ User connected: {user_id}")
        await self.notify_subadmins_user_list()

    async def connect_subadmin(self, subadmin_id: str, websocket: WebSocket):
        await websocket.accept()
        if subadmin_id not in self.subadmins:
            self.subadmins[subadmin_id] = []
        self.subadmins[subadmin_id].append(websocket)
        print(f"✅ Subadmin connected: {subadmin_id} (total connections: {len(self.subadmins[subadmin_id])})")
        await self.notify_subadmins_user_list()

    async def disconnect(self, websocket: WebSocket):
        # Remove from users
        for uid, ws in list(self.users.items()):
            if ws == websocket:
                del self.users[uid]
                print(f"❌ User disconnected: {uid}")

        # Remove from subadmins (multiple connections possible)
        for sid, ws_list in list(self.subadmins.items()):
            if websocket in ws_list:
                ws_list.remove(websocket)
                if not ws_list:
                    del self.subadmins[sid]
                print(f"❌ Subadmin disconnected: {sid}")

        await self.notify_subadmins_user_list()

    # ---------------- USER LIST / NAMES ----------------
    async def notify_subadmins_user_list(self):
        # 1️⃣ Get all unique user IDs from chats
        all_chats = await self.db["chats"].find({}, {"user_id": 1}).to_list(length=None)
        db_users = [c["user_id"] for c in all_chats]

        # 2️⃣ Merge with currently connected users
        active_users = list(self.users.keys())
        all_user_ids = list(set(db_users + active_users))

        # 3️⃣ Fetch usernames from your "users" collection
        users_with_names = []
        for uid in all_user_ids:
            user_doc = None
            if ObjectId.is_valid(uid):
                user_doc = await self.db["users"].find_one({"_id": ObjectId(uid)}, {"username": 1})

            users_with_names.append({
                "id": uid,
                "username": user_doc["username"] if user_doc and "username" in user_doc else uid
            })

        # 4️⃣ Send payload to subadmins (all connections)
        payload = {"type": "users_list", "users": users_with_names}
        for ws_list in list(self.subadmins.values()):
            for ws in ws_list:
                try:
                    await ws.send_text(json.dumps(payload))
                except:
                    pass
    async def get_unread_counts(self, subadmin_id):
    # For all chats assigned to subadmin
     counts = {}
     chats = await self.db["chats"].find({"subadmin_id": subadmin_id}).to_list(length=None)
     for chat in chats:
        chat_id = str(chat["_id"])
        count = await self.db["messages"].count_documents({
            "chat_id": chat_id,
            "sender_role": "user",
            "read": False
        })
        counts[chat["user_id"]] = count
     return counts
    async def route_message(self, message: dict):
        sender_from = message.get("from")

        if isinstance(message.get("timestamp"), datetime):
            message["timestamp"] = message["timestamp"].isoformat()

        # Determine user_id and subadmin_id
        user_id = message["sender_id"] if sender_from == "user" else message.get("to")
        subadmin_id = message["sender_id"] if sender_from == "subadmin" else None

        # 1️⃣ Ensure chat exists
        chat = await self.db["chats"].find_one({"user_id": user_id})
        if not chat:
            chat_doc = {
                "user_id": user_id,
                "subadmin_id": subadmin_id,
                "created_at": datetime.utcnow(),
                "mode": "human"
            }
            result_chat = await self.db["chats"].insert_one(chat_doc)
            chat_id = str(result_chat.inserted_id)
        else:
            chat_id = str(chat["_id"])

        # 2️⃣ Save message
        msg_doc = {
            "chat_id": chat_id,
            "sender_id": message["sender_id"],
            "sender_role": sender_from,
            "receiver_id": message.get("to"),
            "content": message.get("content"),
            "file_url": message.get("file_url"),
            "type": message.get("type", "text"),
            "timestamp": datetime.utcnow(),
            "read": False
        }
        result = await self.db["messages"].insert_one(msg_doc)
        msg_id = str(result.inserted_id)

        msg_out = {
            **msg_doc,
            "_id": msg_id,
            "timestamp": msg_doc["timestamp"].isoformat()
        }

        txt = json.dumps({"type": "chat", **msg_out})

        # 3️⃣ Broadcast correctly
        if sender_from == "user":
            # send to ALL subadmins
            for sid, ws_list in self.subadmins.items():
                for ws in ws_list:
                    try:
                        await ws.send_text(txt)
                    except:
                        pass
                # send unread counts to that subadmin
                counts = await self.get_unread_counts(sid)
                for ws in ws_list:
                    try:
                        await ws.send_text(json.dumps({"type": "unread_counts", "counts": counts}))
                    except:
                        pass

        elif sender_from == "subadmin":
            target_user = message.get("to")
            ws = self.users.get(target_user)
            if ws:
                try:
                    await ws.send_text(txt)
                except:
                    print(f"⚠️ Failed to send message to {target_user}")
                    del self.users[target_user]

    # ---------------- MESSAGE ROUTING ----------------
    # async def route_message(self, message: dict):
    #     sender_from = message.get("from")

    #     if isinstance(message.get("timestamp"), datetime):
    #         message["timestamp"] = message["timestamp"].isoformat()

    #     # Determine user_id and subadmin_id
    #     user_id = message["sender_id"] if sender_from == "user" else message.get("to")
    #     subadmin_id = message["sender_id"] if sender_from == "subadmin" else None

    #     # 1️⃣ Ensure chat exists
    #     chat = await self.db["chats"].find_one({"user_id": user_id})
    #     if not chat:
    #         chat_doc = {
    #             "user_id": user_id,
    #             "subadmin_id": subadmin_id,
    #             "created_at": datetime.utcnow(),
    #             "mode": "human"
    #         }
    #         result_chat = await self.db["chats"].insert_one(chat_doc)
    #         chat_id = str(result_chat.inserted_id)
    #     else:
    #         chat_id = str(chat["_id"])

    #     # 2️⃣ Save message in `messages` collection
    #     msg_doc = {
    #         "chat_id": chat_id,
    #         "sender_id": message["sender_id"],
    #         "sender_role": message["from"],
    #         "receiver_id": message.get("to"),
    #         "content": message.get("content"),
    #         "file_url": message.get("file_url"),
    #         "type": message.get("type", "text"),
    #         "timestamp": datetime.utcnow(),
    #         "read": False 
    #     }

    #     result = await self.db["messages"].insert_one(msg_doc)
    #     msg_id = str(result.inserted_id)

    #     msg_out = {
    #         **msg_doc,
    #         "_id": msg_id,
    #         "timestamp": msg_doc["timestamp"].isoformat()
    #     }
    #     txt = json.dumps({"type": "chat", **msg_out})
    #     # 3️⃣ Broadcast to the correct side
    #     if sender_from == "user":
            
    #         for ws_list in list(self.subadmins.values()):
    #             for ws in ws_list:
    #                 try:
    #                     await ws.send_text(txt)
    #                     counts = await self.get_unread_counts(ws_list[0])  # pick first ws to get subadmin_id
    #                     await ws.send_text(json.dumps({"type": "unread_counts", "counts": counts}))
    #                 except:
    #                     pass
    #     elif sender_from == "subadmin":
    #         target_user = message.get("to")
    #         ws = self.users.get(target_user)
    #         if ws:
    #             try:
    #                 await ws.send_text(json.dumps({"type": "chat", **msg_out}))
    #             except:
    #                 print(f"⚠️ Failed to send message to {target_user}, removing from active users")
    #                 del self.users[target_user]
    async def mark_read(self, chat_id, user_id):
     await self.db["messages"].update_many(
        {"chat_id": chat_id, "sender_role": "user", "read": False},
        {"$set": {"read": True}}
    )
