import os
from sqlmodel import create_engine, SQLModel
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import AsyncGenerator

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///backend/anime_script_pro.db")

# Create synchronous engine
engine = create_engine(DATABASE_URL, echo=False)

# Calculate async DB URL
ASYNC_DB_URL = DATABASE_URL
if ASYNC_DB_URL.startswith("sqlite:///"):
    ASYNC_DB_URL = ASYNC_DB_URL.replace("sqlite:///", "sqlite+aiosqlite:///")
elif ASYNC_DB_URL.startswith("postgresql://"):
    ASYNC_DB_URL = ASYNC_DB_URL.replace("postgresql://", "postgresql+asyncpg://")

# Create asynchronous engine
async_engine = create_async_engine(ASYNC_DB_URL, echo=False)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSession(async_engine) as session:
        yield session
