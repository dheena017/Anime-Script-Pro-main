import logging
import os
import sys
import warnings

# Ensure project root and backend package roots are importable when running this module directly
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_ROOT = os.path.dirname(os.path.abspath(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

# Suppress all runtime user warnings during backend startup
warnings.filterwarnings(
    "ignore",
    category=UserWarning,
)

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


def configure_logging() -> None:
    logger.remove()
    logger.add(
        sys.stderr,
        level="INFO",
        colorize=True,
        format="<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        backtrace=False,
        diagnose=False,
    )

    class InterceptHandler(logging.Handler):
        def emit(self, record: logging.LogRecord) -> None:
            try:
                level = logger.level(record.levelname).name
            except ValueError:
                level = record.levelno
            frame, depth = logging.currentframe(), 2
            while frame is not None and frame.f_code.co_filename == logging.__file__:
                frame = frame.f_back
                depth += 1
            logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())

    intercept_loggers = [
        "uvicorn",
        "uvicorn.error",
        "uvicorn.access",
        "fastapi",
        "sqlalchemy",
        "sqlmodel",
    ]
    for name in intercept_loggers:
        logging.getLogger(name).handlers = [InterceptHandler()]
        logging.getLogger(name).propagate = False


# Add project root to path to allow absolute imports when run directly
# (This is also safe when imported as a module.)

from backend.database import engine, async_engine, get_async_session
from backend.models import Tutorial
from backend.user_manager import fastapi_users, auth_backend, UserRead, UserCreate, UserUpdate
from backend.deps import get_auth_user_id
from backend.schemas import GenerationResponse

configure_logging()

# --- FastAPI app initialization ---
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)
logging.getLogger('sqlalchemy.pool').setLevel(logging.WARNING)
logging.getLogger('sqlalchemy').setLevel(logging.WARNING)
logging.getLogger('sqlmodel').setLevel(logging.WARNING)

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
    import time
    start_time = time.perf_counter()
    
    # Capture relevant request details
    method = request.method
    path = request.url.path
    query = request.url.query
    
    logger.info(f"INCOMING: {method} {path}{'?' + query if query else ''}")
    
    try:
        response = await call_next(request)
        process_time = (time.perf_counter() - start_time) * 1000
        
        status_color = "green" if response.status_code < 400 else "yellow" if response.status_code < 500 else "red"
        logger.info(f"OUTGOING: {method} {path} | <{status_color}>{response.status_code}</{status_color}> | Latency: {process_time:.2f}ms")
        
        return response
    except Exception as e:
        logger.error(f"CRITICAL: Middleware caught exception during {method} {path}: {str(e)}")
        raise

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

@app.get("/api/health", tags=["system"], include_in_schema=False)
async def api_health():
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
    banner = """
    ================================================================================
    █████╗ ███╗   ██╗██╗███╗   ███╗███████╗    ███████╗ ██████╗██████╗ ██╗██████╗ ████████╗
    ██╔══██╗████╗  ██║██║████╗ ████║██╔════╝    ██╔════╝██╔════╝██╔══██╗██║██╔══██╗╚══██╔══╝
    ███████║██╔██╗ ██║██║██╔████╔██║█████╗      ███████╗██║     ██████╔╝██║██████╔╝   ██║   
    ██╔══██║██║╚██╗██║██║██║╚██╔╝██║██╔══╝      ╚════██║██║     ██╔══██╗██║██╔═══╝    ██║   
    ██║  ██║██║ ╚████║██║██║ ╚═╝ ██║███████╗    ███████║╚██████╗██║  ██║██║██║        ██║   
    ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝╚══════╝    ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝        ╚═╝   
    ================================================================================
    PRO PRODUCTION SUITE | NEURAL ENGINE v1.0.0 | STATUS: INITIALIZING...
    """
    for line in banner.strip().split("\n"):
        logger.info(line)

    logger.info("Starting Anime Script Pro backend...")
    logger.info("Loading environment variables and preparing database...")

    # 1. Initialize Database & Sync Metadata (Async)
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    logger.success("DATABASE: Metadata synced successfully.")
    
    # 2. Auto-seed if empty (Synchronous check within session)
    with Session(engine) as session:
        if not session.exec(select(Tutorial)).first():
            logger.warning("DATABASE: Studio data missing. Initializing core templates...")
            from seed_all import seed_all
            try:
                seed_all()
                logger.success("DATABASE: Auto-seeding complete. Studio assets deployed.")
            except Exception as e:
                logger.error(f"DATABASE: Auto-seeding failed: {e}")
        else:
            logger.info("DATABASE: Persistence verified. Skipping seed.")

    logger.success("SYSTEM: Anime Script Pro Production Suite is ONLINE.")

@app.on_event("shutdown")
async def on_shutdown():
    logger.info("Anime Script Pro backend is shutting down.")
