# # from dotenv import load_dotenv
# # import os
# # import json
# # import requests
# # from datetime import datetime
# # from bson import ObjectId
# # from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, Request
# # from fastapi.staticfiles import StaticFiles
# # from fastapi.middleware.cors import CORSMiddleware
# # from fastapi.responses import FileResponse

# # import ollama
# # from app.routes import auth, doctor, appointments, patient, subadmin, chat
# # from app.database import db, chats_collection, doctors_collection, appointments_collection, patients_collection
# # from manager import ConnectionManager
# # from app.models import Chat, Message

# # # ==============================
# # # Load environment variables
# # # ==============================
# # load_dotenv()
# # WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# # PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# # VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# # # ==============================
# # # FastAPI setup
# # # ==============================
# # app = FastAPI()
# # manager = ConnectionManager(db)

# # # ==============================
# # # Middleware
# # # ==============================
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # # ==============================
# # # Static files
# # # ==============================
# # app.mount("/static", StaticFiles(directory="app/static"), name="static")

# # # ==============================
# # # Routers
# # # ==============================
# # app.include_router(auth.router)
# # app.include_router(doctor.router)
# # app.include_router(appointments.router)
# # app.include_router(patient.router)
# # app.include_router(subadmin.router)
# # app.include_router(chat.router)

# # # ==============================
# # # Basic routes
# # # ==============================
# # @app.get("/favicon.ico")
# # async def favicon():
# #     return FileResponse("app/static/favicon.ico")

# # @app.get("/")
# # async def root():
# #     return {"msg": "FastAPI WhatsApp bot with AI is running 🚀"}

# # # ==============================
# # # WhatsApp Webhook Verification
# # # ==============================
# # @app.get("/webhook")
# # async def verify_token(request: Request):
# #     params = request.query_params
# #     if params.get("hub.verify_token") == VERIFY_TOKEN:
# #         return int(params.get("hub.challenge"))
# #     return {"error": "Invalid verification token"}

# # # ==============================
# # # WhatsApp Message Sender
# # # ==============================
# # def send_whatsapp_message(to: str, message: str):
# #     url = f"https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages"
# #     headers = {
# #         "Authorization": f"Bearer {WHATSAPP_TOKEN}",
# #         "Content-Type": "application/json"
# #     }
# #     payload = {
# #         "messaging_product": "whatsapp",
# #         "to": to,
# #         "type": "text",
# #         "text": {"body": message}
# #     }
# #     res = requests.post(url, headers=headers, json=payload)
# #     print("📤 WhatsApp response:", res.json())

# # # ==============================
# # # Save Message in DB
# # # ==============================
# # async def save_message(user_id: str, sender_id: str, sender_role: str, text: str = None, type: str = "text"):
# #     message = Message(
# #         sender_id=sender_id,
# #         sender_role=sender_role,
# #         text=text,
# #         type=type,
# #         timestamp=datetime.utcnow()
# #     )
# #     await chats_collection.update_one(
# #         {"user_id": user_id},
# #         {
# #             "$push": {"messages": message.dict()},
# #             "$setOnInsert": {"user_id": user_id, "mode": "AI", "created_at": datetime.utcnow()}
# #         },
# #         upsert=True
# #     )

# # # ==============================
# # # Ollama AI Reply
# # # ==============================
# # def get_ai_reply(user_message: str) -> str:
# #     try:
# #         response = ollama.chat(
# #             model="llama3:latest",
# #             messages=[{"role": "user", "content": user_message}]
# #         )
# #         if "message" in response and "content" in response["message"]:
# #             return response["message"]["content"]
# #         return response.get("content", "Sorry, I couldn’t generate a reply.")
# #     except Exception as e:
# #         print("❌ Ollama error:", e)
# #         return "Sorry, I’m having trouble answering right now."

# # # ==============================
# # # Load AI Flow JSON
# # # ==============================
# # AI_FLOW_FILE = "app/static/ai_flow.json"
# # with open(AI_FLOW_FILE, "r", encoding="utf-8") as f:
# #     ai_flow = json.load(f)

# # # ==============================
# # # Chat State Helpers
# # # ==============================
# # async def get_chat_state(user_id: str):
# #     record = await chats_collection.find_one({"user_id": user_id})
# #     if record and "state" in record:
# #         return record["state"], record.get("extra", {})
# #     return None, {}

# # async def update_chat_state(user_id: str, state: str = None, extra: dict = None):
# #     update_data = {}
# #     if state is not None:
# #         update_data["state"] = state
# #     if extra is not None:
# #         update_data["extra"] = extra
# #     if update_data:
# #         await chats_collection.update_one({"user_id": user_id}, {"$set": update_data}, upsert=True)
# #     else:
# #         await chats_collection.update_one({"user_id": user_id}, {"$unset": {"state": "", "extra": ""}})

# # # ==============================
# # # WhatsApp Message Handler
# # # ==============================
# # @app.post("/webhook")
# # async def receive_message(request: Request):
# #     data = await request.json()
# #     value = data["entry"][0]["changes"][0]["value"]

# #     if "messages" not in value:
# #         return {"status": "ok"}

# #     msg = value["messages"][0]
# #     from_number = msg["from"]
# #     user_text = msg["text"]["body"].strip()
# #     user_text_lower = user_text.lower()

# #     await save_message(from_number, from_number, "user", user_text)
# #     state, extra = await get_chat_state(from_number)
# #     ai_reply = ""

# #     # 1️⃣ Greeting
# #     if any(k in user_text_lower for k in ai_flow["greeting"]["keywords"]):
# #         for msg in ai_flow["greeting"]["messages"]:
# #             await save_message(from_number, "ai_bot", "bot", msg)
# #             send_whatsapp_message(from_number, msg)
# #         await update_chat_state(from_number, None)
# #         return {"status": "ok"}

# #     # 2️⃣ Appointment intent
# #     elif any(k in user_text_lower for k in ai_flow["services"]["appointment"]["keywords"]):
# #         ai_reply = "You selected Appointment. Please enter your full name:"
# #         await update_chat_state(from_number, "awaiting_name")

