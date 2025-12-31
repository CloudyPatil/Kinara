from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.user import User
from app.models.owner import Owner
from app.schemas.auth import UserCreate, LoginRequest, Token
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.notifications import send_new_owner_alert

router = APIRouter()

# --- USER AUTHENTICATION ---

@router.post("/user/signup", response_model=Token)
async def register_user(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    # 1. Check if email already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash the password
    hashed_pw = get_password_hash(user_data.password)

    # 3. Create new User object
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_pw,
        phone_number=user_data.phone_number # <--- CHANGED from phone to phone_number
    )

    # 4. Save to DB
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # 5. Generate Token
    access_token = create_access_token(subject=new_user.id, role="user")
    
    return {"access_token": access_token, "token_type": "bearer", "role": "user"}


@router.post("/user/login", response_model=Token)
async def login_user(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    print(f"------------ LOGIN ATTEMPT ------------")
    print(f"1. Email received: '{login_data.email}'")
    print(f"2. Password received: '{login_data.password}'")

    # 1. Find user by email
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()

    if not user:
        print("❌ RESULT: User not found in database!")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    print(f"3. User Found! ID: {user.id}, Hash in DB: {user.hashed_password[:10]}...")

    # 2. Verify password
    is_valid = verify_password(login_data.password, user.hashed_password)
    print(f"4. Password Check Result: {is_valid}")

    if not is_valid:
        print("❌ RESULT: Password does not match hash!")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    print("✅ RESULT: Login Successful!")
    # 3. Generate Token
    access_token = create_access_token(subject=user.id, role="user")
    
    return {"access_token": access_token, "token_type": "bearer", "role": "user"}

# --- OWNER AUTHENTICATION ---

@router.post("/owner/signup", response_model=Token)
async def register_owner(
    owner_data: UserCreate, 
    background_tasks: BackgroundTasks, # <--- 1. We added this parameter
    db: AsyncSession = Depends(get_db)
):
    # 1. Check if email exists
    result = await db.execute(select(Owner).where(Owner.email == owner_data.email))
    existing_owner = result.scalar_one_or_none()
    
    if existing_owner:
        raise HTTPException(status_code=400, detail="Owner email already registered")

    # 2. Create Owner
    hashed_pw = get_password_hash(owner_data.password)
    new_owner = Owner(
        email=owner_data.email,
        name=owner_data.name,
        hashed_password=hashed_pw,
        phone_number=owner_data.phone_number
    )

    db.add(new_owner)
    await db.commit()
    await db.refresh(new_owner)

    # 3. SEND NOTIFICATION (This runs in the background)
    # We pass the function name, and then the arguments (name, email, phone)
    background_tasks.add_task(
        send_new_owner_alert, 
        new_owner.name, 
        new_owner.email, 
        new_owner.phone_number
    )

    # 4. Login the user immediately
    access_token = create_access_token(subject=new_owner.id, role="owner")
    
    return {"access_token": access_token, "token_type": "bearer", "role": "owner"}



@router.post("/owner/login", response_model=Token)
async def login_owner(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    # 1. Find OWNER
    result = await db.execute(select(Owner).where(Owner.email == login_data.email))
    owner = result.scalar_one_or_none()

    # 2. Verify
    if not owner or not verify_password(login_data.password, owner.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # 3. Generate Token
    access_token = create_access_token(subject=owner.id, role="owner")
    
    return {"access_token": access_token, "token_type": "bearer", "role": "owner"}

# --- ADMIN AUTHENTICATION ---

@router.post("/admin/login", response_model=Token)
async def login_admin(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    # 1. Admin is stored in the 'users' table, so we check there
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()

    # 2. Verify Credentials
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect admin credentials",
        )
    
    # 3. Security Check: Ensure this is actually the Admin
    # (Since we don't have a role column in DB yet, we check the email hardcoded for safety)
    if user.email.lower() != "admin@localstay.com":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Not an administrator",
        )

    # 4. Generate Token with "admin" role
    access_token = create_access_token(subject=user.id, role="admin")
    
    return {"access_token": access_token, "token_type": "bearer", "role": "admin"}