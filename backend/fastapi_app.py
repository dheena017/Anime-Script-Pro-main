import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from datetime import datetime
from dotenv import load_dotenv
from fastapi import Depends, Query, WebSocket, WebSocketDisconnect
from fastapi import FastAPI, HTTPException, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, constr
from typing import List, Optional
from sqlmodel import SQLModel, Session, create_engine, select
from models import Template, Method, WorldLore, NarrativeBeat, CastMember, Series, Script, Storyboard, SEOEntry, Prompt, ScreeningRoomEntry, UserSettings, UserProfile, UserBalance, MediaAsset, UserFavorite, SavedPrompt, ReusableCharacter, Tutorial, Project, ProductionSession, Episode, Scene, Category, PromptLibrary

# --- FastAPI app and engine definitions (must be before any usage) ---
app = FastAPI(
    title="Anime Script Pro API",
    version="1.0.0",
    description="Backend API for Anime Script Pro. Provides authentication, project, and AI endpoints.",
    contact={
        "name": "Anime Script Pro Team",
        "email": "support@animescriptpro.com",
    },
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL(s) in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# --- Health Check Endpoint ---
@app.get("/", tags=["system"])
async def root():
    return {"message": "Welcome to Anime Script Pro API. Visit /docs for documentation.", "status": "online"}

@app.get("/health", tags=["system"])
async def health():
    return {"status": "ok"}

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./anime_script_pro.db")
engine = create_engine(DATABASE_URL, echo=True)
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import JWTStrategy, AuthenticationBackend, BearerTransport
from fastapi_users_db_sqlmodel import SQLModelUserDatabase
from sqlmodel import Field
from typing import Optional, List
from fastapi_users import schemas as fa_schemas
from fastapi_users_db_sqlmodel import SQLModelBaseUserDB
from pydantic import BaseModel, constr
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError as FastAPIRequestValidationError
from sqlalchemy.exc import SQLAlchemyError

# --- Enhanced Global Exception Handlers (DRY, with docstrings) ---
def error_response(status_code: int, detail: str, request: Request, error: str = None, body=None):
    """Helper to standardize error responses."""
    content = {"detail": detail, "path": request.url.path}
    if error:
        content["error"] = error
    if body is not None:
        content["body"] = body
    return JSONResponse(status_code=status_code, content=content)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all for unhandled exceptions."""
    logger.error(f"Unhandled error: {exc}")
    return error_response(500, "Internal server error", request, error=str(exc) if getattr(app, 'debug', False) else None)

@app.exception_handler(FastAPIRequestValidationError)
async def validation_exception_handler(request: Request, exc: FastAPIRequestValidationError):
    """Handles validation errors from request bodies and query params."""
    logger.warning(f"Validation error: {exc}")
    return error_response(422, "Validation error", request, error=str(exc), body=exc.body)

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handles HTTPException (e.g., 404, 401, 403)."""
    logger.warning(f"HTTPException: {exc.detail} (status {exc.status_code}) at {request.url.path}")
    return error_response(exc.status_code, exc.detail, request)

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    """Handles SQLAlchemy database errors."""
    logger.error(f"Database error: {exc}")
    return error_response(status.HTTP_500_INTERNAL_SERVER_ERROR, "A database error occurred.", request, error=str(exc) if getattr(app, 'debug', False) else None)
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
import asyncio
from fastapi import APIRouter
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from loguru import logger

# Calculate async DB URL based on protocol
ASYNC_DB_URL = DATABASE_URL
if ASYNC_DB_URL.startswith("sqlite:///"):
    ASYNC_DB_URL = ASYNC_DB_URL.replace("sqlite:///", "sqlite+aiosqlite:///")
elif ASYNC_DB_URL.startswith("postgresql://"):
    ASYNC_DB_URL = ASYNC_DB_URL.replace("postgresql://", "postgresql+asyncpg://")

async_engine = create_async_engine(ASYNC_DB_URL, echo=True)

async def get_async_session() -> AsyncSession:
    async with AsyncSession(async_engine) as session:
        yield session


TEMPLATE_TAG = ["Templates"]

from pydantic import BaseModel

# --- User Model for Auth ---
class TemplateIn(BaseModel):
    name: str
    description: str | None = None

class TemplateOut(BaseModel):
    id: int
    name: str
    description: str | None = None
class User(SQLModelBaseUserDB, table=True):
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}

class UserCreate(fa_schemas.BaseUserCreate):
    pass

class UserUpdate(fa_schemas.BaseUserUpdate):
    pass

SECRET = "CHANGE_THIS_SECRET_KEY"

from fastapi_users.manager import BaseUserManager, UserManagerDependency

class UserManager(BaseUserManager[User, str]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)

bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLModelUserDatabase(session, User)

async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)

fastapi_users = FastAPIUsers[User, str](
    get_user_manager,
    [auth_backend],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/api/auth/jwt",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(User, UserCreate),
    prefix="/api/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(User, UserUpdate),
    prefix="/api/users",
    tags=["users"],
)

