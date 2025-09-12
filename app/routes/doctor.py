from fastapi import APIRouter, HTTPException
from app.models import Doctor, DoctorUpdateStatus

from app.database import doctors_collection
from bson import ObjectId

router = APIRouter(prefix="/doctors", tags=["Doctors"])

# Create doctor
@router.post("/")
async def add_doctor(doctor: Doctor):
    doctor_dict = doctor.dict()
    result = await doctors_collection.insert_one(doctor_dict)
    doctor_dict["_id"] = str(result.inserted_id)
    return {"msg": "Doctor added successfully", "doctor": doctor_dict}

# Get all doctors
@router.get("/")
async def get_doctors():
    doctors = []
    async for doc in doctors_collection.find():
        doc["_id"] = str(doc["_id"])
        doctors.append(doc)
    return doctors

# Update doctor
@router.put("/{doctor_id}")
async def update_doctor(doctor_id: str, doctor: Doctor):
    result = await doctors_collection.update_one(
        {"_id": ObjectId(doctor_id)}, {"$set": doctor.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Doctor not found")
    updated_doc = await doctors_collection.find_one({"_id": ObjectId(doctor_id)})
    updated_doc["_id"] = str(updated_doc["_id"])
    return {"msg": "Doctor updated", "doctor": updated_doc}

# Delete doctor
@router.delete("/{doctor_id}")
async def delete_doctor(doctor_id: str):
    result = await doctors_collection.delete_one({"_id": ObjectId(doctor_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return {"msg": "Doctor deleted"}

@router.patch("/{doctor_id}")
async def update_doctor_status(doctor_id: str, update: DoctorUpdateStatus):
    result = await doctors_collection.update_one(
        {"_id": ObjectId(doctor_id)},
        {"$set": {"status": update.status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    updated = await doctors_collection.find_one({"_id": ObjectId(doctor_id)})
    if updated:
        updated["_id"] = str(updated["_id"])  # <-- convert ObjectId to string
    return {"msg": "Status updated successfully", "doctor": updated}
