
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
 

class SubAdminRegister(BaseModel):
    username: str
    email: EmailStr
    contactnumber: str
    password: str
    confirmPassword: str

class SubAdminResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    contactnumber: str
    isActive: bool
    shift: Optional[str] = None

    class Config:
        from_attributes = True

class ShiftUpdate(BaseModel):
    start: str
    end: str

class ToggleActive(BaseModel):
    isActive: bool

# from typing import Optional, Literal
# from pydantic import BaseModel, EmailStr, Field
# from datetime import datetime


# # ----------------- USERS -----------------
# class UserRegister(BaseModel):
#     firstName: str
#     lastName: str
#     email: EmailStr
#     contactNumber: str
#     role: Literal["admin", "subadmin"]
#     password: str = Field(..., min_length=6)
#     confirmPassword: str = Field(..., min_length=6)


# class SubAdminRegister(UserRegister):
#     role: Literal["subadmin"] = "subadmin"


# class UserLogin(BaseModel):
#     email: EmailStr
#     password: str


# class UserResponse(BaseModel):
#     id: str
#     firstName: str
#     lastName: str
#     email: EmailStr
#     contactNumber: str
#     role: str

#     class Config:
#         from_attributes = True


# class SubAdminResponse(BaseModel):
#     id: str
#     firstName: str
#     lastName: str
#     email: EmailStr
#     contactNumber: str
#     isActive: bool
#     shift: Optional[str] = None

#     class Config:
#         from_attributes = True


# # ----------------- OTP -----------------
# class OTPRequest(BaseModel):
#     email: Optional[EmailStr] = None
#     contactNumber: Optional[str] = None


# class VerifyOTPRequest(BaseModel):
#     otp: str
#     otpToken: str


# class ResetPasswordRequest(BaseModel):
#     newPassword: str = Field(..., min_length=6)
#     otp: str
#     otpToken: str


# # ----------------- DOCTORS -----------------
# class Doctor(BaseModel):
#     name: str
#     specialty: str
#     timing: str
#     status: Literal["present", "absent"] = "present"
#     phone: Optional[str] = None
#     experience: Optional[str] = None


# class DoctorUpdateStatus(BaseModel):
#     status: Literal["present", "absent"]


# # ----------------- APPOINTMENTS -----------------
# class Appointment(BaseModel):
#     id: Optional[str] = None
#     type: Literal["human", "AI"]
#     name: str
#     age: int
#     address: str
#     appointment_time: datetime
#     disease: str
#     doctor_id: str


# # ----------------- PATIENTS -----------------
# class Patient(BaseModel):
#     id: Optional[str] = None
#     name: str
#     age: int
#     phone: str  # Using string for phone numbers
#     issue: str
#     lastVisit: Optional[datetime] = None  # Can store datetime


# # ----------------- SHIFT -----------------
# class ShiftUpdate(BaseModel):
#     start: datetime
#     end: datetime


# class ToggleActive(BaseModel):
#     isActive: bool
