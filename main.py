
# # from dotenv import load_dotenv
# # import os, json, requests, asyncio, re
# # from datetime import datetime, timedelta
# # from bson import ObjectId
# # from fastapi import FastAPI, Request
# # from fastapi.staticfiles import StaticFiles
# # from fastapi.middleware.cors import CORSMiddleware
# # from fastapi.responses import FileResponse
# # import ollama
# # from sentence_transformers import SentenceTransformer
# # from dateutil import parser as dt_parser

# # # ==============================
# # # App Imports
# # # ==============================
# # from app.routes import auth, doctor, appointments, patient, subadmin, chat
# # from app.database import (
# #     db,
# #     chats_collection,
# #     doctors_collection,
# #     appointments_collection,
# #     patients_collection,
# # )
# # from manager import ConnectionManager
# # from app.models import Message
# # from app.routes.appointments import round_to_nearest_half_hour

# # # ==============================
# # # Environment Setup
# # # ==============================
# # load_dotenv()
# # WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# # PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# # VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# # # ==============================
# # # SentenceTransformer Model
# # # ==============================
# # EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
# # st_sync_model = None
# # try:
# #     st_sync_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
# #     print(f"✅ Loaded SentenceTransformer model: {EMBEDDING_MODEL_NAME}")
# # except Exception as e:
# #     print(f"❌ Error loading SentenceTransformer: {e}")
# #     st_sync_model = None

# # # ==============================
# # # Embedding Generator
# # # ==============================
# # async def get_embedding_vector(text: str):
# #     if st_sync_model is None:
# #         print("❌ Model not loaded.")
# #         return None

# #     def sync_embed(txt):
# #         return st_sync_model.encode(txt, convert_to_tensor=False).tolist()

# #     try:
# #         return await asyncio.to_thread(sync_embed, text)
# #     except Exception as e:
# #         print(f"Embedding Error: {e}")
# #         return None
# # # ==============================
# # # Semantic Specialty Matcher
# # # ==============================
# # async def match_specialty_semantically(user_specialty: str):
# #     """
# #     Match user specialty phrase (like 'nose problem') to doctor specialties semantically.
# #     """
# #     if not user_specialty or st_sync_model is None:
# #         return user_specialty

# #     try:
# #         # Get embedding for user specialty
# #         query_vec = await get_embedding_vector(user_specialty)

# #         # Get all doctor specialties (distinct list)
# #         specialties = await doctors_collection.distinct("specialty")
# #         if not specialties:
# #             return user_specialty

# #         # Compute similarity between user input and each specialty
# #         def cosine_similarity(a, b):
# #             import numpy as np
# #             a, b = np.array(a), np.array(b)
# #             return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

# #         max_score = -1
# #         best_match = user_specialty

# #         for sp in specialties:
# #             sp_vec = await get_embedding_vector(sp)
# #             if sp_vec:
# #                 score = cosine_similarity(query_vec, sp_vec)
# #                 if score > max_score:
# #                     max_score = score
# #                     best_match = sp

# #         print(f"🔍 Semantic Specialty Match: '{user_specialty}' → '{best_match}' (Score={max_score:.3f})")
# #         return best_match

# #     except Exception as e:
# #         print(f"❌ Error in match_specialty_semantically: {e}")
# #         return user_specialty

# # # ==============================
# # # Doctor Semantic Search
# # # ==============================
# # # async def semantic_search_doctor(query: str, limit: int = 1):
# # #     query_vector = await get_embedding_vector(query)
# # #     if not query_vector:
# # #         return None

# # #     pipeline = [
# # #         {
# # #             "$vectorSearch": {
# # #                 "index": "vector_index",
# # #                 "path": "embedding",
# # #                 "queryVector": query_vector,
# # #                 "numCandidates": 50,
# # #                 "limit": limit,
# # #             }
# # #         },
# # #         {
# # #             "$project": {
# # #                 "_id": 1,
# # #                 "name": 1,
# # #                 "specialty": 1,
# # #                 "timing": 1,
# # #                 "status": 1,
# # #                 "phone": 1,
# # #                 "experience": 1,
# # #                 "score": {"$meta": "vectorSearchScore"},
# # #             }
# # #         },
# # #     ]
# # #     cursor = doctors_collection.aggregate(pipeline)
# # #     results = await cursor.to_list(length=limit)
# # #     return results[0] if results else None
# # async def semantic_search_doctor(query: str, limit: int = 1):
# #     query_vector = await get_embedding_vector(query)
# #     if not query_vector:
# #         return None

# #     try:
# #         pipeline = [
# #             {
# #                 "$vectorSearch": {
# #                     "index": "vector_index",
# #                     "path": "embedding",
# #                     "queryVector": query_vector,
# #                     "numCandidates": 50,
# #                     "limit": limit,
# #                 }
# #             },
# #             {"$project": {"_id": 1, "name": 1, "specialty": 1, "timing": 1,
# #                           "status": 1, "phone": 1, "experience": 1,
# #                           "score": {"$meta": "vectorSearchScore"}}},
# #         ]
# #         cursor = doctors_collection.aggregate(pipeline)
# #         results = await cursor.to_list(length=limit)

# #         # 🧩 Fallback to text match if no results
# #         if not results:
# #             fuzzy = await doctors_collection.find_one(
# #                 {"specialty": {"$regex": query, "$options": "i"}}
# #             )
# #             return fuzzy

# #         return results[0]

# #     except Exception as e:
# #         print(f"❌ Semantic Search Error: {e}")
# #         fuzzy = await doctors_collection.find_one(
# #             {"specialty": {"$regex": query, "$options": "i"}}
# #         )
# #         return fuzzy

# # # ==============================
# # # Patient Search (Flexible)
# # # ==============================
# # # ==============================
# # # True Semantic Patient Search (Analyzes Message Intelligently)
# # # ==============================
# # async def search_patient_from_message(user_text: str):
# #     """
# #     Smart hybrid patient search:
# #     1️⃣ Semantic search using embeddings.
# #     2️⃣ Fallback to fuzzy name match if embedding similarity is low or no results.
# #     """
# #     query_vector = await get_embedding_vector(user_text)
# #     if not query_vector:
# #         print("❌ Could not generate embedding for patient search.")
# #         return None

# #     try:
# #         # 1️⃣ Semantic Search (fetch multiple)
# #         pipeline = [
# #             {
# #                 "$vectorSearch": {
# #                     "index": "patient_vector_index",
# #                     "path": "embedding",
# #                     "queryVector": query_vector,
# #                     "numCandidates": 50,
# #                     "limit": 5,  # fetch more candidates
# #                 }
# #             },
# #             {
# #                 "$project": {
# #                     "_id": 1,
# #                     "name": 1,
# #                     "age": 1,
# #                     "issue": 1,
# #                     "phone": 1,
# #                     "lastVisit": 1,
# #                     "score": {"$meta": "vectorSearchScore"},
# #                 }
# #             },
# #         ]

# #         cursor = patients_collection.aggregate(pipeline)
# #         results = await cursor.to_list(length=5)

# #         # 2️⃣ Filter by partial name mention
# #         if results:
# #             for r in results:
# #                 if any(n in user_text.lower() for n in r["name"].lower().split()):
# #                     r["_id"] = str(r["_id"])
# #                     print(f"✅ Hybrid match for patient: {r['name']} (Score: {r['score']:.3f})")
# #                     return r

# #         # 3️⃣ Fuzzy fallback if semantic fails
# #         name_match = re.search(r"(?:patient|show|details|about)?\s*(\w+)", user_text.lower())
# #         if name_match:
# #             name_candidate = name_match.group(1)
# #             fuzzy = await patients_collection.find_one(
# #                 {"name": {"$regex": name_candidate, "$options": "i"}}
# #             )
# #             if fuzzy:
# #                 fuzzy["_id"] = str(fuzzy["_id"])
# #                 print(f"🧩 Fuzzy match for patient: {fuzzy['name']}")
# #                 return fuzzy

# #         print("⚠️ No match found for patient.")
# #         return None

# #     except Exception as e:
# #         print(f"❌ Hybrid Patient Search Error: {e}")
# #         return None

# # # ==============================
# # # FastAPI Setup
# # # ==============================
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

# # # Include Routers
# # app.include_router(auth.router)
# # app.include_router(doctor.router)
# # app.include_router(appointments.router)
# # app.include_router(patient.router)
# # app.include_router(subadmin.router)
# # app.include_router(chat.router)

