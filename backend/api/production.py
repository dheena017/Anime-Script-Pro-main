from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models.project_content import ProjectContent
from datetime import datetime
from typing import Optional, List

router = APIRouter(prefix="/api/production", tags=["production"])

@router.get("/{user_id}", response_model=Optional[ProjectContent])
def get_production_content(user_id: str, project_id: Optional[int] = None, session: Session = Depends(get_session)):
    statement = select(ProjectContent).where(ProjectContent.user_id == user_id)
    if project_id:
        statement = statement.where(ProjectContent.project_id == project_id)
    
    statement = statement.order_by(ProjectContent.updated_at.desc())
    return session.exec(statement).first()

@router.post("/{user_id}", response_model=ProjectContent)
def update_production_content(user_id: str, update: dict, project_id: Optional[int] = None, session: Session = Depends(get_session)):
    statement = select(ProjectContent).where(ProjectContent.user_id == user_id)
    if project_id:
        statement = statement.where(ProjectContent.project_id == project_id)
    
    db_content = session.exec(statement).first()
    
    if not db_content:
        db_content = ProjectContent(user_id=user_id, project_id=project_id)
    
    for key, value in update.items():
        if hasattr(db_content, key):
            setattr(db_content, key, value)
    
    db_content.updated_at = datetime.utcnow()
    
    session.add(db_content)
    session.commit()
    session.refresh(db_content)
    return db_content
