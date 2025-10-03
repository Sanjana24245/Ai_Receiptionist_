# # # from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query

# # # from app.routes import auth
# # # from fastapi.staticfiles import StaticFiles
# # # from fastapi.middleware.cors import CORSMiddleware
# # # from fastapi.responses import FileResponse
# # # from app.routes import doctor
# # # from app.routes import appointments,patient, subadmin,chat 
# # # from typing import Dict, List
# # # import json
# # # from datetime import datetime
# # # from app.database import db
# # # from manager import ConnectionManager
# # # app = FastAPI()
# # # manager = ConnectionManager(db)

# # # app.add_middleware(
# # #     CORSMiddleware,
# # #     allow_origins=["*"],
# # #     allow_credentials=True,
# # #     allow_methods=["*"],
# # #     allow_headers=["*"],
# # # )
# # # app.mount("/static", StaticFiles(directory="app/static"), name="static")
# # # app.include_router(auth.router)
# # # app.include_router(doctor.router)
# # # app.include_router(appointments.router)
# # # app.include_router(patient.router)
# # # app.include_router(subadmin.router)
# # # app.include_router(chat.router)
# # # @app.get("/favicon.ico")
# # # async def favicon():
# # #     return FileResponse("app/static/favicon.ico")
# # # @app.get("/")
# # # async def root():
# # #     return {"msg": "FastAPI Auth System Running"}


# # # @app.websocket("/ws")
# # # async def websocket_endpoint(websocket: WebSocket, role: str = Query(...), client_id: str = Query(None)):
# # #     try:
# # #         if not client_id:
# # #             await websocket.close(code=4001)
# # #             return

# # #         if role == "user":
# # #             await manager.connect_user(client_id, websocket)  # already accepts
# # #         elif role == "subadmin":
# # #             await manager.connect_subadmin(client_id, websocket)  # already accepts
# # #         else:
# # #             await websocket.close(code=4000)
# # #             return

# # #         while True:
# # #             data = await websocket.receive_text()
# # #             message = json.loads(data)
# # #             if "timestamp" not in message:
# # #                 message["timestamp"] = datetime.utcnow().isoformat()
# # #             await manager.route_message(message)

# # #     except WebSocketDisconnect:
# # #         await manager.disconnect(websocket)
# # #     except Exception as e:
# # #         print("WebSocket error:", e)
# # #         await manager.disconnect(websocket)
# # # from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, Request
# # # from fastapi.staticfiles import StaticFiles
# # # from fastapi.middleware.cors import CORSMiddleware
# # # from fastapi.responses import FileResponse
# # # from datetime import datetime
# # # from typing import Dict, List
# # # import os
# # # import json
# # # import requests

# # # from dotenv import load_dotenv
# # # from openai import OpenAI

# # # # Import your routers
# # # from app.routes import auth, doctor, appointments, patient, subadmin, chat
# # # from app.database import db
# # # from manager import ConnectionManager

# # # # ==============================
# # # # ✅ Load environment variables
# # # # ==============================
# # # load_dotenv()

# # # app = FastAPI()
# # # manager = ConnectionManager(db)

# # # # ==============================
# # # # ✅ Middleware
# # # # ==============================
# # # app.add_middleware(
# # #     CORSMiddleware,
# # #     allow_origins=["*"],   # change to your frontend domain in production
# # #     allow_credentials=True,
# # #     allow_methods=["*"],
# # #     allow_headers=["*"],
# # # )

# # # # ==============================
# # # # ✅ Static files
# # # # ==============================
# # # app.mount("/static", StaticFiles(directory="app/static"), name="static")

# # # # ==============================
# # # # ✅ Routers
# # # # ==============================
# # # app.include_router(auth.router)
# # # app.include_router(doctor.router)
# # # app.include_router(appointments.router)
# # # app.include_router(patient.router)
# # # app.include_router(subadmin.router)
# # # app.include_router(chat.router)

# # # # ==============================
# # # # ✅ WhatsApp + OpenAI credentials
# # # # ==============================
# # # WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# # # PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# # # VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")
# # # OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# # # # ✅ OpenAI client
# # # client = OpenAI(api_key=OPENAI_API_KEY)

# # # # ==============================
# # # # ✅ Basic routes
# # # # ==============================
# # # @app.get("/favicon.ico")
# # # async def favicon():
# # #     return FileResponse("app/static/favicon.ico")

# # # @app.get("/")
# # # async def root():
# # #     return {"msg": "FastAPI Auth System Running with WhatsApp + AI"}

# # # # ==============================
# # # # ✅ WhatsApp Webhook Endpoints
# # # # ==============================
# # # @app.get("/webhook")
# # # async def verify_token(request: Request):
# # #     """
# # #     Meta webhook verification
# # #     """
# # #     params = request.query_params
# # #     if params.get("hub.verify_token") == VERIFY_TOKEN:
# # #         return int(params.get("hub.challenge"))
# # #     return {"error": "Invalid verification token"}
# # # # ==============================
# # # # ✅ WhatsApp Webhook Endpoints (UPDATED)
# # # # ==============================
# # # @app.post("/webhook")
# # # async def receive_message(request: Request):
# # #     """
# # #     Receive messages from WhatsApp and reply using OpenAI
# # #     """
# # #     data = await request.json()
# # #     # Print the WHOLE payload for debugging purposes
# # #     print(f"📥 Incoming Webhook Data: {json.dumps(data, indent=2)}")

# # #     try:
# # #         # Check if the notification is a message notification
# # #         changes = data["entry"][0]["changes"][0]
# # #         if changes["field"] != "messages":
# # #             # Ignore status updates or other non-message events
# # #             return {"status": "ok", "message": "Ignored non-message event"}