current_active_user = fastapi_users.current_user(active=True)
# --- More Relationship Endpoints ---
@app.get("/api/series/{series_id}/cast", response_model=List[CastMember])
def get_cast_for_series(series_id: int):
    with Session(engine) as session:
        return session.exec(select(CastMember).where(CastMember.series_id == series_id)).all()

@app.get("/api/scripts/{script_id}/narrativebeats", response_model=List[NarrativeBeat])
def get_narrativebeats_for_script(script_id: int):
    with Session(engine) as session:
        return session.exec(select(NarrativeBeat).where(NarrativeBeat.script_id == script_id)).all()

@app.get("/api/scripts/{script_id}/screeningroom", response_model=List[ScreeningRoomEntry])
def get_screeningroom_for_script(script_id: int):
    with Session(engine) as session:
        return session.exec(select(ScreeningRoomEntry).where(ScreeningRoomEntry.script_id == script_id)).all()
# --- Relationship Endpoints ---
@app.get("/api/series/{series_id}/scripts", response_model=List[Script])
def get_scripts_for_series(series_id: int):
    with Session(engine) as session:
        return session.exec(select(Script).where(Script.series_id == series_id)).all()

@app.get("/api/scripts/{script_id}/storyboards", response_model=List[Storyboard])
def get_storyboards_for_script(script_id: int):
    with Session(engine) as session:
        return session.exec(select(Storyboard).where(Storyboard.script_id == script_id)).all()

@app.on_event("startup")
async def on_startup_async():
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

