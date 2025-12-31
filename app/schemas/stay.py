from typing import List, Optional
from pydantic import BaseModel

# Shared Properties
class StayBase(BaseModel):
    name: str
    description: Optional[str] = None
    location: str
    price_per_night: int
    facilities: Optional[List[str]] = []
    image_url: Optional[str] = None
    images: Optional[List[str]] = []

# Properties to receive on creation
class StayCreate(StayBase):
    pass

# Properties to receive on update
class StayUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    price_per_night: Optional[int] = None
    facilities: Optional[List[str]] = None
    image_url: Optional[str] = None
    images: Optional[List[str]] = None

# Nested Schema to show Owner Name/Phone safely
class OwnerSimple(BaseModel):
    name: str
    phone_number: Optional[str] = None

    class Config:
        from_attributes = True # <--- Updated from orm_mode

# Properties to return to client
class StayResponse(StayBase):
    id: int
    owner_id: int
    is_active: bool
    owner: Optional[OwnerSimple] = None

    class Config:
        from_attributes = True # <--- Updated from orm_mode