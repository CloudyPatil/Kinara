import asyncio
from sqlalchemy import text
from app.db.session import engine

async def fix_database_columns():
    print("🔧 Connecting to database to apply fixes...")
    
    async with engine.begin() as conn:
        # 1. Fix Owners Table
        # We use "IF NOT EXISTS" so it is safe to run even if the column is already there.
        print("Checking 'owners' table...")
        await conn.execute(text("ALTER TABLE owners ADD COLUMN IF NOT EXISTS phone_number VARCHAR;"))
        print("✅ 'phone_number' column ensured in 'owners' table.")

        # 2. Fix Users Table (Your User model also has phone_number now)
        print("Checking 'users' table...")
        await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR;"))
        print("✅ 'phone_number' column ensured in 'users' table.")

    print("\n🎉 Database structure updated successfully! No data was deleted.")

if __name__ == "__main__":
    # Standard boilerplate to run async code
    try:
        asyncio.run(fix_database_columns())
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(fix_database_columns())