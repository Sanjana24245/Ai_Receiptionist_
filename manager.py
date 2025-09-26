
# from typing import Dict, List
# from fastapi import WebSocket
# import json
# from datetime import datetime
# from bson import ObjectId 

# class ConnectionManager:
#     def __init__(self, db):
#         self.db = db
#         self.users: Dict[str, WebSocket] = {}         # user_id -> websocket
#         self.subadmins: Dict[str, List[WebSocket]] = {}  # subadmin_id -> list of websockets

#     # ---------------- CONNECT / DISCONNECT ----------------
#     async def connect_user(self, user_id: str, websocket: WebSocket):
#         await websocket.accept()
#         self.users[user_id] = websocket
#         print(f"✅ User connected: {user_id}")
#         await self.notify_subadmins_user_list()

#     async def connect_subadmin(self, subadmin_id: str, websocket: WebSocket):
#         await websocket.accept()
#         if subadmin_id not in self.subadmins:
#             self.subadmins[subadmin_id] = []
#         self.subadmins[subadmin_id].append(websocket)
#         print(f"✅ Subadmin connected: {subadmin_id} (total connections: {len(self.subadmins[subadmin_id])})")
#         await self.notify_subadmins_user_list()

#     async def disconnect(self, websocket: WebSocket):
#         # Remove from users
#         for uid, ws in list(self.users.items()):
#             if ws == websocket:
#                 del self.users[uid]
#                 print(f"❌ User disconnected: {uid}")

#         # Remove from subadmins (multiple connections possible)
#         for sid, ws_list in list(self.subadmins.items()):
#             if websocket in ws_list:
#                 ws_list.remove(websocket)
#                 if not ws_list:
#                     del self.subadmins[sid]
#                 print(f"❌ Subadmin disconnected: {sid}")

#         await self.notify_subadmins_user_list()

#     # ---------------- USER LIST / NAMES ----------------
#     async def notify_subadmins_user_list(self):
#         # 1️⃣ Get all unique user IDs from chats
#         all_chats = await self.db["chats"].find({}, {"user_id": 1}).to_list(length=None)
#         db_users = [c["user_id"] for c in all_chats]

#         # 2️⃣ Merge with currently connected users
#         active_users = list(self.users.keys())
#         all_user_ids = list(set(db_users + active_users))

#         # 3️⃣ Fetch usernames from your "users" collection
#         users_with_names = []
#         for uid in all_user_ids:
#             user_doc = None
#             if ObjectId.is_valid(uid):
#                 user_doc = await self.db["users"].find_one({"_id": ObjectId(uid)}, {"username": 1})

#             users_with_names.append({
#                 "id": uid,
#                 "username": user_doc["username"] if user_doc and "username" in user_doc else uid
#             })

#         # 4️⃣ Send payload to subadmins (all connections)
#         payload = {"type": "users_list", "users": users_with_names}
#         for ws_list in list(self.subadmins.values()):
#             for ws in ws_list:
#                 try:
#                     await ws.send_text(json.dumps(payload))
#                 except:
#                     pass
#     async def get_unread_counts(self, subadmin_id):
#     # For all chats assigned to subadmin
#      counts = {}
#      chats = await self.db["chats"].find({"subadmin_id": subadmin_id}).to_list(length=None)
#      for chat in chats:
#         chat_id = str(chat["_id"])
#         count = await self.db["messages"].count_documents({
#             "chat_id": chat_id,
#             "sender_role": "user",
#             "read": False
#         })
#         counts[chat["user_id"]] = count
#      return counts
#     async def route_message(self, message: dict):
#         sender_from = message.get("from")

#         if isinstance(message.get("timestamp"), datetime):
#             message["timestamp"] = message["timestamp"].isoformat()

#         # Determine user_id and subadmin_id
#         user_id = message["sender_id"] if sender_from == "user" else message.get("to")
#         subadmin_id = message["sender_id"] if sender_from == "subadmin" else None

#         # 1️⃣ Ensure chat exists
#         chat = await self.db["chats"].find_one({"user_id": user_id})
#         if not chat:
#             chat_doc = {
#                 "user_id": user_id,
#                 "subadmin_id": subadmin_id,
#                 "created_at": datetime.utcnow(),
#                 "mode": "human"
#             }
#             result_chat = await self.db["chats"].insert_one(chat_doc)
#             chat_id = str(result_chat.inserted_id)
#         else:
#             chat_id = str(chat["_id"])