# # #         # Extract the relevant message data
# # #         value = changes["value"]
        
# # #         # Check for error in message processing (e.g., if message is empty)
# # #         if "messages" not in value or not value["messages"]:
# # #             print("⚠️ Ignoring empty message array or status update.")
# # #             return {"status": "ok", "message": "Ignored status update"}
        
# # #         message = value["messages"][0]
# # #         from_number = message["from"]
        
# # #         # Check message type (text, image, etc.)
# # #         message_type = message["type"]
        
# # #         text = ""
# # #         if message_type == "text":
# # #             # If it's a text message, extract the body
# # #             text = message["text"]["body"]
# # #         else:
# # #             # Handle non-text messages (e.g., reply with a template or a default message)
# # #             text = f"I received your {message_type}. I can only process text messages right now. Please send a text message."
# # #             # Optionally, you can skip AI processing for non-text messages
# # #             # send_whatsapp_message(from_number, "I can only process text messages right now.")
# # #             # return {"status": "ok"}


# # #         print(f"📩 WhatsApp message from {from_number} (Type: {message_type}): {text}")

# # #         # ✅ Get AI reply
# # #         # Only call OpenAI if the incoming message was text
# # #         if message_type == "text":
# # #             ai_response = client.chat.completions.create(
# # #                 model="gpt-4o-mini",
# # #                 messages=[
# # #                     {"role": "system", "content": "You are a helpful AI receptionist for a doctor's clinic. Reply concisely."},
# # #                     {"role": "user", "content": text}
# # #                 ]
# # #             )
# # #             reply = ai_response.choices[0].message.content
# # #         else:
# # #             # Use the default reply set above for non-text messages
# # #             reply = text

# # #         # ✅ Send AI reply back to WhatsApp
# # #         send_whatsapp_message(from_number, reply)

# # #     except IndexError:
# # #         print("❌ Webhook error: Data structure might be different (e.g., status or read receipt). Ignoring.")
# # #         # Meta sends multiple non-message events (like status, read, etc.) which can cause IndexError.
# # #     except Exception as e:
# # #         print("❌ Webhook General error:", e)
# # #         # If the failure happens inside send_whatsapp_message, the error might be here.
    
# # #     return {"status": "ok"}
# # # # @app.post("/webhook")
# # # # async def receive_message(request: Request):
# # # #     """
# # # #     Receive messages from WhatsApp and reply using OpenAI
# # # #     """
# # # #     data = await request.json()
# # # #     try:
# # # #         message = data["entry"][0]["changes"][0]["value"]["messages"][0]
# # # #         from_number = message["from"]
# # # #         text = message.get("text", {}).get("body", "")

# # # #         print(f"📩 WhatsApp message from {from_number}: {text}")

# # # #         # ✅ Get AI reply
# # # #         ai_response = client.chat.completions.create(
# # # #             model="gpt-4o-mini",
# # # #             messages=[
# # # #                 {"role": "system", "content": "You are a helpful AI receptionist."},
# # # #                 {"role": "user", "content": text}
# # # #             ]
# # # #         )
# # # #         reply = ai_response.choices[0].message.content

# # # #         # ✅ Send AI reply back to WhatsApp
# # # #         send_whatsapp_message(from_number, reply)

# # # #     except Exception as e:
# # # #         print("❌ Webhook error:", e)
# # # #     return {"status": "ok"}

# # # def send_whatsapp_message(to, message):
# # #     """
# # #     Send a text message via WhatsApp API
# # #     """
# # #     url = f"https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages"
# # #     headers = {
# # #         "Authorization": f"Bearer {WHATSAPP_TOKEN}",
# # #         "Content-Type": "application/json"
# # #     }
# # #     payload = {
# # #         "messaging_product": "whatsapp",
# # #         "to": to,
# # #         "type": "text",
# # #         "text": {"body": message}
# # #     }
# # #     response = requests.post(url, headers=headers, json=payload)
# # #     print("📤 WhatsApp API response:", response.json())

# # # # ==============================
# # # # ✅ WebSocket Endpoint
# # # # ==============================
# # # @app.websocket("/ws")
# # # async def websocket_endpoint(
# # #     websocket: WebSocket,
# # #     role: str = Query(...),
# # #     client_id: str = Query(None)
# # # ):
# # #     try:
# # #         if not client_id:
# # #             await websocket.close(code=4001)  # missing client_id
# # #             return

# # #         # Register connection by role
# # #         if role == "user":
# # #             await manager.connect_user(client_id, websocket)
# # #         elif role == "subadmin":
# # #             await manager.connect_subadmin(client_id, websocket)
# # #         else:
# # #             await websocket.close(code=4000)  # invalid role
# # #             return

# # #         # Listen for messages
# # #         while True:
# # #             data = await websocket.receive_text()
# # #             message = json.loads(data)

# # #             # Ensure timestamp exists
# # #             if "timestamp" not in message:
# # #                 message["timestamp"] = datetime.utcnow().isoformat()

# # #             await manager.route_message(message)

# # #     except WebSocketDisconnect:
# # #         await manager.disconnect(websocket)
# # #     except Exception as e:
# # #         print("❌ WebSocket error:", e)
# # #         await manager.disconnect(websocket)
# # from dotenv import load_dotenv
# # load_dotenv()

# # from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, Request
# # from fastapi.staticfiles import StaticFiles
# # from fastapi.middleware.cors import CORSMiddleware
# # from fastapi.responses import FileResponse
# # from datetime import datetime
# # from typing import Dict, List
# # import os
# # import json
# # import requests

# # # We keep this import, but the client will not be used in the webhook post function
# # from openai import OpenAI 

