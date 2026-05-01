from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from backend.database import AsyncSession, async_engine
from backend.models import SystemLog
from typing import List
from loguru import logger

router = APIRouter(prefix="/api/logs", tags=["System Logs"])

@router.post("/", response_model=SystemLog)
async def create_log(log_entry: SystemLog):
    """
    Save a new log entry to the persistent SQLite database.
    """
    async with AsyncSession(async_engine) as session:
        session.add(log_entry)
        await session.commit()
        await session.refresh(log_entry)
        logger.info(f"DB_LOG: Saved [{log_entry.source}] {log_entry.message}")
        return log_entry

@router.get("/", response_model=List[SystemLog])
async def get_logs(limit: int = 50):
    """
    Retrieve historical logs from the database.
    """
    async with AsyncSession(async_engine) as session:
        statement = select(SystemLog).order_by(SystemLog.timestamp.desc()).limit(limit)
        result = await session.exec(statement)
        return result.all()
