import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models import Patient
from app.database import db
from io import BytesIO

patients_collection = db["patients"]
router = APIRouter(prefix="/patients", tags=["Patients"])


# ✅ Upload Excel File
@router.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_excel(BytesIO(contents))

        # Normalize headers (lowercase + strip spaces)
        df.columns = df.columns.str.strip().str.lower()

        # Required columns
        required_cols = {"name", "age", "phone", "issue", "lastvisit"}
        if not required_cols.issubset(set(df.columns)):
            raise HTTPException(
                status_code=400,
                detail=f"Excel must contain columns: {required_cols}"
            )

        patients = df.to_dict(orient="records")
        validated_patients = []

        for p in patients:
            try:
                # ✅ Phone ko int bana do
                if "phone" in p and pd.notna(p["phone"]):
                    p["phone"] = int(p["phone"])

                # ✅ lastvisit ko YYYY-MM-DD string bana do
                if "lastvisit" in p and pd.notna(p["lastvisit"]):
                    if hasattr(p["lastvisit"], "date"):
                        p["lastVisit"] = str(p.pop("lastvisit").date())
                    else:
                        p["lastVisit"] = str(p.pop("lastvisit"))
                else:
                    p["lastVisit"] = None

                validated_patients.append(Patient(**p).dict())

            except Exception as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid row: {p}, error: {str(e)}"
                )

        # ✅ Insert into MongoDB
        result = await patients_collection.insert_many(validated_patients)

        # Attach inserted IDs
        for p, oid in zip(validated_patients, result.inserted_ids):
            p["_id"] = str(oid)

        return {
            "msg": "Patients uploaded successfully",
            "patients": validated_patients
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Get all patients
@router.get("/list")
async def get_patients():
    patients = []
    async for patient in patients_collection.find():
        patient["_id"] = str(patient["_id"])
        patients.append(patient)
    return {"patients": patients}
