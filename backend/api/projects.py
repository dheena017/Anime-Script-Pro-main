from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, Session
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
from loguru import logger
from backend.models import Project, Series, ProductionSession, Episode, PromptLibrary, Category, Script, CastMember
from backend.database import async_engine, engine
from backend.deps import get_auth_user_id

router = APIRouter(prefix="/api", tags=["Projects"])

# --- Projects ---
@router.get("/projects", response_model=List[Project])
async def get_projects(user_id: str = Depends(get_auth_user_id)):
    """Get all active projects for the authenticated user."""
    async with AsyncSession(async_engine) as session:
        statement = select(Project).where(Project.user_id == user_id, Project.is_active == True)
        results = await session.exec(statement)
        return results.all()

@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: int, user_id: str = Depends(get_auth_user_id)):
    """Retrieve a specific project by ID."""
    async with AsyncSession(async_engine) as session:
        project = await session.get(Project, project_id)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=404, detail="Production project not found")
        return project

@router.post("/projects", response_model=Project, status_code=201)
async def create_project(project: Project, user_id: str = Depends(get_auth_user_id)):
    """Initialize a new production project."""
    async with AsyncSession(async_engine) as session:
        project.user_id = user_id
        session.add(project)
        await session.commit()
        await session.refresh(project)
        return project

@router.delete("/projects/{project_id}")
async def delete_project(project_id: int, user_id: str = Depends(get_auth_user_id)):
    """Purge a project from the archive."""
    async with AsyncSession(async_engine) as session:
        project = await session.get(Project, project_id)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=404, detail="Production project not found")
        await session.delete(project)
        await session.commit()
        return {"ok": True, "message": "Production record purged successfully"}

# --- Series ---
@router.get("/series", response_model=List[Series])
def get_series():
    with Session(engine) as session:
        return session.exec(select(Series)).all()

@router.post("/series", response_model=Series)
def create_series(series: Series):
    with Session(engine) as session:
        session.add(series)
        session.commit()
        session.refresh(series)
        return series

@router.get("/series/{series_id}", response_model=Series)
def get_series_item(series_id: int):
    with Session(engine) as session:
        series = session.get(Series, series_id)
        if not series:
            raise HTTPException(status_code=404, detail="Series not found")
        return series

@router.put("/series/{series_id}", response_model=Series)
def update_series(series_id: int, series: Series):
    with Session(engine) as session:
        db_series = session.get(Series, series_id)
        if not db_series:
            raise HTTPException(status_code=404, detail="Series not found")
        db_series.title = series.title
        db_series.summary = series.summary
        session.add(db_series)
        session.commit()
        session.refresh(db_series)
        return db_series

@router.get("/series/{series_id}/scripts", response_model=List[Script])
def get_scripts_for_series(series_id: int):
    with Session(engine) as session:
        from backend.models import Script
        return session.exec(select(Script).where(Script.series_id == series_id)).all()

@router.get("/series/{series_id}/cast", response_model=List[CastMember])
def get_cast_for_series(series_id: int):
    with Session(engine) as session:
        from backend.models import CastMember
        return session.exec(select(CastMember).where(CastMember.series_id == series_id)).all()

# --- Sessions ---
@router.post("/sessions")
def batch_create_sessions(payload: dict):
    project_id = payload.get("project_id")
    if not project_id:
        raise HTTPException(status_code=400, detail="project_id is required")
    sessions_data = payload.get("sessions", [])
    with Session(engine) as session:
        created = []
        for s in sessions_data:
            db_session = ProductionSession(
                project_id=int(project_id),
                session_number=s.get("session_number"),
                title=s.get("title"),
                summary=s.get("summary"),
                prod_metadata=s.get("prod_metadata", {})
            )
            session.add(db_session)
            created.append(db_session)
        session.commit()
        for s in created:
            session.refresh(s)
        return created

@router.get("/sessions")
def get_sessions(project_id: int):
    with Session(engine) as session:
        return session.exec(select(ProductionSession).where(ProductionSession.project_id == project_id)).all()

# --- Episodes ---
@router.post("/episodes")
def batch_create_episodes(payload: dict):
    project_id = payload.get("project_id")
    episodes_data = payload.get("episodes", [])
    session_id = payload.get("session_id")
    if project_id is None:
        raise HTTPException(status_code=400, detail="project_id is required")
    
    with Session(engine) as session:
        created = []
        for e in episodes_data:
            db_episode = Episode(
                project_id=int(project_id),
                session_id=session_id,
                episode_number=e.get("episode_number") or 0,
                title=e.get("title") or "Untitled Episode",
                hook=e.get("hook"),
                summary=e.get("summary")
            )
            session.add(db_episode)
            created.append(db_episode)
        session.commit()
        for e in created:
            session.refresh(e)
        return created

@router.get("/episodes")
def get_episodes(project_id: int):
    """Get episodes for a project."""
    with Session(engine) as session:
        return session.exec(select(Episode).where(Episode.project_id == project_id)).all()

# --- Scenes ---
@router.post("/scenes")
def batch_create_scenes(payload: dict):
    """Batch create or update scenes."""
    project_id = payload.get("project_id")
    scenes_data = payload.get("scenes", [])
    episode_id = payload.get("episode_id")
    if project_id is None or episode_id is None:
        raise HTTPException(status_code=400, detail="project_id and episode_id are required")

    with Session(engine) as session:
        created = []
        for s in scenes_data:
            from backend.models import Scene
            db_scene = Scene(
                project_id=int(project_id),
                episode_id=int(episode_id),
                scene_number=s.get("scene_number") or 0,
                status=s.get("status", "QUEUED"),
                visual_variance_index=s.get("visual_variance_index", 0),
                prompt=s.get("prompt"),
                content=s.get("content")
            )
            session.add(db_scene)
            created.append(db_scene)
        session.commit()
        for s in created:
            session.refresh(s)
        return created

@router.get("/scenes")
def get_scenes(project_id: int):
    """Get scenes for a project."""
    with Session(engine) as session:
        from backend.models import Scene
        return session.exec(select(Scene).where(Scene.project_id == project_id)).all()

@router.post("/prompt-library")
def create_prompt_library_entry(entry: PromptLibrary):
    with Session(engine) as session:
        from backend.models import PromptLibrary
        session.add(entry)
        session.commit()
        session.refresh(entry)
        return entry