# # @app.get("/")
# # async def root():
# #     return {"msg": "AI Receptionist WhatsApp Bot is running 🚀"}

# # @app.get("/favicon.ico")
# # async def favicon():
# #     return FileResponse("app/static/favicon.ico")

# # @app.get("/webhook")
# # async def verify_token(request: Request):
# #     params = request.query_params
# #     if params.get("hub.verify_token") == VERIFY_TOKEN:
# #         return int(params.get("hub.challenge"))
# #     return {"error": "Invalid verification token"}

# # # ==============================
# # # WhatsApp Sender
# # # ==============================
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
# #     print("📤 Sent Message:", res.json())

# # # ==============================
# # # Save Message
# # # ==============================
# # async def save_message(user_id: str, sender_id: str, sender_role: str, text: str):
# #     if not text:
# #         return
# #     message = Message(
# #         sender_id=sender_id, sender_role=sender_role, text=text, timestamp=datetime.utcnow()
# #     )
# #     await chats_collection.update_one(
# #         {"user_id": user_id},
# #         {
# #             "$push": {"messages": message.dict()},
# #             "$setOnInsert": {"user_id": user_id, "created_at": datetime.utcnow()},
# #         },
# #         upsert=True,
# #     )

# # # ==============================
# # # System Prompt
# # # ==============================
# # # ==============================
# # # System Prompt
# # # ==============================
# # SYSTEM_PROMPT = """
# # You are a polite and professional AI receptionist for a hospital.

# # You must **DETECT THE USER'S LANGUAGE** (e.g., French, Arabic, Mandarin, etc.) and **REPLY IN THAT SAME LANGUAGE** while strictly maintaining your professional persona and following the data and duties below.

# # Duties:
# # 1️⃣ Greet politely when user greets.
# # 2️⃣ Provide hospital, doctor, and patient information when asked.
# # 3️⃣ If user asks about a doctor, search doctor collection and reply.
# # 4️⃣ If user asks about a patient, search patient collection and reply.
# # 5️⃣ If booking/appointment query, ask required details.
# # 6️⃣ For unrelated queries, reply: "Sorry, I can only assist with hospital-related queries."
# # """

# # # ==============================
# # # AI Response
# # # ==============================
# # # async def get_ai_response(user_id: str, user_message: str):
# # #     context = ""
# # #     chat_record = await chats_collection.find_one(
# # #         {"user_id": user_id}, {"messages": {"$slice": -5}}
# # #     )
# # #     history = [{"role": "system", "content": SYSTEM_PROMPT + context}]

# # #     if chat_record:
# # #         for msg in chat_record["messages"]:
# # #             if msg["sender_role"] == "user":
# # #                 history.append({"role": "user", "content": msg["text"]})
# # #             elif msg["sender_role"] == "bot" and "No doctor found" not in msg["text"]:
# # #                 history.append({"role": "assistant", "content": msg["text"]})

# # #     history.append({"role": "user", "content": user_message})
# # #     print("🧠 Sending to Ollama:", history)

# # #     try:
# # #         def run_ollama():
# # #             response = ollama.chat(model="llama3:latest", messages=history)
# # #             if isinstance(response, dict):
# # #                 return response.get("message", {}).get("content", "")
# # #             elif hasattr(response, "__iter__"):
# # #                 full_response = ""
# # #                 for chunk in response:
# # #                     full_response += chunk.get("message", {}).get("content", "")
# # #                 return full_response
# # #             else:
# # #                 return str(response)

# # #         reply = await asyncio.to_thread(run_ollama)
# # #         print("🤖 Ollama Reply:", reply)
# # #         return reply.strip() if reply else "Sorry, I couldn’t process that request right now."

# # #     except Exception as e:
# # #         print(f"❌ Ollama Error: {e}")
# # #         return "Sorry, I couldn’t process that request right now."
# # # async def get_ai_response(user_id: str, user_message: str):
# # #     context = ""
# # #     chat_record = await chats_collection.find_one(
# # #         {"user_id": user_id}, {"messages": {"$slice": -5}}
# # #     )

# # #     history = [{"role": "system", "content": SYSTEM_PROMPT + context}]

# # #     # Add conversation history
# # #     if chat_record:
# # #         for msg in chat_record["messages"]:
# # #             if msg["sender_role"] == "user":
# # #                 history.append({"role": "user", "content": msg["text"]})
# # #             elif msg["sender_role"] == "bot" and "No doctor found" not in msg["text"]:
# # #                 history.append({"role": "assistant", "content": msg["text"]})

# # #     # Append latest user input
# # #     history.append({"role": "user", "content": user_message})

# # #     print("\n🧠 Sending to Ollama with history:")
# # #     for h in history:
# # #         print(f" - {h['role']}: {h['content'][:80]}{'...' if len(h['content']) > 80 else ''}")

# # #     try:
# # #         def run_ollama():
# # #             try:
# # #                 response = ollama.chat(model="llama3:latest", messages=history)

# # #                 # Handle streaming responses (generator-like)
# # #                 if hasattr(response, "__iter__") and not isinstance(response, dict):
# # #                     full_response = ""
# # #                     for chunk in response:
# # #                         if isinstance(chunk, dict):
# # #                             msg_content = (
# # #                                 chunk.get("message", {}).get("content", "")
# # #                                 or chunk.get("content", "")
# # #                             )
# # #                             full_response += msg_content
# # #                     return full_response.strip()

# # #                 # Handle direct dict responses
# # #                 elif isinstance(response, dict):
# # #                     return (
# # #                         response.get("message", {}).get("content", "")
# # #                         or response.get("content", "")
# # #                         or ""
# # #                     ).strip()

# # #                 # Fallback
# # #                 return str(response).strip()

# # #             except Exception as inner_e:
# # #                 print(f"⚠️ Ollama inner error: {inner_e}")
# # #                 return ""

# # #         # Run ollama.chat in a background thread to avoid blocking the event loop
# # #         reply = await asyncio.to_thread(run_ollama)
# # #         print("🤖 Ollama Reply:", reply)
# # #         return reply if reply else "Sorry, I couldn’t process that request right now."

# # #     except Exception as e:
# # #         print(f"❌ Ollama Error: {e}")
# # #         return "Sorry, I couldn’t process that request right now."
# # async def get_ai_response(user_id: str, user_message: str):
# #     """
# #     Sends the latest 5 chat messages + system prompt to Ollama for context-aware response.
# #     Handles both dict and streaming tuple responses cleanly.
# #     """
# #     context = ""
# #     chat_record = await chats_collection.find_one(
# #         {"user_id": user_id}, {"messages": {"$slice": -5}}
# #     )

# #     # System prompt + conversation history
# #     history = [{"role": "system", "content": SYSTEM_PROMPT + context}]

# #     if chat_record:
# #         for msg in chat_record.get("messages", []):
# #             if msg["sender_role"] == "user":
# #                 history.append({"role": "user", "content": msg["text"]})
# #             elif msg["sender_role"] == "bot" and "No doctor found" not in msg["text"]:
# #                 history.append({"role": "assistant", "content": msg["text"]})

# #     history.append({"role": "user", "content": user_message})

# #     print("\n🧠 Sending to Ollama (last few messages):")
# #     for h in history[-6:]:
# #         snippet = h['content'][:80].replace("\n", " ")
# #         print(f" - {h['role']}: {snippet}{'...' if len(h['content']) > 80 else ''}")

# #     try:
# #         def run_ollama():
# #             """Run Ollama.chat in a thread (safe for async context)."""
# #             try:
# #                 response = ollama.chat(model="llama3:latest", messages=history)

# #                 # 🧠 Handle streaming (iterable) responses
# #                 if hasattr(response, "__iter__") and not isinstance(response, dict):
# #                     full = ""
# #                     for chunk in response:
# #                         if isinstance(chunk, dict):
# #                             part = (
# #                                 chunk.get("message", {}).get("content", "")
# #                                 or chunk.get("content", "")
# #                             )
# #                             full += part
# #                     return full.strip()

# #                 # 🧩 Handle dict (non-stream)
# #                 elif isinstance(response, dict):
# #                     return (
# #                         response.get("message", {}).get("content", "")
# #                         or response.get("content", "")
# #                         or ""
# #                     ).strip()

# #                 # 🔄 Handle unexpected tuple/list cases
# #                 elif isinstance(response, (tuple, list)):
# #                     for item in response:
# #                         if isinstance(item, dict) and "message" in item:
# #                             return item["message"].get("content", "").strip()
# #                     return str(response)