# #     # 3️⃣ Name
# #     elif state == "awaiting_name":
# #         extra["patient_info"] = {"name": user_text}
# #         ai_reply = "Please enter your age:"
# #         await update_chat_state(from_number, "awaiting_age", extra)

# #     # 4️⃣ Age
# #     elif state == "awaiting_age":
# #         try:
# #             extra["patient_info"]["age"] = int(user_text)
# #         except:
# #             extra["patient_info"]["age"] = 0
# #         ai_reply = "Please enter your address:"
# #         await update_chat_state(from_number, "awaiting_address", extra)

# #     # 5️⃣ Address
# #     elif state == "awaiting_address":
# #         extra["patient_info"]["address"] = user_text
# #         ai_reply = "Please enter your disease:"
# #         await update_chat_state(from_number, "awaiting_disease", extra)

# #     # 6️⃣ Disease
# #     elif state == "awaiting_disease":
# #         disease = user_text
# #         doctors = await doctors_collection.find({"specialty": {"$regex": disease, "$options": "i"}}).to_list(length=5)
# #         if not doctors:
# #             ai_reply = f"❌ No doctors found for '{disease}'. Try again."
# #             await update_chat_state(from_number, "awaiting_disease", extra)
# #         else:
# #             doc_list = "\n".join([f"👨‍⚕️ {d['name']} ({d['specialty']})" for d in doctors])
# #             ai_reply = f"Available doctors for '{disease}':\n{doc_list}\n\nPlease type doctor name and preferred time (YYYY-MM-DD HH:MM)."
# #             extra["patient_info"]["disease"] = disease
# #             await update_chat_state(from_number, "awaiting_booking", extra)

# #     # 7️⃣ Booking
# #     elif state == "awaiting_booking":
# #         try:
# #             parts = user_text.rsplit(" ", 2)
# #             doctor_name = parts[0].strip()
# #             date_str = " ".join(parts[1:])
# #             appt_time = datetime.strptime(date_str, "%Y-%m-%d %H:%M")

# #             doctor = await doctors_collection.find_one({"name": {"$regex": doctor_name, "$options": "i"}})
# #             if not doctor:
# #                 ai_reply = "Doctor not found. Try again."
# #             else:
# #                 conflict = await appointments_collection.find_one({"doctor_id": str(doctor["_id"]), "appointment_time": appt_time})
# #                 if conflict:
# #                     ai_reply = "That slot is already booked. Choose another time."
# #                 else:
# #                     patient = extra.get("patient_info", {})
# #                     appt = {
# #                         "_id": ObjectId(),
# #                         "doctor_id": str(doctor["_id"]),
# #                         "patient_id": patient.get("patient_id", str(ObjectId())),
# #                         "name": patient.get("name"),
# #                         "age": patient.get("age"),
# #                         "address": patient.get("address"),
# #                         "disease": patient.get("disease"),
# #                         "appointment_time": appt_time,
# #                         "status": "booked",
# #                         "type": "AI"
# #                     }
# #                     await appointments_collection.insert_one(appt)
# #                     ai_reply = f"✅ Appointment booked with {doctor['name']} on {appt_time.strftime('%Y-%m-%d %H:%M')}."
# #                     await update_chat_state(from_number, None)
# #         except Exception as e:
# #             print("Booking error:", e)
# #             ai_reply = "Invalid format. Example: Dr. Sharma 2025-10-06 14:30"

# #     # 8️⃣ Dynamic FAQ — Patient or Doctor
# #     elif any(k in user_text_lower for k in ai_flow["services"]["faq"]["keywords"]):
# #         if "patient" in user_text_lower:
# #             query_name = user_text.split()[-1]
# #             patient = await patients_collection.find_one({"name": {"$regex": query_name, "$options": "i"}})
# #             if patient:
# #                 ai_reply = f"👤 Patient Details:\nName: {patient['name']}\nAge: {patient['age']}\nDisease: {patient.get('disease', 'N/A')}\nAddress: {patient.get('address', 'N/A')}"
# #             else:
# #                 ai_reply = f"No patient found with name similar to '{query_name}'."
# #         elif "doctor" in user_text_lower or "timing" in user_text_lower or "specialist" in user_text_lower:
# #             doctor = await doctors_collection.find_one({
# #                 "$or": [
# #                     {"name": {"$regex": user_text, "$options": "i"}},
# #                     {"specialty": {"$regex": user_text, "$options": "i"}}
# #                 ]
# #             })
# #             if doctor:
# #                 ai_reply = f"👨‍⚕️ Doctor Details:\nName: {doctor['name']}\nSpecialty: {doctor['specialty']}\nAvailable: {doctor.get('timings', 'Not updated')}"
# #             else:
# #                 ai_reply = f"No doctor info found for '{user_text}'."
# #         else:
# #             ai_reply = ai_flow["services"]["faq"]["messages"][0]

# #     # 9️⃣ Fallback (AI or help)
# #     else:
# #         ai_reply = get_ai_reply(user_text)

# #     await save_message(from_number, "ai_bot", "bot", ai_reply)
# #     send_whatsapp_message(from_number, ai_reply)
# #     return {"status": "ok"}

# # # ==============================
# # # WebSocket Chat System
# # # ==============================
# # @app.websocket("/ws")
# # async def websocket_endpoint(websocket: WebSocket, role: str = Query(...), client_id: str = Query(None)):
# #     try:
# #         if not client_id:
# #             await websocket.close(code=4001)
# #             return
# #         if role == "user":
# #             await manager.connect_user(client_id, websocket)
# #         elif role == "subadmin":
# #             await manager.connect_subadmin(client_id, websocket)
# #         else:
# #             await websocket.close(code=4000)
# #             return

# #         while True:
# #             data = await websocket.receive_text()
# #             msg = json.loads(data)
# #             if "timestamp" not in msg:
# #                 msg["timestamp"] = datetime.utcnow().isoformat()
# #             await manager.route_message(msg)
# #     except WebSocketDisconnect:
# #         await manager.disconnect(websocket)
# #     except Exception as e:
# #         print("❌ WebSocket error:", e)
# #         await manager.disconnect(websocket)
# # from dotenv import load_dotenv
# # import os
# # import json
# # import requests
# # from datetime import datetime
# # from bson import ObjectId
# # from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, Request
# # from fastapi.staticfiles import StaticFiles
# # from fastapi.middleware.cors import CORSMiddleware
# # from fastapi.responses import FileResponse