# # # Import your routers
# # from app.routes import auth, doctor, appointments, patient, subadmin, chat
# # from app.database import db
# # from manager import ConnectionManager

# # # ==============================
# # # ✅ Load environment variables
# # # ==============================


# # app = FastAPI()
# # manager = ConnectionManager(db)

# # # ==============================
# # # ✅ Middleware
# # # ==============================
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],    # change to your frontend domain in production
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # # ==============================
# # # ✅ Static files
# # # ==============================
# # app.mount("/static", StaticFiles(directory="app/static"), name="static")

# # # ==============================
# # # ✅ Routers
# # # ==============================
# # app.include_router(auth.router)
# # app.include_router(doctor.router)
# # app.include_router(appointments.router)
# # app.include_router(patient.router)
# # app.include_router(subadmin.router)
# # app.include_router(chat.router)

# # # ==============================
# # # ✅ WhatsApp + OpenAI credentials
# # # ==============================
# # WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# # PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# # VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")
# # OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# # # main.py

# # # ...
# # HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
# # # ...


# # # ==============================
# # # ✅ Basic routes
# # # ==============================
# # @app.get("/favicon.ico")
# # async def favicon():
# #     return FileResponse("app/static/favicon.ico")

# # @app.get("/")
# # async def root():
# #     return {"msg": "FastAPI Auth System Running with WhatsApp + AI"}

# # # ==============================
# # # ✅ WhatsApp Webhook Endpoints
# # # ==============================
# # @app.get("/webhook")
# # async def verify_token(request: Request):
# #     """
# #     Meta webhook verification
# #     """
# #     params = request.query_params
# #     if params.get("hub.verify_token") == VERIFY_TOKEN:
# #         return int(params.get("hub.challenge"))
# #     return {"error": "Invalid verification token"}

# # # ==================================================
# # # ✅ WhatsApp Webhook Endpoints (UPDATED FOR TESTING)
# # # ==================================================
# # @app.post("/webhook")
# # async def receive_message(request: Request):
# #     """
# #     Receive messages from WhatsApp and reply using a hardcoded message 
# #     to bypass the OpenAI quota error.
# #     """
# #     data = await request.json()
# #     # Print the WHOLE payload for debugging purposes
# #     print(f"📥 Incoming Webhook Data: {json.dumps(data, indent=2)}")

# #     try:
# #         changes = data["entry"][0]["changes"][0]
# #         if changes["field"] != "messages":
# #             return {"status": "ok", "message": "Ignored non-message event"}

# #         value = changes["value"]
        
# #         if "messages" not in value or not value["messages"]:
# #             print("⚠️ Ignoring empty message array or status update.")
# #             return {"status": "ok", "message": "Ignored status update"}
        
# #         message = value["messages"][0]
# #         from_number = message["from"]
# #         message_type = message["type"]
        
# #         text = ""
# #         if message_type == "text":
# #             text = message["text"]["body"]
# #         else:
# #             text = f"I received your {message_type}. I can only process text messages right now."
        
# #         print(f"📩 WhatsApp message from {from_number} (Type: {message_type}): {text}")

# #         # =======================================================
# #         # ⚠️ TESTING REPLY LOGIC: NO OPENAI CALL (FIXES ERROR 429)
# #         # =======================================================
# #         if "hi" in text.lower() or "hello" in text.lower():
# #             reply = "Hello! Your webhook and reply system are fully operational. Please fix your OpenAI billing to enable my AI brain. 🤖"
# #         elif "test" in text.lower():
# #             reply = "Test successful! This confirms your entire setup (Meta, Ngrok, FastAPI) is working perfectly."
# #         else:
# #             reply = f"I received: '{text}'. Reply is being sent via working WhatsApp API. Fix OpenAI quota to get dynamic answers!"
        
# #         # ✅ Send reply back to WhatsApp
# #         send_whatsapp_message(from_number, reply)

# #     except IndexError:
# #         print("❌ Webhook error: Data structure might be different (e.g., status or read receipt). Ignoring.")
# #     except Exception as e:
# #         print("❌ Webhook General error:", e)
    
# #     return {"status": "ok"}


# # def send_whatsapp_message(to, message):
# #     """
# #     Send a text message via WhatsApp API
# #     """
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
# #     response = requests.post(url, headers=headers, json=payload)
# #     print("📤 WhatsApp API response:", response.json())

# # # ==============================
# # # ✅ WebSocket Endpoint
# # # ==============================
# # @app.websocket("/ws")
# # async def websocket_endpoint(
# #     websocket: WebSocket,
# #     role: str = Query(...),
# #     client_id: str = Query(None)
# # ):
# #     try:
# #         if not client_id:
# #             await websocket.close(code=4001)  # missing client_id
# #             return

# #         # Register connection by role
# #         if role == "user":
# #             await manager.connect_user(client_id, websocket)
# #         elif role == "subadmin":
# #             await manager.connect_subadmin(client_id, websocket)
# #         else:
# #             await websocket.close(code=4000)  # invalid role
# #             return

# #         # Listen for messages
# #         while True:
# #             data = await websocket.receive_text()
# #             message = json.loads(data)

# #             # Ensure timestamp exists
# #             if "timestamp" not in message:
# #                 message["timestamp"] = datetime.utcnow().isoformat()

# #             await manager.route_message(message)

# #     except WebSocketDisconnect:
# #         await manager.disconnect(websocket)
# #     except Exception as e:
# #         print("❌ WebSocket error:", e)
# #         await manager.disconnect(websocket)

# # # from dotenv import load_dotenv
# # # import os
# # # # Load environment variables IMMEDIATELY so all subsequent imports/code can use them.
# # # load_dotenv() 

