# from fastapi import APIRouter, HTTPException
# from bson import ObjectId
# from app.database import doctors_collection, appointments_collection
# from app.models import Appointment

# router = APIRouter()

# # Helper: Convert Mongo ObjectId to string
# def serialize_doc(doc):
#     doc["_id"] = str(doc["_id"])
#     return doc

# # ---------------- Routes ----------------

# @router.get("/doctors")
# async def get_doctors():
#     doctors = await doctors_collection.find().to_list(100)
#     return [serialize_doc(doc) for doc in doctors]

# @router.post("/appointments")
# async def book_appointment(appointment: Appointment):
#     # Check doctor exists
#     doctor = await doctors_collection.find_one({"_id": ObjectId(appointment.doctor_id)})
#     if not doctor:
#         raise HTTPException(status_code=404, detail="Doctor not found")
    
#     app_dict = appointment.dict()
    
#     # Optional: you can handle AI/human differently here
#     if appointment.type == "AI":
#         # AI-specific logic
#         pass
#     elif appointment.type == "human":
#         # Human-specific logic
#         pass

#     result = await appointments_collection.insert_one(app_dict)
#     app_dict["_id"] = str(result.inserted_id)
#     return app_dict


# @router.get("/appointments")
# async def get_appointments():
#     apps = await appointments_collection.find().to_list(100)
#     return [serialize_doc(app) for app in apps]

# @router.get("/appointments/{appt_type}")
# async def get_appointments_by_type(appt_type: str):
#     if appt_type not in ["human", "AI"]:
#         raise HTTPException(status_code=400, detail="Invalid type")
    
#     apps = await appointments_collection.find({"type": appt_type}).to_list(100)
#     return [serialize_doc(app) for app in apps]
from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime
from app.database import doctors_collection, appointments_collection
from app.models import Appointment

router = APIRouter(prefix="/appointments", tags=["Appointments"])


# Helper: Convert Mongo ObjectId to string
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc


def round_to_nearest_half_hour(dt: datetime) -> datetime:
    """Force appointment to nearest 30 min slot"""
    minute = 30 if dt.minute >= 30 else 0
    return dt.replace(minute=minute, second=0, microsecond=0)


# ---------------- Routes ----------------

@router.post("/")
async def create_appointment(appointment: Appointment):
    # 1. Validate type
    if appointment.type not in ["human", "AI"]:
        raise HTTPException(status_code=400, detail="Invalid appointment type")

    # 2. Check doctor exists
    doctor = await doctors_collection.find_one({"_id": ObjectId(appointment.doctor_id)})
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    # 3. If type = human → check doctor availability
    if appointment.type == "human":
        if doctor.get("status") == "leave":
            raise HTTPException(
                status_code=400,
                detail="Doctor is on leave, cannot book human appointment"
            )

    # 4. Round appointment to 30 min slot
    appt_time = round_to_nearest_half_hour(appointment.appointment_time)

    # 5. Check slot conflict (for both AI & human)
    conflict = await appointments_collection.find_one({
        "doctor_id": appointment.doctor_id,
        "appointment_time": appt_time
    })
    if conflict:
        raise HTTPException(status_code=400, detail="This time slot is already booked for the doctor")

    # 6. Save appointment
    appt_dict = appointment.dict()
    appt_dict["appointment_time"] = appt_time
    result = await appointments_collection.insert_one(appt_dict)
    appt_dict["_id"] = str(result.inserted_id)

    return {
        "msg": f"{appointment.type.capitalize()} appointment booked successfully",
        "appointment": appt_dict
    }


@router.get("/")
async def get_appointments():
    apps = await appointments_collection.find().to_list(100)
    return [serialize_doc(app) for app in apps]


@router.get("/{appt_type}")
async def get_appointments_by_type(appt_type: str):
    if appt_type not in ["human", "AI"]:
        raise HTTPException(status_code=400, detail="Invalid type")

    apps = await appointments_collection.find({"type": appt_type}).to_list(100)
    return [serialize_doc(app) for app in apps]
