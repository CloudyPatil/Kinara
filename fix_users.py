import asyncio
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.user import User, Owner
from app.models.admin import Admin
from app.core.security import get_password_hash

async def fix_accounts():
    async with AsyncSessionLocal() as db:
        print("🔍 SCANNING DATABASE...")
        
        # 1. FIX TRAVELER (User)
        result = await db.execute(select(User).where(User.email == "harshalgenai@gmail.com"))
        user = result.scalar_one_or_none()
        
        if user:
            print(f"   found User: {user.email}")
            user.hashed_password = get_password_hash("Harshal@321")
            print("   ✅ Password RESET to: Harshal@321")
        else:
            print("   ❌ User 'harshalgenai@gmail.com' NOT FOUND in DB.")

        # 2. FIX HOST (Owner)
        result = await db.execute(select(Owner).where(Owner.email == "ownerofkonkan@gmail.com"))
        owner = result.scalar_one_or_none()
        
        if owner:
            print(f"   found Owner: {owner.email}")
            owner.hashed_password = get_password_hash("Konkan@18")
            print("   ✅ Password RESET to: Konkan@18")
        else:
            print("   ❌ Owner 'ownerofkonkan@gmail.com' NOT FOUND in DB.")

        # 3. FIX ADMIN
        result = await db.execute(select(Admin).where(Admin.email == "admin@localstay.com"))
        admin = result.scalar_one_or_none()
        
        if admin:
            print(f"   found Admin: {admin.email}")
            admin.hashed_password = get_password_hash("Admin@123")
            print("   ✅ Password RESET to: Admin@123")
        else:
            print("   ❌ Admin 'admin@localstay.com' NOT FOUND in DB.")

        await db.commit()
        print("\n✨ REPAIR COMPLETE. Try logging in now.")

if __name__ == "__main__":
    asyncio.run(fix_accounts())