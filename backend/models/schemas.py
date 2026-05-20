from pydantic import BaseModel, EmailStr, Field


class MobileRequest(BaseModel):
    mobile: str = Field(..., min_length=10, max_length=10)


class VerifyOtpRequest(BaseModel):
    mobile: str = Field(..., min_length=10, max_length=10)
    otp: str = Field(..., min_length=4, max_length=6)
    action: str


class ProfileRequest(BaseModel):
    first_name: str
    last_name: str
    dob: str
    email: EmailStr
    password: str = Field(..., min_length=6)
    mobile: str = Field(..., min_length=10, max_length=10)


class EmailLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)