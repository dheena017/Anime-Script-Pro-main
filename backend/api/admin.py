from fastapi import APIRouter, Depends
from sqlmodel import select
from backend.models import User
from backend.database import AsyncSession, async_engine

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/users")
async def admin_get_users():
    """Admin-only user listing."""
    async with AsyncSession(async_engine) as session:
        statement = select(User)
        results = await session.exec(statement)
        return results.all()
