from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from typing import List
from passlib.hash import bcrypt
from app.models import SubAdminRegister, SubAdminResponse, ShiftUpdate, ToggleActive
from app.database import users_collection
from app.middleware.auth_middleware import authenticate  # JWT middleware

router = APIRouter(prefix="/subadmin", tags=["SubAdmin"])

# -------------------------------
# Helper function - Admin Access
# -------------------------------
def admin_required(payload: dict):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return payload


# -------------------------------
# Get Pending SubAdmins
# -------------------------------
@router.get("/pending", response_model=List[SubAdminResponse])
async def get_pending_subadmins(payload: dict = Depends(authenticate)):
    admin_required(payload)
    subs_cursor = users_collection.find({"role": "subadmin", "isPending": True})
    result = []
    async for sub in subs_cursor:
        sub["id"] = str(sub["_id"])
        result.append(sub)
    return result


# -------------------------------
# Get Approved SubAdmins
# -------------------------------
@router.get("/approved", response_model=List[SubAdminResponse])
async def get_approved_subadmins(payload: dict = Depends(authenticate)):
    admin_required(payload)
    subs_cursor = users_collection.find({"role": "subadmin", "isPending": False})
    result = []
    async for sub in subs_cursor:
        sub["id"] = str(sub["_id"])
        result.append(sub)
    return result


# -------------------------------
# Approve SubAdmin
# -------------------------------
@router.put("/approve/{subadmin_id}", response_model=SubAdminResponse)
async def approve_subadmin(subadmin_id: str, shift: ShiftUpdate, payload: dict = Depends(authenticate)):
    admin_required(payload)
    sub = await users_collection.find_one({"_id": ObjectId(subadmin_id), "role": "subadmin"})
    if not sub:
        raise HTTPException(status_code=404, detail="SubAdmin not found")

    shift_str = f"{shift.start} - {shift.end}"
    await users_collection.update_one(
        {"_id": ObjectId(subadmin_id)},
        {"$set": {"isPending": False, "isActive": True, "shift": shift_str}}
    )
    sub["isPending"] = False
    sub["isActive"] = True
    sub["shift"] = shift_str
    sub["id"] = str(sub["_id"])
    return sub


# -------------------------------
# Toggle Active Status
# -------------------------------
@router.put("/toggle-active/{subadmin_id}", response_model=SubAdminResponse)
async def toggle_active(subadmin_id: str, data: ToggleActive, payload: dict = Depends(authenticate)):
    admin_required(payload)
    sub = await users_collection.find_one({"_id": ObjectId(subadmin_id), "role": "subadmin"})
    if not sub:
        raise HTTPException(status_code=404, detail="SubAdmin not found")

    await users_collection.update_one(
        {"_id": ObjectId(subadmin_id)},
        {"$set": {"isActive": data.isActive}}
    )
    sub["isActive"] = data.isActive
    sub["id"] = str(sub["_id"])
    return sub


# -------------------------------
# Update Shift
# -------------------------------
@router.put("/shift/{subadmin_id}", response_model=SubAdminResponse)
async def update_shift(subadmin_id: str, shift: ShiftUpdate, payload: dict = Depends(authenticate)):
    admin_required(payload)
    sub = await users_collection.find_one({"_id": ObjectId(subadmin_id), "role": "subadmin"})
    if not sub:
        raise HTTPException(status_code=404, detail="SubAdmin not found")

    shift_str = f"{shift.start} - {shift.end}"
    await users_collection.update_one(
        {"_id": ObjectId(subadmin_id)},
        {"$set": {"shift": shift_str}}
    )
    sub["shift"] = shift_str
    sub["id"] = str(sub["_id"])
    return sub


# -------------------------------
# Register New SubAdmin
# -------------------------------
@router.post("/register")
async def register_subadmin(data: SubAdminRegister):
    if data.password != data.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing = await users_collection.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = bcrypt.hash(data.password)

    new_subadmin = {
        "username": data.username,
        "email": data.email,
        "contactnumber": data.contactnumber,
        "password": hashed_password,  # ✅ Hashed for security
        "role": "subadmin",
        "isPending": True,
        "isActive": False,
        "shift": None
    }
    result = await users_collection.insert_one(new_subadmin)
    new_subadmin["id"] = str(result.inserted_id)

    return {
        "message": "SubAdmin registered successfully. Awaiting approval.",
        "subadmin": new_subadmin
    }
# Get all chats assigned to a subadmin
@router.get("/{subadmin_id}/chats")
async def get_subadmin_chats(subadmin_id: str, payload: dict = Depends(authenticate)):
    # Ensure only admin or the same subadmin can fetch
    if payload["role"] not in ["admin", "subadmin"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    if payload["role"] == "subadmin" and payload["id"] != subadmin_id:
        raise HTTPException(status_code=403, detail="Cannot access other subadmin's chats")

    chats_cursor = chats_collection.find({"subadmin_id": subadmin_id})
    result = []
    async for chat in chats_cursor:
        chat["id"] = str(chat["_id"])
        result.append(chat)
    return {"chats": result}
