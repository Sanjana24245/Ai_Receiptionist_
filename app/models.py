# from pydantic import BaseModel, EmailStr

# class UserRegister(BaseModel):
#     username: str
#     email: EmailStr
#     contactnumber:str
#     role:str
#     password: str
#     confirmPassword: str

# class UserLogin(BaseModel):
#     username: str
#     password: str

# class UserResponse(BaseModel):
#     id: str
#     username: str
#     email: EmailStr

# class OTPRequest(BaseModel):
#     email: EmailStr

# class VerifyOTPRequest(BaseModel):
#     otp: str
#     otpToken: str

from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    contactnumber: str
    role: str = Field(..., pattern="^(admin|subadmin)$")
    password: str = Field(..., min_length=6)
    confirmPassword: str = Field(..., min_length=6)

# ✅ Login request model
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ✅ Response model (for profile, registration response)
class UserResponse(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: EmailStr
    contactNumber: str
    role: str

    class Config:
        from_attributes = True

# ✅ OTP related models
class OTPRequest(BaseModel):
    email: Optional[EmailStr] = None
    contactnumber: Optional[str] = None
class VerifyOTPRequest(BaseModel):
    otp: str
    otpToken: str
