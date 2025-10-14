
# from dotenv import load_dotenv
# import os, json, requests, asyncio, re
# from datetime import datetime, timedelta
# from bson import ObjectId
# from fastapi import FastAPI, Request
# from fastapi.staticfiles import StaticFiles
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse
# import ollama
# from sentence_transformers import SentenceTransformer
# from dateutil import parser as dt_parser

# # ==============================
# # App Imports
# # ==============================
# from app.routes import auth, doctor, appointments, patient, subadmin, chat
# from app.database import (
#     db,
#     chats_collection,
#     doctors_collection,
#     appointments_collection,
#     patients_collection,
# )
# from manager import ConnectionManager
# from app.models import Message
# from app.routes.appointments import round_to_nearest_half_hour

# # ==============================
# # Environment Setup
# # ==============================
# load_dotenv()
# WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# # ==============================
# # SentenceTransformer Model
# # ==============================
# EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
# st_sync_model = None
# try:
#     st_sync_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
#     print(f"✅ Loaded SentenceTransformer model: {EMBEDDING_MODEL_NAME}")
# except Exception as e:
#     print(f"❌ Error loading SentenceTransformer: {e}")
#     st_sync_model = None

# # ==============================
# # Embedding Generator
# # ==============================
# async def get_embedding_vector(text: str):
#     if st_sync_model is None:
#         print("❌ Model not loaded.")
#         return None

#     def sync_embed(txt):
#         return st_sync_model.encode(txt, convert_to_tensor=False).tolist()

#     try:
#         return await asyncio.to_thread(sync_embed, text)
#     except Exception as e:
#         print(f"Embedding Error: {e}")
#         return None
# # ==============================
# # Semantic Specialty Matcher
# # ==============================
# async def match_specialty_semantically(user_specialty: str):
#     """
#     Match user specialty phrase (like 'nose problem') to doctor specialties semantically.
#     """
#     if not user_specialty or st_sync_model is None:
#         return user_specialty

#     try:
#         # Get embedding for user specialty
#         query_vec = await get_embedding_vector(user_specialty)

#         # Get all doctor specialties (distinct list)
#         specialties = await doctors_collection.distinct("specialty")
#         if not specialties:
#             return user_specialty

#         # Compute similarity between user input and each specialty
#         def cosine_similarity(a, b):
#             import numpy as np
#             a, b = np.array(a), np.array(b)
#             return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

#         max_score = -1
#         best_match = user_specialty

#         for sp in specialties:
#             sp_vec = await get_embedding_vector(sp)
#             if sp_vec:
#                 score = cosine_similarity(query_vec, sp_vec)
#                 if score > max_score:
#                     max_score = score
#                     best_match = sp

#         print(f"🔍 Semantic Specialty Match: '{user_specialty}' → '{best_match}' (Score={max_score:.3f})")
#         return best_match

#     except Exception as e:
#         print(f"❌ Error in match_specialty_semantically: {e}")
#         return user_specialty

# # ==============================
# # Doctor Semantic Search
# # ==============================
# async def semantic_search_doctor(query: str, limit: int = 1):
#     query_vector = await get_embedding_vector(query)
#     if not query_vector:
#         return None

#     pipeline = [
#         {
#             "$vectorSearch": {
#                 "index": "vector_index",
#                 "path": "embedding",
#                 "queryVector": query_vector,
#                 "numCandidates": 50,
#                 "limit": limit,
#             }
#         },
#         {
#             "$project": {
#                 "_id": 1,
#                 "name": 1,
#                 "specialty": 1,
#                 "timing": 1,
#                 "status": 1,
#                 "phone": 1,
#                 "experience": 1,
#                 "score": {"$meta": "vectorSearchScore"},
#             }
#         },
#     ]
#     cursor = doctors_collection.aggregate(pipeline)
#     results = await cursor.to_list(length=limit)
#     return results[0] if results else None