#         # 2️⃣ Save message
#         msg_doc = {
#             "chat_id": chat_id,
#             "sender_id": message["sender_id"],
#             "sender_role": sender_from,
#             "receiver_id": message.get("to"),
#             "content": message.get("content"),
#             "file_url": message.get("file_url"),
#             "type": message.get("type", "text"),
#             "timestamp": datetime.utcnow(),
#             "read": False
#         }
#         result = await self.db["messages"].insert_one(msg_doc)
#         msg_id = str(result.inserted_id)

#         msg_out = {
#             **msg_doc,
#             "_id": msg_id,
#             "timestamp": msg_doc["timestamp"].isoformat()
#         }

#         txt = json.dumps({"type": "chat", **msg_out})

#         # 3️⃣ Broadcast correctly
#         if sender_from == "user":
#             # send to ALL subadmins
#             for sid, ws_list in self.subadmins.items():
#                 for ws in ws_list:
#                     try:
#                         await ws.send_text(txt)
#                     except:
#                         pass
#                 # send unread counts to that subadmin
#                 counts = await self.get_unread_counts(sid)
#                 for ws in ws_list:
#                     try:
#                         await ws.send_text(json.dumps({"type": "unread_counts", "counts": counts}))
#                     except:
#                         pass

#         elif sender_from == "subadmin":
#             target_user = message.get("to")
#             ws = self.users.get(target_user)
#             if ws:
#                 try:
#                     await ws.send_text(txt)
#                 except:
#                     print(f"⚠️ Failed to send message to {target_user}")
#                     del self.users[target_user]

#     # ---------------- MESSAGE ROUTING ----------------
#     # async def route_message(self, message: dict):
#     #     sender_from = message.get("from")

#     #     if isinstance(message.get("timestamp"), datetime):
#     #         message["timestamp"] = message["timestamp"].isoformat()

#     #     # Determine user_id and subadmin_id
#     #     user_id = message["sender_id"] if sender_from == "user" else message.get("to")
#     #     subadmin_id = message["sender_id"] if sender_from == "subadmin" else None

#     #     # 1️⃣ Ensure chat exists
#     #     chat = await self.db["chats"].find_one({"user_id": user_id})
#     #     if not chat:
#     #         chat_doc = {
#     #             "user_id": user_id,
#     #             "subadmin_id": subadmin_id,
#     #             "created_at": datetime.utcnow(),
#     #             "mode": "human"
#     #         }
#     #         result_chat = await self.db["chats"].insert_one(chat_doc)
#     #         chat_id = str(result_chat.inserted_id)
#     #     else:
#     #         chat_id = str(chat["_id"])

#     #     # 2️⃣ Save message in `messages` collection
#     #     msg_doc = {
#     #         "chat_id": chat_id,
#     #         "sender_id": message["sender_id"],
#     #         "sender_role": message["from"],
#     #         "receiver_id": message.get("to"),
#     #         "content": message.get("content"),
#     #         "file_url": message.get("file_url"),
#     #         "type": message.get("type", "text"),
#     #         "timestamp": datetime.utcnow(),
#     #         "read": False 
#     #     }

#     #     result = await self.db["messages"].insert_one(msg_doc)
#     #     msg_id = str(result.inserted_id)

#     #     msg_out = {
#     #         **msg_doc,
#     #         "_id": msg_id,
#     #         "timestamp": msg_doc["timestamp"].isoformat()
#     #     }
#     #     txt = json.dumps({"type": "chat", **msg_out})
#     #     # 3️⃣ Broadcast to the correct side
#     #     if sender_from == "user":
            
#     #         for ws_list in list(self.subadmins.values()):
#     #             for ws in ws_list:
#     #                 try:
#     #                     await ws.send_text(txt)
#     #                     counts = await self.get_unread_counts(ws_list[0])  # pick first ws to get subadmin_id
#     #                     await ws.send_text(json.dumps({"type": "unread_counts", "counts": counts}))
#     #                 except:
#     #                     pass
#     #     elif sender_from == "subadmin":
#     #         target_user = message.get("to")
#     #         ws = self.users.get(target_user)
#     #         if ws:
#     #             try:
#     #                 await ws.send_text(json.dumps({"type": "chat", **msg_out}))
#     #             except:
#     #                 print(f"⚠️ Failed to send message to {target_user}, removing from active users")
#     #                 del self.users[target_user]
#     async def mark_read(self, chat_id, user_id):
#      await self.db["messages"].update_many(
#         {"chat_id": chat_id, "sender_role": "user", "read": False},
#         {"$set": {"read": True}}
#     )
from typing import Dict, List, AsyncGenerator
from fastapi import WebSocket
import json
from datetime import datetime
from bson import ObjectId

