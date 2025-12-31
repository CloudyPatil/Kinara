from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.user import User
from app.models.owner import Owner
from app.api.deps import oauth2_scheme, settings
from jose import jwt, JWTError

router = APIRouter()

# --- ADMIN SECURITY DEPENDENCY ---
async def get_current_admin(
    token: str = Depends(oauth2_scheme), 
    db: AsyncSession = Depends(get_db)
) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        role: str = payload.get("role")
        user_id: str = payload.get("sub")
        
        if role != "admin":
            raise HTTPException(status_code=403, detail="Not authorized as Admin")
            
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    result = await db.execute(select(User).where(User.id == int(user_id)))
    admin_user = result.scalar_one_or_none()
    
    if not admin_user or admin_user.email != "admin@localstay.com":
        raise HTTPException(status_code=401, detail="Admin not found")
        
    return admin_user

# --- 1. VERIFICATION (Existing) ---
@router.get("/unverified-owners")
async def get_unverified_owners(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(Owner).where(Owner.is_verified == False))
    return result.scalars().all()

@router.post("/verify-owner/{owner_id}")
async def verify_owner(
    owner_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(Owner).where(Owner.id == owner_id))
    owner = result.scalar_one_or_none()
    if not owner: raise HTTPException(status_code=404, detail="Owner not found")
        
    owner.is_verified = True
    await db.commit()
    return {"message": f"Owner {owner.name} is now verified"}

# --- 2. MANAGE HOSTS (New: Ban/Unban) ---
@router.get("/all-owners")
async def get_all_owners(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """List all owners to manage them"""
    result = await db.execute(select(Owner).order_by(Owner.id))
    return result.scalars().all()

@router.post("/toggle-status/{owner_id}")
async def toggle_owner_status(
    owner_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Bans or Unbans an owner. If banned, their stays disappear from the public feed."""
    result = await db.execute(select(Owner).where(Owner.id == owner_id))
    owner = result.scalar_one_or_none()
    if not owner: raise HTTPException(status_code=404, detail="Owner not found")

    # Flip the status
    owner.is_verified = not owner.is_verified
    await db.commit()
    
    status_text = "Verified/Active" if owner.is_verified else "Banned/Inactive"
    return {"message": f"Owner is now {status_text}"}

# --- 3. ANALYTICS (New: List Users) ---
@router.get("/all-users")
async def get_all_users(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """List all regular users/travelers"""
    result = await db.execute(select(User).order_by(User.id))
    return result.scalars().all()