# #                 # Fallback: plain text
# #                 return str(response).strip()

# #             except Exception as inner_e:
# #                 print(f"⚠️ Ollama inner error: {inner_e}")
# #                 return ""

# #         reply = await asyncio.to_thread(run_ollama)
# #         print(f"🤖 Ollama Reply: {reply[:120]}{'...' if len(reply) > 120 else ''}")

# #         return reply or "Sorry, I couldn’t process that request right now."

# #     except Exception as e:
# #         print(f"❌ Ollama Error (outer): {e}")
# #         return "Sorry, I couldn’t process that request right now."

# # # ==============================
# # # Suggest Available Doctor
# # # ==============================
# # async def suggest_available_doctor(specialty: str, requested_time: datetime):
# #     doctors = await doctors_collection.find({"specialty": {"$regex": specialty, "$options": "i"}}).to_list(20)
# #     if not doctors:
# #         return None, f"❌ No doctor found for specialty '{specialty}'"

# #     for doc in doctors:
# #         if doc.get("status") == "leave":
# #             continue
# #         appt_time = round_to_nearest_half_hour(requested_time)
# #         conflict = await appointments_collection.find_one({
# #             "doctor_id": str(doc["_id"]),
# #             "appointment_time": appt_time,
# #             "status": "booked"
# #         })
# #         if not conflict:
# #             return doc, appt_time

# #     return None, f"⚠️ All {specialty} doctors are busy or on leave at {requested_time.strftime('%Y-%m-%d %H:%M')}"

# # @app.post("/webhook")
# # async def receive_message(request: Request):
# #     """Main WhatsApp webhook endpoint — handles AI hospital assistant logic."""
# #     data = await request.json()

# #     # =============================
# #     # Validate incoming message
# #     # =============================
# #     if "entry" not in data:
# #         return {"status": "ignored"}

# #     value = data["entry"][0].get("changes", [])[0].get("value", {})
# #     if "messages" not in value:
# #         return {"status": "ignored"}

# #     msg = value["messages"][0]
# #     if msg.get("type") != "text":
# #         print("⚠️ Non-text message received — ignored.")
# #         return {"status": "ignored"}

# #     # Extract message details
# #     from_number = msg["from"]
# #     user_text = msg["text"]["body"].strip()
# #     print(f"📩 Message from {from_number}: {user_text}")

# #     # =============================
# #     # Greeting Handling
# #     ai_reply = None

# #     # Save user's message
# #     await save_message(from_number, from_number, "user", user_text)

# #     # =============================
# #     # Doctor Semantic Search (Improved)
# #     # =============================
# #     specialty_query = None
# #     semantic_specialty = None
# #     found_doctor = None

# #     # ✅ Extract possible specialty from user text
# #     match = re.search(r"(?:doctor\s*(?:for)?|specialist\s*(?:for)?|for|any)\s+([\w\s]+?)(?:\s*doctor|\s*specialist)?$", user_text.lower())

# #     if match:
# #         specialty_query = match.group(1).strip()
# #         semantic_specialty = await match_specialty_semantically(specialty_query)
# #         print(f"🔍 Extracted Specialty: {specialty_query} → Semantic: {semantic_specialty}")

# #         # Search doctor using semantic match if found
# #         if semantic_specialty:
# #             found_doctor = await semantic_search_doctor(semantic_specialty)
# #         else:
# #             found_doctor = await semantic_search_doctor(specialty_query)
# #     else:
# #         found_doctor = await semantic_search_doctor(user_text)

# #     # ✅ Fallback: Try to extract doctor name (e.g., "Doctor Rahul")
# #     if not found_doctor:
# #         name_match = re.search(r"doctor\s+([a-zA-Z]+)", user_text.lower())
# #         if name_match:
# #             doctor_name = name_match.group(1)
# #             found_doctor = await doctors_collection.find_one(
# #                 {"name": {"$regex": doctor_name, "$options": "i"}}
# #             )

# #     # =============================
# #     # Patient Search
# #     # =============================
# #     patient = await search_patient_from_message(user_text)
# #     patient_name = patient["name"] if patient else None

# #     # =============================
# #     # Appointment Booking Flow
# #     # =============================
# #     if any(k in user_text.lower() for k in ["appointment", "book", "schedule"]):
# #         patient_match = re.findall(r"\bfor\s+([A-Za-z]+)", user_text.lower())
# #         patient_name = patient_match[0].capitalize() if len(patient_match) >= 1 else patient_name

# #         specialty_raw = patient_match[1] if len(patient_match) >= 2 else None
# #         specialty = await match_specialty_semantically(specialty_raw) if specialty_raw else None
# #         print(f"🔍 Extracted Patient: {patient_name}, Specialty: {specialty}")

# #         # Extract appointment time
# #         appt_time = None
# #         time_match = re.search(r"\b(\d{4}-\d{2}-\d{2} \d{1,2}:\d{2})\b", user_text)
# #         if time_match:
# #             try:
# #                 appt_time = dt_parser.parse(time_match.group(1))
# #             except Exception:
# #                 appt_time = datetime.now()
# #         else:
# #             appt_time = datetime.now()

# #         # Extract doctor name
# #         doctor_name_match = re.search(r"doctor\s+([A-Za-z]+)", user_text.lower())
# #         doctor_name = doctor_name_match.group(1) if doctor_name_match else None

# #         # Find or assign doctor
# #         doctor = None
# #         if doctor_name:
# #             doctor = await doctors_collection.find_one(
# #                 {"name": {"$regex": doctor_name, "$options": "i"}}
# #             )
# #             if not doctor:
# #                 ai_reply = f"❌ Sorry, I couldn’t find a doctor named '{doctor_name}'."
# #                 send_whatsapp_message(from_number, ai_reply)
# #                 await save_message(from_number, "ai_bot", "bot", ai_reply)
# #                 return {"status": "ok"}
# #         elif specialty:
# #             doctor, appt_time = await suggest_available_doctor(specialty, appt_time)
# #             if not doctor:
# #                 ai_reply = appt_time  # message from suggest_available_doctor
# #                 send_whatsapp_message(from_number, ai_reply)
# #                 await save_message(from_number, "ai_bot", "bot", ai_reply)
# #                 return {"status": "ok"}
# #         else:
# #             ai_reply = (
# #                 "⚠️ Please mention either the doctor’s name or the department/specialty "
# #                 "to book an appointment."
# #             )
# #             send_whatsapp_message(from_number, ai_reply)
# #             await save_message(from_number, "ai_bot", "bot", ai_reply)
# #             return {"status": "ok"}

# #         # Check doctor leave status
# #         if doctor.get("status") == "leave":
# #             ai_reply = f"⚠️ Doctor {doctor['name']} is currently on leave."
# #             send_whatsapp_message(from_number, ai_reply)
# #             await save_message(from_number, "ai_bot", "bot", ai_reply)
# #             return {"status": "ok"}

# #         # Check time conflict
# #         conflict = await appointments_collection.find_one({
# #             "doctor_id": str(doctor["_id"]),
# #             "appointment_time": appt_time
# #         })
# #         if conflict:
# #             suggested_time = round_to_nearest_half_hour(appt_time + timedelta(minutes=30))
# #             ai_reply = (
# #                 f"⚠️ The slot {appt_time.strftime('%Y-%m-%d %H:%M')} is already booked "
# #                 f"for Doctor {doctor['name']}.\n"
# #                 f"Next available: {suggested_time.strftime('%Y-%m-%d %H:%M')}."
# #             )
# #             send_whatsapp_message(from_number, ai_reply)
# #             await save_message(from_number, "ai_bot", "bot", ai_reply)
# #             return {"status": "ok"}

# #         # Book appointment
# #         appointment_doc = {
# #             "doctor_id": str(doctor["_id"]),
# #             "patient_id": str(ObjectId()),
# #             "patient_name": patient_name or "Unknown",
# #             "doctor_name": doctor["name"],
# #             "disease": specialty or "General",
# #             "appointment_time": appt_time,
# #             "type": "AI",
# #             "status": "booked",
# #             "created_at": datetime.utcnow()
# #         }
# #         result = await appointments_collection.insert_one(appointment_doc)
# #         appointment_doc["_id"] = str(result.inserted_id)