# # import ollama
# # from app.routes import auth, doctor, appointments, patient, subadmin, chat
# # from app.database import db, chats_collection, doctors_collection, appointments_collection, patients_collection
# # from manager import ConnectionManager
# # from app.models import Message

# # # =================================
# # # Environment Variables
# # # =================================
# # load_dotenv()
# # WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# # PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# # VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# # # =================================
# # # FastAPI App
# # # =================================
# # app = FastAPI()
# # manager = ConnectionManager(db)

# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # app.mount("/static", StaticFiles(directory="app/static"), name="static")

# # # =================================
# # # Routers
# # # =================================
# # app.include_router(auth.router)
# # app.include_router(doctor.router)
# # app.include_router(appointments.router)
# # app.include_router(patient.router)
# # app.include_router(subadmin.router)
# # app.include_router(chat.router)

# # # =================================
# # # Basic routes
# # # =================================
# # @app.get("/")
# # async def root():
# #     return {"msg": "FastAPI WhatsApp bot with AI is running 🚀"}

# # @app.get("/favicon.ico")
# # async def favicon():
# #     return FileResponse("app/static/favicon.ico")

# # # =================================
# # # Webhook Verification
# # # =================================
# # @app.get("/webhook")
# # async def verify_token(request: Request):
# #     params = request.query_params
# #     if params.get("hub.verify_token") == VERIFY_TOKEN:
# #         return int(params.get("hub.challenge"))
# #     return {"error": "Invalid verification token"}

# # # =================================
# # # WhatsApp Message Sender
# # # =================================
# # def send_whatsapp_message(to: str, message: str):
# #     url = f"https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages"
# #     headers = {
# #         "Authorization": f"Bearer {WHATSAPP_TOKEN}",
# #         "Content-Type": "application/json",
# #     }
# #     payload = {
# #         "messaging_product": "whatsapp",
# #         "to": to,
# #         "type": "text",
# #         "text": {"body": message},
# #     }
# #     res = requests.post(url, headers=headers, json=payload)
# #     print("📤 WhatsApp response:", res.json())

# # # =================================
# # # Save Chat
# # # =================================
# # async def save_message(user_id: str, sender_id: str, sender_role: str, text: str = None):
# #     message = Message(
# #         sender_id=sender_id,
# #         sender_role=sender_role,
# #         text=text,
# #         timestamp=datetime.utcnow(),
# #     )
# #     await chats_collection.update_one(
# #         {"user_id": user_id},
# #         {
# #             "$push": {"messages": message.dict()},
# #             "$setOnInsert": {"user_id": user_id, "mode": "AI", "created_at": datetime.utcnow()},
# #         },
# #         upsert=True,
# #     )

# # # =================================
# # # AI Fallback
# # # =================================
# # def get_ai_reply(user_message: str):
# #     try:
# #         res = ollama.chat(model="llama3:latest", messages=[{"role": "user", "content": user_message}])
# #         return res.get("message", {}).get("content", "I'm not sure about that.")
# #     except Exception as e:
# #         print("❌ Ollama error:", e)
# #         return "Sorry, I couldn’t process that."

# # # =================================
# # # Load AI Flow
# # # =================================
# # AI_FLOW_FILE = "app/static/ai_flow.json"
# # with open(AI_FLOW_FILE, "r", encoding="utf-8") as f:
# #     ai_flow = json.load(f)

# # # =================================
# # # Chat State Helpers
# # # =================================
# # async def get_chat_state(user_id: str):
# #     record = await chats_collection.find_one({"user_id": user_id})
# #     return (record.get("state"), record.get("extra", {})) if record else (None, {})

# # async def update_chat_state(user_id: str, state: str = None, extra: dict = None):
# #     update_data = {}
# #     if state is not None:
# #         update_data["state"] = state
# #     if extra is not None:
# #         update_data["extra"] = extra
# #     if update_data:
# #         await chats_collection.update_one({"user_id": user_id}, {"$set": update_data}, upsert=True)
# #     else:
# #         await chats_collection.update_one({"user_id": user_id}, {"$unset": {"state": "", "extra": ""}})

# # # =================================
# # # WhatsApp Webhook (Main Handler)
# # # =================================
# # @app.post("/webhook")
# # async def receive_message(request: Request):
# #     data = await request.json()
# #     value = data["entry"][0]["changes"][0]["value"]
# #     if "messages" not in value:
# #         return {"status": "ok"}

# #     msg = value["messages"][0]
# #     from_number = msg["from"]
# #     user_text = msg["text"]["body"].strip()
# #     user_text_lower = user_text.lower()

# #     await save_message(from_number, from_number, "user", user_text)
# #     state, extra = await get_chat_state(from_number)
# #     ai_reply = ""

# #     # 1️⃣ Greeting
# #     if any(k in user_text_lower for k in ai_flow["greeting"]["keywords"]):
# #         for gmsg in ai_flow["greeting"]["messages"]:
# #             send_whatsapp_message(from_number, gmsg)
# #         await update_chat_state(from_number, None)
# #         return {"status": "ok"}

# #     # 2️⃣ Appointment Flow Start
# #     elif any(k in user_text_lower for k in ai_flow["services"]["appointment"]["keywords"]):
# #         ai_reply = "You selected Appointment. Please enter your full name:"
# #         await update_chat_state(from_number, "awaiting_name")

# #     # 3️⃣ Patient Info Flow
# #     elif state == "awaiting_name":
# #         extra["patient_info"] = {"name": user_text}
# #         ai_reply = "Please enter your age:"
# #         await update_chat_state(from_number, "awaiting_age", extra)

# #     elif state == "awaiting_age":
# #         try:
# #             extra["patient_info"]["age"] = int(user_text)
# #         except:
# #             extra["patient_info"]["age"] = 0
# #         ai_reply = "Please enter your address:"
# #         await update_chat_state(from_number, "awaiting_address", extra)

