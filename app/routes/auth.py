import random
from fastapi import APIRouter, HTTPException, Depends, Query
from passlib.context import CryptContext
from bson import ObjectId
from app.database import users_collection
from app.models import UserRegister, UserLogin, OTPRequest, VerifyOTPRequest, ResetPasswordRequest
from app.utils.jwt_handler import create_access_token, verify_token
from app.utils.email_utils import send_otp
from app.middleware.auth_middleware import authenticate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/auth", tags=["Auth"])

otp_store = {}

# Register
# @router.post("/register")
# async def register(user: UserRegister):
#     if user.password != user.confirmPassword:
#         raise HTTPException(status_code=400, detail="Passwords do not match")

#     existing = await users_collection.find_one(
#         {"$or": [{"email": user.email}, {"username": user.username}]}
#     )
#     if existing:
#         raise HTTPException(status_code=400, detail="Username or Email already exists")

#     hashed_pw = pwd_context.hash(user.password)
#     new_user = {
#         "username": user.username,
#         "email": user.email,
#         "role": user.role,
#         "contactnumber": user.contactnumber,
#         "password": hashed_pw,
#     }
#     await users_collection.insert_one(new_user)
#     return {"msg": "User registered successfully. You can now login."}
@router.post("/register")
async def register(user: UserRegister):
    if user.password != user.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Check for existing username/email
    existing = await users_collection.find_one(
        {"$or": [{"email": user.email}, {"username": user.username}]}
    )
    if existing:
        raise HTTPException(status_code=400, detail="Username or Email already exists")

    # Assign role
    if user.role not in ["admin", "subadmin"]:
        user_role = "user"  # default for normal users
    else:
        user_role = user.role  # admin/subadmin choice

    hashed_pw = pwd_context.hash(user.password)
    is_pending = False
    is_active = True
    if user.role == "subadmin":
        is_pending = True
        is_active = False
    new_user = {
        "username": user.username,
        "email": user.email,
        "contactnumber": user.contactnumber,
        "role": user_role,
        "password": hashed_pw,
        "isPending": is_pending,
        "isActive": is_active,
    }

    await users_collection.insert_one(new_user)
    return {
        "msg": "Subadmin registered successfully. Awaiting admin approval."
        if user.role == "subadmin"
        else "User registered successfully. You can now login."
    }
# Login
# Login Route
# app/routes/auth.py

# @router.post("/login")
# async def login(data: UserLogin):
#     # Find user by email only
#     user = await users_collection.find_one({"email": data.email})

#     if not user:
#      raise HTTPException(status_code=404, detail="User not found")

#     if not pwd_context.verify(data.password, user["password"]):
#      raise HTTPException(status_code=400, detail="Password is wrong")

#     # Create JWT token
#     token = create_access_token({"id": str(user["_id"]), "role": user["role"]})

#     return {
#         "msg": "Login successful",
#         "token": token,
#         "user": {
#             "id": str(user["_id"]),
#             "username": user.get("username"),
#             "email": user["email"],
#             "role": user["role"],
#             "contactnumber": user.get("contactnumber")
#         },
#     }

@router.post("/login")
async def login(data: UserLogin):
    # Find user by email only
    user = await users_collection.find_one({"email": data.email})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify password
    if not pwd_context.verify(data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Password is wrong")

    # BLOCK subadmin if still pending
    if user.get("role") == "subadmin":
        if user.get("isPending", True):
            raise HTTPException(status_code=403, detail="SubAdmin not approved by Admin yet")
        if not user.get("isActive", False):
            raise HTTPException(status_code=403, detail="SubAdmin account is not active")

    # Create JWT token
    token = create_access_token({"id": str(user["_id"]), "role": user["role"]})

    return {
        "msg": "Login successful",
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "username": user.get("username"),
            "email": user["email"],
            "role": user["role"],
            "contactnumber": user.get("contactnumber"),
            "isPending": user.get("isPending", False),
            "isActive": user.get("isActive", False),
        },
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




@router.post("/send-contact-otp")
async def send_contact_otp(data: OTPRequest):
    if not data.contactnumber:
        raise HTTPException(status_code=400, detail="Contact number required")

    otp = str(random.randint(100000, 999999))
    token = create_access_token({"otp": otp, "type": "contact"}, expires=300)

    otp_store[data.contactnumber] = otp
    print(f"[DEBUG] Contact OTP sent to {data.contactnumber}: {otp}")  # Replace with SMS gateway later

    return {"msg": "OTP sent to contact", "otpToken": token}

@router.post("/auth/verify-otp")
async def verify_otp(data: VerifyOTPRequest):
    decoded = verify_token(data.otpToken)
    if not decoded:
        raise HTTPException(status_code=400, detail="OTP expired or invalid")
    if decoded.get("otp") != data.otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP")
    return {"msg": "OTP verified successfully"}

# Forgot Password → Send OTP
@router.post("/forgot-password/send-otp")
async def forgot_password_send_otp(data: OTPRequest):
    user = await users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = str(random.randint(100000, 999999))
    await send_otp(data.email, otp)

    otp_token = create_access_token({"email": data.email, "otp": otp}, expires_delta=10)
    return {"msg": "OTP sent to your email", "otpToken": otp_token}


# Forgot Password → Verify OTP
@router.post("/forgot-password/verify-otp")
async def forgot_password_verify_otp(data: VerifyOTPRequest):
    decoded = verify_token(data.otpToken)
    if not decoded:
        raise HTTPException(status_code=400, detail="OTP expired or invalid")

    if decoded.get("otp") != data.otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP")

    return {"msg": "OTP verified successfully", "email": decoded["email"]}


# Forgot Password → Reset Password
@router.post("/forgot-password/reset")
async def forgot_password_reset(data: ResetPasswordRequest):
    decoded = verify_token(data.otpToken)
    if not decoded:
        raise HTTPException(status_code=400, detail="OTP expired or invalid")

    if decoded.get("otp") != data.otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP")

    hashed_pw = pwd_context.hash(data.newPassword)
    result = await users_collection.update_one(
        {"email": decoded["email"]}, {"$set": {"password": hashed_pw}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Password update failed")

    return {"msg": "Password reset successful"}