# #         ai_reply = (
# #             f"✅ *Appointment Confirmed!*\n\n"
# #             f"👤 *Patient:* {appointment_doc['patient_name']}\n"
# #             f"👨‍⚕️ *Doctor:* {appointment_doc['doctor_name']}\n"
# #             f"🩺 *Department:* {appointment_doc['disease']}\n"
# #             f"📅 *Date & Time:* {appt_time.strftime('%Y-%m-%d %H:%M')}\n"
# #             f"🆔 *Appointment ID:* {appointment_doc['_id']}"
# #         )
# #         send_whatsapp_message(from_number, ai_reply)
# #         await save_message(from_number, "ai_bot", "bot", ai_reply)
# #         return {"status": "ok"}

# #     # =============================
# #     # Doctor Info Queries
# #     # =============================
# #     if found_doctor:
# #         name = found_doctor["name"]
# #         timing = found_doctor.get("timing", "N/A")
# #         phone = found_doctor.get("phone", "N/A")
# #         specialty = found_doctor.get("specialty", "N/A")
# #         experience = found_doctor.get("experience", "N/A")
# #         status = found_doctor.get("status", "N/A")

# #         if any(k in user_text.lower() for k in ["timing", "available", "slot", "time"]):
# #             ai_reply = f"🕒 Doctor {name} is available at {timing}."
# #         elif any(k in user_text.lower() for k in ["phone", "contact"]):
# #             ai_reply = f"📞 You can contact Doctor {name} at {phone}."
# #         elif any(k in user_text.lower() for k in ["specialty", "department"]):
# #             ai_reply = f"👨‍⚕️ Doctor {name} specializes in {specialty}."
# #         elif any(k in user_text.lower() for k in ["experience", "years"]):
# #             ai_reply = f"🩺 Doctor {name} has {experience} years of experience."
# #         elif any(k in user_text.lower() for k in ["status", "leave"]):
# #             ai_reply = f"📋 Doctor {name} is currently {status}."
# #         else:
# #             ai_reply = (
# #                 f"👨‍⚕️ *Doctor Details:*\n"
# #                 f"Name: {name}\n"
# #                 f"Specialty: {specialty}\n"
# #                 f"Experience: {experience} years\n"
# #                 f"Status: {status}\n"
# #                 f"Timing: {timing}\n"
# #                 f"Phone: {phone}"
# #             )

# #     # =============================
# #     # Patient Info Queries
# #     # =============================
# #     elif patient:
# #         ai_reply = (
# #             f"✅ *Patient Details:*\n"
# #             f"👤 Name: {patient.get('name')}\n"
# #             f"🎂 Age: {patient.get('age', 'N/A')}\n"
# #             f"🩺 Issue: {patient.get('issue', 'N/A')}\n"
# #             f"📞 Phone: {patient.get('phone', 'N/A')}\n"
# #             f"📅 Last Visit: {patient.get('lastVisit', 'N/A')}"
# #         )

# #     # =============================
# #     # Ollama AI Fallback
# #     # =============================
# #     else:
# #         print("🤖 No doctor/patient found — using AI reasoning.")
# #         ai_reply = await get_ai_response(from_number, user_text)

# #     # =============================
# #     # Send + Save AI response
# #     # =============================
# #     send_whatsapp_message(from_number, ai_reply)
# #     await save_message(from_number, "ai_bot", "bot", ai_reply)
# #     return {"status": "ok"}
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
# import numpy as np

# # ==============================
# # App Imports (Ensure these point to your actual database and models)
# # ==============================
# # NOTE: The following imports must correctly link to your database setup.
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
#     print(f"❌ Error loading SentenceTransformer: {e}. Semantic search disabled.")
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
        
# def cosine_similarity(a, b):
#     import numpy as np
#     a, b = np.array(a), np.array(b)
#     norm_a = np.linalg.norm(a)
#     norm_b = np.linalg.norm(b)
#     if norm_a == 0 or norm_b == 0:
#         return 0.0
#     return float(np.dot(a, b) / (norm_a * norm_b))

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
#         query_vec = await get_embedding_vector(user_specialty)
#         specialties = await doctors_collection.distinct("specialty")
#         if not specialties:
#             return user_specialty

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

#     try:
#         pipeline = [
#             {
#                 "$vectorSearch": {
#                     "index": "vector_index",
#                     "path": "embedding",
#                     "queryVector": query_vector,
#                     "numCandidates": 50,
#                     "limit": limit,
#                 }
#             },
#             {"$project": {"_id": 1, "name": 1, "specialty": 1, "timing": 1,
#                           "status": 1, "phone": 1, "experience": 1,
#                           "score": {"$meta": "vectorSearchScore"}}},
#         ]
#         cursor = doctors_collection.aggregate(pipeline)
#         results = await cursor.to_list(length=limit)

#         # 🧩 Fallback to text match if no results
#         if not results:
#             fuzzy = await doctors_collection.find_one(
#                 {"specialty": {"$regex": query, "$options": "i"}}
#             )
#             return fuzzy

#         return results[0]

#     except Exception as e:
#         print(f"❌ Semantic Search Error: {e}")
#         fuzzy = await doctors_collection.find_one(
#             {"specialty": {"$regex": query, "$options": "i"}}
#         )
#         return fuzzy

# # ==============================
# # Patient Search (Flexible)
# # ==============================
# async def search_patient_from_message(user_text: str):
#     """
#     Smart hybrid patient search.
#     """
#     query_vector = await get_embedding_vector(user_text)
#     if not query_vector:
#         print("❌ Could not generate embedding for patient search.")
#         return None

#     try:
#         # 1️⃣ Semantic Search
#         pipeline = [
#             {
#                 "$vectorSearch": {
#                     "index": "patient_vector_index",
#                     "path": "embedding",
#                     "queryVector": query_vector,
#                     "numCandidates": 50,
#                     "limit": 5, 
#                 }
#             },
#             {
#                 "$project": {
#                     "_id": 1, "name": 1, "age": 1, "issue": 1, "phone": 1, "lastVisit": 1,
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

# You must **DETECT THE USER'S LANGUAGE** (e.g., French, Arabic, Mandarin, etc.) and **REPLY IN THAT SAME LANGUAGE** while strictly maintaining your professional persona and following the data and duties below.

# Duties:
# 1️⃣ Greet politely when user greets.
# 2️⃣ Provide hospital, doctor, and patient information when asked.
# 3️⃣ If user asks about a doctor, search doctor collection and reply.
# 4️⃣ If user asks about a patient, search patient collection and reply.
# 5️⃣ If booking/appointment query, ask required details.
# 6️⃣ For unrelated queries, reply: "Sorry, I can only assist with hospital-related queries."
# """

# # ==============================
# # AI Response (Model Switched, History Filtered)
# # ==============================
# async def get_ai_response(user_id: str, user_message: str):
#     """
#     Sends the latest 5 chat messages + system prompt to Ollama for context-aware response.
#     Filters out previous error messages to prevent response loops.
#     """
#     context = ""
#     chat_record = await chats_collection.find_one(
#         {"user_id": user_id}, {"messages": {"$slice": -5}}
#     )

#     # System prompt + conversation history
#     history = [{"role": "system", "content": SYSTEM_PROMPT + context}]

#     if chat_record:
#         for msg in chat_record.get("messages", []):
#             if msg["sender_role"] == "user":
#                 history.append({"role": "user", "content": msg["text"]})
            
#             # 💡 FIX: Filter out the specific error message AND No doctor found messages
#             elif msg["sender_role"] == "bot" and "No doctor found" not in msg["text"] and "Sorry, I couldn’t process that request right now" not in msg["text"]:
#                 history.append({"role": "assistant", "content": msg["text"]})

#     history.append({"role": "user", "content": user_message})

#     print("\n🧠 Sending to Ollama (last few messages):")
#     for h in history[-6:]:
#         snippet = h['content'][:80].replace("\n", " ")
#         print(f" - {h['role']}: {snippet}{'...' if len(h['content']) > 80 else ''}")

#     try:
#         def run_ollama():
#             """Run Ollama.chat in a thread (safe for async context)."""
#             try:
#                 # 💡 FIX: Switched to Mistral for potentially better stability
#                 response = ollama.chat(model="mistral:latest", messages=history) 

#                 if hasattr(response, "__iter__") and not isinstance(response, dict):
#                     full = ""
#                     for chunk in response:
#                         if isinstance(chunk, dict):
#                             part = chunk.get("message", {}).get("content", "") or chunk.get("content", "")
#                             full += part
#                     return full.strip()

#                 elif isinstance(response, dict):
#                     return (response.get("message", {}).get("content", "") or response.get("content", "") or "").strip()
                
#                 return str(response).strip()

#             except Exception as inner_e:
#                 print(f"⚠️ Ollama inner error: {inner_e}")
#                 return ""

