
# from fastapi import APIRouter, HTTPException
# from bson import ObjectId
# from datetime import datetime
# from app.database import doctors_collection, appointments_collection
# from app.models import Appointment

# router = APIRouter(prefix="/appointments", tags=["Appointments"])


# # Helper: Convert Mongo ObjectId to string
# def serialize_doc(doc):
#     doc["_id"] = str(doc["_id"])
#     return doc


# def round_to_nearest_half_hour(dt: datetime) -> datetime:
#     """Force appointment to nearest 30 min slot"""
#     minute = 30 if dt.minute >= 30 else 0
#     return dt.replace(minute=minute, second=0, microsecond=0)


# # ---------------- Routes ----------------

# @router.post("/")
# async def create_appointment(appointment: Appointment):
#     # 1. Validate type
#     if appointment.type not in ["human", "AI"]:
#         raise HTTPException(status_code=400, detail="Invalid appointment type")

#     # 2. Check doctor exists
#     doctor = await doctors_collection.find_one({"_id": ObjectId(appointment.doctor_id)})
#     if not doctor:
#         raise HTTPException(status_code=404, detail="Doctor not found")

#     # 3. If type = human → check doctor availability
#     if appointment.type == "human":
#         if doctor.get("status") == "leave":
#             raise HTTPException(
#                 status_code=400,
#                 detail="Doctor is on leave, cannot book human appointment"
#             )

#     # 4. Round appointment to 30 min slot
#     appt_time = round_to_nearest_half_hour(appointment.appointment_time)

#     # 5. Check slot conflict (for both AI & human)
#     conflict = await appointments_collection.find_one({
#         "doctor_id": appointment.doctor_id,
#         "appointment_time": appt_time
#     })
#     if conflict:
#         raise HTTPException(status_code=400, detail="This time slot is already booked for the doctor")

#     # 6. Save appointment
#     appt_dict = appointment.dict()
#     appt_dict["appointment_time"] = appt_time
#     result = await appointments_collection.insert_one(appt_dict)
#     appt_dict["_id"] = str(result.inserted_id)

#     return {
#         "msg": f"{appointment.type.capitalize()} appointment booked successfully",
#         "appointment": appt_dict
#     }


# @router.get("/")
# async def get_appointments():
#     apps = await appointments_collection.find().to_list(100)
#     return [serialize_doc(app) for app in apps]


# @router.get("/{appt_type}")
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
    if appointment.type not in ["human", "AI"]:
        raise HTTPException(status_code=400, detail="Invalid appointment type")

    doctor = await doctors_collection.find_one({"_id": ObjectId(appointment.doctor_id)})
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    if appointment.type == "human":
        if doctor.get("status") == "leave":
            raise HTTPException(
                status_code=400,
                detail="Doctor is on leave, cannot book human appointment"
            )

    appt_time = round_to_nearest_half_hour(appointment.appointment_time)

    conflict = await appointments_collection.find_one({
        "doctor_id": appointment.doctor_id,
        "appointment_time": appt_time
    })
    if conflict:
        raise HTTPException(status_code=400, detail="This time slot is already booked for the doctor")

    appt_dict = appointment.dict()
    appt_dict["appointment_time"] = appt_time
    appt_dict["status"] = "booked"
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


@router.get("/doctor/{doctor_id}")
async def get_doctor_appointments(doctor_id: str):
    apps = await appointments_collection.find({"doctor_id": doctor_id}).to_list(100)
    return [serialize_doc(app) for app in apps]


@router.get("/patient/{patient_id}")
async def get_patient_appointments(patient_id: str):
    apps = await appointments_collection.find({"patient_id": patient_id}).to_list(100)
    return [serialize_doc(app) for app in apps]


@router.delete("/{appointment_id}")
async def cancel_appointment(appointment_id: str):
    result = await appointments_collection.update_one(
        {"_id": ObjectId(appointment_id)},
        {"$set": {"status": "cancelled"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"msg": "Appointment cancelled successfully"}


@router.put("/{appointment_id}/reschedule")
async def reschedule_appointment(appointment_id: str, new_time: datetime):
    appt_time = round_to_nearest_half_hour(new_time)

    conflict = await appointments_collection.find_one({
        "appointment_time": appt_time
    })
    if conflict:
        raise HTTPException(status_code=400, detail="This time slot is already booked")

    result = await appointments_collection.update_one(
        {"_id": ObjectId(appointment_id)},
        {"$set": {"appointment_time": appt_time, "status": "booked"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found or not modified")

    return {"msg": "Appointment rescheduled successfully"}


@router.get("/upcoming/all")
async def get_upcoming_appointments():
    now = datetime.now()
    apps = await appointments_collection.find({"appointment_time": {"$gte": now}}).to_list(100)
    return [serialize_doc(app) for app in apps]


@router.get("/past/all")
async def get_past_appointments():
    now = datetime.now()
    apps = await appointments_collection.find({"appointment_time": {"$lt": now}}).to_list(100)
    return [serialize_doc(app) for app in apps]
