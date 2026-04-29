from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from datetime import datetime, timezone, timedelta
from backend.models import User
from backend.database import async_engine
from backend.auth_utils import verify_password, create_access_token, create_refresh_token
from backend.user_manager import auth_backend, fastapi_users
from backend.models import User as UserTable # For pydantic schemas if needed

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 30

@router.post("/login")
async def secure_login(
    request: Request,
    response: Response,
    login_data: LoginRequest
):
    async with AsyncSession(async_engine) as db:
        result = await db.exec(select(User).where(User.email == login_data.email))
        user = result.first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
            
        if user.locked_until and user.locked_until.replace(tzinfo=timezone.utc) > datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account temporarily locked due to multiple failed login attempts."
            )
            
        if not verify_password(login_data.password, user.hashed_password):
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= MAX_FAILED_ATTEMPTS:
                user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_MINUTES)
            db.add(user)
            await db.commit()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
            
        user.failed_login_attempts = 0
        user.locked_until = None
        db.add(user)
        await db.commit()
        
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="strict",
            max_age=7 * 24 * 60 * 60
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": 15 * 60
        }