# # # from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, Request
# # # from fastapi.staticfiles import StaticFiles
# # # from fastapi.middleware.cors import CORSMiddleware
# # # from fastapi.responses import FileResponse
# # # from datetime import datetime
# # # from typing import Dict, List
# # # import json
# # # import requests

# # # # ✅ CRITICAL CHANGE: Uncomment the OpenAI import
# # # from openai import OpenAI 

# # # # Import your routers
# # # from app.routes import auth, doctor, appointments, patient, subadmin, chat
# # # from app.database import db
# # # from manager import ConnectionManager

# # # # ==============================
# # # # ❌ Hugging Face Constants (REMOVE or COMMENT OUT)
# # # # ==============================
# # # # HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/distilgpt2" 

# # # # ==============================
# # # # ✅ FastAPI & Connection Manager
# # # # ==============================
# # # app = FastAPI()
# # # manager = ConnectionManager(db)

# # # # ... (Middleware and Routers remain the same) ...

# # # # ==============================
# # # # ✅ Environment Variables
# # # # ==============================
# # # WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# # # PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# # # VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")
# # # # ✅ CRITICAL CHANGE: Use OpenAI Key
# # # OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") 
# # # HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN") # No longer used, but kept for context


# # # # ==============================
# # # # ✅ OpenAI AI Function (NEW)
# # # # ==============================
# # # # Initialize OpenAI client globally
# # # client = OpenAI(api_key=OPENAI_API_KEY)

# # # def get_ai_response(text: str) -> str:
# # #     """Calls the OpenAI API for a dynamic response."""
    
# # #     if not OPENAI_API_KEY:
# # #         print("❌ OpenAI API Key is missing. Check .env file.")
# # #         return "I'm facing a technical difficulty. The AI brain is offline."
        
# # #     try:
# # #         response = client.chat.completions.create(
# # #             model="gpt-3.5-turbo", # Use a reliable and fast model
# # #             messages=[
# # #                 {"role": "system", "content": "You are a helpful and concise AI assistant for a medical reception system. Keep your answers brief."},
# # #                 {"role": "user", "content": text}
# # #             ],
# # #             max_tokens=150
# # #         )
# # #         # Extract the content from the response
# # #         reply = response.choices[0].message.content.strip()
# # #         return reply
        
# # #     except Exception as e:
# # #         print(f"❌ OpenAI API Error: {e}")
# # #         # Return a helpful error message if the API key or billing is the issue
# # #         if "Authentication" in str(e) or "Billing" in str(e):
# # #              return "AI connection failed due to an invalid key or billing issue. Please check API settings."
# # #         return "I had trouble formulating a response."


# # # def send_whatsapp_message(to, message):
# # #     # ... (This function remains the same, but will now use your new WHATSAPP_TOKEN) ...
# # #     """Send a text message via WhatsApp API"""
# # #     url = f"https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages"
# # #     headers = {
# # #         "Authorization": f"Bearer {WHATSAPP_TOKEN}", # IMPORTANT: Uses the new, valid token
# # #         "Content-Type": "application/json"
# # #     }
# # #     payload = {
# # #         "messaging_product": "whatsapp",
# # #         "to": to,
# # #         "type": "text",
# # #         "text": {"body": message}
# # #     }
# # #     response = requests.post(url, headers=headers, json=payload)
# # #     print("📤 WhatsApp API response:", response.json())


# # # # ... (Basic routes remain the same) ...

# # # @app.post("/webhook")
# # # async def receive_message(request: Request):
# # #     """Receive messages from WhatsApp and reply using the OpenAI AI model."""
# # #     data = await request.json()
# # #     print(f"📥 Incoming Webhook Data: {json.dumps(data, indent=2)}")

# # #     try:
# # #         changes = data["entry"][0]["changes"][0]
# # #         if changes["field"] != "messages":
# # #             return {"status": "ok", "message": "Ignored non-message event"}

# # #         value = changes["value"]
        
# # #         if "messages" not in value or not value["messages"]:
# # #             print("⚠️ Ignoring empty message array or status update.")
# # #             return {"status": "ok", "message": "Ignored status update"}
        
# # #         message = value["messages"][0]
# # #         from_number = message["from"]
# # #         message_type = message["type"]
        
# # #         text = ""
# # #         if message_type == "text":
# # #             text = message["text"]["body"]
# # #         else:
# # #             text = f"I received your {message_type}. I can only process text messages right now."
        
# # #         print(f"📩 WhatsApp message from {from_number} (Type: {message_type}): {text}")

# # #         # =======================================================
# # #         # ✅ DYNAMIC REPLY LOGIC: CALL OPENAI
# # #         # =======================================================
# # #         reply = get_ai_response(text) # <--- CRITICAL FUNCTION CALL CHANGE
# # #         print(f"🤖 AI Reply Generated: {reply}")
        
# # #         # ✅ Send reply back to WhatsApp
# # #         send_whatsapp_message(from_number, reply)

# # #     except IndexError:
# # #         print("❌ Webhook error: Data structure might be different (e.g., status or read receipt). Ignoring.")
# # #     except Exception as e:
# # #         print(f"❌ Webhook General error: {e}")
    
# # #     return {"status": "ok"}


# # # # ==============================
# # # # ✅ WebSocket Endpoint
# # # # ==============================
# # # @app.websocket("/ws")
# # # async def websocket_endpoint(
# # #     websocket: WebSocket,
# # #     role: str = Query(...),
# # #     client_id: str = Query(None)
# # # ):
# # #     try:
# # #         if not client_id:
# # #             await websocket.close(code=4001)
# # #             return

# # #         # Register connection by role
# # #         if role == "user":
# # #             await manager.connect_user(client_id, websocket)
# # #         elif role == "subadmin":
# # #             await manager.connect_subadmin(client_id, websocket)
# # #         else:
# # #             await websocket.close(code=4000)
# # #             return

