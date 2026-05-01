from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select
from typing import List, Optional
from loguru import logger
from backend.models import Script, Storyboard, ScriptVersion, ScreeningRoomEntry, NarrativeBeat
from backend.database import AsyncSession, async_engine

router = APIRouter(prefix="/api", tags=["Scripts"])

@router.get("/scripts", response_model=List[Script])
async def get_scripts():
    async with AsyncSession(async_engine) as session:
        statement = select(Script)
        results = await session.exec(statement)
        return results.all()

@router.post("/scripts", response_model=Script)
async def create_script(script: Script):
    async with AsyncSession(async_engine) as session:
        session.add(script)
        await session.commit()
        await session.refresh(script)
        logger.info(f"[SCRIPT] Initialized: {script.title}")
        return script

@router.get("/scripts/{script_id}", response_model=Script)
async def get_script(script_id: int):
    async with AsyncSession(async_engine) as session:
        script = await session.get(Script, script_id)
        if not script:
            raise HTTPException(status_code=404, detail="Script not found")
        return script

@router.put("/scripts/{script_id}", response_model=Script)
async def update_script(script_id: int, script: Script):
    async with AsyncSession(async_engine) as session:
        db_script = await session.get(Script, script_id)
        if not db_script:
            raise HTTPException(status_code=404, detail="Script not found")
        db_script.title = script.title
        db_script.content = script.content
        session.add(db_script)
        await session.commit()
        await session.refresh(db_script)
        return db_script

@router.delete("/scripts/{script_id}")
async def delete_script(script_id: int):
    async with AsyncSession(async_engine) as session:
        script = await session.get(Script, script_id)
        if not script:
            raise HTTPException(status_code=404, detail="Script not found")
        await session.delete(script)
        await session.commit()
        return {"ok": True}

@router.get("/storyboards", response_model=List[Storyboard])
async def get_storyboards(script_id: Optional[int] = Query(None)):
    async with AsyncSession(async_engine) as session:
        statement = select(Storyboard)
        if script_id:
            statement = statement.where(Storyboard.script_id == script_id)
        results = await session.exec(statement)
        return results.all()

@router.post("/storyboards", response_model=Storyboard)
async def create_storyboard(storyboard: Storyboard):
    async with AsyncSession(async_engine) as session:
        session.add(storyboard)
        await session.commit()
        await session.refresh(storyboard)
        return storyboard

@router.get("/storyboards/{storyboard_id}", response_model=Storyboard)
async def get_storyboard(storyboard_id: int):
    async with AsyncSession(async_engine) as session:
        storyboard = await session.get(Storyboard, storyboard_id)
        if not storyboard:
            raise HTTPException(status_code=404, detail="Storyboard not found")
        return storyboard

# Screening Room Aliases
@router.get("/screening_room_entries", response_model=List[ScreeningRoomEntry])
async def get_screeningroom_entries(script_id: Optional[int] = Query(None)):
    async with AsyncSession(async_engine) as session:
        statement = select(ScreeningRoomEntry)
        if script_id:
            statement = statement.where(ScreeningRoomEntry.script_id == script_id)
        results = await session.exec(statement)
        return results.all()

@router.post("/screening_room_entries", response_model=ScreeningRoomEntry)
async def create_screeningroom_entry(entry: ScreeningRoomEntry):
    async with AsyncSession(async_engine) as session:
        session.add(entry)
        await session.commit()
        await session.refresh(entry)
        logger.info(f"[SCREENING] New entry synced for script {entry.script_id}")
        return entry

@router.get("/scripts/{script_id}/versions", response_model=List[ScriptVersion])
async def get_script_versions(script_id: int):
    async with AsyncSession(async_engine) as session:
        statement = select(ScriptVersion).where(ScriptVersion.script_id == script_id)
        results = await session.exec(statement)
        return results.all()

@router.post("/scripts/{script_id}/versions", response_model=ScriptVersion)
async def create_script_version(script_id: int, version: ScriptVersion):
    async with AsyncSession(async_engine) as session:
        version.script_id = script_id
        session.add(version)
        await session.commit()
        await session.refresh(version)
        return version

@router.get("/scripts/{script_id}/narrativebeats", response_model=List[NarrativeBeat])
async def get_narrativebeats_for_script(script_id: int):
    async with AsyncSession(async_engine) as session:
        statement = select(NarrativeBeat).where(NarrativeBeat.script_id == script_id)
        results = await session.exec(statement)
        return results.all()

@router.post("/methods")
async def create_production_method(payload: dict):
    # Stub for production methods
    logger.info(f"[METHOD] Production strategy initialized: {payload.get('name')}")
    return {"status": "ok", "method": payload.get("name")}
