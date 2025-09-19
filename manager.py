
from typing import Dict
from fastapi import WebSocket
import json
from datetime import datetime
print(json.dumps({"test": "ok"}))



class ConnectionManager:
    def __init__(self):
        self.users: Dict[str, WebSocket] = {}        # user_id -> websocket
        self.subadmins: Dict[str, WebSocket] = {}    # subadmin_id -> websocket

    async def connect_user(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.users[user_id] = websocket
        print(f"User connected: {user_id}")
        await self.notify_subadmins_user_list()

    async def connect_subadmin(self, subadmin_id: str, websocket: WebSocket):
        await websocket.accept()
        self.subadmins[subadmin_id] = websocket
        print(f"Subadmin connected: {subadmin_id}")
        await self.notify_subadmins_user_list()

    async def disconnect(self, websocket: WebSocket):
        # remove from users
        for uid, ws in list(self.users.items()):
            if ws == websocket:
                del self.users[uid]
        # remove from subadmins
        for sid, ws in list(self.subadmins.items()):
            if ws == websocket:
                del self.subadmins[sid]
        await self.notify_subadmins_user_list()

    async def notify_subadmins_user_list(self):
        payload = {"type": "users_list", "users": list(self.users.keys())}
        for ws in list(self.subadmins.values()):
            try:
                await ws.send_text(json.dumps(payload))
            except:
                pass

    async def route_message(self, message: dict):
        """
        message JSON:
        {
          "type": "chat",
          "from": "user" | "subadmin",
          "sender_id": "<id>",
          "to": "<user_id | subadmin>",
          "content": "...",
          "timestamp": "..."
        }
        """
        sender_from = message.get("from")
        if sender_from == "user":
            # Broadcast user message to all subadmins
            txt = json.dumps(message)
            for ws in list(self.subadmins.values()):
                try:
                    await ws.send_text(txt)
                except:
                    pass
        elif sender_from == "subadmin":
            # Send subadmin message to specific user
            target_user = message.get("to")
            ws = self.users.get(target_user)
            if ws:
                try:
                    await ws.send_text(json.dumps(message))
                except Exception as e:
                   print(f"Failed to send message to {target_user}: {e}")
