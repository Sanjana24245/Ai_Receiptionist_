# from dotenv import load_dotenv
# import os
# import json
# import requests
# from datetime import datetime
# from bson import ObjectId
# from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, Request
# from fastapi.staticfiles import StaticFiles
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse

# import ollama
# from app.routes import auth, doctor, appointments, patient, subadmin, chat
# from app.database import db, chats_collection, doctors_collection, appointments_collection, patients_collection
# from manager import ConnectionManager
# from app.models import Chat, Message

# # ==============================
# # Load environment variables
# # ==============================
# load_dotenv()
# WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# # ==============================
# # FastAPI setup
# # ==============================
# app = FastAPI()
# manager = ConnectionManager(db)

# # ==============================
# # Middleware
# # ==============================
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ==============================
# # Static files
# # ==============================
# app.mount("/static", StaticFiles(directory="app/static"), name="static")

# # ==============================
# # Routers
# # ==============================
# app.include_router(auth.router)
# app.include_router(doctor.router)
# app.include_router(appointments.router)
# app.include_router(patient.router)
# app.include_router(subadmin.router)
# app.include_router(chat.router)

# # ==============================
# # Basic routes
# # ==============================
# @app.get("/favicon.ico")
# async def favicon():
#     return FileResponse("app/static/favicon.ico")

# @app.get("/")
# async def root():
#     return {"msg": "FastAPI WhatsApp bot with AI is running 🚀"}

# # ==============================
# # WhatsApp Webhook Verification
# # ==============================
# @app.get("/webhook")
# async def verify_token(request: Request):
#     params = request.query_params
#     if params.get("hub.verify_token") == VERIFY_TOKEN:
#         return int(params.get("hub.challenge"))
#     return {"error": "Invalid verification token"}

# # ==============================
# # WhatsApp Message Sender
# # ==============================
# def send_whatsapp_message(to: str, message: str):
#     url = f"https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages"
#     headers = {
#         "Authorization": f"Bearer {WHATSAPP_TOKEN}",
#         "Content-Type": "application/json"
#     }
#     payload = {
#         "messaging_product": "whatsapp",
#         "to": to,
#         "type": "text",
#         "text": {"body": message}
#     }
#     res = requests.post(url, headers=headers, json=payload)
#     print("📤 WhatsApp response:", res.json())

# # ==============================
# # Save Message in DB
# # ==============================
# async def save_message(user_id: str, sender_id: str, sender_role: str, text: str = None, type: str = "text"):
#     message = Message(
#         sender_id=sender_id,
#         sender_role=sender_role,
#         text=text,
#         type=type,
#         timestamp=datetime.utcnow()
#     )
#     await chats_collection.update_one(
#         {"user_id": user_id},
#         {
#             "$push": {"messages": message.dict()},
#             "$setOnInsert": {"user_id": user_id, "mode": "AI", "created_at": datetime.utcnow()}
#         },
#         upsert=True
#     )

# # ==============================
# # Ollama AI Reply
# # ==============================
# def get_ai_reply(user_message: str) -> str:
#     try:
#         response = ollama.chat(
#             model="llama3:latest",
#             messages=[{"role": "user", "content": user_message}]
#         )
#         if "message" in response and "content" in response["message"]:
#             return response["message"]["content"]
#         return response.get("content", "Sorry, I couldn’t generate a reply.")
#     except Exception as e:
#         print("❌ Ollama error:", e)
#         return "Sorry, I’m having trouble answering right now."

# # ==============================
# # Load AI Flow JSON
# # ==============================
# AI_FLOW_FILE = "app/static/ai_flow.json"
# with open(AI_FLOW_FILE, "r", encoding="utf-8") as f:
#     ai_flow = json.load(f)

# # ==============================
# # Chat State Helpers
# # ==============================
# async def get_chat_state(user_id: str):
#     record = await chats_collection.find_one({"user_id": user_id})
#     if record and "state" in record:
#         return record["state"], record.get("extra", {})
#     return None, {}

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

# # ==============================
# # WhatsApp Message Handler
# # ==============================
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
#     if any(k in user_text_lower for k in ai_flow["greeting"]["keywords"]):
#         for msg in ai_flow["greeting"]["messages"]:
#             await save_message(from_number, "ai_bot", "bot", msg)
#             send_whatsapp_message(from_number, msg)
#         await update_chat_state(from_number, None)
#         return {"status": "ok"}

