from sqlalchemy import Column, Integer, ForeignKey, Date, String, Enum
from sqlalchemy.orm import relationship
from app.db.base import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stay_id = Column(Integer, ForeignKey("stays.id"), nullable=False)
    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=False)
    guests = Column(Integer, nullable=False)
    status = Column(String, default="REQUESTED") # REQUESTED, ACCEPTED, REJECTED, CANCELLED

    # Relationships
    user = relationship("app.models.user.User")
    stay = relationship("app.models.stay.Stay")