from pydantic import BaseModel, EmailStr
from typing import Optional

# What the user sends during Registration
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone_number: Optional[str] = None # <--- Add this line

# What the user sends during Login
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# What the API sends back (The Token)
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str