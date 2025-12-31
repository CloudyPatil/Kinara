from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.models.owner import Owner

# This tells FastAPI where to look for the token (the login URL)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/user/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        
        if user_id is None or role != "user":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Get User from DB
    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
    return user

async def get_current_owner(
    token: str = Depends(oauth2_scheme), 
    db: AsyncSession = Depends(get_db)
) -> Owner:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        owner_id: str = payload.get("sub")
        role: str = payload.get("role")

        # STRICT CHECK: Only allow if role is 'owner'
        if owner_id is None or role != "owner":
            raise HTTPException(status_code=403, detail="Not authorized as Owner")
            
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(Owner).where(Owner.id == int(owner_id)))
    owner = result.scalar_one_or_none()
    
    if owner is None:
        raise credentials_exception
    return owner