# # ==============================
# # Patient Search (Flexible)
# # ==============================
# # ==============================
# # True Semantic Patient Search (Analyzes Message Intelligently)
# # ==============================
# async def search_patient_from_message(user_text: str):
#     """
#     Smart hybrid patient search:
#     1️⃣ Semantic search using embeddings.
#     2️⃣ Fallback to fuzzy name match if embedding similarity is low or no results.
#     """
#     query_vector = await get_embedding_vector(user_text)
#     if not query_vector:
#         print("❌ Could not generate embedding for patient search.")
#         return None

#     try:
#         # 1️⃣ Semantic Search (fetch multiple)
#         pipeline = [
#             {
#                 "$vectorSearch": {
#                     "index": "patient_vector_index",
#                     "path": "embedding",
#                     "queryVector": query_vector,
#                     "numCandidates": 50,
#                     "limit": 5,  # fetch more candidates
#                 }
#             },
#             {
#                 "$project": {
#                     "_id": 1,
#                     "name": 1,
#                     "age": 1,
#                     "issue": 1,
#                     "phone": 1,
#                     "lastVisit": 1,
#                     "score": {"$meta": "vectorSearchScore"},
#                 }
#             },
#         ]

#         cursor = patients_collection.aggregate(pipeline)
#         results = await cursor.to_list(length=5)

#         # 2️⃣ Filter by partial name mention
#         if results:
#             for r in results:
#                 if any(n in user_text.lower() for n in r["name"].lower().split()):
#                     r["_id"] = str(r["_id"])
#                     print(f"✅ Hybrid match for patient: {r['name']} (Score: {r['score']:.3f})")
#                     return r

#         # 3️⃣ Fuzzy fallback if semantic fails
#         name_match = re.search(r"(?:patient|show|details|about)?\s*(\w+)", user_text.lower())
#         if name_match:
#             name_candidate = name_match.group(1)
#             fuzzy = await patients_collection.find_one(
#                 {"name": {"$regex": name_candidate, "$options": "i"}}
#             )
#             if fuzzy:
#                 fuzzy["_id"] = str(fuzzy["_id"])
#                 print(f"🧩 Fuzzy match for patient: {fuzzy['name']}")
#                 return fuzzy

#         print("⚠️ No match found for patient.")
#         return None

#     except Exception as e:
#         print(f"❌ Hybrid Patient Search Error: {e}")
#         return None

# # ==============================
# # FastAPI Setup
# # ==============================
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

# # Include Routers
# app.include_router(auth.router)
# app.include_router(doctor.router)
# app.include_router(appointments.router)
# app.include_router(patient.router)
# app.include_router(subadmin.router)
# app.include_router(chat.router)

# @app.get("/")
# async def root():
#     return {"msg": "AI Receptionist WhatsApp Bot is running 🚀"}

# @app.get("/favicon.ico")
# async def favicon():
#     return FileResponse("app/static/favicon.ico")

# @app.get("/webhook")
# async def verify_token(request: Request):
#     params = request.query_params
#     if params.get("hub.verify_token") == VERIFY_TOKEN:
#         return int(params.get("hub.challenge"))
#     return {"error": "Invalid verification token"}

# # ==============================
# # WhatsApp Sender
# # ==============================
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
#     print("📤 Sent Message:", res.json())

# # ==============================
# # Save Message
# # ==============================
# async def save_message(user_id: str, sender_id: str, sender_role: str, text: str):
#     if not text:
#         return
#     message = Message(
#         sender_id=sender_id, sender_role=sender_role, text=text, timestamp=datetime.utcnow()
#     )
#     await chats_collection.update_one(
#         {"user_id": user_id},
#         {
#             "$push": {"messages": message.dict()},
#             "$setOnInsert": {"user_id": user_id, "created_at": datetime.utcnow()},
#         },
#         upsert=True,
#     )

# # ==============================
# # System Prompt
# # ==============================
# SYSTEM_PROMPT = """
# You are a polite and professional AI receptionist for a hospital.

# Duties:
# 1️⃣ Greet politely when user greets.
# 2️⃣ Provide hospital, doctor, and patient information when asked.
# 3️⃣ If user asks about a doctor, search doctor collection and reply.
# 4️⃣ If user asks about a patient, search patient collection and reply.
# 5️⃣ If booking/appointment query, ask required details.
# 6️⃣ For unrelated queries, reply: "Sorry, I can only assist with hospital-related queries."
# """

