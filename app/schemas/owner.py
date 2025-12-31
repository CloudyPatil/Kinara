class OwnerCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone_number: str # <--- Add this