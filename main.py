# from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query

# from app.routes import auth
# from fastapi.staticfiles import StaticFiles
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse
# from app.routes import doctor
# from app.routes import appointments,patient, subadmin,chat 
# from typing import Dict, List
# import json
# from datetime import datetime
# from app.database import db
# from manager import ConnectionManager
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
# app.include_router(auth.router)
# app.include_router(doctor.router)
# app.include_router(appointments.router)
# app.include_router(patient.router)
# app.include_router(subadmin.router)
# app.include_router(chat.router)
# @app.get("/favicon.ico")
# async def favicon():
#     return FileResponse("app/static/favicon.ico")
# @app.get("/")
# async def root():
#     return {"msg": "FastAPI Auth System Running"}


# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket, role: str = Query(...), client_id: str = Query(None)):
#     try:
#         if not client_id:
#             await websocket.close(code=4001)
#             return

#         if role == "user":
#             await manager.connect_user(client_id, websocket)  # already accepts
#         elif role == "subadmin":
#             await manager.connect_subadmin(client_id, websocket)  # already accepts
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
#         print("WebSocket error:", e)
#         await manager.disconnect(websocket)
# from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, Request
# from fastapi.staticfiles import StaticFiles
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse
# from datetime import datetime
# from typing import Dict, List
# import os
# import json
# import requests

# from dotenv import load_dotenv
# from openai import OpenAI

# # Import your routers
# from app.routes import auth, doctor, appointments, patient, subadmin, chat
# from app.database import db
# from manager import ConnectionManager

# # ==============================
# # ✅ Load environment variables
# # ==============================
# load_dotenv()

# app = FastAPI()
# manager = ConnectionManager(db)

# # ==============================
# # ✅ Middleware
# # ==============================
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],   # change to your frontend domain in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ==============================
# # ✅ Static files
# # ==============================
# app.mount("/static", StaticFiles(directory="app/static"), name="static")

# # ==============================
# # ✅ Routers
# # ==============================
# app.include_router(auth.router)
# app.include_router(doctor.router)
# app.include_router(appointments.router)
# app.include_router(patient.router)
# app.include_router(subadmin.router)
# app.include_router(chat.router)

# # ==============================
# # ✅ WhatsApp + OpenAI credentials
# # ==============================
# WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
# PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
# VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# # ✅ OpenAI client
# client = OpenAI(api_key=OPENAI_API_KEY)

# # ==============================
# # ✅ Basic routes
# # ==============================
# @app.get("/favicon.ico")
# async def favicon():
#     return FileResponse("app/static/favicon.ico")

# @app.get("/")
# async def root():
#     return {"msg": "FastAPI Auth System Running with WhatsApp + AI"}

# # ==============================
# # ✅ WhatsApp Webhook Endpoints
# # ==============================
# @app.get("/webhook")
# async def verify_token(request: Request):
#     """
#     Meta webhook verification
#     """
#     params = request.query_params
#     if params.get("hub.verify_token") == VERIFY_TOKEN:
#         return int(params.get("hub.challenge"))
#     return {"error": "Invalid verification token"}
# # ==============================
# # ✅ WhatsApp Webhook Endpoints (UPDATED)
# # ==============================
# @app.post("/webhook")
# async def receive_message(request: Request):
#     """
#     Receive messages from WhatsApp and reply using OpenAI
#     """
#     data = await request.json()
#     # Print the WHOLE payload for debugging purposes
#     print(f"📥 Incoming Webhook Data: {json.dumps(data, indent=2)}")

#     try:
#         # Check if the notification is a message notification
#         changes = data["entry"][0]["changes"][0]
#         if changes["field"] != "messages":
#             # Ignore status updates or other non-message events
#             return {"status": "ok", "message": "Ignored non-message event"}

#         # Extract the relevant message data
#         value = changes["value"]
        
#         # Check for error in message processing (e.g., if message is empty)
#         if "messages" not in value or not value["messages"]:
#             print("⚠️ Ignoring empty message array or status update.")
#             return {"status": "ok", "message": "Ignored status update"}
        
#         message = value["messages"][0]
#         from_number = message["from"]
        
#         # Check message type (text, image, etc.)
#         message_type = message["type"]
        