#     # 2️⃣ Appointment intent
#     elif any(k in user_text_lower for k in ai_flow["services"]["appointment"]["keywords"]):
#         ai_reply = "You selected Appointment. Please enter your full name:"
#         await update_chat_state(from_number, "awaiting_name")

#     # 3️⃣ Name
#     elif state == "awaiting_name":
#         extra["patient_info"] = {"name": user_text}
#         ai_reply = "Please enter your age:"
#         await update_chat_state(from_number, "awaiting_age", extra)

#     # 4️⃣ Age
#     elif state == "awaiting_age":
#         try:
#             extra["patient_info"]["age"] = int(user_text)
#         except:
#             extra["patient_info"]["age"] = 0
#         ai_reply = "Please enter your address:"
#         await update_chat_state(from_number, "awaiting_address", extra)

#     # 5️⃣ Address
#     elif state == "awaiting_address":
#         extra["patient_info"]["address"] = user_text
#         ai_reply = "Please enter your disease:"
#         await update_chat_state(from_number, "awaiting_disease", extra)

#     # 6️⃣ Disease
#     elif state == "awaiting_disease":
#         disease = user_text
#         doctors = await doctors_collection.find({"specialty": {"$regex": disease, "$options": "i"}}).to_list(length=5)
#         if not doctors:
#             ai_reply = f"❌ No doctors found for '{disease}'. Try again."
#             await update_chat_state(from_number, "awaiting_disease", extra)
#         else:
#             doc_list = "\n".join([f"👨‍⚕️ {d['name']} ({d['specialty']})" for d in doctors])
#             ai_reply = f"Available doctors for '{disease}':\n{doc_list}\n\nPlease type doctor name and preferred time (YYYY-MM-DD HH:MM)."
#             extra["patient_info"]["disease"] = disease
#             await update_chat_state(from_number, "awaiting_booking", extra)

#     # 7️⃣ Booking
#     elif state == "awaiting_booking":
#         try:
#             parts = user_text.rsplit(" ", 2)
#             doctor_name = parts[0].strip()
#             date_str = " ".join(parts[1:])
#             appt_time = datetime.strptime(date_str, "%Y-%m-%d %H:%M")

#             doctor = await doctors_collection.find_one({"name": {"$regex": doctor_name, "$options": "i"}})
#             if not doctor:
#                 ai_reply = "Doctor not found. Try again."
#             else:
#                 conflict = await appointments_collection.find_one({"doctor_id": str(doctor["_id"]), "appointment_time": appt_time})
#                 if conflict:
#                     ai_reply = "That slot is already booked. Choose another time."
#                 else:
#                     patient = extra.get("patient_info", {})
#                     appt = {
#                         "_id": ObjectId(),
#                         "doctor_id": str(doctor["_id"]),
#                         "patient_id": patient.get("patient_id", str(ObjectId())),
#                         "name": patient.get("name"),
#                         "age": patient.get("age"),
#                         "address": patient.get("address"),
#                         "disease": patient.get("disease"),
#                         "appointment_time": appt_time,
#                         "status": "booked",
#                         "type": "AI"
#                     }
#                     await appointments_collection.insert_one(appt)
#                     ai_reply = f"✅ Appointment booked with {doctor['name']} on {appt_time.strftime('%Y-%m-%d %H:%M')}."
#                     await update_chat_state(from_number, None)
#         except Exception as e:
#             print("Booking error:", e)
#             ai_reply = "Invalid format. Example: Dr. Sharma 2025-10-06 14:30"

#     # 8️⃣ Dynamic FAQ — Patient or Doctor
#     elif any(k in user_text_lower for k in ai_flow["services"]["faq"]["keywords"]):
#         if "patient" in user_text_lower:
#             query_name = user_text.split()[-1]
#             patient = await patients_collection.find_one({"name": {"$regex": query_name, "$options": "i"}})
#             if patient:
#                 ai_reply = f"👤 Patient Details:\nName: {patient['name']}\nAge: {patient['age']}\nDisease: {patient.get('disease', 'N/A')}\nAddress: {patient.get('address', 'N/A')}"
#             else:
#                 ai_reply = f"No patient found with name similar to '{query_name}'."
#         elif "doctor" in user_text_lower or "timing" in user_text_lower or "specialist" in user_text_lower:
#             doctor = await doctors_collection.find_one({
#                 "$or": [
#                     {"name": {"$regex": user_text, "$options": "i"}},
#                     {"specialty": {"$regex": user_text, "$options": "i"}}
#                 ]
#             })
#             if doctor:
#                 ai_reply = f"👨‍⚕️ Doctor Details:\nName: {doctor['name']}\nSpecialty: {doctor['specialty']}\nAvailable: {doctor.get('timings', 'Not updated')}"
#             else:
#                 ai_reply = f"No doctor info found for '{user_text}'."
#         else:
#             ai_reply = ai_flow["services"]["faq"]["messages"][0]

