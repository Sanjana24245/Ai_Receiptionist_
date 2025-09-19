from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from app.routes import auth
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from app.routes import doctor
from app.routes import appointments,patient, subadmin,chat 
from typing import Dict, List
from app.manager import ConnectionManager
app = FastAPI()


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



# Manager for active connections
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, role: str = Query(...), client_id: str = Query(None)):
    """
    Connect as:
    - user: role=user&client_id=<userId>
    - receptionist: role=receptionist&client_id=<receptionistId(optional)>
    """
    try:
        if role == "user":
            if not client_id:
                await websocket.close(code=4001)
                return
            await manager.connect_user(client_id, websocket)
        elif role == "receptionist":
            await manager.connect_receptionist(websocket)
        else:
            # unknown role
            await websocket.close(code=4000)
            return

        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
            except:
                continue
            # attach timestamp if missing
            if "timestamp" not in message:
                message["timestamp"] = datetime.utcnow().isoformat()
            # Basic routing
            await manager.route_message(message)

    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception as e:
        # On any other exception, ensure cleanup
        await manager.disconnect(websocket)