# #     elif state == "awaiting_address":
# #         extra["patient_info"]["address"] = user_text
# #         ai_reply = "Please enter your disease:"
# #         await update_chat_state(from_number, "awaiting_disease", extra)

# #     elif state == "awaiting_disease":
# #         disease = user_text
# #         doctors = await doctors_collection.find({"specialty": {"$regex": disease, "$options": "i"}}).to_list(length=10)
# #         if not doctors:
# #             ai_reply = f"❌ No doctors found for '{disease}'. Please try another disease."
# #             await update_chat_state(from_number, "awaiting_disease", extra)
# #         else:
# #             doc_list = "\n".join([f"👨‍⚕️ {d['name']} ({d['specialty']})" for d in doctors])
# #             ai_reply = f"Available doctors for '{disease}':\n{doc_list}\n\nPlease type doctor name and preferred time (YYYY-MM-DD HH:MM)."
# #             extra["patient_info"]["disease"] = disease
# #             await update_chat_state(from_number, "awaiting_booking", extra)

# #     elif state == "awaiting_booking":
# #         try:
# #             doctor_name, date_str = user_text.rsplit(" ", 1)
# #             appt_time = datetime.strptime(date_str, "%Y-%m-%d %H:%M")
# #             doctor = await doctors_collection.find_one({"name": {"$regex": doctor_name, "$options": "i"}})
# #             if not doctor:
# #                 ai_reply = "Doctor not found. Try again."
# #             else:
# #                 conflict = await appointments_collection.find_one(
# #                     {"doctor_id": str(doctor["_id"]), "appointment_time": appt_time}
# #                 )
# #                 if conflict:
# #                     ai_reply = "That slot is already booked. Choose another time."
# #                 else:
# #                     patient = extra.get("patient_info", {})
# #                     appt = {
# #                         "_id": ObjectId(),
# #                         "doctor_id": str(doctor["_id"]),
# #                         "patient_name": patient.get("name"),
# #                         "age": patient.get("age"),
# #                         "address": patient.get("address"),
# #                         "disease": patient.get("disease"),
# #                         "appointment_time": appt_time,
# #                         "status": "booked",
# #                         "type": "AI",
# #                     }
# #                     await appointments_collection.insert_one(appt)
# #                     ai_reply = f"✅ Appointment booked with {doctor['name']} on {appt_time.strftime('%Y-%m-%d %H:%M')}."
# #                     await update_chat_state(from_number, None)
# #         except Exception as e:
# #             print("Booking error:", e)
# #             ai_reply = "Invalid format. Example: Dr. Sharma 2025-10-06 14:30"

# #     # 4️⃣ Dynamic FAQ — Natural Language Queries
# #     elif (
# #         "doctor" in user_text_lower
# #         or "patient" in user_text_lower
# #         or "specialist" in user_text_lower
# #         or "list" in user_text_lower
# #         or "show all" in user_text_lower
# #     ):
# #         # Doctor listing or details
# #         if "doctor" in user_text_lower or "specialist" in user_text_lower or "list" in user_text_lower:
# #             specialty = user_text_lower.replace("show all", "").replace("list", "").replace("doctors", "").strip()
# #             doctors = await doctors_collection.find(
# #                 {"$or": [
# #                     {"specialty": {"$regex": specialty, "$options": "i"}},
# #                     {"name": {"$regex": specialty, "$options": "i"}}
# #                 ]}
# #             ).to_list(length=10)
# #             if doctors:
# #                 doc_lines = [f"👨‍⚕️ {d['name']} - {d['specialty']}" for d in doctors]
# #                 ai_reply = "Here are the doctors:\n" + "\n".join(doc_lines)
# #             else:
# #                 ai_reply = f"No doctors found for '{specialty}'."
# #         # Patient info
# #         elif "patient" in user_text_lower:
# #             name = user_text.split()[-1]
# #             patient = await patients_collection.find_one({"name": {"$regex": name, "$options": "i"}})
# #             if patient:
# #                 ai_reply = f"👤 Patient Details:\nName: {patient['name']}\nAge: {patient.get('age', 'N/A')}\nDisease: {patient.get('disease', 'N/A')}\nAddress: {patient.get('address', 'N/A')}"
# #             else:
# #                 ai_reply = f"No patient found with name '{name}'."

# #     # 5️⃣ Fallback AI
# #     else:
# #         ai_reply = get_ai_reply(user_text)

# #     await save_message(from_number, "ai_bot", "bot", ai_reply)
# #     send_whatsapp_message(from_number, ai_reply)
# #     return {"status": "ok"}
# from dotenv import load_dotenv
# import os
# import json
# import requests
# from datetime import datetime
# from bson import ObjectId
# from fastapi import FastAPI, Request
# from fastapi.staticfiles import StaticFiles
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse
# import ollama

# from app.routes import auth, doctor, appointments, patient, subadmin, chat
# from app.database import db, chats_collection, doctors_collection, appointments_collection, patients_collection
# from manager import ConnectionManager
# from app.models import Message

# # =================================
# # Environment
# # =================================
# load_dotenv()
# WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# # =================================
# # App Config
# # =================================
# app = FastAPI()
# manager = ConnectionManager(db)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.mount("/static", StaticFiles(directory="app/static"), name="static")

# # =================================
# # Routers
# # =================================
# app.include_router(auth.router)
# app.include_router(doctor.router)
# app.include_router(appointments.router)
# app.include_router(patient.router)
# app.include_router(subadmin.router)
# app.include_router(chat.router)

# # =================================
# # Routes
# # =================================
# @app.get("/")
# async def root():
#     return {"msg": "AI Receptionist WhatsApp Bot is running 🚀"}

# @app.get("/favicon.ico")
# async def favicon():
#     return FileResponse("app/static/favicon.ico")

# # =================================
# # Webhook Verification
# # =================================
# @app.get("/webhook")
# async def verify_token(request: Request):
#     params = request.query_params
#     if params.get("hub.verify_token") == VERIFY_TOKEN:
#         return int(params.get("hub.challenge"))
#     return {"error": "Invalid verification token"}