#         reply = await asyncio.to_thread(run_ollama)
#         print(f"🤖 Ollama Reply: {reply[:120]}{'...' if len(reply) > 120 else ''}")

#         return reply or "Sorry, I couldn’t process that request right now."

#     except Exception as e:
#         print(f"❌ Ollama Error (outer): {e}")
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

#     # Save user's message
#     await save_message(from_number, from_number, "user", user_text)
    
#     # =============================
#     # Doctor Search Logic (Cleaned up for flow)
#     # =============================
#     found_doctor = None

#     # 1. Try to extract doctor name (e.g., "doctor vaibhav")
#     name_match = re.search(r"doctor\s+([a-zA-Z]+)", user_text.lower())
#     if name_match:
#         doctor_name = name_match.group(1)
#         found_doctor = await doctors_collection.find_one(
#             {"name": {"$regex": doctor_name, "$options": "i"}}
#         )

#     # 2. If not found by name, try to search by specialty/semantic match
#     if not found_doctor:
#         specialty_query = None
#         match = re.search(r"(?:doctor\s*(?:for)?|specialist\s*(?:for)?|for|any)\s+([\w\s]+?)(?:\s*doctor|\s*specialist)?$", user_text.lower())
#         if match:
#             specialty_query = match.group(1).strip()
#             semantic_specialty = await match_specialty_semantically(specialty_query)
#             if semantic_specialty:
#                 found_doctor = await semantic_search_doctor(semantic_specialty)
        
#         # 3. Final Fallback: Semantic search on the whole message
#         if not found_doctor:
#              found_doctor = await semantic_search_doctor(user_text)


#     # =============================
#     # Patient Search
#     # =============================
#     patient = await search_patient_from_message(user_text)
#     patient_name = patient["name"] if patient else None
    
#     ai_reply = None

#     # =============================
#     # Appointment Booking Flow (Simplified logic path)
#     # =============================
#     if any(k in user_text.lower() for k in ["appointment", "book", "schedule"]):
#         # A full, robust booking flow would go here, which is complex.
#         # For this fix, we assume the AI is better at handling the initial prompt.
        
#         # If the query is explicitly about booking, let the AI handle the complex conversation
#         # unless all details are present for a hardcoded booking.
#         pass # Fall through to AI or implement full booking logic if required.


#     # =============================
#     # Doctor Info Queries (FIXED CONSTRUCTION)
#     # =============================
#     if found_doctor and not ai_reply:
#         name = found_doctor["name"]
#         timing = found_doctor.get("timing", "N/A")
#         phone = found_doctor.get("phone", "N/A")
#         specialty = found_doctor.get("specialty", "N/A")
#         experience = found_doctor.get("experience", "N/A")
#         status = found_doctor.get("status", "N/A")

#         # 💡 FIX: Ensure clean string output for Doctor Details.
#         ai_reply = (
#             f"👨‍⚕️ *Doctor Details:*\n"
#             f"Name: {name}\n"
#             f"Specialty: {specialty}\n"
#             f"Experience: {experience} years\n"
#             f"Status: {status}\n"
#             f"Timing: {timing}\n"
#             f"Phone: {phone}"
#         )

#     # =============================
#     # Patient Info Queries
#     # =============================
#     elif patient and not ai_reply:
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
#         print("🤖 No doctor/patient/appointment match found — using AI reasoning.")
#         ai_reply = await get_ai_response(from_number, user_text)

#     # =============================
#     # Send + Save AI response
#     # =============================
#     send_whatsapp_message(from_number, ai_reply)
#     await save_message(from_number, "ai_bot", "bot", ai_reply)
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
# import numpy as np

# # ==============================
# # App Imports (Ensure these point to your actual database and models)
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
# from app.routes.appointments import round_to_nearest_half_hour # Assumes this function is defined and imported

# # ==============================
# # Environment Setup
# # ==============================
# load_dotenv()
# WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# # ==============================
# # SentenceTransformer Model & Helpers
# # ==============================
# EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
# st_sync_model = None
# try:
#     st_sync_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
#     print(f"✅ Loaded SentenceTransformer model: {EMBEDDING_MODEL_NAME}")
# except Exception as e:
#     print(f"❌ Error loading SentenceTransformer: {e}. Semantic search disabled.")
#     st_sync_model = None

# async def get_embedding_vector(text: str):
#     if st_sync_model is None:
#         return None
#     def sync_embed(txt):
#         return st_sync_model.encode(txt, convert_to_tensor=False).tolist()
#     try:
#         return await asyncio.to_thread(sync_embed, text)
#     except Exception as e:
#         print(f"Embedding Error: {e}")
#         return None
        
# def cosine_similarity(a, b):
#     a, b = np.array(a), np.array(b)
#     norm_a = np.linalg.norm(a)
#     norm_b = np.linalg.norm(b)
#     if norm_a == 0 or norm_b == 0:
#         return 0.0
#     return float(np.dot(a, b) / (norm_a * norm_b))

# async def match_specialty_semantically(user_specialty: str):
#     if not user_specialty or st_sync_model is None: return user_specialty
#     try:
#         query_vec = await get_embedding_vector(user_specialty)
#         specialties = await doctors_collection.distinct("specialty")
#         if not specialties: return user_specialty

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
# # Doctor Semantic Search (Using your existing implementation)
# # ==============================
# async def semantic_search_doctor(query: str, limit: int = 1):
#     query_vector = await get_embedding_vector(query)
#     if not query_vector:
#         # Fallback to text match if no embedding possible
#         return await doctors_collection.find_one({"specialty": {"$regex": query, "$options": "i"}})
#     try:
#         pipeline = [
#             {"$vectorSearch": {"index": "vector_index", "path": "embedding", "queryVector": query_vector, "numCandidates": 50, "limit": limit}},
#             {"$project": {"_id": 1, "name": 1, "specialty": 1, "timing": 1, "status": 1, "phone": 1, "experience": 1, "score": {"$meta": "vectorSearchScore"}}},
#         ]
#         cursor = doctors_collection.aggregate(pipeline)
#         results = await cursor.to_list(length=limit)
#         if not results:
#             fuzzy = await doctors_collection.find_one({"specialty": {"$regex": query, "$options": "i"}})
#             return fuzzy
#         return results[0]
#     except Exception as e:
#         print(f"❌ Semantic Search Error: {e}")
#         return await doctors_collection.find_one({"specialty": {"$regex": query, "$options": "i"}})

# # ==============================
# # Patient Search (Using your existing implementation)
# # ==============================
# async def search_patient_from_message(user_text: str):
#     query_vector = await get_embedding_vector(user_text)
#     if not query_vector:
#         print("❌ Could not generate embedding for patient search.")
#         return None
#     try:
#         pipeline = [
#             {"$vectorSearch": {"index": "patient_vector_index", "path": "embedding", "queryVector": query_vector, "numCandidates": 50, "limit": 5}},
#             {"$project": {"_id": 1, "name": 1, "age": 1, "issue": 1, "phone": 1, "lastVisit": 1, "score": {"$meta": "vectorSearchScore"}}},
#         ]
#         cursor = patients_collection.aggregate(pipeline)
#         results = await cursor.to_list(length=5)
#         if results:
#             for r in results:
#                 if any(n in user_text.lower() for n in r["name"].lower().split()):
#                     r["_id"] = str(r["_id"])
#                     print(f"✅ Hybrid match for patient: {r['name']} (Score: {r['score']:.3f})")
#                     return r
#         name_match = re.search(r"(?:patient|show|details|about)?\s*(\w+)", user_text.lower())
#         if name_match:
#             name_candidate = name_match.group(1)
#             fuzzy = await patients_collection.find_one({"name": {"$regex": name_candidate, "$options": "i"}})
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

# app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
# app.mount("/static", StaticFiles(directory="app/static"), name="static")

# # Include Routers (Assuming these are correctly defined)
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
#     headers = {"Authorization": f"Bearer {WHATSAPP_TOKEN}", "Content-Type": "application/json"}
#     payload = {"messaging_product": "whatsapp", "to": to, "type": "text", "text": {"body": message}}
#     res = requests.post(url, headers=headers, json=payload)
#     print("📤 Sent Message:", res.json())

# # ==============================
# # Save Message
# # ==============================
# async def save_message(user_id: str, sender_id: str, sender_role: str, text: str):
#     if not text: return
#     message = Message(sender_id=sender_id, sender_role=sender_role, text=text, timestamp=datetime.utcnow())
#     await chats_collection.update_one(
#         {"user_id": user_id},
#         {"$push": {"messages": message.dict()}, "$setOnInsert": {"user_id": user_id, "created_at": datetime.utcnow()}},
#         upsert=True,
#     )

