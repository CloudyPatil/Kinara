import asyncio
from sqlalchemy import text
from app.db.session import engine
from app.core.security import get_password_hash

async def create_admin_account():
    print("🔧 Configuring Admin Account...")
    
    # 1. Generate the correct hash for "Admin@123"
    hashed_pwd = get_password_hash("Admin@123")
    
    async with engine.begin() as conn:
        # 2. Insert Admin, or Update password if they already exist
        # We use ON CONFLICT (email) to handle both cases safely
        await conn.execute(
            text("""
            INSERT INTO users (email, name, hashed_password, phone_number, created_at)
            VALUES (:email, :name, :pwd, :phone, NOW())
            ON CONFLICT (email) 
            DO UPDATE SET hashed_password = :pwd;
            """),
            {
                "email": "admin@localstay.com",
                "name": "SuperUser",
                "pwd": hashed_pwd,
                "phone": "+91 00000 00000"
            }
        )
    
    print("✅ Admin Account Ready!")
    print("📧 Email: admin@localstay.com")
    print("TB Password: Admin@123")

if __name__ == "__main__":
    try:
        asyncio.run(create_admin_account())
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(create_admin_account())