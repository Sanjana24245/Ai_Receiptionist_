# from fastapi import APIRouter, HTTPException, Depends
# from bson import ObjectId
# from typing import List
# from app.models import SubAdminRegister, SubAdminResponse, ShiftUpdate, ToggleActive
# from app.database import users_collection
# from app.middleware.auth_middleware import authenticate  # <-- your JWT middleware

# router = APIRouter(prefix="/subadmin", tags=["SubAdmin"])

# # Helper function to check admin role
# def admin_required(payload: dict):
#     if payload.get("role") != "admin":
#         raise HTTPException(status_code=403, detail="Admin access required")
#     return payload

# # -------------------------------
# # Get pending SubAdmins
# # -------------------------------
# @router.get("/pending", response_model=List[SubAdminResponse])
# async def get_pending_subadmins(payload: dict = Depends(authenticate)):
#     admin_required(payload)  # check role
#     subs = users_collection.find({"role": "subadmin", "isPending": True})
#     result = []
#     async for sub in subs:
#         sub["id"] = str(sub["_id"])
#         result.append(sub)
#     return result

# # -------------------------------
# # Get approved SubAdmins
# # -------------------------------
# @router.get("/approved", response_model=List[SubAdminResponse])
# async def get_approved_subadmins(payload: dict = Depends(authenticate)):
#     admin_required(payload)
#     subs = users_collection.find({"role": "subadmin", "isPending": False})
#     result = []
#     async for sub in subs:
#         sub["id"] = str(sub["_id"])
#         result.append(sub)
#     return result

# # -------------------------------
# # Approve SubAdmin
# # -------------------------------
# @router.put("/approve/{subadmin_id}", response_model=SubAdminResponse)
# async def approve_subadmin(subadmin_id: str, shift: ShiftUpdate, payload: dict = Depends(authenticate)):
#     admin_required(payload)
#     sub = await users_collection.find_one({"_id": ObjectId(subadmin_id), "role": "subadmin"})
#     if not sub:
#         raise HTTPException(status_code=404, detail="SubAdmin not found")

#     shift_str = f"{shift.start} - {shift.end}"
#     await users_collection.update_one(
#         {"_id": ObjectId(subadmin_id)},
#         {"$set": {"isPending": False, "isActive": True, "shift": shift_str}}
#     )
#     sub["isPending"] = False
#     sub["isActive"] = True
#     sub["shift"] = shift_str
#     sub["id"] = str(sub["_id"])
#     return sub

# # -------------------------------
# # Toggle Active
# # -------------------------------
# @router.put("/toggle-active/{subadmin_id}", response_model=SubAdminResponse)
# async def toggle_active(subadmin_id: str, data: ToggleActive, payload: dict = Depends(authenticate)):
#     admin_required(payload)
#     sub = await users_collection.find_one({"_id": ObjectId(subadmin_id), "role": "subadmin"})
#     if not sub:
#         raise HTTPException(status_code=404, detail="SubAdmin not found")

#     await users_collection.update_one(
#         {"_id": ObjectId(subadmin_id)},
#         {"$set": {"isActive": data.isActive}}
#     )
#     sub["isActive"] = data.isActive
#     sub["id"] = str(sub["_id"])
#     return sub

# # -------------------------------
# # Update Shift
# # -------------------------------
# @router.put("/shift/{subadmin_id}", response_model=SubAdminResponse)
# async def update_shift(subadmin_id: str, shift: ShiftUpdate, payload: dict = Depends(authenticate)):
#     admin_required(payload)
#     sub = await users_collection.find_one({"_id": ObjectId(subadmin_id), "role": "subadmin"})
#     if not sub:
#         raise HTTPException(status_code=404, detail="SubAdmin not found")

#     shift_str = f"{shift.start} - {shift.end}"
#     await users_collection.update_one(
#         {"_id": ObjectId(subadmin_id)},
#         {"$set": {"shift": shift_str}}
#     )
#     sub["shift"] = shift_str
#     sub["id"] = str(sub["_id"])
#     return sub
# @router.post("/register", response_model=SubAdminResponse)
# async def register_subadmin(data: SubAdminRegister):
#     if data.password != data.confirmPassword:
#         raise HTTPException(status_code=400, detail="Passwords do not match")

#     existing = await users_collection.find_one({"email": data.email})
#     if existing:
#         raise HTTPException(status_code=400, detail="Email already exists")

#     new_subadmin = {
#         "username": data.username,
#         "email": data.email,
#         "contactnumber": data.contactnumber,
#         "password": data.password,  # ⚠️ hash in production
#         "role": "subadmin",
#         "isPending": True,
#         "isActive": False,
#         "shift": None
#     }
#     result = await users_collection.insert_one(new_subadmin)
#     new_subadmin["id"] = str(result.inserted_id)

#     return {
#         "msg": "Subadmin registered successfully. Awaiting approval.",
#         "subadmin": new_subadmin
#     }