#         text = ""
#         if message_type == "text":
#             # If it's a text message, extract the body
#             text = message["text"]["body"]
#         else:
#             # Handle non-text messages (e.g., reply with a template or a default message)
#             text = f"I received your {message_type}. I can only process text messages right now. Please send a text message."
#             # Optionally, you can skip AI processing for non-text messages
#             # send_whatsapp_message(from_number, "I can only process text messages right now.")
#             # return {"status": "ok"}


#         print(f"📩 WhatsApp message from {from_number} (Type: {message_type}): {text}")

#         # ✅ Get AI reply
#         # Only call OpenAI if the incoming message was text
#         if message_type == "text":
#             ai_response = client.chat.completions.create(
#                 model="gpt-4o-mini",
#                 messages=[
#                     {"role": "system", "content": "You are a helpful AI receptionist for a doctor's clinic. Reply concisely."},
#                     {"role": "user", "content": text}
#                 ]
#             )
#             reply = ai_response.choices[0].message.content
#         else:
#             # Use the default reply set above for non-text messages
#             reply = text

#         # ✅ Send AI reply back to WhatsApp
#         send_whatsapp_message(from_number, reply)

#     except IndexError:
#         print("❌ Webhook error: Data structure might be different (e.g., status or read receipt). Ignoring.")
#         # Meta sends multiple non-message events (like status, read, etc.) which can cause IndexError.
#     except Exception as e:
#         print("❌ Webhook General error:", e)
#         # If the failure happens inside send_whatsapp_message, the error might be here.
    
#     return {"status": "ok"}
# # @app.post("/webhook")
# # async def receive_message(request: Request):
# #     """
# #     Receive messages from WhatsApp and reply using OpenAI
# #     """
# #     data = await request.json()
# #     try:
# #         message = data["entry"][0]["changes"][0]["value"]["messages"][0]
# #         from_number = message["from"]
# #         text = message.get("text", {}).get("body", "")

# #         print(f"📩 WhatsApp message from {from_number}: {text}")

# #         # ✅ Get AI reply
# #         ai_response = client.chat.completions.create(
# #             model="gpt-4o-mini",
# #             messages=[
# #                 {"role": "system", "content": "You are a helpful AI receptionist."},
# #                 {"role": "user", "content": text}
# #             ]
# #         )
# #         reply = ai_response.choices[0].message.content

# #         # ✅ Send AI reply back to WhatsApp
# #         send_whatsapp_message(from_number, reply)

# #     except Exception as e:
# #         print("❌ Webhook error:", e)
# #     return {"status": "ok"}

# def send_whatsapp_message(to, message):
#     """
#     Send a text message via WhatsApp API
#     """
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
# # ✅ WebSocket Endpoint
# # ==============================
# @app.websocket("/ws")
# async def websocket_endpoint(
#     websocket: WebSocket,
#     role: str = Query(...),
#     client_id: str = Query(None)
# ):
#     try:
#         if not client_id:
#             await websocket.close(code=4001)  # missing client_id
#             return

#         # Register connection by role
#         if role == "user":
#             await manager.connect_user(client_id, websocket)
#         elif role == "subadmin":
#             await manager.connect_subadmin(client_id, websocket)
#         else:
#             await websocket.close(code=4000)  # invalid role
#             return

#         # Listen for messages
#         while True:
#             data = await websocket.receive_text()
#             message = json.loads(data)

#             # Ensure timestamp exists
#             if "timestamp" not in message:
#                 message["timestamp"] = datetime.utcnow().isoformat()

#             await manager.route_message(message)

#     except WebSocketDisconnect:
#         await manager.disconnect(websocket)
#     except Exception as e:
#         print("❌ WebSocket error:", e)
#         await manager.disconnect(websocket)
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from datetime import datetime
from typing import Dict, List
import os
import json
import requests

from dotenv import load_dotenv
# We keep this import, but the client will not be used in the webhook post function
from openai import OpenAI 

# Import your routers
from app.routes import auth, doctor, appointments, patient, subadmin, chat
from app.database import db
from manager import ConnectionManager

# ==============================
# ✅ Load environment variables
# ==============================
load_dotenv()

app = FastAPI()
manager = ConnectionManager(db)

# ==============================
# ✅ Middleware
# ==============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    # change to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# ✅ Static files
# ==============================
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# ==============================
# ✅ Routers
# ==============================
app.include_router(auth.router)
app.include_router(doctor.router)
app.include_router(appointments.router)
app.include_router(patient.router)
app.include_router(subadmin.router)
app.include_router(chat.router)

