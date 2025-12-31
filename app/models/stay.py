from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class Stay(Base):
    __tablename__ = "stays"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("owners.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    location = Column(String, nullable=False)
    price_per_night = Column(Integer, nullable=False)
    
    # --- IMAGES SUPPORT ---
    image_url = Column(String, nullable=True) # Main Cover Image
    images = Column(JSON, default=[])         # Gallery: ["url1", "url2"]
    # ----------------------

    facilities = Column(JSON, nullable=True) # e.g. ["Wifi", "AC"]
    is_active = Column(Boolean, default=True)
    
    # Relationship FIX:
    # We use back_populates="stays" because 'stays' is explicitly defined in Owner.py
    owner = relationship("app.models.owner.Owner", back_populates="stays")