from typing import Optional

# class AIReceptionist:
#     def __init__(self, api_key: str):
#         openai.api_key = api_key
#         self.system_prompt = """
#         You are an AI receptionist for a medical clinic. Your role is to:
#         1. Greet patients warmly and professionally
#         2. Collect basic information (name, symptoms, appointment preference)
#         3. Help schedule appointments with appropriate doctors
#         4. Answer frequently asked questions about services
#         5. Escalate to human agent when needed
        
#         Be empathetic, concise, and maintain a friendly medical tone.
#         Keep responses under 200 characters for quick chat experience.
#         """
    
#     async def generate_response(self, user_input: str, call_id: str, db) -> str:
#         try:
#             # Get conversation history from MongoDB
#             call_session = await db["calls"].find_one({"_id": ObjectId(call_id)})
#             conversation_history = call_session.get("conversation_history", [])
            
#             messages = [
#                 {"role": "system", "content": self.system_prompt},
#                 *conversation_history,
#                 {"role": "user", "content": user_input}
#             ]
            
#             response = await openai.ChatCompletion.acreate(
#                 model="gpt-3.5-turbo",
#                 messages=messages,
#                 max_tokens=150,
#                 temperature=0.7
#             )
            
#             ai_response = response.choices[0].message.content
            
#             # Update conversation history in MongoDB
#             updated_history = conversation_history + [
#                 {"role": "user", "content": user_input},
#                 {"role": "assistant", "content": ai_response}
#             ]
            
#             await db["calls"].update_one(
#                 {"_id": ObjectId(call_id)},
#                 {"$set": {"conversation_history": updated_history}}
#             )
            
#             return ai_response
            
#         except Exception as e:
#             print(f"AI Error: {e}")
#             return "I apologize, but I'm having trouble responding right now. Please try again or request a human agent."
# In manager.py, temporarily comment out:
# import openai

class AIReceptionist:
    def __init__(self, api_key: str = None):
        self.enabled = False  # Disable AI features
    
    async def generate_response(self, user_input: str, call_id: str, db) -> str:
        return "AI call features are temporarily disabled. Please use manual calls."

