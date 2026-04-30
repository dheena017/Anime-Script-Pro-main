from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from database import get_session
from models.world import WorldLore
from datetime import datetime
from typing import List, Optional

router = APIRouter(prefix="/api/world", tags=["world"])

@router.get("/lore/{user_id}", response_model=Optional[WorldLore])
def get_world_lore(user_id: str, project_id: Optional[int] = None, session: Session = Depends(get_session)):
    statement = select(WorldLore).where(WorldLore.user_id == user_id)
    if project_id:
        statement = statement.where(WorldLore.project_id == project_id)
    
    # Return the most recent lore for this user/project
    statement = statement.order_by(WorldLore.updated_at.desc())
    return session.exec(statement).first()

@router.post("/lore/{user_id}", response_model=WorldLore)
def update_world_lore(user_id: str, lore_update: dict, project_id: Optional[int] = None, session: Session = Depends(get_session)):
    # Check if existing lore exists
    statement = select(WorldLore).where(WorldLore.user_id == user_id)
    if project_id:
        statement = statement.where(WorldLore.project_id == project_id)
    
    db_lore = session.exec(statement).first()
    
    if not db_lore:
        db_lore = WorldLore(user_id=user_id, project_id=project_id)
    
    # Update fields from dict
    for key, value in lore_update.items():
        if hasattr(db_lore, key):
            setattr(db_lore, key, value)
    
    db_lore.updated_at = datetime.utcnow()
    
    session.add(db_lore)
    session.commit()
    session.refresh(db_lore)
    return db_lore

@router.get("/history/{user_id}", response_model=List[WorldLore])
def get_lore_history(user_id: str, limit: int = 10, session: Session = Depends(get_session)):
    statement = select(WorldLore).where(WorldLore.user_id == user_id).order_by(WorldLore.updated_at.desc()).limit(limit)
    return session.exec(statement).all()