ASYNC_DATABASE_URL = "sqlite+aiosqlite:///./anime_script_pro.db"
async_engine = create_async_engine(ASYNC_DATABASE_URL, echo=True)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Logs all incoming requests and their response status codes."""
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

@app.post(
    "/api/templates",
    response_model=TemplateOut,
    tags=TEMPLATE_TAG,
    summary="Create a new template",
    description="Create a new template with a name and optional description.",
    response_description="The created template object.",
    responses={201: {"description": "Template created successfully."}},
    status_code=201
)
@limiter.limit("5/minute")
async def create_template(request: Request, template: TemplateIn, user=Depends(current_active_user)):
    async with AsyncSession(async_engine) as session:
        db_template = Template(name=template.name, description=template.description)
        session.add(db_template)
        await session.commit()
        await session.refresh(db_template)
        return db_template

@app.get(
    "/api/templates",
    response_model=list[TemplateOut],
    tags=TEMPLATE_TAG,
    summary="List templates",
    description="List templates with pagination and optional name filtering.",
    response_description="A list of template objects."
)
async def get_templates(
    user=Depends(current_active_user),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    name: str | None = Query(None)
):
    async with AsyncSession(async_engine) as session:
        query = select(Template)
        if name:
            query = query.where(Template.name.contains(name))
        results = (await session.exec(query.offset(offset).limit(limit))).all()
        return results

@app.get(
    "/api/templates/{template_id}",
    response_model=TemplateOut,
    tags=TEMPLATE_TAG,
    summary="Get a template by ID",
    description="Retrieve a template by its unique ID.",
    response_description="The template object."
)
async def get_template(template_id: int, user=Depends(current_active_user)):
    async with AsyncSession(async_engine) as session:
        template = await session.get(Template, template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        return template

@app.put(
    "/api/templates/{template_id}",
    response_model=TemplateOut,
    tags=TEMPLATE_TAG,
    summary="Update a template",
    description="Update the name and description of a template.",
    response_description="The updated template object."
)
async def update_template(template_id: int, template: TemplateIn, user=Depends(current_active_user)):
    async with AsyncSession(async_engine) as session:
        db_template = await session.get(Template, template_id)
        if not db_template:
            raise HTTPException(status_code=404, detail="Template not found")
        db_template.name = template.name
        db_template.description = template.description
        session.add(db_template)
        await session.commit()
        await session.refresh(db_template)
        return db_template

@app.delete(
    "/api/templates/{template_id}",
    tags=TEMPLATE_TAG,
    summary="Delete a template",
    description="Delete a template by its unique ID.",
    response_description="Confirmation of deletion."
)
async def delete_template(template_id: int, user=Depends(current_active_user)):
    async with AsyncSession(async_engine) as session:
        template = await session.get(Template, template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        await session.delete(template)
        await session.commit()
        return {"ok": True}


# --- CRUD for Method (DB) ---
@app.get("/api/methods", response_model=List[Method])
def get_methods(user=Depends(current_active_user)):
    """Get all methods."""
    with Session(engine) as session:
        return session.exec(select(Method)).all()

@app.post("/api/methods", response_model=Method)
def create_method(method: Method, user=Depends(current_active_user)):
    """Create a new method."""
    with Session(engine) as session:
        session.add(method)
        session.commit()
        session.refresh(method)
        return method

@app.get("/api/methods/{method_id}", response_model=Method)
def get_method(method_id: int, user=Depends(current_active_user)):
    """Get a method by ID."""
    with Session(engine) as session:
        method = session.get(Method, method_id)
        if not method:
            raise HTTPException(status_code=404, detail="Method not found")
        return method

@app.put("/api/methods/{method_id}", response_model=Method)
def update_method(method_id: int, method: Method, user=Depends(current_active_user)):
    """Update a method by ID."""
    with Session(engine) as session:
        db_method = session.get(Method, method_id)
        if not db_method:
            raise HTTPException(status_code=404, detail="Method not found")
        db_method.name = method.name
        db_method.description = method.description
        session.add(db_method)
        session.commit()
        session.refresh(db_method)
        return db_method

@app.delete("/api/methods/{method_id}")
def delete_method(method_id: int, user=Depends(current_active_user)):
    """Delete a method by ID."""
    with Session(engine) as session:
        method = session.get(Method, method_id)
        if not method:
            raise HTTPException(status_code=404, detail="Method not found")
        session.delete(method)
        session.commit()
        return {"ok": True}


# --- CRUD for WorldLore (DB) ---
@app.post("/api/world-lore")
def create_worldlore(worldlore: WorldLore):
    """Create or update world lore."""
    with Session(engine) as session:
        session.add(worldlore)
        session.commit()
        session.refresh(worldlore)
        return worldlore

@app.get("/api/world-lore/{project_id}")
def get_worldlore(project_id: int):
    """Get world lore for a project."""
    with Session(engine) as session:
        return session.exec(select(WorldLore).where(WorldLore.id == project_id)).first() # Simplification for now


# --- CRUD for NarrativeBeat (DB) ---
@app.get("/api/narrativebeats", response_model=List[NarrativeBeat])
def get_narrativebeats():
    """Get all narrative beats."""
    with Session(engine) as session:
        return session.exec(select(NarrativeBeat)).all()

@app.post("/api/narrativebeats", response_model=NarrativeBeat)
def create_narrativebeat(narrativebeat: NarrativeBeat):
    """Create a new narrative beat."""
    with Session(engine) as session:
        session.add(narrativebeat)
        session.commit()
        session.refresh(narrativebeat)
        return narrativebeat

@app.get("/api/narrativebeats/{narrativebeat_id}", response_model=NarrativeBeat)
def get_narrativebeat(narrativebeat_id: int):
    """Get a narrative beat by ID."""
    with Session(engine) as session:
        narrativebeat = session.get(NarrativeBeat, narrativebeat_id)
        if not narrativebeat:
            raise HTTPException(status_code=404, detail="NarrativeBeat not found")
        return narrativebeat

@app.put("/api/narrativebeats/{narrativebeat_id}", response_model=NarrativeBeat)
def update_narrativebeat(narrativebeat_id: int, narrativebeat: NarrativeBeat):
    """Update a narrative beat by ID."""
    with Session(engine) as session:
        db_narrativebeat = session.get(NarrativeBeat, narrativebeat_id)
        if not db_narrativebeat:
            raise HTTPException(status_code=404, detail="NarrativeBeat not found")
        db_narrativebeat.label = narrativebeat.label
        db_narrativebeat.description = narrativebeat.description
        db_narrativebeat.duration = narrativebeat.duration
        session.add(db_narrativebeat)
        session.commit()
        session.refresh(db_narrativebeat)
        return db_narrativebeat

@app.delete("/api/narrativebeats/{narrativebeat_id}")
def delete_narrativebeat(narrativebeat_id: int):
    """Delete a narrative beat by ID."""
    with Session(engine) as session:
        narrativebeat = session.get(NarrativeBeat, narrativebeat_id)
        if not narrativebeat:
            raise HTTPException(status_code=404, detail="NarrativeBeat not found")
        session.delete(narrativebeat)
        session.commit()
        return {"ok": True}


# --- CRUD for CastMember / AI Characters (DB) ---
@app.get("/api/cast", response_model=List[CastMember])
def get_cast(project_id: Optional[int] = None):
    """Get cast members, optionally filtered by project_id."""
    with Session(engine) as session:
        statement = select(CastMember).where(CastMember.is_active == True)
        if project_id:
            statement = statement.where(CastMember.project_id == project_id)
        return session.exec(statement).all()

@app.post("/api/characters")
def batch_create_characters(payload: dict):
    """Batch create characters for a project."""
    project_id = payload.get("project_id")
    characters = payload.get("characters", [])
    
    with Session(engine) as session:
        created = []
        for c in characters:
            db_member = CastMember(
                name=c.get("name"),
                role=c.get("archetype", "Main"),
                archetype=c.get("archetype"),
                personality=c.get("personality"),
                appearance=c.get("appearance"),
                visual_prompt=c.get("visualPrompt") or c.get("visual_dna"),
                conflict=c.get("conflict"),
                goal=c.get("goal"),
                flaw=c.get("flaw"),
                speaking_style=c.get("speakingStyle"),
                secret=c.get("secret"),
                description=c.get("personality"),
                project_id=project_id
            )
            session.add(db_member)
            created.append(db_member)
        session.commit()
        for c in created:
            session.refresh(c)
        return created

@app.get("/api/cast/{castmember_id}", response_model=CastMember)
def get_castmember(castmember_id: int):
    """Get a cast member by ID."""
    with Session(engine) as session:
        castmember = session.get(CastMember, castmember_id)
        if not castmember:
            raise HTTPException(status_code=404, detail="CastMember not found")
        return castmember

@app.put("/api/cast/{castmember_id}", response_model=CastMember)
def update_castmember(castmember_id: int, castmember: CastMember):
    """Update a cast member by ID."""
    with Session(engine) as session:
        db_castmember = session.get(CastMember, castmember_id)
        if not db_castmember:
            raise HTTPException(status_code=404, detail="CastMember not found")
        data = castmember.dict(exclude_unset=True)
        for key, value in data.items():
            setattr(db_castmember, key, value)
        session.add(db_castmember)
        session.commit()
        session.refresh(db_castmember)
        return db_castmember

@app.delete("/api/cast/{castmember_id}")
def delete_castmember(castmember_id: int):
    """Delete a cast member by ID."""
    with Session(engine) as session:
        castmember = session.get(CastMember, castmember_id)
        if not castmember:
            raise HTTPException(status_code=404, detail="CastMember not found")
        session.delete(castmember)
        session.commit()
        return {"ok": True}

# --- CRUD for Projects (DB) ---
@app.get("/api/projects", response_model=List[Project])
def get_projects(user_id: str):
    """Get projects for a user."""
    with Session(engine) as session:
        return session.exec(select(Project).where(Project.user_id == user_id)).all()

@app.post("/api/projects", response_model=Project)
def create_project(project: Project):
    """Create a new project."""
    with Session(engine) as session:
        session.add(project)
        session.commit()
        session.refresh(project)
        return project


# --- CRUD for Series (DB) ---
@app.get("/api/series", response_model=List[Series])
def get_series():
    """Get all series."""
    with Session(engine) as session:
        return session.exec(select(Series)).all()

@app.post("/api/series", response_model=Series)
def create_series(series: Series):
    """Create a new series."""
    with Session(engine) as session:
        session.add(series)
        session.commit()
        session.refresh(series)
        return series

@app.get("/api/series/{series_id}", response_model=Series)
def get_series_item(series_id: int):
    """Get a series by ID."""
    with Session(engine) as session:
        series = session.get(Series, series_id)
        if not series:
            raise HTTPException(status_code=404, detail="Series not found")
        return series

@app.put("/api/series/{series_id}", response_model=Series)
def update_series(series_id: int, series: Series):
    """Update a series by ID."""
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

@app.delete("/api/series/{series_id}")
def delete_series(series_id: int):
    """Delete a series by ID."""
    with Session(engine) as session:
        series = session.get(Series, series_id)
        if not series:
            raise HTTPException(status_code=404, detail="Series not found")
        session.delete(series)
        session.commit()
        return {"ok": True}

@app.post("/api/sessions")
def batch_create_sessions(payload: dict):
    """Batch create or update sessions."""
    project_id = payload.get("project_id")
    sessions_data = payload.get("sessions", [])
    with Session(engine) as session:
        created = []
        for s in sessions_data:
            db_session = ProductionSession(
                project_id=project_id,
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

@app.get("/api/sessions")
def get_sessions(project_id: int):
    """Get sessions for a project."""
    with Session(engine) as session:
        return session.exec(select(ProductionSession).where(ProductionSession.project_id == project_id)).all()

@app.post("/api/episodes")
def batch_create_episodes(payload: dict):
    """Batch create or update episodes."""
    project_id = payload.get("project_id")
    episodes_data = payload.get("episodes", [])
    session_id = payload.get("session_id")
    with Session(engine) as session:
        created = []
        for e in episodes_data:
            db_ep = Episode(
                project_id=project_id,
                session_id=session_id,
                episode_number=e.get("episode_number"),
                title=e.get("title"),
                hook=e.get("hook"),
                summary=e.get("summary")
            )
            session.add(db_ep)
            created.append(db_ep)
        session.commit()
        for e in created:
            session.refresh(e)
        return created

@app.get("/api/episodes")
def get_episodes(project_id: int):
    """Get episodes for a project."""
    with Session(engine) as session:
        return session.exec(select(Episode).where(Episode.project_id == project_id)).all()

@app.post("/api/scenes")
def batch_create_scenes(payload: dict):
    """Batch create or update scenes."""
    project_id = payload.get("project_id")
    scenes_data = payload.get("scenes", [])
    episode_id = payload.get("episode_id")
    with Session(engine) as session:
        created = []
        for s in scenes_data:
            db_scene = Scene(
                project_id=project_id,
                episode_id=episode_id,
                scene_number=s.get("scene_number"),
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

@app.get("/api/scenes")
def get_scenes(project_id: int):
    """Get scenes for a project."""
    with Session(engine) as session:
        return session.exec(select(Scene).where(Scene.project_id == project_id)).all()

# --- NEW: Categories, Stats/Progress, and PromptLibrary ---
@app.get("/api/categories", response_model=List[Category])
def get_categories():
    with Session(engine) as session:
        return session.exec(select(Category).order_by(Category.name)).all()

@app.get("/api/stats/progress")
def get_stats_progress(project_id: int):
    with Session(engine) as session:
        # Simple implementation for now without complex CEIL logic
        scenes = session.exec(select(Scene).where(Scene.project_id == project_id)).all()
        # Logic to group into sessions (192 scenes per session)
        stats = {}
        for s in scenes:
            sess_idx = (s.scene_number - 1) // 192 + 1
            if sess_idx not in stats:
                stats[sess_idx] = {"session": sess_idx, "total": 0, "completed": 0, "in_production": 0}
            stats[sess_idx]["total"] += 1
            if s.status == "COMPLETED":
                stats[sess_idx]["completed"] += 1
            elif s.status != "QUEUED":
                stats[sess_idx]["in_production"] += 1
        return sorted(list(stats.values()), key=lambda x: x["session"])

@app.post("/api/prompt-library", response_model=PromptLibrary)
def create_prompt_library_entry(entry: PromptLibrary):
    with Session(engine) as session:
        session.add(entry)
        session.commit()
        session.refresh(entry)
        return entry

# --- CRUD for Script (DB) ---
@app.get("/api/scripts", response_model=List[Script])
def get_scripts():
    """Get all scripts."""
    with Session(engine) as session:
        return session.exec(select(Script)).all()

@app.post("/api/scripts", response_model=Script)
def create_script(script: Script):
    """Create a new script."""
    with Session(engine) as session:
        session.add(script)
        session.commit()
        session.refresh(script)
        return script

@app.get("/api/scripts/{script_id}", response_model=Script)
def get_script(script_id: int):
    """Get a script by ID."""
    with Session(engine) as session:
        script = session.get(Script, script_id)
        if not script:
            raise HTTPException(status_code=404, detail="Script not found")
        return script

@app.put("/api/scripts/{script_id}", response_model=Script)
def update_script(script_id: int, script: Script):
    """Update a script by ID."""
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

@app.delete("/api/scripts/{script_id}")
def delete_script(script_id: int):
    """Delete a script by ID."""
    with Session(engine) as session:
        script = session.get(Script, script_id)
        if not script:
            raise HTTPException(status_code=404, detail="Script not found")
        session.delete(script)
        session.commit()
        return {"ok": True}


# --- CRUD for Storyboard (DB) ---
@app.get("/api/storyboards", response_model=List[Storyboard])
def get_storyboards():
    """Get all storyboards."""
    with Session(engine) as session:
        return session.exec(select(Storyboard)).all()

@app.post("/api/storyboards", response_model=Storyboard)
def create_storyboard(storyboard: Storyboard):
    """Create a new storyboard."""
    with Session(engine) as session:
        session.add(storyboard)
        session.commit()
        session.refresh(storyboard)
        return storyboard

@app.get("/api/storyboards/{storyboard_id}", response_model=Storyboard)
def get_storyboard(storyboard_id: int):
    """Get a storyboard by ID."""
    with Session(engine) as session:
        storyboard = session.get(Storyboard, storyboard_id)
        if not storyboard:
            raise HTTPException(status_code=404, detail="Storyboard not found")
        return storyboard

@app.put("/api/storyboards/{storyboard_id}", response_model=Storyboard)
def update_storyboard(storyboard_id: int, storyboard: Storyboard):
    """Update a storyboard by ID."""
    with Session(engine) as session:
        db_storyboard = session.get(Storyboard, storyboard_id)
        if not db_storyboard:
            raise HTTPException(status_code=404, detail="Storyboard not found")
        db_storyboard.script_id = storyboard.script_id
        db_storyboard.image_url = storyboard.image_url
        db_storyboard.description = storyboard.description
        session.add(db_storyboard)
        session.commit()
        session.refresh(db_storyboard)
        return db_storyboard

@app.delete("/api/storyboards/{storyboard_id}")
def delete_storyboard(storyboard_id: int):
    """Delete a storyboard by ID."""
    with Session(engine) as session:
        storyboard = session.get(Storyboard, storyboard_id)
        if not storyboard:
            raise HTTPException(status_code=404, detail="Storyboard not found")
        session.delete(storyboard)
        session.commit()
        return {"ok": True}


# --- CRUD for SEOEntry (DB) ---
@app.get("/api/seo", response_model=List[SEOEntry])
def get_seo_entries():
    with Session(engine) as session:
        return session.exec(select(SEOEntry)).all()

@app.post("/api/seo", response_model=SEOEntry)
def create_seo_entry(seo_entry: SEOEntry):
    with Session(engine) as session:
        session.add(seo_entry)
        session.commit()
        session.refresh(seo_entry)
        return seo_entry

@app.get("/api/seo/{seo_id}", response_model=SEOEntry)
def get_seo_entry(seo_id: int):
    with Session(engine) as session:
        seo_entry = session.get(SEOEntry, seo_id)
        if not seo_entry:
            raise HTTPException(status_code=404, detail="SEOEntry not found")
        return seo_entry

@app.put("/api/seo/{seo_id}", response_model=SEOEntry)
def update_seo_entry(seo_id: int, seo_entry: SEOEntry):
    with Session(engine) as session:
        db_seo_entry = session.get(SEOEntry, seo_id)
        if not db_seo_entry:
            raise HTTPException(status_code=404, detail="SEOEntry not found")
        db_seo_entry.keyword = seo_entry.keyword
        db_seo_entry.description = seo_entry.description
        session.add(db_seo_entry)
        session.commit()
        session.refresh(db_seo_entry)
        return db_seo_entry

@app.delete("/api/seo/{seo_id}")
def delete_seo_entry(seo_id: int):
    with Session(engine) as session:
        seo_entry = session.get(SEOEntry, seo_id)
        if not seo_entry:
            raise HTTPException(status_code=404, detail="SEOEntry not found")
        session.delete(seo_entry)
        session.commit()
        return {"ok": True}


# --- CRUD for Prompt (DB) ---
@app.get("/api/prompts", response_model=List[Prompt])
def get_prompts():
    with Session(engine) as session:
        return session.exec(select(Prompt)).all()

@app.post("/api/prompts", response_model=Prompt)
def create_prompt(prompt: Prompt):
    with Session(engine) as session:
        session.add(prompt)
        session.commit()
        session.refresh(prompt)
        return prompt

@app.get("/api/prompts/{prompt_id}", response_model=Prompt)
def get_prompt(prompt_id: int):
    with Session(engine) as session:
        prompt = session.get(Prompt, prompt_id)
        if not prompt:
            raise HTTPException(status_code=404, detail="Prompt not found")
        return prompt

@app.put("/api/prompts/{prompt_id}", response_model=Prompt)
def update_prompt(prompt_id: int, prompt: Prompt):
    with Session(engine) as session:
        db_prompt = session.get(Prompt, prompt_id)
        if not db_prompt:
            raise HTTPException(status_code=404, detail="Prompt not found")
        db_prompt.text = prompt.text
        db_prompt.context = prompt.context
        session.add(db_prompt)
        session.commit()
        session.refresh(db_prompt)
        return db_prompt

@app.delete("/api/prompts/{prompt_id}")
def delete_prompt(prompt_id: int):
    with Session(engine) as session:
        prompt = session.get(Prompt, prompt_id)
        if not prompt:
            raise HTTPException(status_code=404, detail="Prompt not found")
        session.delete(prompt)
        session.commit()
        return {"ok": True}


# --- CRUD for ScreeningRoomEntry (DB) ---
@app.get("/screeningroom", response_model=List[ScreeningRoomEntry])
def get_screeningroom_entries():
    with Session(engine) as session:
        return session.exec(select(ScreeningRoomEntry)).all()

@app.post("/screeningroom", response_model=ScreeningRoomEntry)
def create_screeningroom_entry(entry: ScreeningRoomEntry):
    with Session(engine) as session:
        session.add(entry)
        session.commit()
        session.refresh(entry)
        return entry

@app.get("/screeningroom/{entry_id}", response_model=ScreeningRoomEntry)
def get_screeningroom_entry(entry_id: int):
    with Session(engine) as session:
        entry = session.get(ScreeningRoomEntry, entry_id)
        if not entry:
            raise HTTPException(status_code=404, detail="ScreeningRoomEntry not found")
        return entry

@app.put("/screeningroom/{entry_id}", response_model=ScreeningRoomEntry)
def update_screeningroom_entry(entry_id: int, entry: ScreeningRoomEntry):
    with Session(engine) as session:
        db_entry = session.get(ScreeningRoomEntry, entry_id)
        if not db_entry:
            raise HTTPException(status_code=404, detail="ScreeningRoomEntry not found")
        db_entry.script_id = entry.script_id
        db_entry.feedback = entry.feedback
        session.add(db_entry)
        session.commit()
        session.refresh(db_entry)
        return db_entry

@app.delete("/screeningroom/{entry_id}")
def delete_screeningroom_entry(entry_id: int):
    with Session(engine) as session:
        entry = session.get(ScreeningRoomEntry, entry_id)
        if not entry:
            raise HTTPException(status_code=404, detail="ScreeningRoomEntry not found")
        session.delete(entry)
        session.commit()
        return {"ok": True}

# --- WebSocket endpoint for real-time template notifications ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/templates/notifications")
async def websocket_template_notifications(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # Keep connection alive
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/api/settings/{user_id}", tags=["Settings"])
async def get_user_settings(user_id: str):
    try:
        async with AsyncSession(async_engine) as session:
            statement = select(UserSettings).where(UserSettings.user_id == user_id)
            results = await session.exec(statement)
            settings = results.first()
            if not settings:
                return {"user_id": user_id, "profile": {}, "security": {}, "notifications": {}, "ai_models": {}, "storage": {}, "billing": {}}
            return settings
    except Exception as e:
        logger.error(f"Failed to fetch user settings for {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal God Mode server error.")

@app.post("/api/settings/{user_id}", tags=["Settings"])
async def update_user_settings(user_id: str, payload: dict):
    try:
        async with AsyncSession(async_engine) as session:
            statement = select(UserSettings).where(UserSettings.user_id == user_id)
            results = await session.exec(statement)
            settings = results.first()
            if not settings:
                settings = UserSettings(user_id=user_id, profile={}, security={}, notifications={}, ai_models={}, storage={}, billing={})
                session.add(settings)
            
            if "profile" in payload: settings.profile = payload["profile"]
            if "security" in payload: settings.security = payload["security"]
            if "notifications" in payload: settings.notifications = payload["notifications"]
            if "ai_models" in payload: settings.ai_models = payload["ai_models"]
            if "storage" in payload: settings.storage = payload["storage"]
            if "billing" in payload: settings.billing = payload["billing"]
            
            await session.commit()
            await session.refresh(settings)
            return settings
    except Exception as e:
        logger.error(f"Failed to update user settings for {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save data. The database might be offline.")

@app.get("/api/profiles/{user_id}", tags=["Profile"])
async def get_user_profile(user_id: str):
    try:
        async with AsyncSession(async_engine) as session:
            statement = select(UserProfile).where(UserProfile.user_id == user_id)
            results = await session.exec(statement)
            profile = results.first()
            if not profile:
                default_handle = f"architect_{user_id[:5]}"
                profile = UserProfile(user_id=user_id, display_name="Shogun Architect", handle=default_handle)
                session.add(profile)
                await session.commit()
                await session.refresh(profile)
            return profile
    except Exception as e:
        logger.error(f"Profile fetch error for {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Identity Retrieval Failure.")

@app.post("/api/profiles/{user_id}", tags=["Profile"])
async def update_user_profile(user_id: str, payload: dict):
    try:
        async with AsyncSession(async_engine) as session:
            statement = select(UserProfile).where(UserProfile.user_id == user_id)
            results = await session.exec(statement)
            profile = results.first()
            if not profile:
                profile = UserProfile(user_id=user_id, handle=payload.get("handle", f"user_{user_id[:5]}"))
                session.add(profile)
            
            if "display_name" in payload: profile.display_name = payload["display_name"]
            if "handle" in payload: profile.handle = payload["handle"]
            if "bio" in payload: profile.bio = payload["bio"]
            if "avatar_url" in payload: profile.avatar_url = payload["avatar_url"]
            if "banner_url" in payload: profile.banner_url = payload["banner_url"]
            
            profile.updated_at = datetime.utcnow()
            await session.commit()
            await session.refresh(profile)
            return profile
    except Exception as e:
        logger.error(f"Profile update error for {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Identity Synchronization Failure.")

@app.get("/api/balances/{user_id}", tags=["Profile"])
async def get_user_balance(user_id: str):
    try:
        async with AsyncSession(async_engine) as session:
            statement = select(UserBalance).where(UserBalance.user_id == user_id)
            results = await session.exec(statement)
            balance = results.first()
            if not balance:
                balance = UserBalance(user_id=user_id, credits=5000, current_tier="Master")
                session.add(balance)
                await session.commit()
                await session.refresh(balance)
            return balance
    except Exception as e:
        logger.error(f"Balance fetch error: {str(e)}")
        raise HTTPException(status_code=500, detail="Neural Balance Check Failed.")

# --- Media & Generations Endpoints ---

@app.get("/api/assets/{user_id}", tags=["Media"])
async def get_user_assets(user_id: str, asset_type: Optional[str] = None):
    try:
        async with AsyncSession(async_engine) as session:
            statement = select(MediaAsset).where(MediaAsset.user_id == user_id)
            if asset_type:
                statement = statement.where(MediaAsset.asset_type == asset_type)
            statement = statement.order_by(MediaAsset.created_at.desc())
            results = await session.exec(statement)
            return results.all()
    except Exception as e:
        logger.error(f"Asset fetch error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve neural memories.")

@app.post("/api/assets", tags=["Media"])
async def create_asset(asset: MediaAsset):
    try:
        async with AsyncSession(async_engine) as session:
            session.add(asset)
            await session.commit()
            await session.refresh(asset)
            return asset
    except Exception as e:
        logger.error(f"Asset creation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to persist generation.")

@app.get("/api/favorites/{user_id}", tags=["Media"])
async def get_favorites(user_id: str):
    try:
        async with AsyncSession(async_engine) as session:
            # Join search for favorite assets
            statement = select(MediaAsset).join(UserFavorite).where(UserFavorite.user_id == user_id)
            results = await session.exec(statement)
            return results.all()
    except Exception as e:
        logger.error(f"Favorites fetch error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve bookmarked items.")

@app.post("/api/favorites", tags=["Media"])
async def toggle_favorite(favorite: UserFavorite):
    try:
        async with AsyncSession(async_engine) as session:
            # Check if exists
            statement = select(UserFavorite).where(
                UserFavorite.user_id == favorite.user_id,
                UserFavorite.asset_id == favorite.asset_id
            )
            results = await session.exec(statement)
            existing = results.first()
            if existing:
                await session.delete(existing)
                await session.commit()
                return {"status": "removed"}
            else:
                session.add(favorite)
                await session.commit()
                return {"status": "added"}
    except Exception as e:
        logger.error(f"Favorite toggle error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update bookmarks.")

# --- Creative Library & Studio Defaults ---

@app.get("/api/library/prompts/{user_id}", tags=["Library"])
async def get_saved_prompts(user_id: str):
    try:
        async with AsyncSession(async_engine) as session:
            statement = select(SavedPrompt).where(SavedPrompt.user_id == user_id)
            results = await session.exec(statement)
            return results.all()
    except Exception as e:
        logger.error(f"Saved Prompts fetch error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve prompt library.")

@app.post("/api/library/prompts", tags=["Library"])
async def create_saved_prompt(prompt: SavedPrompt):
    try:
        async with AsyncSession(async_engine) as session:
            session.add(prompt)
            await session.commit()
            await session.refresh(prompt)
            return prompt
    except Exception as e:
        logger.error(f"Saved Prompt creation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save neural template.")

@app.get("/api/library/characters/{user_id}", tags=["Library"])
async def get_characters(user_id: str):
    try:
        async with AsyncSession(async_engine) as session:
            statement = select(ReusableCharacter).where(ReusableCharacter.user_id == user_id)
            results = await session.exec(statement)
            return results.all()
    except Exception as e:
        logger.error(f"Character fetch error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve character sheets.")

@app.post("/api/library/characters", tags=["Library"])
async def create_character(char: ReusableCharacter):
    try:
        async with AsyncSession(async_engine) as session:
            session.add(char)
            await session.commit()
            await session.refresh(char)
            return char
    except Exception as e:
        logger.error(f"Character creation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to build character DNA.")

# --- CRUD for Tutorial (DB) ---
@app.get("/api/tutorials", response_model=List[Tutorial], tags=["Tutorials"])
async def get_tutorials():
    """Get all tutorials."""
    try:
        async with AsyncSession(async_engine) as session:
            statement = select(Tutorial).where(Tutorial.is_active == True)
            results = await session.exec(statement)
            return results.all()
    except Exception as e:
        logger.error(f"Failed to fetch tutorials: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve tutorials from database.")

@app.post("/api/tutorials", response_model=Tutorial, tags=["Tutorials"])
async def create_tutorial(tutorial: Tutorial, user=Depends(current_active_user)):
    """Create a new tutorial."""
    try:
        async with AsyncSession(async_engine) as session:
            session.add(tutorial)
            await session.commit()
            await session.refresh(tutorial)
            return tutorial
    except Exception as e:
        logger.error(f"Failed to create tutorial: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save tutorial. Database might be offline.")

@app.get("/api/tutorials/{tutorial_id}", response_model=Tutorial, tags=["Tutorials"])
async def get_tutorial(tutorial_id: int):
    """Get a tutorial by ID."""
    try:
        async with AsyncSession(async_engine) as session:
            tutorial = await session.get(Tutorial, tutorial_id)
            if not tutorial:
                raise HTTPException(status_code=404, detail="Tutorial not found")
            return tutorial
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching tutorial {tutorial_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching the tutorial.")

@app.put("/api/tutorials/{tutorial_id}", response_model=Tutorial, tags=["Tutorials"])
async def update_tutorial(tutorial_id: int, tutorial_update: Tutorial, user=Depends(current_active_user)):
    """Update a tutorial by ID."""
    try:
        async with AsyncSession(async_engine) as session:
            db_tutorial = await session.get(Tutorial, tutorial_id)
            if not db_tutorial:
                raise HTTPException(status_code=404, detail="Tutorial not found")
            
            db_tutorial.title = tutorial_update.title
            db_tutorial.description = tutorial_update.description
            db_tutorial.icon_name = tutorial_update.icon_name
            db_tutorial.duration = tutorial_update.duration
            db_tutorial.level = tutorial_update.level
            db_tutorial.category = tutorial_update.category
            
            session.add(db_tutorial)
            await session.commit()
            await session.refresh(db_tutorial)
            return db_tutorial
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update tutorial {tutorial_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update tutorial.")

@app.delete("/api/tutorials/{tutorial_id}", tags=["Tutorials"])
async def delete_tutorial(tutorial_id: int, user=Depends(current_active_user)):
    """Delete a tutorial by ID."""
    try:
        async with AsyncSession(async_engine) as session:
            tutorial = await session.get(Tutorial, tutorial_id)
            if not tutorial:
                raise HTTPException(status_code=404, detail="Tutorial not found")
            await session.delete(tutorial)
            await session.commit()
            return {"ok": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete tutorial {tutorial_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete tutorial.")

import json
import os

@app.post("/api/tutorials/seed", tags=["Tutorials"])
async def seed_tutorials():
    """Seed the database with initial tutorials from JSON file."""
    json_path = os.path.join(os.path.dirname(__file__), "database", "tutorials.json")
    
    try:
        if not os.path.exists(json_path):
             raise HTTPException(status_code=404, detail=f"Seed file not found at {json_path}")

        with open(json_path, "r") as f:
            initial_tutorials = json.load(f)
        
        async with AsyncSession(async_engine) as session:
            for t_data in initial_tutorials:
                # Check if tutorial already exists to avoid duplicates
                statement = select(Tutorial).where(Tutorial.title == t_data["title"])
                results = await session.exec(statement)
                if not results.first():
                    tutorial = Tutorial(**t_data)
                    session.add(tutorial)
            await session.commit()
            return {"message": "Tutorials seeded successfully from external file"}
    except Exception as e:
        logger.error(f"Failed to seed tutorials: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to initialize tutorial database.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("fastapi_app:app", host="0.0.0.0", port=8000, reload=True)
