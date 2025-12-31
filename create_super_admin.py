import asyncio
from app.db.session import AsyncSessionLocal
from app.models.admin import Admin
from app.core.security import get_password_hash

async def create_admin():
    async with AsyncSessionLocal() as db:
        print("Creating Super Admin...")
        
        admin = Admin(
            email="admin@localstay.com",
            name="Super Admin",
            hashed_password=get_password_hash("Admin@123") # <--- Admin Password
        )
        
        db.add(admin)
        await db.commit()
        print("✅ Admin Created successfully!")

if __name__ == "__main__":
    asyncio.run(create_admin())