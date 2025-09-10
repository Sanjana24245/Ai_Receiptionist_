from fastapi import FastAPI
from app.routes import auth
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.include_router(auth.router)
@app.get("/favicon.ico")
async def favicon():
    return FileResponse("app/static/favicon.ico")
@app.get("/")
async def root():
    return {"msg": "FastAPI Auth System Running"}
