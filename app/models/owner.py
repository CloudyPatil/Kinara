from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class Owner(Base):
    __tablename__ = "owners"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # --- NEW FIELD ---
    phone_number = Column(String, nullable=True)
    # -----------------

    is_verified = Column(Boolean, default=False) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to stays (optional but good practice)
    stays = relationship("app.models.stay.Stay", back_populates="owner")