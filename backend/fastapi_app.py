import os
import sys
from datetime import datetime
from typing import List, Optional, Dict
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status, Response, Request, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError as FastAPIRequestValidationError
from sqlmodel import SQLModel, Session, select
from sqlalchemy.exc import SQLAlchemyError
from loguru import logger
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.staticfiles import StaticFiles

# Add parent directory to path to allow absolute imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.database import engine, async_engine, get_async_session
from backend.models import Tutorial
from backend.user_manager import fastapi_users, auth_backend, UserRead, UserCreate, UserUpdate
from backend.deps import get_auth_user_id
from backend.schemas import GenerationResponse

# --- FastAPI app initialization ---
app = FastAPI(
    title="Anime Script Pro API",
    version="1.0.0",
    description="Backend API for Anime Script Pro. Provides authentication, project, and AI endpoints.",
    docs_url=None,  # Disable default docs
    redoc_url=None, # Disable default redoc
)

# Mount local static files for Swagger UI
static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# --- SlowAPI Limiter ---
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded", "error": str(exc)},
    )

# --- Exception Handlers ---
def error_response(status_code: int, detail: str, request: Request, error: str = None, body=None):
    content = {"detail": detail, "path": request.url.path}
    if error: content["error"] = error
    if body: content["body"] = body
    return JSONResponse(status_code=status_code, content=content)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}")
    return error_response(500, "Internal server error", request, error=str(exc))

@app.exception_handler(FastAPIRequestValidationError)
async def validation_exception_handler(request: Request, exc: FastAPIRequestValidationError):
    return error_response(422, "Validation error", request, error=str(exc), body=exc.body)

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database error: {exc}")
    err_str = str(exc) if getattr(app, 'debug', False) else "A database error occurred."
    return error_response(500, "A database error occurred.", request, error=err_str)

# --- Middleware ---
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

# --- Routers ---
from api.templates import router as templates_router
from api.projects import router as projects_router
from api.scripts import router as scripts_router
from api.users import router as users_router
from api.media import router as media_router
from api.notifications import router as notifications_router
from api.auth import router as auth_router
from api.stats import router as stats_router
from api.admin import router as admin_router
from api.world import router as world_router
from api.ai import router as ai_router
from api.tutorials import router as tutorials_router
from api.library import router as library_router
from api.seo import router as seo_router
from api.community import router as community_router
from api.help import router as help_router

# Core system routes
@app.get("/", tags=["system"])
async def root():
    return {"message": "Welcome to Anime Script Pro API. Visit /docs for documentation.", "status": "online"}

@app.get("/health", tags=["system"])
async def health():
    return {"status": "ok"}

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

# Custom Docs Routes (Local Assets)
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url or "/openapi.json",
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )

# --- Compatibility Aliases ---
from api.ai import generate_content
app.post("/api/generate", tags=["AI Engine"], response_model=GenerationResponse)(generate_content)

# Include routers
app.include_router(templates_router)
app.include_router(projects_router)
app.include_router(scripts_router)
app.include_router(users_router)
app.include_router(media_router)
app.include_router(notifications_router)
app.include_router(auth_router)
app.include_router(stats_router)
app.include_router(admin_router)
app.include_router(world_router)
app.include_router(ai_router)
app.include_router(tutorials_router)
app.include_router(library_router)
app.include_router(seo_router)
app.include_router(community_router)
app.include_router(help_router)

# FastAPI Users Auth Routers
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/api/auth/jwt",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/api/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/api/users",
    tags=["users"],
)

# --- WebSocket ---
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
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# --- Startup Events ---
@app.on_event("startup")
async def on_startup():
    # Create tables
    SQLModel.metadata.create_all(engine)
    
    # Auto-seed if empty
    with Session(engine) as session:
        if not session.exec(select(Tutorial)).first():
            logger.info("Database empty. Initializing with default studio data...")
            from seed_all import seed_all
            try:
                seed_all()
            except Exception as e:
                logger.error(f"Auto-seeding failed: {e}")

@app.on_event("startup")
async def on_startup_async():
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
