from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create the Async Engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,
    # THIS FIXES THE ERROR WITH SUPABASE POOLER:
    connect_args={
        "statement_cache_size": 0
    }
)

# Create the Session Factory
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Dependency to get DB session in endpoints
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session