# # ==============================
# # AI Response
# # ==============================
# async def get_ai_response(user_id: str, user_message: str):
#     context = ""
#     chat_record = await chats_collection.find_one(
#         {"user_id": user_id}, {"messages": {"$slice": -5}}
#     )
#     history = [{"role": "system", "content": SYSTEM_PROMPT + context}]

#     if chat_record:
#         for msg in chat_record["messages"]:
#             if msg["sender_role"] == "user":
#                 history.append({"role": "user", "content": msg["text"]})
#             elif msg["sender_role"] == "bot" and "No doctor found" not in msg["text"]:
#                 history.append({"role": "assistant", "content": msg["text"]})

#     history.append({"role": "user", "content": user_message})
#     print("🧠 Sending to Ollama:", history)

#     try:
#         def run_ollama():
#             response = ollama.chat(model="llama3:latest", messages=history)
#             if isinstance(response, dict) and "message" in response:
#                 return response["message"]["content"]
#             elif hasattr(response, "__iter__"):
#                 full_response = ""
#                 for chunk in response:
#                     full_response += chunk.get("message", {}).get("content", "")
#                 return full_response
#             else:
#                 return str(response)

#         reply = await asyncio.to_thread(run_ollama)
#         print("🤖 Ollama Reply:", reply)
#         return reply.strip() if reply else "Sorry, I couldn’t process that request right now."

#     except Exception as e:
#         print(f"❌ Ollama Error: {e}")
#         return "Sorry, I couldn’t process that request right now."

# # ==============================
# # Suggest Available Doctor
# # ==============================
# async def suggest_available_doctor(specialty: str, requested_time: datetime):
#     doctors = await doctors_collection.find({"specialty": {"$regex": specialty, "$options": "i"}}).to_list(20)
#     if not doctors:
#         return None, f"❌ No doctor found for specialty '{specialty}'"

#     for doc in doctors:
#         if doc.get("status") == "leave":
#             continue
#         appt_time = round_to_nearest_half_hour(requested_time)
#         conflict = await appointments_collection.find_one({
#             "doctor_id": str(doc["_id"]),
#             "appointment_time": appt_time,
#             "status": "booked"
#         })
#         if not conflict:
#             return doc, appt_time

#     return None, f"⚠️ All {specialty} doctors are busy or on leave at {requested_time.strftime('%Y-%m-%d %H:%M')}"

# @app.post("/webhook")
# async def receive_message(request: Request):
#     """Main WhatsApp webhook endpoint — handles AI hospital assistant logic."""
#     data = await request.json()

#     # =============================
#     # Validate incoming message
#     # =============================
#     if "entry" not in data:
#         return {"status": "ignored"}

#     value = data["entry"][0].get("changes", [])[0].get("value", {})
#     if "messages" not in value:
#         return {"status": "ignored"}

#     msg = value["messages"][0]
#     if msg.get("type") != "text":
#         print("⚠️ Non-text message received — ignored.")
#         return {"status": "ignored"}

#     # Extract message details
#     from_number = msg["from"]
#     user_text = msg["text"]["body"].strip()
#     print(f"📩 Message from {from_number}: {user_text}")

#     # =============================
#     # Greeting Handling
#     # =============================
#     greetings = ["hi", "hello", "hey", "good morning", "good evening", "good afternoon"]
#     if user_text.lower() in greetings:
#         ai_reply = (
#             "👋 Hello! I’m your AI hospital receptionist.\n"
#             "How may I assist you today?\n"
#             "You can ask about doctors, patients, or book an appointment."
#         )
#         send_whatsapp_message(from_number, ai_reply)
#         await save_message(from_number, "ai_bot", "bot", ai_reply)
#         return {"status": "ok"}

#     # Save user's message
#     await save_message(from_number, from_number, "user", user_text)

#     # =============================
#     # Doctor Semantic Search (Improved)
#     # =============================
#     specialty_query = None
#     semantic_specialty = None
#     found_doctor = None

