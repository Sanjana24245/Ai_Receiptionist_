from fastapi import FastAPI
from app.routes import auth
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from app.routes import doctor
from app.routes import appointments,patient, subadmin,chat 

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

@app.get("/favicon.ico")
async def favicon():
    return FileResponse("app/static/favicon.ico")
@app.get("/")
async def root():
    return {"msg": "FastAPI Auth System Running"}