#     # 9️⃣ Fallback (AI or help)
#     else:
#         ai_reply = get_ai_reply(user_text)

#     await save_message(from_number, "ai_bot", "bot", ai_reply)
#     send_whatsapp_message(from_number, ai_reply)
#     return {"status": "ok"}

# # ==============================
# # WebSocket Chat System
# # ==============================
# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket, role: str = Query(...), client_id: str = Query(None)):
#     try:
#         if not client_id:
#             await websocket.close(code=4001)
#             return
#         if role == "user":
#             await manager.connect_user(client_id, websocket)
#         elif role == "subadmin":
#             await manager.connect_subadmin(client_id, websocket)
#         else:
#             await websocket.close(code=4000)
#             return

#         while True:
#             data = await websocket.receive_text()
#             msg = json.loads(data)
#             if "timestamp" not in msg:
#                 msg["timestamp"] = datetime.utcnow().isoformat()
#             await manager.route_message(msg)
#     except WebSocketDisconnect:
#         await manager.disconnect(websocket)
#     except Exception as e:
#         print("❌ WebSocket error:", e)
#         await manager.disconnect(websocket)
# from dotenv import load_dotenv
# import os
# import json
# import requests
# from datetime import datetime
# from bson import ObjectId
# from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, Request
# from fastapi.staticfiles import StaticFiles
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse

# import ollama
# from app.routes import auth, doctor, appointments, patient, subadmin, chat
# from app.database import db, chats_collection, doctors_collection, appointments_collection, patients_collection
# from manager import ConnectionManager
# from app.models import Message

# # =================================
# # Environment Variables
# # =================================
# load_dotenv()
# WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# # =================================
# # FastAPI App
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
# # Basic routes
# # =================================
# @app.get("/")
# async def root():
#     return {"msg": "FastAPI WhatsApp bot with AI is running 🚀"}

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
#     print("📤 WhatsApp response:", res.json())

# # =================================
# # Save Chat
# # =================================
# async def save_message(user_id: str, sender_id: str, sender_role: str, text: str = None):
#     message = Message(
#         sender_id=sender_id,
#         sender_role=sender_role,
#         text=text,
#         timestamp=datetime.utcnow(),
#     )
#     await chats_collection.update_one(
#         {"user_id": user_id},
#         {
#             "$push": {"messages": message.dict()},
#             "$setOnInsert": {"user_id": user_id, "mode": "AI", "created_at": datetime.utcnow()},
#         },
#         upsert=True,
#     )

# # =================================
# # AI Fallback
# # =================================
# def get_ai_reply(user_message: str):
#     try:
#         res = ollama.chat(model="llama3:latest", messages=[{"role": "user", "content": user_message}])
#         return res.get("message", {}).get("content", "I'm not sure about that.")
#     except Exception as e:
#         print("❌ Ollama error:", e)
#         return "Sorry, I couldn’t process that."

# # =================================
# # Load AI Flow
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
# # WhatsApp Webhook (Main Handler)
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
#     if any(k in user_text_lower for k in ai_flow["greeting"]["keywords"]):
#         for gmsg in ai_flow["greeting"]["messages"]:
#             send_whatsapp_message(from_number, gmsg)
#         await update_chat_state(from_number, None)
#         return {"status": "ok"}

#     # 2️⃣ Appointment Flow Start
#     elif any(k in user_text_lower for k in ai_flow["services"]["appointment"]["keywords"]):
#         ai_reply = "You selected Appointment. Please enter your full name:"
#         await update_chat_state(from_number, "awaiting_name")