#     # ✅ Extract possible specialty from user text
#     match = re.search(r"(?:doctor\s*(?:for)?|specialist\s*(?:for)?|for)\s+([\w\s]+)", user_text.lower())
#     if match:
#         specialty_query = match.group(1).strip()
#         semantic_specialty = await match_specialty_semantically(specialty_query)
#         print(f"🔍 Extracted Specialty: {specialty_query} → Semantic: {semantic_specialty}")

#         # Search doctor using semantic match if found
#         if semantic_specialty:
#             found_doctor = await semantic_search_doctor(semantic_specialty)
#         else:
#             found_doctor = await semantic_search_doctor(specialty_query)
#     else:
#         found_doctor = await semantic_search_doctor(user_text)

#     # ✅ Fallback: Try to extract doctor name (e.g., "Doctor Rahul")
#     if not found_doctor:
#         name_match = re.search(r"doctor\s+([a-zA-Z]+)", user_text.lower())
#         if name_match:
#             doctor_name = name_match.group(1)
#             found_doctor = await doctors_collection.find_one(
#                 {"name": {"$regex": doctor_name, "$options": "i"}}
#             )

#     # =============================
#     # Patient Search
#     # =============================
#     patient = await search_patient_from_message(user_text)
#     patient_name = patient["name"] if patient else None

#     # =============================
#     # Appointment Booking Flow
#     # =============================
#     if any(k in user_text.lower() for k in ["appointment", "book", "schedule"]):
#         patient_match = re.findall(r"\bfor\s+([A-Za-z]+)", user_text.lower())
#         patient_name = patient_match[0].capitalize() if len(patient_match) >= 1 else patient_name

#         specialty_raw = patient_match[1] if len(patient_match) >= 2 else None
#         specialty = await match_specialty_semantically(specialty_raw) if specialty_raw else None
#         print(f"🔍 Extracted Patient: {patient_name}, Specialty: {specialty}")

#         # Extract appointment time
#         appt_time = None
#         time_match = re.search(r"\b(\d{4}-\d{2}-\d{2} \d{1,2}:\d{2})\b", user_text)
#         if time_match:
#             try:
#                 appt_time = dt_parser.parse(time_match.group(1))
#             except Exception:
#                 appt_time = datetime.now()
#         else:
#             appt_time = datetime.now()

#         # Extract doctor name
#         doctor_name_match = re.search(r"doctor\s+([A-Za-z]+)", user_text.lower())
#         doctor_name = doctor_name_match.group(1) if doctor_name_match else None

#         # Find or assign doctor
#         doctor = None
#         if doctor_name:
#             doctor = await doctors_collection.find_one(
#                 {"name": {"$regex": doctor_name, "$options": "i"}}
#             )
#             if not doctor:
#                 ai_reply = f"❌ Sorry, I couldn’t find a doctor named '{doctor_name}'."
#                 send_whatsapp_message(from_number, ai_reply)
#                 await save_message(from_number, "ai_bot", "bot", ai_reply)
#                 return {"status": "ok"}
#         elif specialty:
#             doctor, appt_time = await suggest_available_doctor(specialty, appt_time)
#             if not doctor:
#                 ai_reply = appt_time  # message from suggest_available_doctor
#                 send_whatsapp_message(from_number, ai_reply)
#                 await save_message(from_number, "ai_bot", "bot", ai_reply)
#                 return {"status": "ok"}
#         else:
#             ai_reply = (
#                 "⚠️ Please mention either the doctor’s name or the department/specialty "
#                 "to book an appointment."
#             )
#             send_whatsapp_message(from_number, ai_reply)
#             await save_message(from_number, "ai_bot", "bot", ai_reply)
#             return {"status": "ok"}

#         # Check doctor leave status
#         if doctor.get("status") == "leave":
#             ai_reply = f"⚠️ Doctor {doctor['name']} is currently on leave."
#             send_whatsapp_message(from_number, ai_reply)
#             await save_message(from_number, "ai_bot", "bot", ai_reply)
#             return {"status": "ok"}