# # =================================
# # WhatsApp Message Sender
# # =================================
# def send_whatsapp_message(to: str, message: str):
#     url = f"https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages"
#     headers = {
#         "Authorization": f"Bearer {WHATSAPP_TOKEN}",
#         "Content-Type": "application/json",
#     }
#     payload = {
#         "messaging_product": "whatsapp",
#         "to": to,
#         "type": "text",
#         "text": {"body": message},
#     }
#     res = requests.post(url, headers=headers, json=payload)
#     print("📤 Sent:", res.json())

# # =================================
# # Save Message
# # =================================
# async def save_message(user_id: str, sender_id: str, sender_role: str, text: str = None):
#     message = Message(sender_id=sender_id, sender_role=sender_role, text=text, timestamp=datetime.utcnow())
#     await chats_collection.update_one(
#         {"user_id": user_id},
#         {
#             "$push": {"messages": message.dict()},
#             "$setOnInsert": {"user_id": user_id, "mode": "AI", "created_at": datetime.utcnow()},
#         },
#         upsert=True,
#     )

# # =================================
# # Load Flow JSON
# # =================================
# AI_FLOW_FILE = "app/static/ai_flow.json"
# with open(AI_FLOW_FILE, "r", encoding="utf-8") as f:
#     ai_flow = json.load(f)

# # =================================
# # Chat State Helpers
# # =================================
# async def get_chat_state(user_id: str):
#     record = await chats_collection.find_one({"user_id": user_id})
#     return (record.get("state"), record.get("extra", {})) if record else (None, {})

# async def update_chat_state(user_id: str, state: str = None, extra: dict = None):
#     update_data = {}
#     if state is not None:
#         update_data["state"] = state
#     if extra is not None:
#         update_data["extra"] = extra
#     if update_data:
#         await chats_collection.update_one({"user_id": user_id}, {"$set": update_data}, upsert=True)
#     else:
#         await chats_collection.update_one({"user_id": user_id}, {"$unset": {"state": "", "extra": ""}})

# # =================================
# # Ollama AI Fallback
# # =================================
# def get_ai_reply(user_message: str):
#     try:
#         res = ollama.chat(model="llama3:latest", messages=[{"role": "user", "content": user_message}])
#         return res.get("message", {}).get("content", "I'm not sure about that.")
#     except Exception as e:
#         print("❌ Ollama error:", e)
#         return "Sorry, I couldn’t process that."

# # =================================
# # Main WhatsApp Handler
# # =================================
# @app.post("/webhook")
# async def receive_message(request: Request):
#     data = await request.json()
#     value = data["entry"][0]["changes"][0]["value"]
#     if "messages" not in value:
#         return {"status": "ok"}

#     msg = value["messages"][0]
#     from_number = msg["from"]
#     user_text = msg["text"]["body"].strip()
#     user_text_lower = user_text.lower()

#     await save_message(from_number, from_number, "user", user_text)
#     state, extra = await get_chat_state(from_number)
#     ai_reply = ""

#     # 1️⃣ Greeting
#     if any(k in user_text_lower for k in ai_flow["greeting"]["keywords"]) or user_text in ["1", "2", "3"]:
#         if user_text in ["1", "appointment"]:
#             ai_reply = "You selected Appointment. Please enter your full name:"
#             await update_chat_state(from_number, "awaiting_name")
#         elif user_text in ["2", "emergency"]:
#             ai_reply = "🚨 Emergency noted! Our team will contact you immediately."
#             await update_chat_state(from_number, None)
#         elif user_text in ["3", "faq"]:
#             ai_reply = "Please type your question about doctors or patients."
#             await update_chat_state(from_number, "faq_mode")
#         else:
#             for gmsg in ai_flow["greeting"]["messages"]:
#                 send_whatsapp_message(from_number, gmsg)
#             return {"status": "ok"}

#     # 2️⃣ Appointment Flow
#     elif state == "awaiting_name":
#         extra["patient_info"] = {"name": user_text}
#         ai_reply = "Please enter your age:"
#         await update_chat_state(from_number, "awaiting_age", extra)

#     elif state == "awaiting_age":
#         try:
#             extra["patient_info"]["age"] = int(user_text)
#         except:
#             extra["patient_info"]["age"] = 0
#         ai_reply = "Please enter your address:"
#         await update_chat_state(from_number, "awaiting_address", extra)

#     elif state == "awaiting_address":
#         extra["patient_info"]["address"] = user_text
#         ai_reply = "Please enter your disease:"
#         await update_chat_state(from_number, "awaiting_disease", extra)

#     elif state == "awaiting_disease":
#         disease = user_text
#         extra["patient_info"]["disease"] = disease
#         doctors = await doctors_collection.find({"specialty": {"$regex": disease, "$options": "i"}}).to_list(length=10)
#         if not doctors:
#             ai_reply = f"❌ No doctors found for '{disease}'. Please try another disease."
#             await update_chat_state(from_number, "awaiting_disease", extra)
#         else:
#             doc_list = "\n".join([f"👨‍⚕️ {d['name']} ({d['specialty']})" for d in doctors])
#             ai_reply = f"Available doctors:\n{doc_list}\n\nPlease type your preferred doctor name:"
#             await update_chat_state(from_number, "awaiting_doctor", extra)

#     elif state == "awaiting_doctor":
#         extra["patient_info"]["doctor_name"] = user_text
#         ai_reply = "Please enter your preferred appointment date and time (YYYY-MM-DD HH:MM):"
#         await update_chat_state(from_number, "awaiting_time", extra)

