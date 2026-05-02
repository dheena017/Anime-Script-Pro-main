from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select
from backend.database import AsyncSession, get_async_session
from backend.database.models.projects import Episode
from backend.deps import get_auth_user_id
from datetime import datetime
from typing import List, Optional

router = APIRouter(prefix="/api/series", tags=["episodes"])

@router.get("/episodes", response_model=List[Episode])
async def get_episodes(
    project_id: Optional[int] = None, 
    user_id: Optional[str] = None,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    effective_user_id = user_id or auth_user_id
    statement = select(Episode).where(Episode.user_id == effective_user_id)
    if project_id:
        statement = statement.where(Episode.project_id == project_id)
    
    result = await session.execute(statement)
    return result.scalars().all()

@router.post("/episodes", response_model=Episode)
async def create_episode(
    episode: Episode,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    episode.user_id = episode.user_id or auth_user_id
    session.add(episode)
    await session.commit()
    await session.refresh(episode)
    return episode

@router.put("/episodes/{episode_id}", response_model=Episode)
async def update_episode(
    episode_id: int,
    updates: dict,
    session: AsyncSession = Depends(get_async_session)
):
    db_episode = await session.get(Episode, episode_id)
    if not db_episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    
    for key, value in updates.items():
        if hasattr(db_episode, key):
            setattr(db_episode, key, value)
    
    db_episode.updated_at = datetime.utcnow()
    session.add(db_episode)
    await session.commit()
    await session.refresh(db_episode)
    return db_episode

@router.delete("/episodes/{episode_id}")
async def delete_episode(
    episode_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    db_episode = await session.get(Episode, episode_id)
    if not db_episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    
    await session.delete(db_episode)
    await session.commit()
    return {"status": "success", "message": "Episode deleted"}