# Rest of your ConnectionManager code...
class ConnectionManager:
    def __init__(self, db):
        self.db = db
        self.users: Dict[str, WebSocket] = {}         # user_id -> websocket
        self.subadmins: Dict[str, List[WebSocket]] = {}  # subadmin_id -> list of websockets
        self.ai_calls: Dict[str, WebSocket] = {}      # call_id -> websocket (for AI calls)
        self.ai_receptionist = AIReceptionist("your-openai-api-key")  # Add your key

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

    async def connect_ai_call(self, call_id: str, websocket: WebSocket):
        """Connect WebSocket for AI call session"""
        await websocket.accept()
        self.ai_calls[call_id] = websocket
        print(f"🤖 AI Call connected: {call_id}")
        
        # Update call status in database
        await self.db["calls"].update_one(
            {"_id": ObjectId(call_id)},
            {"$set": {"status": "ongoing", "started_at": datetime.utcnow()}}
        )

    async def disconnect(self, websocket: WebSocket):
        # Remove from users
        for uid, ws in list(self.users.items()):
            if ws == websocket:
                del self.users[uid]
                print(f"❌ User disconnected: {uid}")

        # Remove from subadmins
        for sid, ws_list in list(self.subadmins.items()):
            if websocket in ws_list:
                ws_list.remove(websocket)
                if not ws_list:
                    del self.subadmins[sid]
                print(f"❌ Subadmin disconnected: {sid}")

        # Remove from AI calls
        for call_id, ws in list(self.ai_calls.items()):
            if ws == websocket:
                del self.ai_calls[call_id]
                # Update call as completed
                await self.db["calls"].update_one(
                    {"_id": ObjectId(call_id)},
                    {"$set": {"status": "completed", "ended_at": datetime.utcnow()}}
                )
                print(f"❌ AI Call ended: {call_id}")

        await self.notify_subadmins_user_list()

    # ---------------- AI CALL HANDLING ----------------
    async def handle_ai_call_message(self, call_id: str, message_data: dict):
        """Process messages for AI calls"""
        try:
            if message_data.get("type") == "user_message":
                user_input = message_data.get("content", "")
                
                # Get AI response
                ai_response = await self.ai_receptionist.generate_response(
                    user_input, call_id, self.db
                )
                
                # Send AI response back to user
                response_payload = {
                    "type": "ai_response",
                    "content": ai_response,
                    "timestamp": datetime.utcnow().isoformat(),
                    "call_id": call_id
                }
                
                websocket = self.ai_calls.get(call_id)
                if websocket:
                    await websocket.send_text(json.dumps(response_payload))
                
                # Also notify subadmins about AI conversation (for monitoring)
                await self.notify_subadmins_ai_activity(call_id, user_input, ai_response)
                
        except Exception as e:
            print(f"AI call handling error: {e}")

    async def notify_subadmins_ai_activity(self, call_id: str, user_input: str, ai_response: str):
        """Notify subadmins about AI call activity for monitoring"""
        activity_payload = {
            "type": "ai_activity",
            "call_id": call_id,
            "user_input": user_input,
            "ai_response": ai_response,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        for ws_list in self.subadmins.values():
            for ws in ws_list:
                try:
                    await ws.send_text(json.dumps(activity_payload))
                except:
                    pass

    # ---------------- MANUAL CALL HANDLING ----------------
    async def initiate_manual_call(self, user_id: str) -> dict:
        """Initiate a manual call and assign to available subadmin"""
        # Find available subadmin
        available_subadmin = await self.db["subadmins"].find_one({
            "is_online": True,
            "active_chats": {"$lt": "$max_chats"}
        })
        
        if not available_subadmin:
            return {"error": "No agents available", "status": "busy"}
        
        # Create call record
        call_data = {
            "user_id": user_id,
            "type": "manual",
            "status": "waiting",
            "subadmin_id": str(available_subadmin["_id"]),
            "created_at": datetime.utcnow()
        }
        
        result = await self.db["calls"].insert_one(call_data)
        call_id = str(result.inserted_id)
        
        # Notify the assigned subadmin
        await self.notify_subadmin_new_call(str(available_subadmin["_id"]), call_id, user_id)
        
        return {
            "call_id": call_id,
            "status": "waiting",
            "subadmin_assigned": str(available_subadmin["_id"]),
            "message": "Agent will connect shortly"
        }

    async def notify_subadmin_new_call(self, subadmin_id: str, call_id: str, user_id: str):
        """Notify specific subadmin about new manual call"""
        user_data = await self.db["users"].find_one({"_id": ObjectId(user_id)})
        username = user_data.get("username", "User") if user_data else "User"
        
        call_payload = {
            "type": "new_manual_call",
            "call_id": call_id,
            "user_id": user_id,
            "user_name": username,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        ws_list = self.subadmins.get(subadmin_id, [])
        for ws in ws_list:
            try:
                await ws.send_text(json.dumps(call_payload))
            except:
                pass

    # ---------------- USER LIST / NAMES ----------------
    async def notify_subadmins_user_list(self):
        # 1️⃣ Get all unique user IDs from chats
        all_chats = await self.db["chats"].find({}, {"user_id": 1}).to_list(length=None)
        db_users = [c["user_id"] for c in all_chats]

        # 2️⃣ Merge with currently connected users
        active_users = list(self.users.keys())
        all_user_ids = list(set(db_users + active_users))

        # 3️⃣ Fetch usernames from "users" collection
        users_with_names = []
        for uid in all_user_ids:
            user_doc = None
            if ObjectId.is_valid(uid):
                user_doc = await self.db["users"].find_one({"_id": ObjectId(uid)}, {"username": 1})

            users_with_names.append({
                "id": uid,
                "username": user_doc["username"] if user_doc and "username" in user_doc else uid
            })

        # 4️⃣ Send payload to subadmins
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

    # ---------------- MESSAGE ROUTING (Existing Chat) ----------------
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

    async def mark_read(self, chat_id, user_id):
        await self.db["messages"].update_many(
            {"chat_id": chat_id, "sender_role": "user", "read": False},
            {"$set": {"read": True}}
        )