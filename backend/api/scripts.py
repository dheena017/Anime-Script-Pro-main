from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, Session
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
from loguru import logger
from backend.models import Script, Storyboard, ScriptVersion, ScreeningRoomEntry, NarrativeBeat
from backend.database import async_engine, engine

router = APIRouter(prefix="", tags=["Scripts"])

@router.get("/api/scripts", response_model=List[Script])
def get_scripts():
    with Session(engine) as session:
        return session.exec(select(Script)).all()

@router.post("/api/scripts", response_model=Script)
def create_script(script: Script):
    with Session(engine) as session:
        session.add(script)
        session.commit()
        session.refresh(script)
        return script

@router.get("/api/scripts/{script_id}", response_model=Script)
def get_script(script_id: int):
    with Session(engine) as session:
        script = session.get(Script, script_id)
        if not script:
            raise HTTPException(status_code=404, detail="Script not found")
        return script

@router.put("/api/scripts/{script_id}", response_model=Script)
def update_script(script_id: int, script: Script):
    with Session(engine) as session:
        db_script = session.get(Script, script_id)
        if not db_script:
            raise HTTPException(status_code=404, detail="Script not found")
        db_script.title = script.title
        db_script.content = script.content
        session.add(db_script)
        session.commit()
        session.refresh(db_script)
        return db_script

@router.delete("/api/scripts/{script_id}")
def delete_script(script_id: int):
    with Session(engine) as session:
        script = session.get(Script, script_id)
        if not script:
            raise HTTPException(status_code=404, detail="Script not found")
        session.delete(script)
        session.commit()
        return {"ok": True}

@router.get("/api/storyboards", response_model=List[Storyboard])
async def get_storyboards(script_id: Optional[int] = Query(None)):
    async with AsyncSession(async_engine) as session:
        statement = select(Storyboard)
        if script_id:
            statement = statement.where(Storyboard.script_id == script_id)
        results = await session.exec(statement)
        return results.all()

@router.post("/api/storyboards", response_model=Storyboard)
async def create_storyboard(storyboard: Storyboard):
    async with AsyncSession(async_engine) as session:
        session.add(storyboard)
        await session.commit()
        await session.refresh(storyboard)
        return storyboard

@router.get("/api/storyboards/{storyboard_id}", response_model=Storyboard)
def get_storyboard(storyboard_id: int):
    with Session(engine) as session:
        storyboard = session.get(Storyboard, storyboard_id)
        if not storyboard:
            raise HTTPException(status_code=404, detail="Storyboard not found")
        return storyboard

# Screening Room Aliases
@router.get("/screeningroom", response_model=List[ScreeningRoomEntry])
@router.get("/api/screening_room_entries", response_model=List[ScreeningRoomEntry])
def get_screeningroom_entries(script_id: Optional[int] = Query(None)):
    with Session(engine) as session:
        statement = select(ScreeningRoomEntry)
        if script_id:
            statement = statement.where(ScreeningRoomEntry.script_id == script_id)
        return session.exec(statement).all()

@router.post("/screeningroom", response_model=ScreeningRoomEntry)
@router.post("/api/screening_room_entries", response_model=ScreeningRoomEntry)
def create_screeningroom_entry(entry: ScreeningRoomEntry):
    with Session(engine) as session:
        session.add(entry)
        session.commit()
        session.refresh(entry)
        return entry

@router.get("/api/scripts/{script_id}/versions", response_model=List[ScriptVersion])
def get_script_versions(script_id: int):
    with Session(engine) as session:
        return session.exec(select(ScriptVersion).where(ScriptVersion.script_id == script_id)).all()

@router.post("/api/scripts/{script_id}/versions", response_model=ScriptVersion)
def create_script_version(script_id: int, version: ScriptVersion):
    with Session(engine) as session:
        version.script_id = script_id
        session.add(version)
        session.commit()
        session.refresh(version)
        return version

@router.get("/api/scripts/{script_id}/narrativebeats", response_model=List[NarrativeBeat])
def get_narrativebeats_for_script(script_id: int):
    with Session(engine) as session:
        return session.exec(select(NarrativeBeat).where(NarrativeBeat.script_id == script_id)).all()

@router.post("/api/methods")
def create_production_method(payload: dict):
    # Stub for production methods
    return {"status": "ok", "method": payload.get("method")}