#         # Check time conflict
#         conflict = await appointments_collection.find_one({
#             "doctor_id": str(doctor["_id"]),
#             "appointment_time": appt_time
#         })
#         if conflict:
#             suggested_time = round_to_nearest_half_hour(appt_time + timedelta(minutes=30))
#             ai_reply = (
#                 f"⚠️ The slot {appt_time.strftime('%Y-%m-%d %H:%M')} is already booked "
#                 f"for Doctor {doctor['name']}.\n"
#                 f"Next available: {suggested_time.strftime('%Y-%m-%d %H:%M')}."
#             )
#             send_whatsapp_message(from_number, ai_reply)
#             await save_message(from_number, "ai_bot", "bot", ai_reply)
#             return {"status": "ok"}

#         # Book appointment
#         appointment_doc = {
#             "doctor_id": str(doctor["_id"]),
#             "patient_id": str(ObjectId()),
#             "patient_name": patient_name or "Unknown",
#             "doctor_name": doctor["name"],
#             "disease": specialty or "General",
#             "appointment_time": appt_time,
#             "type": "AI",
#             "status": "booked",
#             "created_at": datetime.utcnow()
#         }
#         result = await appointments_collection.insert_one(appointment_doc)
#         appointment_doc["_id"] = str(result.inserted_id)

#         ai_reply = (
#             f"✅ *Appointment Confirmed!*\n\n"
#             f"👤 *Patient:* {appointment_doc['patient_name']}\n"
#             f"👨‍⚕️ *Doctor:* {appointment_doc['doctor_name']}\n"
#             f"🩺 *Department:* {appointment_doc['disease']}\n"
#             f"📅 *Date & Time:* {appt_time.strftime('%Y-%m-%d %H:%M')}\n"
#             f"🆔 *Appointment ID:* {appointment_doc['_id']}"
#         )
#         send_whatsapp_message(from_number, ai_reply)
#         await save_message(from_number, "ai_bot", "bot", ai_reply)
#         return {"status": "ok"}

#     # =============================
#     # Doctor Info Queries
#     # =============================
#     if found_doctor:
#         name = found_doctor["name"]
#         timing = found_doctor.get("timing", "N/A")
#         phone = found_doctor.get("phone", "N/A")
#         specialty = found_doctor.get("specialty", "N/A")
#         experience = found_doctor.get("experience", "N/A")
#         status = found_doctor.get("status", "N/A")

#         if any(k in user_text.lower() for k in ["timing", "available", "slot", "time"]):
#             ai_reply = f"🕒 Doctor {name} is available at {timing}."
#         elif any(k in user_text.lower() for k in ["phone", "contact"]):
#             ai_reply = f"📞 You can contact Doctor {name} at {phone}."
#         elif any(k in user_text.lower() for k in ["specialty", "department"]):
#             ai_reply = f"👨‍⚕️ Doctor {name} specializes in {specialty}."
#         elif any(k in user_text.lower() for k in ["experience", "years"]):
#             ai_reply = f"🩺 Doctor {name} has {experience} years of experience."
#         elif any(k in user_text.lower() for k in ["status", "leave"]):
#             ai_reply = f"📋 Doctor {name} is currently {status}."
#         else:
#             ai_reply = (
#                 f"👨‍⚕️ *Doctor Details:*\n"
#                 f"Name: {name}\n"
#                 f"Specialty: {specialty}\n"
#                 f"Experience: {experience} years\n"
#                 f"Status: {status}\n"
#                 f"Timing: {timing}\n"
#                 f"Phone: {phone}"
#             )

#     # =============================
#     # Patient Info Queries
#     # =============================
#     elif patient:
#         ai_reply = (
#             f"✅ *Patient Details:*\n"
#             f"👤 Name: {patient.get('name')}\n"
#             f"🎂 Age: {patient.get('age', 'N/A')}\n"
#             f"🩺 Issue: {patient.get('issue', 'N/A')}\n"
#             f"📞 Phone: {patient.get('phone', 'N/A')}\n"
#             f"📅 Last Visit: {patient.get('lastVisit', 'N/A')}"
#         )