#     elif state == "awaiting_time":
#         try:
#             appt_time = datetime.strptime(user_text, "%Y-%m-%d %H:%M")
#             doctor = await doctors_collection.find_one({"name": {"$regex": extra["patient_info"]["doctor_name"], "$options": "i"}})
#             if not doctor:
#                 ai_reply = "Doctor not found. Please type a valid doctor name."
#                 await update_chat_state(from_number, "awaiting_doctor", extra)
#             else:
#                 conflict = await appointments_collection.find_one(
#                     {"doctor_id": str(doctor["_id"]), "appointment_time": appt_time}
#                 )
#                 if conflict:
#                     ai_reply = "That slot is already booked. Please choose another time."
#                 else:
#                     patient = extra["patient_info"]
#                     appt = {
#                         "_id": ObjectId(),
#                         "doctor_id": str(doctor["_id"]),
#                         "patient_name": patient["name"],
#                         "age": patient["age"],
#                         "address": patient["address"],
#                         "disease": patient["disease"],
#                         "appointment_time": appt_time,
#                         "status": "booked",
#                         "type": "AI",
#                     }
#                     await appointments_collection.insert_one(appt)
#                     ai_reply = f"✅ Appointment booked with {doctor['name']} on {appt_time.strftime('%Y-%m-%d %H:%M')}."
#                     await update_chat_state(from_number, None)
#         except Exception as e:
#             ai_reply = "Invalid format. Please use YYYY-MM-DD HH:MM"

#     # 3️⃣ FAQ Section
#     elif state == "faq_mode" or "doctor" in user_text_lower or "patient" in user_text_lower:
#         if "doctor" in user_text_lower or "specialist" in user_text_lower:
#             specialty = user_text_lower.replace("show", "").replace("doctors", "").strip()
#             doctors = await doctors_collection.find(
#                 {"$or": [
#                     {"specialty": {"$regex": specialty, "$options": "i"}},
#                     {"name": {"$regex": specialty, "$options": "i"}}
#                 ]}
#             ).to_list(length=10)
#             if doctors:
#                 ai_reply = "👨‍⚕️ Doctors:\n" + "\n".join([f"{d['name']} - {d['specialty']}" for d in doctors])
#             else:
#                 ai_reply = "No doctors found."
#         elif "patient" in user_text_lower:
#             name = user_text.split()[-1]
#             patient = await patients_collection.find_one({"name": {"$regex": name, "$options": "i"}})
#             if patient:
#                 ai_reply = f"👤 Patient Details:\nName: {patient['name']}\nAge: {patient.get('age')}\nDisease: {patient.get('disease')}\nAddress: {patient.get('address')}"
#             else:
#                 ai_reply = f"No patient found with name '{name}'."
#         else:
#             ai_reply = get_ai_reply(user_text)

#     # 4️⃣ Fallback AI
#     else:
#         ai_reply = get_ai_reply(user_text)

#     await save_message(from_number, "ai_bot", "bot", ai_reply)
#     send_whatsapp_message(from_number, ai_reply)
#     return {"status": "ok"}
from dotenv import load_dotenv
import os, json, requests, asyncio, re
from datetime import datetime, timedelta
from bson import ObjectId
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import ollama
from sentence_transformers import SentenceTransformer
from dateutil import parser as dt_parser

# ==============================
# App Imports
# ==============================
from app.routes import auth, doctor, appointments, patient, subadmin, chat
from app.database import (
    db,
    chats_collection,
    doctors_collection,
    appointments_collection,
    patients_collection,
)
from manager import ConnectionManager
from app.models import Message
from app.routes.appointments import round_to_nearest_half_hour

# ==============================
# Environment Setup
# ==============================
load_dotenv()
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# ==============================
# SentenceTransformer Model
# ==============================
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
st_sync_model = None
try:
    st_sync_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    print(f"✅ Loaded SentenceTransformer model: {EMBEDDING_MODEL_NAME}")
except Exception as e:
    print(f"❌ Error loading SentenceTransformer: {e}")
    st_sync_model = None

# ==============================
# Embedding Generator
# ==============================
async def get_embedding_vector(text: str):
    if st_sync_model is None:
        print("❌ Model not loaded.")
        return None

    def sync_embed(txt):
        return st_sync_model.encode(txt, convert_to_tensor=False).tolist()

    try:
        return await asyncio.to_thread(sync_embed, text)
    except Exception as e:
        print(f"Embedding Error: {e}")
        return None

# ==============================
# Doctor Semantic Search
# ==============================
async def semantic_search_doctor(query: str, limit: int = 1):
    query_vector = await get_embedding_vector(query)
    if not query_vector:
        return None

    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": query_vector,
                "numCandidates": 50,
                "limit": limit,
            }
        },
        {
            "$project": {
                "_id": 1,
                "name": 1,
                "specialty": 1,
                "timing": 1,
                "status": 1,
                "phone": 1,
                "experience": 1,
                "score": {"$meta": "vectorSearchScore"},
            }
        },
    ]
    cursor = doctors_collection.aggregate(pipeline)
    results = await cursor.to_list(length=limit)
    return results[0] if results else None

# ==============================
# Patient Search (Flexible)
# ==============================
# ==============================
# True Semantic Patient Search (Analyzes Message Intelligently)
# ==============================
async def search_patient_from_message(user_text: str):
    """
    Smart hybrid patient search:
    1️⃣ Semantic search using embeddings.
    2️⃣ Fallback to fuzzy name match if embedding similarity is low or no results.
    """
    query_vector = await get_embedding_vector(user_text)
    if not query_vector:
        print("❌ Could not generate embedding for patient search.")
        return None

    try:
        # 1️⃣ Semantic Search (fetch multiple)
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "patient_vector_index",
                    "path": "embedding",
                    "queryVector": query_vector,
                    "numCandidates": 50,
                    "limit": 5,  # fetch more candidates
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "name": 1,
                    "age": 1,
                    "issue": 1,
                    "phone": 1,
                    "lastVisit": 1,
                    "score": {"$meta": "vectorSearchScore"},
                }
            },
        ]

        cursor = patients_collection.aggregate(pipeline)
        results = await cursor.to_list(length=5)

        # 2️⃣ Filter by partial name mention
        if results:
            for r in results:
                if any(n in user_text.lower() for n in r["name"].lower().split()):
                    r["_id"] = str(r["_id"])
                    print(f"✅ Hybrid match for patient: {r['name']} (Score: {r['score']:.3f})")
                    return r

        # 3️⃣ Fuzzy fallback if semantic fails
        name_match = re.search(r"(?:patient|show|details|about)?\s*(\w+)", user_text.lower())
        if name_match:
            name_candidate = name_match.group(1)
            fuzzy = await patients_collection.find_one(
                {"name": {"$regex": name_candidate, "$options": "i"}}
            )
            if fuzzy:
                fuzzy["_id"] = str(fuzzy["_id"])
                print(f"🧩 Fuzzy match for patient: {fuzzy['name']}")
                return fuzzy

        print("⚠️ No match found for patient.")
        return None

    except Exception as e:
        print(f"❌ Hybrid Patient Search Error: {e}")
        return None

