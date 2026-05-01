from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select
from backend.database import AsyncSession, get_async_session
from backend.models.world import WorldLore
from backend.deps import get_auth_user_id
from datetime import datetime
from typing import List, Optional

router = APIRouter(prefix="/api", tags=["world"])

@router.get("/world/lore/{user_id}", response_model=Optional[WorldLore])
async def get_world_lore(user_id: str, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session)):
    statement = select(WorldLore).where(WorldLore.user_id == user_id)
    if project_id:
        statement = statement.where(WorldLore.project_id == project_id)
    
    # Return the most recent lore for this user/project
    statement = statement.order_by(WorldLore.updated_at.desc())
    result = await session.execute(statement)
    return result.scalars().first()

@router.post("/world/lore/{user_id}", response_model=WorldLore)
@router.post("/world-lore", response_model=WorldLore)
async def update_world_lore(
    lore_update: dict, 
    user_id: Optional[str] = None, 
    project_id: Optional[int] = None, 
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    # Determine the target user_id
    effective_user_id = user_id or auth_user_id
    
    # Extract project_id from body if not in query (for compatibility)
    effective_project_id = project_id or lore_update.get("project_id")
    
    # Check if existing lore exists
    statement = select(WorldLore).where(WorldLore.user_id == effective_user_id)
    if effective_project_id:
        statement = statement.where(WorldLore.project_id == effective_project_id)
    
    result = await session.execute(statement)
    db_lore = result.scalars().first()
    
    if not db_lore:
        db_lore = WorldLore(user_id=effective_user_id, project_id=effective_project_id)
    
    # Handle both modular fields and legacy 'markdown_content'
    if "markdown_content" in lore_update:
        db_lore.full_lore_blob = lore_update["markdown_content"]
    
    # Update modular fields from dict
    for key, value in lore_update.items():
        # Map 'metadata' to 'lore_metadata' to avoid SQLAlchemy reserved word conflict
        target_key = "lore_metadata" if key == "metadata" else key
        if hasattr(db_lore, target_key):
            setattr(db_lore, target_key, value)
    
    db_lore.updated_at = datetime.utcnow()
    
    session.add(db_lore)
    await session.commit()
    await session.refresh(db_lore)
    return db_lore

@router.get("/world/history/{user_id}", response_model=List[WorldLore])
async def get_lore_history(user_id: str, limit: int = 10, session: AsyncSession = Depends(get_async_session)):
    statement = select(WorldLore).where(WorldLore.user_id == user_id).order_by(WorldLore.updated_at.desc()).limit(limit)
    result = await session.execute(statement)
    return result.scalars().all()