# # ==============================
# # System Prompt
# # ==============================
# SYSTEM_PROMPT = """
# You are a polite and professional AI receptionist for a hospital.

# You must **DETECT THE USER'S LANGUAGE** (e.g., French, Arabic, Mandarin, etc.) and **REPLY IN THAT SAME LANGUAGE** while strictly maintaining your professional persona and following the data and duties below.

# Duties:
# 1️⃣ Greet politely when user greets.
# 2️⃣ Provide hospital, doctor, and patient information when asked.
# 3️⃣ If user asks about a doctor, search doctor collection and reply.
# 4️⃣ If user asks about a patient, search patient collection and reply.
# 5️⃣ If booking/appointment query, ask required details.
# 6️⃣ For unrelated queries, reply: "Sorry, I can only assist with hospital-related queries."
# """

# # ==============================
# # AI Response (Cleaned History)
# # ==============================
# async def get_ai_response(user_id: str, user_message: str):
#     context = ""
#     chat_record = await chats_collection.find_one({"user_id": user_id}, {"messages": {"$slice": -5}})
#     history = [{"role": "system", "content": SYSTEM_PROMPT + context}]

#     if chat_record:
#         for msg in chat_record.get("messages", []):
#             if msg["sender_role"] == "user":
#                 history.append({"role": "user", "content": msg["text"]})
#             elif msg["sender_role"] == "bot" and "No doctor found" not in msg["text"] and "Sorry, I couldn’t process that request right now" not in msg["text"]:
#                 history.append({"role": "assistant", "content": msg["text"]})

#     history.append({"role": "user", "content": user_message})

#     print("\n🧠 Sending to Ollama (last few messages):")
#     for h in history[-6:]:
#         snippet = h['content'][:80].replace("\n", " ")
#         print(f" - {h['role']}: {snippet}{'...' if len(h['content']) > 80 else ''}")

#     try:
#         def run_ollama():
#             try:
#                 response = ollama.chat(model="mistral:latest", messages=history) 
#                 if hasattr(response, "__iter__") and not isinstance(response, dict):
#                     full = ""
#                     for chunk in response:
#                         if isinstance(chunk, dict):
#                             part = chunk.get("message", {}).get("content", "") or chunk.get("content", "")
#                             full += part
#                     return full.strip()
#                 elif isinstance(response, dict):
#                     return (response.get("message", {}).get("content", "") or response.get("content", "") or "").strip()
#                 return str(response).strip()
#             except Exception as inner_e:
#                 print(f"⚠️ Ollama inner error: {inner_e}")
#                 return ""

#         reply = await asyncio.to_thread(run_ollama)
#         print(f"🤖 Ollama Reply: {reply[:120]}{'...' if len(reply) > 120 else ''}")

#         return reply or "Sorry, I couldn’t process that request right now."

#     except Exception as e:
#         print(f"❌ Ollama Error (outer): {e}")
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
        
#         # Check if the time slot falls within the doctor's working hours (Timing field parsing required)
#         # Assuming for simplicity that the timing check is handled by the appointment conflict below
        
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
#     # Validate incoming message (FIXED LOGIC)
#     # =============================
#     if "entry" not in data: 
#         return {"status": "ignored"}
        
#     value = data["entry"][0].get("changes", [])[0].get("value", {})
    
#     # Check for 'messages' key safely before accessing index 0
#     if "messages" not in value: 
#         return {"status": "ignored"}

#     # Assign 'msg' now that 'messages' is guaranteed to exist
#     msg = value["messages"][0]
    
#     # Now check the message type
#     if msg.get("type") != "text": 
#         print("⚠️ Non-text message received — ignored.")
#         return {"status": "ignored"}

#     # Extract message details
#     from_number = msg["from"]
#     user_text = msg["text"]["body"].strip()
#     print(f"📩 Message from {from_number}: {user_text}")

#     ai_reply = None
#     await save_message(from_number, from_number, "user", user_text)
    
#     # =============================
#     # Doctor Search (For Info Queries)
#     # =============================
#     found_doctor = None
#     name_match = re.search(r"doctor\s+([a-zA-Z]+)", user_text.lower())
#     if name_match:
#         doctor_name = name_match.group(1)
#         found_doctor = await doctors_collection.find_one({"name": {"$regex": doctor_name, "$options": "i"}})
#     if not found_doctor:
#         match = re.search(r"(?:doctor\s*(?:for)?|specialist\s*(?:for)?|for|any)\s+([\w\s]+?)(?:\s*doctor|\s*specialist)?$", user_text.lower())
#         if match:
#             specialty_query = match.group(1).strip()
#             semantic_specialty = await match_specialty_semantically(specialty_query)
#             if semantic_specialty:
#                 found_doctor = await semantic_search_doctor(semantic_specialty)
#         if not found_doctor:
#              found_doctor = await semantic_search_doctor(user_text)

#     # =============================
#     # Patient Search
#     # =============================
#     patient = await search_patient_from_message(user_text)
#     patient_name = patient["name"] if patient else None

#     # =============================
#     # Appointment Booking Flow
#     # =============================
#     if any(k in user_text.lower() for k in ["appointment", "book", "schedule"]):
        
#         # 1. Extract Patient & Specialty
#         patient_match = re.findall(r"\bfor\s+([A-Za-z]+)", user_text.lower())
#         patient_name = patient_match[0].capitalize() if len(patient_match) >= 1 else (patient_name or "Unknown")

#         specialty_raw = patient_match[1] if len(patient_match) >= 2 else None
#         specialty = await match_specialty_semantically(specialty_raw) if specialty_raw else None
#         print(f"🔍 Extracted Patient: {patient_name}, Specialty: {specialty}")

#         # 2. Extract appointment time
#         appt_time = datetime.now() 
#         time_match = re.search(r"\b(\d{4}-\d{2}-\d{2} \d{1,2}:\d{2})\b", user_text)
#         if time_match:
#             try:
#                 appt_time = dt_parser.parse(time_match.group(1))
#             except Exception:
#                 appt_time = datetime.now() 

#         # 3. Extract doctor name
#         doctor_name_match = re.search(r"doctor\s+([A-Za-z]+)", user_text.lower())
#         doctor_name = doctor_name_match.group(1) if doctor_name_match else None

#         # 4. Find or assign doctor
#         doctor = None
#         if doctor_name:
#             doctor = await doctors_collection.find_one({"name": {"$regex": doctor_name, "$options": "i"}})
#             if not doctor:
#                 ai_reply = f"❌ Sorry, I couldn’t find a doctor named '{doctor_name}'."
#                 send_whatsapp_message(from_number, ai_reply)
#                 await save_message(from_number, "ai_bot", "bot", ai_reply)
#                 return {"status": "ok"}
#         elif specialty:
#             doctor, appt_time = await suggest_available_doctor(specialty, appt_time)
#             if not doctor:
#                 ai_reply = appt_time  # appt_time holds the error message from suggest_available_doctor
#                 send_whatsapp_message(from_number, ai_reply)
#                 await save_message(from_number, "ai_bot", "bot", ai_reply)
#                 return {"status": "ok"}
#         else:
#             ai_reply = ("⚠️ Please mention either the doctor’s name or the department/specialty to book an appointment.")
#             send_whatsapp_message(from_number, ai_reply)
#             await save_message(from_number, "ai_bot", "bot", ai_reply)
#             return {"status": "ok"}

#         # 5. Check doctor leave status
#         if doctor.get("status") == "leave":
#             ai_reply = f"⚠️ Doctor {doctor['name']} is currently on leave."
#             send_whatsapp_message(from_number, ai_reply)
#             await save_message(from_number, "ai_bot", "bot", ai_reply)
#             return {"status": "ok"}

#         # 6. Check time conflict
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

#         # 7. Book appointment (Success)
#         appointment_doc = {
#             "doctor_id": str(doctor["_id"]),
#             "patient_id": str(patient["_id"]) if patient else str(ObjectId()),
#             "patient_name": patient_name,
#             "doctor_name": doctor["name"],
#             "disease": specialty or doctor.get("specialty", "General"),
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
#     # End of Appointment Booking Flow

