from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query

from app.routes import auth
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from app.routes import doctor
from app.routes import appointments,patient, subadmin,chat 
from typing import Dict, List
import json
from datetime import datetime
from app.database import db
from manager import ConnectionManager
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
app.include_router(auth.router)
app.include_router(doctor.router)
app.include_router(appointments.router)
app.include_router(patient.router)
app.include_router(subadmin.router)
app.include_router(chat.router)
@app.get("/favicon.ico")
async def favicon():
    return FileResponse("app/static/favicon.ico")
@app.get("/")
async def root():
    return {"msg": "FastAPI Auth System Running"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, role: str = Query(...), client_id: str = Query(None)):
    try:
        if not client_id:
            await websocket.close(code=4001)
            return

        if role == "user":
            await manager.connect_user(client_id, websocket)  # already accepts
        elif role == "subadmin":
            await manager.connect_subadmin(client_id, websocket)  # already accepts
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
        print("WebSocket error:", e)
        await manager.disconnect(websocket)

# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket, role: str = Query(...), client_id: str = Query(None)):
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
        print("WebSocket error:", e)
        await manager.disconnect(websocket)


# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket, role: str = Query(...), client_id: str = Query(None)):
    try:
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
        print("WebSocket error:", e)
        await manager.disconnect(websocket)