#     # 3️⃣ Patient Info Flow
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
#         doctors = await doctors_collection.find({"specialty": {"$regex": disease, "$options": "i"}}).to_list(length=10)
#         if not doctors:
#             ai_reply = f"❌ No doctors found for '{disease}'. Please try another disease."
#             await update_chat_state(from_number, "awaiting_disease", extra)
#         else:
#             doc_list = "\n".join([f"👨‍⚕️ {d['name']} ({d['specialty']})" for d in doctors])
#             ai_reply = f"Available doctors for '{disease}':\n{doc_list}\n\nPlease type doctor name and preferred time (YYYY-MM-DD HH:MM)."
#             extra["patient_info"]["disease"] = disease
#             await update_chat_state(from_number, "awaiting_booking", extra)

#     elif state == "awaiting_booking":
#         try:
#             doctor_name, date_str = user_text.rsplit(" ", 1)
#             appt_time = datetime.strptime(date_str, "%Y-%m-%d %H:%M")
#             doctor = await doctors_collection.find_one({"name": {"$regex": doctor_name, "$options": "i"}})
#             if not doctor:
#                 ai_reply = "Doctor not found. Try again."
#             else:
#                 conflict = await appointments_collection.find_one(
#                     {"doctor_id": str(doctor["_id"]), "appointment_time": appt_time}
#                 )
#                 if conflict:
#                     ai_reply = "That slot is already booked. Choose another time."
#                 else:
#                     patient = extra.get("patient_info", {})
#                     appt = {
#                         "_id": ObjectId(),
#                         "doctor_id": str(doctor["_id"]),
#                         "patient_name": patient.get("name"),
#                         "age": patient.get("age"),
#                         "address": patient.get("address"),
#                         "disease": patient.get("disease"),
#                         "appointment_time": appt_time,
#                         "status": "booked",
#                         "type": "AI",
#                     }
#                     await appointments_collection.insert_one(appt)
#                     ai_reply = f"✅ Appointment booked with {doctor['name']} on {appt_time.strftime('%Y-%m-%d %H:%M')}."
#                     await update_chat_state(from_number, None)
#         except Exception as e:
#             print("Booking error:", e)
#             ai_reply = "Invalid format. Example: Dr. Sharma 2025-10-06 14:30"

#     # 4️⃣ Dynamic FAQ — Natural Language Queries
#     elif (
#         "doctor" in user_text_lower
#         or "patient" in user_text_lower
#         or "specialist" in user_text_lower
#         or "list" in user_text_lower
#         or "show all" in user_text_lower
#     ):
#         # Doctor listing or details
#         if "doctor" in user_text_lower or "specialist" in user_text_lower or "list" in user_text_lower:
#             specialty = user_text_lower.replace("show all", "").replace("list", "").replace("doctors", "").strip()
#             doctors = await doctors_collection.find(
#                 {"$or": [
#                     {"specialty": {"$regex": specialty, "$options": "i"}},
#                     {"name": {"$regex": specialty, "$options": "i"}}
#                 ]}
#             ).to_list(length=10)
#             if doctors:
#                 doc_lines = [f"👨‍⚕️ {d['name']} - {d['specialty']}" for d in doctors]
#                 ai_reply = "Here are the doctors:\n" + "\n".join(doc_lines)
#             else:
#                 ai_reply = f"No doctors found for '{specialty}'."
#         # Patient info
#         elif "patient" in user_text_lower:
#             name = user_text.split()[-1]
#             patient = await patients_collection.find_one({"name": {"$regex": name, "$options": "i"}})
#             if patient:
#                 ai_reply = f"👤 Patient Details:\nName: {patient['name']}\nAge: {patient.get('age', 'N/A')}\nDisease: {patient.get('disease', 'N/A')}\nAddress: {patient.get('address', 'N/A')}"
#             else:
#                 ai_reply = f"No patient found with name '{name}'."

#     # 5️⃣ Fallback AI
#     else:
#         ai_reply = get_ai_reply(user_text)

#     await save_message(from_number, "ai_bot", "bot", ai_reply)
#     send_whatsapp_message(from_number, ai_reply)
#     return {"status": "ok"}
from dotenv import load_dotenv
import os
import json
import requests
from datetime import datetime
from bson import ObjectId
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import ollama

from app.routes import auth, doctor, appointments, patient, subadmin, chat
from app.database import db, chats_collection, doctors_collection, appointments_collection, patients_collection
from manager import ConnectionManager
from app.models import Message