#     # =============================
#     # Doctor Info Queries
#     # =============================
#     if found_doctor and not ai_reply:
#         name = found_doctor["name"]
#         timing = found_doctor.get("timing", "N/A")
#         phone = found_doctor.get("phone", "N/A")
#         specialty = found_doctor.get("specialty", "N/A")
#         experience = found_doctor.get("experience", "N/A")
#         status = found_doctor.get("status", "N/A")

#         ai_reply = (
#             f"👨‍⚕️ *Doctor Details:*\n"
#             f"Name: {name}\n"
#             f"Specialty: {specialty}\n"
#             f"Experience: {experience} years\n"
#             f"Status: {status}\n"
#             f"Timing: {timing}\n"
#             f"Phone: {phone}"
#         )

#     # =============================
#     # Patient Info Queries
#     # =============================
#     elif patient and not ai_reply:
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
#         print("🤖 No doctor/patient/appointment match found — using AI reasoning.")
#         ai_reply = await get_ai_response(from_number, user_text)

#     # =============================
#     # Send + Save AI response
#     # =============================
#     send_whatsapp_message(from_number, ai_reply)
#     await save_message(from_number, "ai_bot", "bot", ai_reply)
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
import numpy as np
import datefinder
# ==============================
# App Imports (Ensure these point to your actual database and models)
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
from app.routes.appointments import round_to_nearest_half_hour # Assumes this function is defined and imported

# ==============================
# Environment Setup
# ==============================
load_dotenv()
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# ==============================
# SentenceTransformer Model & Helpers
# ==============================
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
st_sync_model = None
try:
    st_sync_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    print(f"✅ Loaded SentenceTransformer model: {EMBEDDING_MODEL_NAME}")
except Exception as e:
    print(f"❌ Error loading SentenceTransformer: {e}. Semantic search disabled.")
    st_sync_model = None

async def get_embedding_vector(text: str):
    if st_sync_model is None:
        return None
    def sync_embed(txt):
        return st_sync_model.encode(txt, convert_to_tensor=False).tolist()
    try:
        return await asyncio.to_thread(sync_embed, text)
    except Exception as e:
        print(f"Embedding Error: {e}")
        return None
        
def cosine_similarity(a, b):
    a, b = np.array(a), np.array(b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))

async def match_specialty_semantically(user_specialty: str):
    if not user_specialty or st_sync_model is None: return user_specialty
    try:
        query_vec = await get_embedding_vector(user_specialty)
        specialties = await doctors_collection.distinct("specialty")
        if not specialties: return user_specialty

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
# Doctor Semantic Search (Using your existing implementation)
# ==============================
async def semantic_search_doctor(query: str, limit: int = 1):
    query_vector = await get_embedding_vector(query)
    if not query_vector:
        # Fallback to text match if no embedding possible
        return await doctors_collection.find_one({"specialty": {"$regex": query, "$options": "i"}})
    try:
        pipeline = [
            {"$vectorSearch": {"index": "vector_index", "path": "embedding", "queryVector": query_vector, "numCandidates": 50, "limit": limit}},
            {"$project": {"_id": 1, "name": 1, "specialty": 1, "timing": 1, "status": 1, "phone": 1, "experience": 1, "score": {"$meta": "vectorSearchScore"}}},
        ]
        cursor = doctors_collection.aggregate(pipeline)
        results = await cursor.to_list(length=limit)
        if not results:
            fuzzy = await doctors_collection.find_one({"specialty": {"$regex": query, "$options": "i"}})
            return fuzzy
        return results[0]
    except Exception as e:
        print(f"❌ Semantic Search Error: {e}")
        return await doctors_collection.find_one({"specialty": {"$regex": query, "$options": "i"}})

# ==============================
# Patient Search (Using your existing implementation)
# ==============================
async def search_patient_from_message(user_text: str):
    query_vector = await get_embedding_vector(user_text)
    if not query_vector:
        print("❌ Could not generate embedding for patient search.")
        return None
    try:
        pipeline = [
            {"$vectorSearch": {"index": "patient_vector_index", "path": "embedding", "queryVector": query_vector, "numCandidates": 50, "limit": 5}},
            {"$project": {"_id": 1, "name": 1, "age": 1, "issue": 1, "phone": 1, "lastVisit": 1, "score": {"$meta": "vectorSearchScore"}}},
        ]
        cursor = patients_collection.aggregate(pipeline)
        results = await cursor.to_list(length=5)
        if results:
            for r in results:
                if any(n in user_text.lower() for n in r["name"].lower().split()):
                    r["_id"] = str(r["_id"])
                    print(f"✅ Hybrid match for patient: {r['name']} (Score: {r['score']:.3f})")
                    return r
        name_match = re.search(r"(?:patient|show|details|about)?\s*(\w+)", user_text.lower())
        if name_match:
            name_candidate = name_match.group(1)
            fuzzy = await patients_collection.find_one({"name": {"$regex": name_candidate, "$options": "i"}})
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

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Include Routers (Assuming these are correctly defined)
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
    headers = {"Authorization": f"Bearer {WHATSAPP_TOKEN}", "Content-Type": "application/json"}
    payload = {"messaging_product": "whatsapp", "to": to, "type": "text", "text": {"body": message}}
    res = requests.post(url, headers=headers, json=payload)
    print("📤 Sent Message:", res.json())

# ==============================
# Save Message
# ==============================
async def save_message(user_id: str, sender_id: str, sender_role: str, text: str):
    if not text: return
    message = Message(sender_id=sender_id, sender_role=sender_role, text=text, timestamp=datetime.utcnow())
    await chats_collection.update_one(
        {"user_id": user_id},
        {"$push": {"messages": message.dict()}, "$setOnInsert": {"user_id": user_id, "created_at": datetime.utcnow()}},
        upsert=True,
    )

