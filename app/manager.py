# server/manager.py
from typing import Dict, List
from fastapi import WebSocket
import json
from datetime import datetime

class ConnectionManager:
    def __init__(self):
        # user_id -> websocket
        self.users: Dict[str, WebSocket] = {}
        # allow multiple receptionists if desired; store them in a list
        self.receptionists: List[WebSocket] = []

    async def connect_user(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.users[user_id] = websocket
        await self.notify_receptionists_user_list()

    async def connect_receptionist(self, websocket: WebSocket):
        await websocket.accept()
        self.receptionists.append(websocket)
        # send current list immediately
        await self.notify_receptionists_user_list()

    async def disconnect(self, websocket: WebSocket):
        # remove from receptionist list if present
        if websocket in self.receptionists:
            self.receptionists.remove(websocket)
            return

        # otherwise remove from users if present
        remove_keys = [k for k, v in self.users.items() if v == websocket]
        for k in remove_keys:
            del self.users[k]
        await self.notify_receptionists_user_list()

    async def notify_receptionists_user_list(self):
        # send list of connected users to all receptionists
        payload = {"type": "users_list", "users": list(self.users.keys())}
        text = json.dumps(payload)
        for r in list(self.receptionists):
            try:
                await r.send_text(text)
            except:
                # if sending fails, remove receptionist
                try:
                    self.receptionists.remove(r)
                except:
                    pass

    async def route_message(self, message: dict):
        """
        message JSON shape (example):
        {
            "type": "chat",
            "from": "user|receptionist",
            "sender_id": "<userId or receptionistId>",
            "to": "<userId or 'receptionist'>",
            "content": "hello",
            "timestamp": "..."
        }
        """
        # if message intended for receptionist -> deliver to all receptionists
        if message.get("to") == "receptionist":
            txt = json.dumps(message)
            for r in list(self.receptionists):
                try:
                    await r.send_text(txt)
                except:
                    try:
                        self.receptionists.remove(r)
                    except:
                        pass
            return

        # otherwise assume to is a user id -> send only to that user websocket (if connected)
        target_user = message.get("to")
        ws = self.users.get(target_user)
        if ws:
            try:
                await ws.send_text(json.dumps(message))
            except:
                # on failure, remove user
                try:
                    del self.users[target_user]
                except:
                    pass
                await self.notify_receptionists_user_list()