# =================================
# Environment
# =================================
load_dotenv()
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# =================================
# App Config
# =================================
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

# =================================
# Routers
# =================================
app.include_router(auth.router)
app.include_router(doctor.router)
app.include_router(appointments.router)
app.include_router(patient.router)
app.include_router(subadmin.router)
app.include_router(chat.router)

# =================================
# Routes
# =================================
@app.get("/")
async def root():
    return {"msg": "AI Receptionist WhatsApp Bot is running 🚀"}

@app.get("/favicon.ico")
async def favicon():
    return FileResponse("app/static/favicon.ico")

# =================================
# Webhook Verification
# =================================
@app.get("/webhook")
async def verify_token(request: Request):
    params = request.query_params
    if params.get("hub.verify_token") == VERIFY_TOKEN:
        return int(params.get("hub.challenge"))
    return {"error": "Invalid verification token"}

# =================================
# WhatsApp Message Sender
# =================================
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
    print("📤 Sent:", res.json())

# =================================
# Save Message
# =================================
async def save_message(user_id: str, sender_id: str, sender_role: str, text: str = None):
    message = Message(sender_id=sender_id, sender_role=sender_role, text=text, timestamp=datetime.utcnow())
    await chats_collection.update_one(
        {"user_id": user_id},
        {
            "$push": {"messages": message.dict()},
            "$setOnInsert": {"user_id": user_id, "mode": "AI", "created_at": datetime.utcnow()},
        },
        upsert=True,
    )

# =================================
# Load Flow JSON
# =================================
AI_FLOW_FILE = "app/static/ai_flow.json"
with open(AI_FLOW_FILE, "r", encoding="utf-8") as f:
    ai_flow = json.load(f)

# =================================
# Chat State Helpers
# =================================
async def get_chat_state(user_id: str):
    record = await chats_collection.find_one({"user_id": user_id})
    return (record.get("state"), record.get("extra", {})) if record else (None, {})

async def update_chat_state(user_id: str, state: str = None, extra: dict = None):
    update_data = {}
    if state is not None:
        update_data["state"] = state
    if extra is not None:
        update_data["extra"] = extra
    if update_data:
        await chats_collection.update_one({"user_id": user_id}, {"$set": update_data}, upsert=True)
    else:
        await chats_collection.update_one({"user_id": user_id}, {"$unset": {"state": "", "extra": ""}})

# =================================
# Ollama AI Fallback
# =================================
def get_ai_reply(user_message: str):
    try:
        res = ollama.chat(model="llama3:latest", messages=[{"role": "user", "content": user_message}])
        return res.get("message", {}).get("content", "I'm not sure about that.")
    except Exception as e:
        print("❌ Ollama error:", e)
        return "Sorry, I couldn’t process that."

