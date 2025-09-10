import random
from fastapi import APIRouter, HTTPException, Depends, Query
from passlib.context import CryptContext
from bson import ObjectId
from app.database import users_collection
from app.models import UserRegister, UserLogin, OTPRequest, VerifyOTPRequest
from app.utils.jwt_handler import create_access_token, verify_token
from app.utils.email_utils import send_otp
from app.middleware.auth_middleware import authenticate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/auth", tags=["Auth"])

# Register
@router.post("/register")
async def register(user: UserRegister):
    if user.password != user.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing = await users_collection.find_one(
        {"$or": [{"email": user.email}, {"username": user.username}]}
    )
    if existing:
        raise HTTPException(status_code=400, detail="Username or Email already exists")

    hashed_pw = pwd_context.hash(user.password)
    new_user = {
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "contactnumber": user.contactnumber,
        "password": hashed_pw,
    }
    await users_collection.insert_one(new_user)
    return {"msg": "User registered successfully. You can now login."}

# Login
@router.post("/login")
async def login(data: UserLogin):
    user = await users_collection.find_one({"username": data.username})
    if not user or not pwd_context.verify(data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    token = create_access_token({"id": str(user["_id"])})
    return {
        "token": token,
        "user": {"id": str(user["_id"]), "username": user["username"], "email": user["email"]},
    }

# Send OTP
# app/routes/auth.py
@router.post("/send-otp")
async def send_otp_route(data: OTPRequest):
    existing = await users_collection.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    otp = str(random.randint(100000, 999999))
    await send_otp(data.email, otp)

    # Use JWT token to store OTP temporarily (10 minutes)
    otp_token = create_access_token({"email": data.email, "otp": otp}, expires_delta=10)
    return {"msg": "OTP sent to your email. Please verify.", "otpToken": otp_token}

@router.post("/verify-otp")
async def verify_otp_route(data: VerifyOTPRequest):
    # Decode the OTP token sent from frontend
    decoded = verify_token(data.otpToken)
    if not decoded:
        raise HTTPException(status_code=400, detail="OTP token expired or invalid")

    # Compare OTP from user with OTP in token
    if decoded.get("otp") != data.otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP")

    return {"msg": "OTP verified successfully"}

# Search Users
@router.get("/search-users")
async def search_users(q: str = Query(...)):
    if not q.strip():
        raise HTTPException(status_code=400, detail="Search query required")

    users = users_collection.find({"username": {"$regex": q, "$options": "i"}})
    result = []
    async for user in users:
        result.append({"username": user["username"]})
    return result

# Profile
@router.get("/profile")
async def profile(user_data=Depends(authenticate)):
    user = await users_collection.find_one({"_id": ObjectId(user_data["id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.pop("password")
    return {"user": user}