# # #         # Listen for messages
# # #         while True:
# # #             data = await websocket.receive_text()
# # #             message = json.loads(data)

# # #             # Ensure timestamp exists
# # #             if "timestamp" not in message:
# # #                 message["timestamp"] = datetime.utcnow().isoformat()

# # #             await manager.route_message(message)

# # #     except WebSocketDisconnect:
# # #         await manager.disconnect(websocket)
# # #     except Exception as e:
# # #         print("❌ WebSocket error:", e)
# # #         await manager.disconnect(websocket)



# # from dotenv import load_dotenv
# # import os
# # import json
# # import requests
# # from datetime import datetime

# # from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, Request
# # from fastapi.staticfiles import StaticFiles
# # from fastapi.middleware.cors import CORSMiddleware
# # from fastapi.responses import FileResponse

# # # Import your routers
# # from app.routes import auth, doctor, appointments, patient, subadmin, chat
# # from app.database import db
# # from manager import ConnectionManager

# # # ==============================
# # # ✅ Load environment variables
# # # ==============================
# # load_dotenv()

# # # ==============================
# # # ✅ FastAPI app setup
# # # ==============================
# # app = FastAPI()
# # manager = ConnectionManager(db)

# # # ==============================
# # # ✅ Middleware
# # # ==============================
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],    # Change this in production to your frontend domain
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # # ==============================
# # # ✅ Static files
# # # ==============================
# # app.mount("/static", StaticFiles(directory="app/static"), name="static")

# # # ==============================
# # # ✅ Routers
# # # ==============================
# # app.include_router(auth.router)
# # app.include_router(doctor.router)
# # app.include_router(appointments.router)
# # app.include_router(patient.router)
# # app.include_router(subadmin.router)
# # app.include_router(chat.router)

# # # ==============================
# # # ✅ WhatsApp + LLaMA config
# # # ==============================
# # WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# # PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# # VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# # OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
# # LLAMA_MODEL = os.getenv("LLAMA_MODEL", "llama3")

# # # ==============================
# # # ✅ Basic routes
# # # ==============================
# # @app.get("/favicon.ico")
# # async def favicon():
# #     return FileResponse("app/static/favicon.ico")

# # @app.get("/")
# # async def root():
# #     return {"msg": "FastAPI WhatsApp + LLaMA bot is running 🚀"}

# # # ==============================
# # # ✅ WhatsApp Webhook Verification
# # # ==============================
# # @app.get("/webhook")
# # async def verify_token(request: Request):
# #     """
# #     Meta webhook verification
# #     """
# #     params = request.query_params
# #     if params.get("hub.verify_token") == VERIFY_TOKEN:
# #         return int(params.get("hub.challenge"))
# #     return {"error": "Invalid verification token"}

# # # ==============================
# # # ✅ LLaMA AI Function
# # # ==============================
# # def get_ai_response(text: str) -> str:
# #     """Generate a reply using local LLaMA model via Ollama."""
# #     try:
# #         system_prompt = (
# #             "You are a helpful and concise AI receptionist for a hospital. "
# #             "Answer politely and briefly based only on hospital context if possible."
# #         )

# #         payload = {
# #             "model": LLAMA_MODEL,
# #             "prompt": f"{system_prompt}\nUser: {text}\nAssistant:",
# #             "stream": False,
# #         }

# #         r = requests.post(OLLAMA_URL, json=payload, timeout=60)
# #         r.raise_for_status()
# #         data = r.json()

# #         reply = data.get("response", "").strip()
# #         return reply or "Sorry, I couldn’t generate a response."
# #     except Exception as e:
# #         print(f"❌ LLaMA API Error: {e}")
# #         return "My AI system is having issues. Please try again later."

# # # ==============================
# # # ✅ WhatsApp Send Message
# # # ==============================
# # def send_whatsapp_message(to, message):
# #     """Send a text message via WhatsApp Cloud API"""
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
# #     response = requests.post(url, headers=headers, json=payload)
# #     print("📤 WhatsApp API response:", response.json())

# # # ==============================
# # # ✅ WhatsApp Webhook Receiver
# # # ==============================
# # @app.post("/webhook")
# # async def receive_message(request: Request):
# #     """
# #     Receive WhatsApp messages and reply with LLaMA response.
# #     """
# #     data = await request.json()
# #     print(f"📥 Incoming Webhook Data: {json.dumps(data, indent=2)}")

# #     try:
# #         changes = data["entry"][0]["changes"][0]
# #         if changes["field"] != "messages":
# #             return {"status": "ok", "message": "Ignored non-message event"}

# #         value = changes["value"]

# #         if "messages" not in value or not value["messages"]:
# #             print("⚠️ Ignoring empty message array or status update.")
# #             return {"status": "ok", "message": "Ignored status update"}

# #         message = value["messages"][0]
# #         from_number = message["from"]
# #         message_type = message["type"]

# #         if message_type == "text":
# #             text = message["text"]["body"]
# #         else:
# #             text = f"I received your {message_type}. Currently, I can only process text messages."

# #         print(f"📩 WhatsApp message from {from_number} (Type: {message_type}): {text}")

# #         # ✅ Generate AI reply with LLaMA
# #         reply = get_ai_response(text)
# #         print(f"🤖 AI Reply: {reply}")

# #         # ✅ Send reply back to WhatsApp
# #         send_whatsapp_message(from_number, reply)

# #     except IndexError:
# #         print("❌ Webhook error: Data structure might be different (status update, read receipt, etc.)")
# #     except Exception as e:
# #         print(f"❌ Webhook General error: {e}")

# #     return {"status": "ok"}