# ==============================
# System Prompt
# ==============================
# ==============================
# 🌟 UPDATED System Prompt (The AI's advanced instructions) 🌟
# ==============================
SYSTEM_PROMPT = """
You are a highly capable, multilingual AI receptionist for a hospital.

Your primary duty is to analyze the user's request, detect their language, and respond *naturally* and *professionally* in that same language, just like a sophisticated chatbot.

**You must strictly adhere to the following duties and data sources:**

1.  **DETECT THE USER'S LANGUAGE** (e.g., Hindi, French, English) and **REPLY IN THAT SAME LANGUAGE** while maintaining a professional and polite tone.
2.  **Data Source (if provided):** When structured data (Doctor, Patient, or Appointment info) is provided in the current conversation history, you MUST use that information as your *primary source of truth*. Format the final response clearly, politely, and entirely in the user's language.
3.  **Doctor/Timing/Phone Query:** Always include the Doctor's **Status** (Present, On Leave, etc.) when giving details.
4.  **Appointment Query:** If data for a successful booking is given, confirm the booking politely. If booking details are missing, politely ask the user for the required information (Doctor/Specialty, Patient Name, Preferred Time).
5.  **Unrelated Queries:** For topics not related to the hospital, doctor, or patient care, respond: "Sorry, I can only assist with hospital-related queries."
"""
# ==============================
# AI Response (Cleaned History)
# ==============================
async def get_ai_response(user_id: str, user_message: str):
    context = ""
    chat_record = await chats_collection.find_one({"user_id": user_id}, {"messages": {"$slice": -5}})
    history = [{"role": "system", "content": SYSTEM_PROMPT + context}]

    if chat_record:
        for msg in chat_record.get("messages", []):
            if msg["sender_role"] == "user":
                history.append({"role": "user", "content": msg["text"]})
            elif msg["sender_role"] == "bot" and "No doctor found" not in msg["text"] and "Sorry, I couldn’t process that request right now" not in msg["text"]:
                history.append({"role": "assistant", "content": msg["text"]})

    history.append({"role": "user", "content": user_message})

    print("\n🧠 Sending to Ollama (last few messages):")
    for h in history[-6:]:
        snippet = h['content'][:80].replace("\n", " ")
        print(f" - {h['role']}: {snippet}{'...' if len(h['content']) > 80 else ''}")

    try:
        def run_ollama():
            try:
                response = ollama.chat(model="mistral:latest", messages=history) 
                if hasattr(response, "__iter__") and not isinstance(response, dict):
                    full = ""
                    for chunk in response:
                        if isinstance(chunk, dict):
                            part = chunk.get("message", {}).get("content", "") or chunk.get("content", "")
                            full += part
                    return full.strip()
                elif isinstance(response, dict):
                    return (response.get("message", {}).get("content", "") or response.get("content", "") or "").strip()
                return str(response).strip()
            except Exception as inner_e:
                print(f"⚠️ Ollama inner error: {inner_e}")
                return ""

        reply = await asyncio.to_thread(run_ollama)
        print(f"🤖 Ollama Reply: {reply[:120]}{'...' if len(reply) > 120 else ''}")

        return reply or "Sorry, I couldn’t process that request right now."

    except Exception as e:
        print(f"❌ Ollama Error (outer): {e}")
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
        
        # Check if the time slot falls within the doctor's working hours (Timing field parsing required)
        
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
    
    # Check for 'messages' key safely before accessing index 0
    if "messages" not in value: 
        return {"status": "ignored"}

    # Assign 'msg' now that 'messages' is guaranteed to exist
    msg = value["messages"][0]
    
    # Now check the message type
    if msg.get("type") != "text": 
        print("⚠️ Non-text message received — ignored.")
        return {"status": "ignored"}

    # Extract message details
    from_number = msg["from"]
    user_text = msg["text"]["body"].strip()
    print(f"📩 Message from {from_number}: {user_text}")

    ai_reply = None
    await save_message(from_number, from_number, "user", user_text)
    
    # =============================
    # Doctor Search (For Info Queries)
    # =============================
    found_doctor = None
    name_match = re.search(r"doctor\s+([a-zA-Z]+)", user_text.lower())
    if name_match:
        doctor_name = name_match.group(1)
        found_doctor = await doctors_collection.find_one({"name": {"$regex": doctor_name, "$options": "i"}})
    if not found_doctor:
        match = re.search(r"(?:doctor\s*(?:for)?|specialist\s*(?:for)?|for|any)\s+([\w\s]+?)(?:\s*doctor|\s*specialist)?$", user_text.lower())
        if match:
            specialty_query = match.group(1).strip()
            semantic_specialty = await match_specialty_semantically(specialty_query)
            if semantic_specialty:
                found_doctor = await semantic_search_doctor(semantic_specialty)
        if not found_doctor:
             found_doctor = await semantic_search_doctor(user_text)

    # =============================
    # Patient Search
    # =============================
    patient = await search_patient_from_message(user_text)
    patient_name = patient["name"] if patient else None

    # =============================
    # Appointment Booking Flow
    # =============================
    if any(k in user_text.lower() for k in ["appointment", "book", "schedule"]):
        
        # 1. Extract Patient & Specialty
        patient_match = re.findall(r"\bfor\s+([A-Za-z]+)", user_text.lower())
        patient_name = patient_match[0].capitalize() if len(patient_match) >= 1 else (patient_name or "Unknown")

        specialty_raw = patient_match[1] if len(patient_match) >= 2 else None
        specialty = await match_specialty_semantically(specialty_raw) if specialty_raw else None
        print(f"🔍 Extracted Patient: {patient_name}, Specialty: {specialty}")

        # 2. Extract appointment time
        appt_time = datetime.now() 
        
        
        try:
            # Use DateFinder to scan the user's message for any date/time indication
            # The 'source_time' argument helps resolve relative times like '6pm' to today's date
            matches = list(datefinder.find_dates(user_text, source_time=datetime.now()))
            
            if matches:
                # DateFinder returns a list; we'll take the first, most confident match
                parsed_time = matches[0]
                
                # IMPORTANT LOGIC: Handle past times (e.g., asking for 6 PM when it's 7 PM)
                # If the user only gave a time (like "6pm") and DateFinder resolved it to an hour 
                # that has already passed today, assume they mean the same time tomorrow.
                if parsed_time < datetime.now() - timedelta(minutes=5):
                    # Check if the text explicitly contains 'today' or 'now' to prevent rolling over
                    if "today" not in user_text.lower() and "now" not in user_text.lower():
                        # Roll the time over to tomorrow
                        parsed_time = parsed_time + timedelta(days=1)
                        print(f"Time was in the past, rolled over to tomorrow: {parsed_time.strftime('%Y-%m-%d %H:%M')}")

                appt_time = parsed_time
            else:
                # If DateFinder finds nothing, appt_time remains datetime.now() (The old default)
                print("DateFinder found no explicit date/time, defaulting to current time.")
        except Exception as e:
            print(f"❌ DateFinder parsing error: {e}, defaulting to current time.")
            appt_time = datetime.now() 

        # 3. Extract doctor name
        doctor_name_match = re.search(r"doctor\s+([A-Za-z]+)", user_text.lower())
        doctor_name = doctor_name_match.group(1) if doctor_name_match else None

        # 4. Find or assign doctor
        doctor = None
        if doctor_name:
            doctor = await doctors_collection.find_one({"name": {"$regex": doctor_name, "$options": "i"}})
            if not doctor:
                ai_reply = f"❌ Sorry, I couldn’t find a doctor named '{doctor_name}'."
                send_whatsapp_message(from_number, ai_reply)
                await save_message(from_number, "ai_bot", "bot", ai_reply)
                return {"status": "ok"}
        elif specialty:
            doctor, appt_time = await suggest_available_doctor(specialty, appt_time)
            if not doctor:
                ai_reply = appt_time  # appt_time holds the error message from suggest_available_doctor
                send_whatsapp_message(from_number, ai_reply)
                await save_message(from_number, "ai_bot", "bot", ai_reply)
                return {"status": "ok"}
        else:
            ai_reply = ("⚠️ Please mention either the doctor’s name or the department/specialty to book an appointment.")
            send_whatsapp_message(from_number, ai_reply)
            await save_message(from_number, "ai_bot", "bot", ai_reply)
            return {"status": "ok"}

        # 5. Check doctor leave status
        if doctor.get("status") == "leave":
            ai_reply = f"⚠️ Doctor {doctor['name']} is currently on leave."
            send_whatsapp_message(from_number, ai_reply)
            await save_message(from_number, "ai_bot", "bot", ai_reply)
            return {"status": "ok"}

        # 6. Check time conflict
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

        # 7. Book appointment (Success)
        appointment_doc = {
            "doctor_id": str(doctor["_id"]),
            "patient_id": str(patient["_id"]) if patient else str(ObjectId()),
            "patient_name": patient_name,
            "doctor_name": doctor["name"],
            "disease": specialty or doctor.get("specialty", "General"),
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
    # End of Appointment Booking Flow

    # =============================
    # Doctor Info Queries (NOW CONDITIONAL WITH STATUS)
    # =============================
    if found_doctor and not ai_reply:
        name = found_doctor["name"]
        timing = found_doctor.get("timing", "N/A")
        phone = found_doctor.get("phone", "N/A")
        specialty = found_doctor.get("specialty", "N/A")
        experience = found_doctor.get("experience", "N/A")
        status = found_doctor.get("status", "N/A").capitalize() # Capitalize for clean output

        user_query = user_text.lower()
        
        # Check for specific queries first
        if any(k in user_query for k in ["phone", "contact", "number"]):
            ai_reply = (
                f"📞 The phone number for Dr. {name} ({specialty}) is: *{phone}*\n"
                f"ℹ️ Status: *{status}*"
            )
        elif any(k in user_query for k in ["timing", "schedule", "hours"]):
            ai_reply = (
                f"⏰ Dr. {name}'s ({specialty}) working hours are: *{timing}*\n"
                f"ℹ️ Status: *{status}*"
            )
        # Fallback to verbose details if no specific query is detected
        else:
            ai_reply = (
                f"👨‍⚕️ *Doctor Details:*\n"
                f"Name: {name}\n"
                f"Specialty: {specialty}\n"
                f"Experience: {experience} years\n"
                f"Status: *{status}*\n"
                f"Timing: {timing}\n"
                f"Phone: {phone}"
            )

    # =============================
    # Patient Info Queries
    # =============================
    elif patient and not ai_reply:
        ai_reply = (
            f"✅ *Patient Details:*\n"
            f"👤 Name: {patient.get('name')}\n"
            f"🎂 Age: {patient.get('age', 'N/A')}\n"
            f"🩺 Issue: {patient.get('issue', 'N/A')}\n"
            f"📞 Phone: {patient.get('phone', 'N/A')}\n"
            f"📅 Last Visit: {patient.get('lastVisit', 'N/A')}"
        )

    # =============================
    # Ollama AI Fallback
    # =============================
    else:
        print("🤖 No doctor/patient/appointment match found — using AI reasoning.")
        ai_reply = await get_ai_response(from_number, user_text)

    # =============================
    # Send + Save AI response
    # =============================
    send_whatsapp_message(from_number, ai_reply)
    await save_message(from_number, "ai_bot", "bot", ai_reply)
    return {"status": "ok"}