# =================================
# Main WhatsApp Handler
# =================================
@app.post("/webhook")
async def receive_message(request: Request):
    data = await request.json()
    value = data["entry"][0]["changes"][0]["value"]
    if "messages" not in value:
        return {"status": "ok"}

    msg = value["messages"][0]
    from_number = msg["from"]
    user_text = msg["text"]["body"].strip()
    user_text_lower = user_text.lower()

    await save_message(from_number, from_number, "user", user_text)
    state, extra = await get_chat_state(from_number)
    ai_reply = ""

    # 1️⃣ Greeting
    if any(k in user_text_lower for k in ai_flow["greeting"]["keywords"]) or user_text in ["1", "2", "3"]:
        if user_text in ["1", "appointment"]:
            ai_reply = "You selected Appointment. Please enter your full name:"
            await update_chat_state(from_number, "awaiting_name")
        elif user_text in ["2", "emergency"]:
            ai_reply = "🚨 Emergency noted! Our team will contact you immediately."
            await update_chat_state(from_number, None)
        elif user_text in ["3", "faq"]:
            ai_reply = "Please type your question about doctors or patients."
            await update_chat_state(from_number, "faq_mode")
        else:
            for gmsg in ai_flow["greeting"]["messages"]:
                send_whatsapp_message(from_number, gmsg)
            return {"status": "ok"}

    # 2️⃣ Appointment Flow
    elif state == "awaiting_name":
        extra["patient_info"] = {"name": user_text}
        ai_reply = "Please enter your age:"
        await update_chat_state(from_number, "awaiting_age", extra)

    elif state == "awaiting_age":
        try:
            extra["patient_info"]["age"] = int(user_text)
        except:
            extra["patient_info"]["age"] = 0
        ai_reply = "Please enter your address:"
        await update_chat_state(from_number, "awaiting_address", extra)

    elif state == "awaiting_address":
        extra["patient_info"]["address"] = user_text
        ai_reply = "Please enter your disease:"
        await update_chat_state(from_number, "awaiting_disease", extra)

    elif state == "awaiting_disease":
        disease = user_text
        extra["patient_info"]["disease"] = disease
        doctors = await doctors_collection.find({"specialty": {"$regex": disease, "$options": "i"}}).to_list(length=10)
        if not doctors:
            ai_reply = f"❌ No doctors found for '{disease}'. Please try another disease."
            await update_chat_state(from_number, "awaiting_disease", extra)
        else:
            doc_list = "\n".join([f"👨‍⚕️ {d['name']} ({d['specialty']})" for d in doctors])
            ai_reply = f"Available doctors:\n{doc_list}\n\nPlease type your preferred doctor name:"
            await update_chat_state(from_number, "awaiting_doctor", extra)

    elif state == "awaiting_doctor":
        extra["patient_info"]["doctor_name"] = user_text
        ai_reply = "Please enter your preferred appointment date and time (YYYY-MM-DD HH:MM):"
        await update_chat_state(from_number, "awaiting_time", extra)

    elif state == "awaiting_time":
        try:
            appt_time = datetime.strptime(user_text, "%Y-%m-%d %H:%M")
            doctor = await doctors_collection.find_one({"name": {"$regex": extra["patient_info"]["doctor_name"], "$options": "i"}})
            if not doctor:
                ai_reply = "Doctor not found. Please type a valid doctor name."
                await update_chat_state(from_number, "awaiting_doctor", extra)
            else:
                conflict = await appointments_collection.find_one(
                    {"doctor_id": str(doctor["_id"]), "appointment_time": appt_time}
                )
                if conflict:
                    ai_reply = "That slot is already booked. Please choose another time."
                else:
                    patient = extra["patient_info"]
                    appt = {
                        "_id": ObjectId(),
                        "doctor_id": str(doctor["_id"]),
                        "patient_name": patient["name"],
                        "age": patient["age"],
                        "address": patient["address"],
                        "disease": patient["disease"],
                        "appointment_time": appt_time,
                        "status": "booked",
                        "type": "AI",
                    }
                    await appointments_collection.insert_one(appt)
                    ai_reply = f"✅ Appointment booked with {doctor['name']} on {appt_time.strftime('%Y-%m-%d %H:%M')}."
                    await update_chat_state(from_number, None)
        except Exception as e:
            ai_reply = "Invalid format. Please use YYYY-MM-DD HH:MM"

    # 3️⃣ FAQ Section
    elif state == "faq_mode" or "doctor" in user_text_lower or "patient" in user_text_lower:
        if "doctor" in user_text_lower or "specialist" in user_text_lower:
            specialty = user_text_lower.replace("show", "").replace("doctors", "").strip()
            doctors = await doctors_collection.find(
                {"$or": [
                    {"specialty": {"$regex": specialty, "$options": "i"}},
                    {"name": {"$regex": specialty, "$options": "i"}}
                ]}
            ).to_list(length=10)
            if doctors:
                ai_reply = "👨‍⚕️ Doctors:\n" + "\n".join([f"{d['name']} - {d['specialty']}" for d in doctors])
            else:
                ai_reply = "No doctors found."
        elif "patient" in user_text_lower:
            name = user_text.split()[-1]
            patient = await patients_collection.find_one({"name": {"$regex": name, "$options": "i"}})
            if patient:
                ai_reply = f"👤 Patient Details:\nName: {patient['name']}\nAge: {patient.get('age')}\nDisease: {patient.get('disease')}\nAddress: {patient.get('address')}"
            else:
                ai_reply = f"No patient found with name '{name}'."
        else:
            ai_reply = get_ai_reply(user_text)

    # 4️⃣ Fallback AI
    else:
        ai_reply = get_ai_reply(user_text)

    await save_message(from_number, "ai_bot", "bot", ai_reply)
    send_whatsapp_message(from_number, ai_reply)
    return {"status": "ok"}