# # # ==============================
# # # ✅ WebSocket Endpoint
# # # ==============================
# # @app.websocket("/ws")
# # async def websocket_endpoint(
# #     websocket: WebSocket,
# #     role: str = Query(...),
# #     client_id: str = Query(None)
# # ):
# #     try:
# #         if not client_id:
# #             await websocket.close(code=4001)
# #             return

# #         # Register connection by role
# #         if role == "user":
# #             await manager.connect_user(client_id, websocket)
# #         elif role == "subadmin":
# #             await manager.connect_subadmin(client_id, websocket)
# #         else:
# #             await websocket.close(code=4000)
# #             return

# #         # Listen for messages
# #         while True:
# #             data = await websocket.receive_text()
# #             message = json.loads(data)

# #             if "timestamp" not in message:
# #                 message["timestamp"] = datetime.utcnow().isoformat()

# #             await manager.route_message(message)

# #     except WebSocketDisconnect:
# #         await manager.disconnect(websocket)
# #     except Exception as e:
# #         print("❌ WebSocket error:", e)
# #         await manager.disconnect(websocket)
# from dotenv import load_dotenv
# import os
# import json
# import requests
# from datetime import datetime

# from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, Request
# from fastapi.staticfiles import StaticFiles
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse

# # Import your routers
# from app.routes import auth, doctor, appointments, patient, subadmin, chat
# from app.database import db
# from manager import ConnectionManager

# # ==============================
# # Load environment variables
# # ==============================
# load_dotenv()

# # ==============================
# # FastAPI app setup
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
# # WhatsApp config
# # ==============================
# WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# # ==============================
# # Basic routes
# # ==============================
# @app.get("/favicon.ico")
# async def favicon():
#     return FileResponse("app/static/favicon.ico")

# @app.get("/")
# async def root():
#     return {"msg": "FastAPI WhatsApp bot is running 🚀"}

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
# # WhatsApp Send Message
# # ==============================
# def send_whatsapp_message(to, message):
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
#     response = requests.post(url, headers=headers, json=payload)
#     print("📤 WhatsApp API response:", response.json())

# # ==============================
# # WhatsApp Webhook Receiver
# # ==============================

# @app.post("/webhook")
# async def receive_message(request: Request):
#     data = await request.json()
#     print(f"📥 Incoming Webhook Data: {json.dumps(data, indent=2)}")

#     try:
#         changes = data["entry"][0]["changes"][0]
#         if changes["field"] != "messages":
#             return {"status": "ok", "message": "Ignored non-message event"}

#         value = changes["value"]
#         if "messages" not in value or not value["messages"]:
#             print("⚠️ Ignoring empty message array or status update.")
#             return {"status": "ok", "message": "Ignored status update"}

#         message = value["messages"][0]
#         from_number = message["from"]

#         # ✅ Send static message instead of echo
#         static_reply = "Hello! Thank you for contacting our hospital. How can we help you today?"
#         send_whatsapp_message(from_number, static_reply)

#         # Optional: Push to WebSocket if needed
#         await manager.route_message({
#             "from": from_number,
#             "to": "subadmin",
#             "text": static_reply,
#             "timestamp": datetime.utcnow().isoformat(),
#             "source": "whatsapp"
#         })

#     except IndexError:
#         print("❌ Webhook error: Data structure might be different")
#     except Exception as e:
#         print(f"❌ Webhook General error: {e}")

#     return {"status": "ok"}

# # ==============================
# # WebSocket Endpoint
# # ==============================
# @app.websocket("/ws")
# async def websocket_endpoint(
#     websocket: WebSocket,
#     role: str = Query(...),
#     client_id: str = Query(None)
# ):
#     try:
#         if not client_id:
#             await websocket.close(code=4001)
#             return

#         # Register connection by role
#         if role == "user":
#             await manager.connect_user(client_id, websocket)
#         elif role == "subadmin":
#             await manager.connect_subadmin(client_id, websocket)
#         else:
#             await websocket.close(code=4000)
#             return

#         while True:
#             data = await websocket.receive_text()
#             message = json.loads(data)
#             if "timestamp" not in message:
#                 message["timestamp"] = datetime.utcnow().isoformat()
#             await manager.route_message(message)

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

# from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, Request
# from fastapi.staticfiles import StaticFiles
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse

# import ollama
# from app.routes import auth, doctor, appointments, patient, subadmin, chat
# from app.database import db
# from manager import ConnectionManager

# # ==============================
# # Load environment variables
# # ==============================
# load_dotenv()

# # ==============================
# # FastAPI app setup
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
# # WhatsApp config
# # ==============================
# WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

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
# # Send WhatsApp Message
# # ==============================
# def send_whatsapp_message(to, message):
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
#     response = requests.post(url, headers=headers, json=payload)
#     print("📤 WhatsApp API response:", response.json())

# # ==============================
# # Save Message in DB
# # ==============================
# async def save_message(sender, receiver, text, role="user", source="whatsapp"):
#     message = {
#         "sender": sender,
#         "receiver": receiver,
#         "text": text,
#         "role": role,
#         "source": source,
#         "timestamp": datetime.utcnow()
#     }
#     result = await db["messages"].insert_one(message)
#     return str(result.inserted_id)

# # ==============================
# # AI Reply with Ollama
# # ==============================
# def get_ai_reply(user_message: str) -> str:
#     try:
#         response = ollama.chat(
#             model="llama3",   # ✅ already installed
#             messages=[{"role": "user", "content": user_message}]
#         )
#         return response["message"]["content"]
#     except Exception as e:
#         print("❌ Ollama error:", e)
#         return "Sorry, I’m having trouble answering right now."