#     # =============================
#     # Ollama AI Fallback
#     # =============================
#     else:
#         print("🤖 No doctor/patient found — using AI reasoning.")
#         ai_reply = await get_ai_response(from_number, user_text)

#     # =============================
#     # Send + Save AI response
#     # =============================
#     send_whatsapp_message(from_number, ai_reply)
#     await save_message(from_number, "ai_bot", "bot", ai_reply)
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
# Semantic Specialty Matcher
# ==============================
async def match_specialty_semantically(user_specialty: str):
    """
    Match user specialty phrase (like 'nose problem') to doctor specialties semantically.
    """
    if not user_specialty or st_sync_model is None:
        return user_specialty

    try:
        # Get embedding for user specialty
        query_vec = await get_embedding_vector(user_specialty)

        # Get all doctor specialties (distinct list)
        specialties = await doctors_collection.distinct("specialty")
        if not specialties:
            return user_specialty

        # Compute similarity between user input and each specialty
        def cosine_similarity(a, b):
            import numpy as np
            a, b = np.array(a), np.array(b)
            return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

        max_score = -1
        best_match = user_specialty

        for sp in specialties:
            sp_vec = await get_embedding_vector(sp)
            if sp_vec:
                score = cosine_similarity(query_vec, sp_vec)
                if score > max_score:
                    max_score = score
                    best_match = sp

        print(f"🔍 Semantic Specialty Match: '{user_specialty}' → '{best_match}' (Score={max_score:.3f})")
        return best_match

    except Exception as e:
        print(f"❌ Error in match_specialty_semantically: {e}")
        return user_specialty

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
                    "limit": 5, # fetch more candidates
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
BASE_SYSTEM_PROMPT = """
You are a polite and professional AI receptionist for a hospital.

Duties:
1️⃣ Greet politely when user greets.
2️⃣ **CRITICAL:** If 'Contextual Data for Analysis' is provided, your primary duty is to analyze the user's message against this data and provide a concise, factual answer about the doctor/patient's status, timing, or details using natural language understanding. For example, if the data shows 'status: present' and the user asks 'is doctor Preei available today', you must answer 'Yes, Doctor Preei is available today.'
3️⃣ If the contextual data is NOT present, act as a general receptionist:
    - If user asks about a doctor, search doctor collection (handled by external code).
    - If user asks about a patient, search patient collection (handled by external code).
    - If booking/appointment query, ask required details (handled by external code).
4️⃣ For unrelated queries, reply: "Sorry, I can only assist with hospital-related queries."
"""

# ==============================
# AI Response (Refactored for Context)
# ==============================
async def get_ai_response(user_id: str, user_message: str, context_data: dict = None):
    context = ""
    if context_data:
        # Inject doctor/patient data directly into the LLM context
        # Use str() to ensure ObjectId is converted before JSON dumping
        def default_converter(o):
            if isinstance(o, ObjectId):
                return str(o)
            raise TypeError(f"Object of type {o.__class__.__name__} is not JSON serializable")

        context = f"\n\nContextual Data for Analysis:\n{json.dumps(context_data, indent=2, default=default_converter)}\n"
        
    system_prompt_with_context = BASE_SYSTEM_PROMPT + context
    
    chat_record = await chats_collection.find_one(
        {"user_id": user_id}, {"messages": {"$slice": -5}}
    )
    
    # Start history with the dynamic system prompt
    history = [{"role": "system", "content": system_prompt_with_context}]

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

