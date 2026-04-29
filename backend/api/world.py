from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import select, Session
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
from datetime import datetime
from loguru import logger
from backend.models import WorldLore, NarrativeBeat, CastMember
from backend.database import async_engine, engine
from backend.deps import get_auth_user_id

router = APIRouter(prefix="/api", tags=["World Building"])

@router.post("/world-lore")
async def create_worldlore(request: Request):
    """Create or update world lore."""
    data = await request.json()
    project_id = data.get("project_id")
    content = data.get("markdown_content")
    
    async with AsyncSession(async_engine) as session:
        statement = select(WorldLore).where(WorldLore.id == project_id)
        result = await session.exec(statement)
        db_lore = result.first()
        
        if db_lore:
            db_lore.content = content
            db_lore.updated_at = datetime.utcnow()
        else:
            db_lore = WorldLore(id=project_id, title=f"World Lore for {project_id}", content=content)
            
        session.add(db_lore)
        await session.commit()
        await session.refresh(db_lore)
        return db_lore

@router.get("/world-lore/{project_id}")
async def get_worldlore(project_id: int):
    """Get world lore for a project."""
    async with AsyncSession(async_engine) as session:
        statement = select(WorldLore).where(WorldLore.id == project_id)
        result = await session.exec(statement)
        return result.first()

@router.get("/narrativebeats", response_model=List[NarrativeBeat])
async def get_narrativebeats():
    async with AsyncSession(async_engine) as session:
        results = await session.exec(select(NarrativeBeat))
        return results.all()

@router.post("/narrativebeats", response_model=NarrativeBeat)
async def create_narrativebeat(narrativebeat: NarrativeBeat):
    async with AsyncSession(async_engine) as session:
        session.add(narrativebeat)
        await session.commit()
        await session.refresh(narrativebeat)
        return narrativebeat

@router.post("/characters")
async def batch_create_characters(payload: dict):
    """Batch create characters for a project."""
    try:
        project_id = payload.get("project_id")
        characters = payload.get("characters", [])
        
        async with AsyncSession(async_engine) as session:
            created = []
            for c in characters:
                db_member = CastMember(
                    name=c.get("name"),
                    role=c.get("role", "MAIN"),
                    archetype=c.get("archetype"),
                    personality=c.get("personality"),
                    appearance=c.get("appearance"),
                    visual_prompt=c.get("visual_dna"),
                    description=c.get("description"),
                    project_id=project_id
                )
                session.add(db_member)
                created.append(db_member)
            await session.commit()
            return {"status": "ok", "count": len(created)}
    except Exception as e:
        logger.error(f"Batch character creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to synthesize character cast")

@router.get("/cast/{castmember_id}", response_model=CastMember)
async def get_castmember(castmember_id: int):
    async with AsyncSession(async_engine) as session:
        castmember = await session.get(CastMember, castmember_id)
        if not castmember:
            raise HTTPException(status_code=404, detail="Character not found")
        return castmember