# # ==============================
# # WhatsApp Webhook Receiver
# # ==============================
# @app.post("/webhook")
# async def receive_message(request: Request):
#     data = await request.json()
#     print(f"📥 Incoming Webhook Data: {json.dumps(data, indent=2)}")

#     try:
#         changes = data["entry"][0]["changes"][0]
#         if changes["field"] != "messages":
#             return {"status": "ok", "message": "Ignored non-message event"}

#         value = changes["value"]
#         if "messages" not in value or not value["messages"]:
#             print("⚠️ Ignoring empty message array or status update.")
#             return {"status": "ok"}

#         message = value["messages"][0]
#         from_number = message["from"]
#         user_text = message["text"]["body"]

#         # ✅ Save user message to DB
#         await save_message(sender=from_number, receiver="ai_bot", text=user_text, role="user")

#         # ✅ Get AI reply from LLaMA
#         ai_reply = get_ai_reply(user_text)

#         # ✅ Save AI reply to DB
#         await save_message(sender="ai_bot", receiver=from_number, text=ai_reply, role="bot")

#         # ✅ Send reply to WhatsApp
#         send_whatsapp_message(from_number, ai_reply)

#         # ✅ Push to WebSocket (optional)
#         await manager.route_message({
#             "from": from_number,
#             "to": "subadmin",
#             "text": ai_reply,
#             "timestamp": datetime.utcnow().isoformat(),
#             "source": "whatsapp"
#         })

#     except Exception as e:
#         print(f"❌ Webhook General error: {e}")

#     return {"status": "ok"}

# # ==============================
# # WebSocket Endpoint
# # ==============================
# @app.websocket("/ws")
# async def websocket_endpoint(
#     websocket: WebSocket,
#     role: str = Query(...),
#     client_id: str = Query(None)
# ):
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
#             message = json.loads(data)
#             if "timestamp" not in message:
#                 message["timestamp"] = datetime.utcnow().isoformat()
#             await manager.route_message(message)

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

# from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, Request
# from fastapi.staticfiles import StaticFiles
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse

# import ollama
# from app.routes import auth, doctor, appointments, patient, subadmin, chat
# from app.database import db
# from manager import ConnectionManager

# # ==============================
# # Load environment variables
# # ==============================
# load_dotenv()
# WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# # ==============================
# # FastAPI app setup
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
# # Send WhatsApp Message
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
#     response = requests.post(url, headers=headers, json=payload)
#     print("📤 WhatsApp API response:", response.json())

# # ==============================
# # Save Message in DB
# # ==============================
# async def save_message(sender, receiver, text, role="user", source="whatsapp"):
#     message = {
#         "sender": sender,
#         "receiver": receiver,
#         "text": text,
#         "role": role,
#         "source": source,
#         "timestamp": datetime.utcnow()
#     }
#     result = await db["messages"].insert_one(message)
#     return str(result.inserted_id)

# # ==============================
# # AI Reply with Ollama
# # ==============================
# def get_ai_reply(user_message: str) -> str:
#     try:
#         response = ollama.chat(
#             model="llama3:latest",
#             messages=[{"role": "user", "content": user_message}]
#         )

#         # Ollama returns dict with "message" key
#         if "message" in response and "content" in response["message"]:
#             return response["message"]["content"]

#         # fallback if response format changes
#         return response.get("content", "Sorry, I couldn’t generate a reply.")
#     except Exception as e:
#         print("❌ Ollama error:", e)
#         return "Sorry, I’m having trouble answering right now."

# # ==============================
# # WhatsApp Webhook Receiver
# # ==============================
# @app.post("/webhook")
# async def receive_message(request: Request):
#     data = await request.json()
#     print(f"📥 Incoming Webhook Data: {json.dumps(data, indent=2)}")

#     try:
#         changes = data["entry"][0]["changes"][0]
#         if changes["field"] != "messages":
#             print("⚠️ Not a message event")
#             return {"status": "ok"}

#         value = changes["value"]
#         if "messages" not in value or not value["messages"]:
#             print("⚠️ Empty or status event")
#             return {"status": "ok"}

#         message = value["messages"][0]
#         from_number = message["from"]

#         if "text" not in message:
#             print("⚠️ Non-text message ignored")
#             return {"status": "ok"}

#         user_text = message["text"]["body"]
#         print(f"📨 User said: {user_text}")

#         # ✅ Save user message
#         await save_message(sender=from_number, receiver="ai_bot", text=user_text, role="user")

#         # ✅ AI reply
#         ai_reply = get_ai_reply(user_text)
#         print(f"🤖 AI replied: {ai_reply}")

#         # ✅ Save AI reply
#         await save_message(sender="ai_bot", receiver=from_number, text=ai_reply, role="bot")

#         # ✅ Send to WhatsApp
#         send_whatsapp_message(from_number, ai_reply)

#     except Exception as e:
#         print(f"❌ Webhook error: {e}")

#     return {"status": "ok"}

# # ==============================
# # WebSocket Endpoint
# # ==============================
# @app.websocket("/ws")
# async def websocket_endpoint(
#     websocket: WebSocket,
#     role: str = Query(...),
#     client_id: str = Query(None)
# ):
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
#             message = json.loads(data)
#             if "timestamp" not in message:
#                 message["timestamp"] = datetime.utcnow().isoformat()
#             await manager.route_message(message)

#     except WebSocketDisconnect:
#         await manager.disconnect(websocket)
#     except Exception as e:
#         print("❌ WebSocket error:", e)
#         await manager.disconnect(websocket)
from dotenv import load_dotenv
import os
import json
import requests
from datetime import datetime

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

import ollama
from app.routes import auth, doctor, appointments, patient, subadmin, chat
from app.database import db
from manager import ConnectionManager

