
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    contactnumber: str
    role: str = Field(..., pattern="^(admin|subadmin)$")
    password: str = Field(..., min_length=6)
    confirmPassword: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: EmailStr
    contactNumber: str
    role: str

    class Config:
        from_attributes = True


class OTPRequest(BaseModel):
    email: Optional[EmailStr] = None
    contactnumber: Optional[str] = None
class VerifyOTPRequest(BaseModel):
    otp: str
    otpToken: str
class ResetPasswordRequest(BaseModel):
    newPassword: str
    otp: str
    otpToken: str
class Doctor(BaseModel):
    name: str
    specialty: str
    timing: str
    status: str = Field(default="present")
    phone: Optional[str] = None
    experience: Optional[str] = None


class DoctorUpdateStatus(BaseModel):
    status: str

class Appointment(BaseModel):
    id: Optional[str] = None   
    type: str = Field(..., pattern="^(human|AI)$")  
    name: str
    age: int
    address: str
    appointment_time: datetime
    disease: str
    doctor_id: str
    
    
class Patient(BaseModel):
    id: Optional[str] = None
    name: str
    age: int
    phone: int       # ✅ string ki jagah integer
    issue: str
    lastVisit: str   # abhi string hi rakho (date string)
 