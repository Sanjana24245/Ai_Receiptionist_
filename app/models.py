
from typing import Optional,List
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from bson import ObjectId
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    contactnumber: str
    role: Optional[str] = None
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
    description: Optional[str] = None   # <-- add this
    timing: str
    status: str = Field(default="present")
    phone: Optional[str] = None
    experience: Optional[str] = None
    embedding: Optional[List[float]] = None  # <-- store embedding here


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
    patient_id: Optional[str] = None  
    receptionist_id: Optional[str] = None
    status: str = Field(default="booked")
class Patient(BaseModel):
    id: Optional[str] = None
    name: str
    age: int
    phone: int       
    issue: str
    lastVisit: str
    embedding: Optional[List[float]] = None  
 

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
    is_online: bool = False      
    active_chats: Optional[int] = 0
    max_chats: int = 5  

    class Config:
        from_attributes = True

class ShiftUpdate(BaseModel):
    start: str
    end: str

class ToggleActive(BaseModel):
    isActive: bool
class Message(BaseModel):
    sender_id: str
    sender_role: str   
    text: Optional[str] = None
    file_url: Optional[str] = None    
    type: str = Field(default="text", pattern="^(text|file|system)$")
    timestamp: datetime = datetime.utcnow()


class Chat(BaseModel):
    
    user_id: str
    subadmin_id: Optional[str] = None 
    mode: str = Field(default="AI", pattern="^(AI|human)$")
    messages: List[Message] = []
    created_at: datetime = datetime.utcnow()


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class CallBase(BaseModel):
    user_id: str
    type: str = Field(..., pattern="^(ai|manual)$")
    status: str = Field(default="initiated") 
    duration: Optional[int] = None 
    subadmin_id: Optional[str] = None  

class CallCreate(CallBase):
    pass

class CallResponse(CallBase):
    id: str = Field(alias="_id")
    created_at: datetime
    ai_transcript: Optional[str] = None
    manual_notes: Optional[str] = None
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

class AICallMessage(BaseModel):
    role: str 
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AICallSession(BaseModel):
    call_id: str
    messages: List[AICallMessage] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)