# ==============================
# Load environment variables
# ==============================
load_dotenv()
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# ==============================
# FastAPI app setup
# ==============================
app = FastAPI()
manager = ConnectionManager(db)

# ==============================
# Middleware
# ==============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# Static files
# ==============================
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# ==============================
# Routers
# ==============================
app.include_router(auth.router)
app.include_router(doctor.router)
app.include_router(appointments.router)
app.include_router(patient.router)
app.include_router(subadmin.router)
app.include_router(chat.router)

# ==============================
# Basic routes
# ==============================
@app.get("/favicon.ico")
async def favicon():
    return FileResponse("app/static/favicon.ico")

@app.get("/")
async def root():
    return {"msg": "FastAPI WhatsApp bot with AI is running 🚀"}

# ==============================
# WhatsApp Webhook Verification
# ==============================
@app.get("/webhook")
async def verify_token(request: Request):
    params = request.query_params
    if params.get("hub.verify_token") == VERIFY_TOKEN:
        return int(params.get("hub.challenge"))
    return {"error": "Invalid verification token"}

# ==============================
# Send WhatsApp Message
# ==============================
def send_whatsapp_message(to: str, message: str):
    url = f"https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": message}
    }
    response = requests.post(url, headers=headers, json=payload)
    print("📤 WhatsApp API response:", response.json())

# ==============================
# Save Message in DB
# ==============================
async def save_message(sender, receiver, text, role="user", source="whatsapp"):
    message = {
        "sender": sender,
        "receiver": receiver,
        "text": text,
        "role": role,
        "source": source,
        "timestamp": datetime.utcnow()
    }
    result = await db["messages"].insert_one(message)
    return str(result.inserted_id)

# ==============================
# AI Reply with Ollama
# ==============================
def get_ai_reply(user_message: str) -> str:
    try:
        response = ollama.chat(
            model="llama3:latest",
            messages=[{"role": "user", "content": user_message}]
        )

        if "message" in response and "content" in response["message"]:
            return response["message"]["content"]
        return response.get("content", "Sorry, I couldn’t generate a reply.")
    except Exception as e:
        print("❌ Ollama error:", e)
        return "Sorry, I’m having trouble answering right now."

# ==============================
# Load AI Flow JSON
# ==============================
AI_FLOW_FILE = "app/static/ai_flow.json"

with open(AI_FLOW_FILE, "r") as f:
    ai_flow = json.load(f)

# ==============================
# WhatsApp Webhook Receiver
# ==============================
@app.post("/webhook")
async def receive_message(request: Request):
    data = await request.json()
    print(f"📥 Incoming Webhook Data: {json.dumps(data, indent=2)}")

    try:
        changes = data["entry"][0]["changes"][0]
        if changes["field"] != "messages":
            print("⚠️ Not a message event")
            return {"status": "ok"}

        value = changes["value"]
        if "messages" not in value or not value["messages"]:
            print("⚠️ Empty or status event")
            return {"status": "ok"}

        message = value["messages"][0]
        from_number = message["from"]

        if "text" not in message:
            print("⚠️ Non-text message ignored")
            return {"status": "ok"}

        user_text = message["text"]["body"].strip()
        print(f"📨 User said: {user_text}")

        # ----------------------
        # Save user message
        # ----------------------
        await save_message(sender=from_number, receiver="ai_bot", text=user_text, role="user")

        # ----------------------
        # Determine AI reply based on flow
        # ----------------------
        ai_reply = ""

        # 1️⃣ Greeting
        if user_text.lower() in ["hi", "hello", "hey"]:
            ai_reply = ai_flow["greeting"]["messages"][0].replace("{name}", "there")
            options_text = "Please share your location (Delhi, Mumbai, Bangalore)."
            ai_reply = f"{ai_reply}\n\n{options_text}"

        # 2️⃣ Location selection
        elif user_text.title() in [loc["city"] for loc in ai_flow["locations"]]:
            selected_city = next(loc for loc in ai_flow["locations"] if loc["city"] == user_text.title())
            hospitals = "\n".join(f"- {h}" for h in selected_city["hospitals"])
            ai_reply = f"Great! You are at our {selected_city['city']} branch. Please choose a hospital:\n{hospitals}"

        # 3️⃣ Service selection
        elif user_text.title() in ai_flow["services"]:
            if user_text.title() == "Appointment":
                ai_reply = "You selected Appointment. Please provide patient name and preferred date."
            elif user_text.title() == "Emergency":
                ai_reply = "Emergency noted! Our team will contact you immediately. 🚨"
            elif user_text.title() == "FAQ":
                ai_reply = "FAQ selected. Ask any questions and I will help you."

        # 4️⃣ Fallback to Ollama AI if none matched
        else:
            ai_reply = get_ai_reply(user_text)

        # ----------------------
        # Save AI reply
        # ----------------------
        await save_message(sender="ai_bot", receiver=from_number, text=ai_reply, role="bot")

        # ----------------------
        # Send WhatsApp message
        # ----------------------
        send_whatsapp_message(from_number, ai_reply)

    except Exception as e:
        print(f"❌ Webhook error: {e}")

    return {"status": "ok"}

# ==============================
# WebSocket Endpoint
# ==============================
@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    role: str = Query(...),
    client_id: str = Query(None)
):
    try:
        if not client_id:
            await websocket.close(code=4001)
            return

        if role == "user":
            await manager.connect_user(client_id, websocket)
        elif role == "subadmin":
            await manager.connect_subadmin(client_id, websocket)
        else:
            await websocket.close(code=4000)
            return

        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            if "timestamp" not in message:
                message["timestamp"] = datetime.utcnow().isoformat()
            await manager.route_message(message)

    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception as e:
        print("❌ WebSocket error:", e)
        await manager.disconnect(websocket)