# ==============================
# FastAPI Setup
# ==============================
app = FastAPI()
manager = ConnectionManager(db)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Include Routers
app.include_router(auth.router)
app.include_router(doctor.router)
app.include_router(appointments.router)
app.include_router(patient.router)
app.include_router(subadmin.router)
app.include_router(chat.router)

@app.get("/")
async def root():
    return {"msg": "AI Receptionist WhatsApp Bot is running 🚀"}

@app.get("/favicon.ico")
async def favicon():
    return FileResponse("app/static/favicon.ico")

@app.get("/webhook")
async def verify_token(request: Request):
    params = request.query_params
    if params.get("hub.verify_token") == VERIFY_TOKEN:
        return int(params.get("hub.challenge"))
    return {"error": "Invalid verification token"}

# ==============================
# WhatsApp Sender
# ==============================
def send_whatsapp_message(to: str, message: str):
    url = f"https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": message},
    }
    res = requests.post(url, headers=headers, json=payload)
    print("📤 Sent Message:", res.json())

# ==============================
# Save Message
# ==============================
async def save_message(user_id: str, sender_id: str, sender_role: str, text: str):
    if not text:
        return
    message = Message(
        sender_id=sender_id, sender_role=sender_role, text=text, timestamp=datetime.utcnow()
    )
    await chats_collection.update_one(
        {"user_id": user_id},
        {
            "$push": {"messages": message.dict()},
            "$setOnInsert": {"user_id": user_id, "created_at": datetime.utcnow()},
        },
        upsert=True,
    )

# ==============================
# System Prompt
# ==============================
SYSTEM_PROMPT = """
You are a polite and professional AI receptionist for a hospital.

Duties:
1️⃣ Greet politely when user greets.
2️⃣ Provide hospital, doctor, and patient information when asked.
3️⃣ If user asks about a doctor, search doctor collection and reply.
4️⃣ If user asks about a patient, search patient collection and reply.
5️⃣ If booking/appointment query, ask required details.
6️⃣ For unrelated queries, reply: "Sorry, I can only assist with hospital-related queries."
"""

# ==============================
# AI Response
# ==============================
async def get_ai_response(user_id: str, user_message: str):
    context = ""
    chat_record = await chats_collection.find_one(
        {"user_id": user_id}, {"messages": {"$slice": -5}}
    )
    history = [{"role": "system", "content": SYSTEM_PROMPT + context}]

    if chat_record:
        for msg in chat_record["messages"]:
            if msg["sender_role"] == "user":
                history.append({"role": "user", "content": msg["text"]})
            elif msg["sender_role"] == "bot" and "No doctor found" not in msg["text"]:
                history.append({"role": "assistant", "content": msg["text"]})

    history.append({"role": "user", "content": user_message})
    print("🧠 Sending to Ollama:", history)

    try:
        def run_ollama():
            response = ollama.chat(model="llama3:latest", messages=history)
            if isinstance(response, dict) and "message" in response:
                return response["message"]["content"]
            elif hasattr(response, "__iter__"):
                full_response = ""
                for chunk in response:
                    full_response += chunk.get("message", {}).get("content", "")
                return full_response
            else:
                return str(response)

        reply = await asyncio.to_thread(run_ollama)
        print("🤖 Ollama Reply:", reply)
        return reply.strip() if reply else "Sorry, I couldn’t process that request right now."

    except Exception as e:
        print(f"❌ Ollama Error: {e}")
        return "Sorry, I couldn’t process that request right now."

# ==============================
# Suggest Available Doctor
# ==============================
async def suggest_available_doctor(specialty: str, requested_time: datetime):
    doctors = await doctors_collection.find({"specialty": {"$regex": specialty, "$options": "i"}}).to_list(20)
    if not doctors:
        return None, f"❌ No doctor found for specialty '{specialty}'"

    for doc in doctors:
        if doc.get("status") == "leave":
            continue
        appt_time = round_to_nearest_half_hour(requested_time)
        conflict = await appointments_collection.find_one({
            "doctor_id": str(doc["_id"]),
            "appointment_time": appt_time,
            "status": "booked"
        })
        if not conflict:
            return doc, appt_time

    return None, f"⚠️ All {specialty} doctors are busy or on leave at {requested_time.strftime('%Y-%m-%d %H:%M')}"

