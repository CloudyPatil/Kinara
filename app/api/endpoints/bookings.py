from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import and_, or_
from app.db.session import get_db
from app.models.booking import Booking
from app.models.stay import Stay
from app.models.user import User
from app.models.owner import Owner
from app.schemas.booking import BookingCreate, BookingResponse, BookingAction
from app.api.deps import get_current_user, get_current_owner

router = APIRouter()

# --- USER ENDPOINTS ---

@router.post("/", response_model=BookingResponse)
async def create_booking_request(
    booking_in: BookingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    User requests a booking. 
    New Feature: Checks if dates are already 'ACCEPTED' by another user.
    """
    # 1. Validate Dates
    if booking_in.check_out <= booking_in.check_in:
        raise HTTPException(status_code=400, detail="Check-out must be after check-in")

    # 2. Check if Stay exists
    result = await db.execute(select(Stay).where(Stay.id == booking_in.stay_id))
    stay = result.scalar_one_or_none()
    if not stay:
        raise HTTPException(status_code=404, detail="Stay not found")

    # 3. CHECK AVAILABILITY (Prevent requesting booked dates)
    # Logic: (Existing Start < New End) AND (Existing End > New Start)
    # This allows same-day turnover (Someone leaves morning, you arrive afternoon)
        # 3. CHECK AVAILABILITY (Prevent requesting booked dates)
    conflict_query = select(Booking).where(
        Booking.stay_id == booking_in.stay_id,
        Booking.status == "ACCEPTED",  # <--- Checks if someone else is already accepted
        Booking.check_in < booking_in.check_out, 
        Booking.check_out > booking_in.check_in
    )
    conflict = await db.execute(conflict_query)
    if conflict.scalar_one_or_none():
        # <--- BLOCKS THE NEW USER HERE
        raise HTTPException(status_code=400, detail="Dates are already booked. Please choose different dates.")

    # 4. Create Booking
    new_booking = Booking(
        user_id=current_user.id,
        stay_id=booking_in.stay_id,
        check_in=booking_in.check_in,
        check_out=booking_in.check_out,
        guests=booking_in.guests,
        status="REQUESTED"
    )
    
    db.add(new_booking)
    await db.commit()
    await db.refresh(new_booking)
    
    # 5. Return with Data Loaded (Fixes potential response errors)
    result = await db.execute(
        select(Booking)
        .options(selectinload(Booking.stay), selectinload(Booking.user))
        .where(Booking.id == new_booking.id)
    )
    return result.scalar_one()


@router.get("/my-bookings", response_model=List[BookingResponse])
async def get_my_bookings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Booking)
        .options(selectinload(Booking.stay)) # Load Stay info for the card
        .where(Booking.user_id == current_user.id)
        .order_by(Booking.check_in.desc())
    )
    return result.scalars().all()

# --- OWNER ENDPOINTS ---

@router.get("/owner-requests", response_model=List[BookingResponse])
async def get_owner_booking_requests(
    db: AsyncSession = Depends(get_db),
    current_owner: Owner = Depends(get_current_owner)
):
    result = await db.execute(
        select(Booking)
        .join(Stay)
        .options(selectinload(Booking.user), selectinload(Booking.stay)) # Load User & Stay
        .where(Stay.owner_id == current_owner.id)
        .order_by(Booking.id.desc())
    )
    return result.scalars().all()


@router.post("/{booking_id}/action", response_model=BookingResponse)
async def handle_booking_action(
    booking_id: int,
    action_in: BookingAction,
    db: AsyncSession = Depends(get_db),
    current_owner: Owner = Depends(get_current_owner)
):
    # 1. Get Booking with Relations (FIXES THE 500 ERROR)
    # We MUST load 'user' and 'stay' because the response schema needs them
    result = await db.execute(
        select(Booking)
        .join(Stay)
        .options(selectinload(Booking.user), selectinload(Booking.stay)) # <--- THE FIX
        .where(Booking.id == booking_id)
        .where(Stay.owner_id == current_owner.id)
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found or authorized")

    if action_in.action.lower() == "accept":
        # 2. Final Availability Check (Race Condition protection)
        conflict_query = select(Booking).where(
            Booking.stay_id == booking.stay_id,
            Booking.status == "ACCEPTED",
            Booking.id != booking.id, 
            Booking.check_in < booking.check_out, 
            Booking.check_out > booking.check_in
        )
        existing_booking = await db.execute(conflict_query)
        if existing_booking.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Dates are already booked! Cannot accept.")

        booking.status = "ACCEPTED"

    elif action_in.action.lower() == "reject":
        booking.status = "REJECTED"
    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    await db.commit()
    await db.refresh(booking)
    return booking