# ==============================
# ✅ WhatsApp + OpenAI credentials
# ==============================
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ✅ OpenAI client (Kept for other uses, but ignored in webhook)
client = OpenAI(api_key=OPENAI_API_KEY)

# ==============================
# ✅ Basic routes
# ==============================
@app.get("/favicon.ico")
async def favicon():
    return FileResponse("app/static/favicon.ico")

@app.get("/")
async def root():
    return {"msg": "FastAPI Auth System Running with WhatsApp + AI"}

# ==============================
# ✅ WhatsApp Webhook Endpoints
# ==============================
@app.get("/webhook")
async def verify_token(request: Request):
    """
    Meta webhook verification
    """
    params = request.query_params
    if params.get("hub.verify_token") == VERIFY_TOKEN:
        return int(params.get("hub.challenge"))
    return {"error": "Invalid verification token"}

# ==================================================
# ✅ WhatsApp Webhook Endpoints (UPDATED FOR TESTING)
# ==================================================
@app.post("/webhook")
async def receive_message(request: Request):
    """
    Receive messages from WhatsApp and reply using a hardcoded message 
    to bypass the OpenAI quota error.
    """
    data = await request.json()
    # Print the WHOLE payload for debugging purposes
    print(f"📥 Incoming Webhook Data: {json.dumps(data, indent=2)}")

    try:
        changes = data["entry"][0]["changes"][0]
        if changes["field"] != "messages":
            return {"status": "ok", "message": "Ignored non-message event"}

        value = changes["value"]
        
        if "messages" not in value or not value["messages"]:
            print("⚠️ Ignoring empty message array or status update.")
            return {"status": "ok", "message": "Ignored status update"}
        
        message = value["messages"][0]
        from_number = message["from"]
        message_type = message["type"]
        
        text = ""
        if message_type == "text":
            text = message["text"]["body"]
        else:
            text = f"I received your {message_type}. I can only process text messages right now."
        
        print(f"📩 WhatsApp message from {from_number} (Type: {message_type}): {text}")

        # =======================================================
        # ⚠️ TESTING REPLY LOGIC: NO OPENAI CALL (FIXES ERROR 429)
        # =======================================================
        if "hi" in text.lower() or "hello" in text.lower():
            reply = "Hello! Your webhook and reply system are fully operational. Please fix your OpenAI billing to enable my AI brain. 🤖"
        elif "test" in text.lower():
            reply = "Test successful! This confirms your entire setup (Meta, Ngrok, FastAPI) is working perfectly."
        else:
            reply = f"I received: '{text}'. Reply is being sent via working WhatsApp API. Fix OpenAI quota to get dynamic answers!"
        
        # ✅ Send reply back to WhatsApp
        send_whatsapp_message(from_number, reply)

    except IndexError:
        print("❌ Webhook error: Data structure might be different (e.g., status or read receipt). Ignoring.")
    except Exception as e:
        print("❌ Webhook General error:", e)
    
    return {"status": "ok"}


def send_whatsapp_message(to, message):
    """
    Send a text message via WhatsApp API
    """
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
# ✅ WebSocket Endpoint
# ==============================
@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    role: str = Query(...),
    client_id: str = Query(None)
):
    try:
        if not client_id:
            await websocket.close(code=4001)  # missing client_id
            return

        # Register connection by role
        if role == "user":
            await manager.connect_user(client_id, websocket)
        elif role == "subadmin":
            await manager.connect_subadmin(client_id, websocket)
        else:
            await websocket.close(code=4000)  # invalid role
            return

        # Listen for messages
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            # Ensure timestamp exists
            if "timestamp" not in message:
                message["timestamp"] = datetime.utcnow().isoformat()

            await manager.route_message(message)

    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception as e:
        print("❌ WebSocket error:", e)
        await manager.disconnect(websocket)
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
#         print("WebSocket error:", e)
#         await manager.disconnect(websocket)


# # @app.websocket("/ws")
# # async def websocket_endpoint(websocket: WebSocket, role: str = Query(...), client_id: str = Query(None)):
#     try:
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
#         print("WebSocket error:", e)
#         await manager.disconnect(websocket)