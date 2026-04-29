from typing import Optional, AsyncGenerator
from fastapi import Depends
from fastapi_users import BaseUserManager, FastAPIUsers, schemas as fa_schemas
from fastapi_users.authentication import AuthenticationBackend, BearerTransport, JWTStrategy
from fastapi_users_db_sqlmodel import SQLModelUserDatabase
from sqlmodel.ext.asyncio.session import AsyncSession

from backend.models import User
from backend.database import get_async_session

# --- FastAPI Users Pydantic Schemas ---
class UserRead(fa_schemas.BaseUser):
    pass

class UserCreate(fa_schemas.BaseUserCreate):
    pass

class UserUpdate(fa_schemas.BaseUserUpdate):
    pass

SECRET = "CHANGE_THIS_SECRET_KEY"

class UserManager(BaseUserManager[User, str]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLModelUserDatabase(session, User)

async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)

bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, str](
    get_user_manager,
    [auth_backend],
)

current_active_user = fastapi_users.current_user(active=True)