@app.post("/webhook")
async def receive_message(request: Request):
    """Main WhatsApp webhook endpoint — handles AI hospital assistant logic."""
    data = await request.json()

    # =============================
    # Validate incoming message
    # =============================
    if "entry" not in data:
        return {"status": "ignored"}

    value = data["entry"][0].get("changes", [])[0].get("value", {})
    if "messages" not in value:
        return {"status": "ignored"}

    msg = value["messages"][0]
    if msg.get("type") != "text":
        print("⚠️ Non-text message received — ignored.")
        return {"status": "ignored"}

    # Extract message details
    from_number = msg["from"]
    user_text = msg["text"]["body"].strip()
    print(f"📩 Message from {from_number}: {user_text}")

    # =============================
    # Greeting Handling
    # =============================
    greetings = ["hi", "hello", "hey", "good morning", "good evening", "good afternoon"]
    if user_text.lower() in greetings:
        ai_reply = (
            "👋 Hello! I’m your AI hospital receptionist.\n"
            "How may I assist you today?\n"
            "You can ask about doctors, patients, or book an appointment."
        )
        send_whatsapp_message(from_number, ai_reply)
        await save_message(from_number, "ai_bot", "bot", ai_reply)
        return {"status": "ok"}

    # Save user's message
    await save_message(from_number, from_number, "user", user_text)

    # =============================
    # Doctor Semantic Search
    # =============================
    specialty_query = None
    semantic_specialty = None
    found_doctor = None

    # ✅ Extract possible specialty from user text
    match = re.search(r"(?:doctor\s*(?:for)?|specialist\s*(?:for)?|for)\s+([\w\s]+)", user_text.lower())
    if match:
        specialty_query = match.group(1).strip()
        semantic_specialty = await match_specialty_semantically(specialty_query)
        print(f"🔍 Extracted Specialty: {specialty_query} → Semantic: {semantic_specialty}")

        # Search doctor using semantic match if found
        if semantic_specialty:
            found_doctor = await semantic_search_doctor(semantic_specialty)
        else:
            found_doctor = await semantic_search_doctor(specialty_query)
    else:
        found_doctor = await semantic_search_doctor(user_text)

    # ✅ Fallback: Try to extract doctor name (e.g., "Doctor Rahul")
    if not found_doctor:
        name_match = re.search(r"doctor\s+([a-zA-Z]+)", user_text.lower())
        if name_match:
            doctor_name = name_match.group(1)
            found_doctor = await doctors_collection.find_one(
                {"name": {"$regex": doctor_name, "$options": "i"}}
            )

    # =============================
    # Patient Search
    # =============================
    patient = await search_patient_from_message(user_text)
    patient_name = patient["name"] if patient else None

    # =============================
    # Appointment Booking Flow (REMAINS THE SAME)
    # This must be processed before the general info queries
    # =============================
    if any(k in user_text.lower() for k in ["appointment", "book", "schedule"]):
        patient_match = re.findall(r"\bfor\s+([A-Za-z]+)", user_text.lower())
        patient_name = patient_match[0].capitalize() if len(patient_match) >= 1 else patient_name

        specialty_raw = patient_match[1] if len(patient_match) >= 2 else None
        specialty = await match_specialty_semantically(specialty_raw) if specialty_raw else None
        print(f"🔍 Extracted Patient: {patient_name}, Specialty: {specialty}")

        # Extract appointment time
        appt_time = None
        time_match = re.search(r"\b(\d{4}-\d{2}-\d{2} \d{1,2}:\d{2})\b", user_text)
        if time_match:
            try:
                appt_time = dt_parser.parse(time_match.group(1))
            except Exception:
                appt_time = datetime.now()
        else:
            appt_time = datetime.now()

        # Extract doctor name
        doctor_name_match = re.search(r"doctor\s+([A-Za-z]+)", user_text.lower())
        doctor_name = doctor_name_match.group(1) if doctor_name_match else None

        # Find or assign doctor
        doctor = None
        if doctor_name:
            doctor = await doctors_collection.find_one(
                {"name": {"$regex": doctor_name, "$options": "i"}}
            )
            if not doctor:
                ai_reply = f"❌ Sorry, I couldn’t find a doctor named '{doctor_name}'."
                send_whatsapp_message(from_number, ai_reply)
                await save_message(from_number, "ai_bot", "bot", ai_reply)
                return {"status": "ok"}
        elif specialty:
            doctor, appt_time = await suggest_available_doctor(specialty, appt_time)
            if not doctor:
                ai_reply = appt_time  # message from suggest_available_doctor
                send_whatsapp_message(from_number, ai_reply)
                await save_message(from_number, "ai_bot", "bot", ai_reply)
                return {"status": "ok"}
        else:
            ai_reply = (
                "⚠️ Please mention either the doctor’s name or the department/specialty "
                "to book an appointment."
            )
            send_whatsapp_message(from_number, ai_reply)
            await save_message(from_number, "ai_bot", "bot", ai_reply)
            return {"status": "ok"}

        # Check doctor leave status
        if doctor.get("status") == "leave":
            ai_reply = f"⚠️ Doctor {doctor['name']} is currently on leave."
            send_whatsapp_message(from_number, ai_reply)
            await save_message(from_number, "ai_bot", "bot", ai_reply)
            return {"status": "ok"}

        # Check time conflict
        conflict = await appointments_collection.find_one({
            "doctor_id": str(doctor["_id"]),
            "appointment_time": appt_time
        })
        if conflict:
            suggested_time = round_to_nearest_half_hour(appt_time + timedelta(minutes=30))
            ai_reply = (
                f"⚠️ The slot {appt_time.strftime('%Y-%m-%d %H:%M')} is already booked "
                f"for Doctor {doctor['name']}.\n"
                f"Next available: {suggested_time.strftime('%Y-%m-%d %H:%M')}."
            )
            send_whatsapp_message(from_number, ai_reply)
            await save_message(from_number, "ai_bot", "bot", ai_reply)
            return {"status": "ok"}

        # Book appointment
        appointment_doc = {
            "doctor_id": str(doctor["_id"]),
            "patient_id": str(ObjectId()),
            "patient_name": patient_name or "Unknown",
            "doctor_name": doctor["name"],
            "disease": specialty or "General",
            "appointment_time": appt_time,
            "type": "AI",
            "status": "booked",
            "created_at": datetime.utcnow()
        }
        result = await appointments_collection.insert_one(appointment_doc)
        appointment_doc["_id"] = str(result.inserted_id)

        ai_reply = (
            f"✅ *Appointment Confirmed!*\n\n"
            f"👤 *Patient:* {appointment_doc['patient_name']}\n"
            f"👨‍⚕️ *Doctor:* {appointment_doc['doctor_name']}\n"
            f"🩺 *Department:* {appointment_doc['disease']}\n"
            f"📅 *Date & Time:* {appt_time.strftime('%Y-%m-%d %H:%M')}\n"
            f"🆔 *Appointment ID:* {appointment_doc['_id']}"
        )
        send_whatsapp_message(from_number, ai_reply)
        await save_message(from_number, "ai_bot", "bot", ai_reply)
        return {"status": "ok"}

    # =======================================================
    # Doctor Info Queries (REPLACED WITH AI REASONING)
    # =======================================================
    if found_doctor:
        # Prepare data by converting ObjectId to string for JSON/prompt injection
        doctor_data_for_ai = {k: v for k, v in found_doctor.items()}
        doctor_data_for_ai["_id"] = str(doctor_data_for_ai["_id"])

        print("🤖 Found doctor — sending full data to AI reasoning for nuanced reply.")
        ai_reply = await get_ai_response(
            from_number, user_text, context_data={"doctor": doctor_data_for_ai}
        )

    # =======================================================
    # Patient Info Queries (REPLACED WITH AI REASONING)
    # =======================================================
    elif patient:
        # Prepare data by converting ObjectId to string for JSON/prompt injection
        patient_data_for_ai = {k: v for k, v in patient.items()}
        patient_data_for_ai["_id"] = str(patient_data_for_ai["_id"])

        print("🤖 Found patient — sending full data to AI reasoning for nuanced reply.")
        ai_reply = await get_ai_response(
            from_number, user_text, context_data={"patient": patient_data_for_ai}
        )

    # =============================
    # Ollama AI Fallback (Original/General)
    # =============================
    else:
        print("🤖 No doctor/patient found — using general AI reasoning.")
        ai_reply = await get_ai_response(from_number, user_text)

    # =============================
    # Send + Save AI response
    # =============================
    send_whatsapp_message(from_number, ai_reply)
    await save_message(from_number, "ai_bot", "bot", ai_reply)
    return {"status": "ok"}