# ==============================
# Webhook with AI + Appointment Booking
# ==============================
@app.post("/webhook")
async def receive_message(request: Request):
    data = await request.json()
    if "entry" not in data:
        return {"status": "ignored"}

    value = data["entry"][0].get("changes", [])[0].get("value", {})
    if "messages" not in value:
        return {"status": "ignored"}

    msg = value["messages"][0]
    if msg.get("type") != "text":
        return {"status": "ignored"}

    from_number = msg["from"]
    user_text = msg["text"]["body"].strip()
    print(f"📩 From {from_number}: {user_text}")

    # ------------------------
    # Greeting
    # ------------------------
    if user_text.lower() in ["hi", "hello", "hey", "good morning", "good evening"]:
        ai_reply = "👋 Hello! I’m your AI hospital receptionist. How may I assist you today?"
        send_whatsapp_message(from_number, ai_reply)
        await save_message(from_number, "ai_bot", "bot", ai_reply)
        return {"status": "ok"}

    # Save user message
    await save_message(from_number, from_number, "user", user_text)

    # ------------------------
    # Doctor semantic search
    # ------------------------
    found_doctor = await semantic_search_doctor(user_text)
    if not found_doctor:
        name_match = re.search(r"doctor (\w+)", user_text.lower())
        if name_match:
            doctor_name = name_match.group(1)
            found_doctor = await doctors_collection.find_one({
                "name": {"$regex": doctor_name, "$options": "i"}
            })

    # ------------------------
    # Patient search
    # ------------------------
    patient = await search_patient_from_message(user_text)
    patient_name = patient["name"] if patient else None

    # ------------------------
    # Appointment Booking
    # ------------------------
    appt_keywords = ["appointment", "book", "schedule"]
    if any(k in user_text.lower() for k in appt_keywords):
        # Extract patient
        patient_match = re.search(r"for (\w+?) for", user_text.lower())  # patient before "for <specialty>"
        if patient_match:
            patient_name = patient_match.group(1).capitalize()

        # Extract specialty
        specialty_match = re.search(r"for (\w+)(?: at|$)", user_text.lower())
        specialty = specialty_match.group(1) if specialty_match else None

        # Extract time
        time_match = re.search(r"\b(\d{4}-\d{2}-\d{2} \d{1,2}:\d{2})\b", user_text)
        appt_time = None
        if time_match:
            try:
                appt_time = dt_parser.parse(time_match.group(0))
            except Exception:
                appt_time = datetime.now()

        # Determine doctor
        doctor_name_match = re.search(r"doctor (\w+)", user_text.lower())
        doctor_name = doctor_name_match.group(1) if doctor_name_match else None

        doctor = None
        if doctor_name:
            doctor = await doctors_collection.find_one({
                "name": {"$regex": doctor_name, "$options": "i"}
            })
            if not doctor:
                ai_reply = f"❌ Sorry, no doctor found with name '{doctor_name}'"
                send_whatsapp_message(from_number, ai_reply)
                await save_message(from_number, "ai_bot", "bot", ai_reply)
                return {"status": "ok"}
        elif specialty:
            doctor, appt_time = await suggest_available_doctor(specialty, appt_time or datetime.now())
            if not doctor:
                ai_reply = appt_time
                send_whatsapp_message(from_number, ai_reply)
                await save_message(from_number, "ai_bot", "bot", ai_reply)
                return {"status": "ok"}
        else:
            ai_reply = "⚠️ Please provide doctor name or specialty for appointment."
            send_whatsapp_message(from_number, ai_reply)
            await save_message(from_number, "ai_bot", "bot", ai_reply)
            return {"status": "ok"}

        # Check doctor leave
        if doctor.get("status") == "leave":
            ai_reply = f"⚠️ Doctor {doctor['name']} is on leave. Cannot book this slot."
            send_whatsapp_message(from_number, ai_reply)
            await save_message(from_number, "ai_bot", "bot", ai_reply)
            return {"status": "ok"}

        # Check slot conflict
        conflict = await appointments_collection.find_one({
            "doctor_id": str(doctor["_id"]),
            "appointment_time": appt_time
        })
        if conflict:
            suggested_time = round_to_nearest_half_hour(appt_time + timedelta(minutes=30))
            ai_reply = (
                f"⚠️ The requested slot {appt_time.strftime('%Y-%m-%d %H:%M')} "
                f"is already booked for Doctor {doctor['name']}.\n"
                f"Suggesting next available: {suggested_time.strftime('%Y-%m-%d %H:%M')}"
            )
            send_whatsapp_message(from_number, ai_reply)
            await save_message(from_number, "ai_bot", "bot", ai_reply)
            return {"status": "ok"}

        # Book appointment
        patient_id = str(ObjectId())
        appointment_doc = {
            "doctor_id": str(doctor["_id"]),
            "patient_id": patient_id,
            "patient_name": patient_name or "Unknown",
            "doctor_name": doctor["name"],
            "disease": specialty or "N/A",
            "appointment_time": appt_time,
            "type": "AI",
            "status": "booked",
            "created_at": datetime.utcnow()
        }
        result = await appointments_collection.insert_one(appointment_doc)
        appointment_doc["_id"] = str(result.inserted_id)

        ai_reply = (
            f"✅ Appointment Booked Successfully!\n"
            f"👤 Patient: {appointment_doc['patient_name']}\n"
            f"👨‍⚕️ Doctor: {appointment_doc['doctor_name']}\n"
            f"🩺 Issue/Disease: {appointment_doc['disease']}\n"
            f"📅 Date & Time: {appt_time.strftime('%Y-%m-%d %H:%M')}\n"
            f"📄 Appointment ID: {appointment_doc['_id']}"
        )
        send_whatsapp_message(from_number, ai_reply)
        await save_message(from_number, "ai_bot", "bot", ai_reply)
        return {"status": "ok"}

    # ------------------------
    # Doctor Info
    # ------------------------
    if found_doctor:
        ai_reply = (
            f"👨‍⚕️ Doctor Details:\n"
            f"Name: {found_doctor['name']}\n"
            f"Specialty: {found_doctor.get('specialty', 'N/A')}\n"
            f"Experience: {found_doctor.get('experience', 'N/A')} years\n"
            f"Status: {found_doctor.get('status', 'N/A')}\n"
            f"Timing: {found_doctor.get('timing', 'N/A')}\n"
            f"Phone: {found_doctor.get('phone', 'N/A')}"
        )
    # ------------------------
    # Patient Info
    # ------------------------
    elif patient:
        ai_reply = (
            f"✅ Patient Details:\n"
            f"👤 Name: {patient.get('name')}\n"
            f"🎂 Age: {patient.get('age', 'N/A')}\n"
            f"🩺 Issue: {patient.get('issue', 'N/A')}\n"
            f"📞 Phone: {patient.get('phone', 'N/A')}\n"
            f"📅 Last Visit: {patient.get('lastVisit', 'N/A')}"
        )
    else:
        # Ollama fallback
        print("⚠️ No doctor/patient found, asking Ollama for help...")
        ai_reply = await get_ai_response(from_number, user_text)

    # Send + Save AI reply
    send_whatsapp_message(from_number, ai_reply)
    await save_message(from_number, "ai_bot", "bot", ai_reply)

    return {"status": "ok"}
