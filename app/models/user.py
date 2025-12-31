from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db.base import Base
# Note: Owner removed from here. It belongs in owner.py

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # --- NEW FIELD ---
    phone_number = Column(String, nullable=True) 
    # -----------------

    created_at = Column(DateTime(timezone=True), server_default=func.now())