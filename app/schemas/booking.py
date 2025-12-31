from pydantic import BaseModel, field_validator
from datetime import date
from typing import Optional # <--- Import Optional

# --- NEW CLASS: User Summary ---
class UserSummary(BaseModel):
    name: str
    email: str
    phone_number: Optional[str] = None

class BookingCreate(BaseModel):
    stay_id: int
    check_in: date
    check_out: date
    guests: int

    @field_validator('check_out')
    def check_dates(cls, check_out, info):
        values = info.data
        if 'check_in' in values and check_out <= values['check_in']:
            raise ValueError('Check-out date must be after check-in date')
        return check_out

class BookingAction(BaseModel):
    action: str 

class BookingResponse(BaseModel):
    id: int
    stay_id: int
    user_id: int
    check_in: date
    check_out: date
    guests: int # Ensure this is here
    status: str 
    
    # --- ADD THIS LINE ---
    user: Optional[UserSummary] = None 
    # ---------------------
    
    class Config:
        from_attributes = True