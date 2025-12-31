from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete # <--- Added delete
from sqlalchemy.orm import selectinload
from app.db.session import get_db
from app.models.stay import Stay
from app.models.owner import Owner
from app.models.booking import Booking # <--- Added Booking model
from app.schemas.stay import StayCreate, StayResponse, StayUpdate
from app.api.deps import get_current_owner

router = APIRouter()

# --- PUBLIC ENDPOINTS ---

@router.get("/", response_model=List[StayResponse])
async def get_all_stays(
    skip: int = 0, 
    limit: int = 100, 
    location: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    # 1. Filter: Active Stays AND Verified Owners Only
    query = select(Stay).join(Owner).options(selectinload(Stay.owner)).where(
        Stay.is_active == True,
        Owner.is_verified == True 
    )
    
    if location:
        query = query.where(Stay.location.ilike(f"%{location}%"))
        
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()

@router.get("/{stay_id}", response_model=StayResponse)
async def get_stay_details(stay_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Stay)
        .options(selectinload(Stay.owner)) 
        .where(Stay.id == stay_id)
    )
    stay = result.scalar_one_or_none()
    if not stay:
        raise HTTPException(status_code=404, detail="Stay not found")
    return stay

# --- OWNER ENDPOINTS (SECURED) ---

@router.post("/", response_model=StayResponse)
async def create_stay(
    stay_in: StayCreate,
    db: AsyncSession = Depends(get_db),
    current_owner: Owner = Depends(get_current_owner)
):
    if not current_owner.is_verified:
        raise HTTPException(status_code=403, detail="Owner not verified by Admin yet.")

    new_stay = Stay(
        owner_id=current_owner.id,
        name=stay_in.name,
        description=stay_in.description,
        location=stay_in.location,
        price_per_night=stay_in.price_per_night,
        facilities=stay_in.facilities,
        image_url=stay_in.image_url,
        images=stay_in.images
    )
    db.add(new_stay)
    await db.commit()
    await db.refresh(new_stay)
    return new_stay

@router.get("/owner/my-stays", response_model=List[StayResponse])
async def get_my_stays(
    db: AsyncSession = Depends(get_db),
    current_owner: Owner = Depends(get_current_owner)
):
    # SECURITY: STRICTLY return stays where owner_id matches the logged-in token
    result = await db.execute(
        select(Stay)
        .options(selectinload(Stay.owner))
        .where(Stay.owner_id == current_owner.id) 
    )
    return result.scalars().all()

@router.put("/{stay_id}", response_model=StayResponse)
async def update_stay(
    stay_id: int,
    stay_update: StayUpdate,
    db: AsyncSession = Depends(get_db),
    current_owner: Owner = Depends(get_current_owner)
):
    # SECURITY: Check Owner ID matching current_owner
    result = await db.execute(
        select(Stay).where(Stay.id == stay_id, Stay.owner_id == current_owner.id)
    )
    stay = result.scalar_one_or_none()
    
    if not stay:
        raise HTTPException(status_code=404, detail="Stay not found or you do not have permission")

    for field, value in stay_update.dict(exclude_unset=True).items():
        setattr(stay, field, value)

    await db.commit()
    await db.refresh(stay)
    return stay

@router.delete("/{stay_id}")
async def delete_stay(
    stay_id: int,
    db: AsyncSession = Depends(get_db),
    current_owner: Owner = Depends(get_current_owner)
):
    # 1. Verify Ownership
    result = await db.execute(
        select(Stay).where(Stay.id == stay_id, Stay.owner_id == current_owner.id)
    )
    stay = result.scalar_one_or_none()
    
    if not stay:
        raise HTTPException(status_code=404, detail="Stay not found or permission denied")

    # 2. DELETE BOOKINGS FIRST (Fixes Integrity Error)
    await db.execute(delete(Booking).where(Booking.stay_id == stay_id))

    # 3. DELETE STAY
    await db.delete(stay)
    await db.commit()
    return {"message": "Stay deleted successfully"}