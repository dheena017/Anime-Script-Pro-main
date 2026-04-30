from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
from datetime import datetime
from loguru import logger
from backend.models import UserProfile, UserSettings, UserBalance
from backend.database import async_engine
from backend.deps import get_auth_user_id

router = APIRouter(prefix="/api", tags=["Users"])

@router.get("/profiles/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: str):
    async with AsyncSession(async_engine) as session:
        statement = select(UserProfile).where(UserProfile.user_id == user_id)
        result = await session.execute(statement)
        profile = result.scalars().first()
        if not profile:
            # Create default profile if it doesn't exist
            profile = UserProfile(user_id=user_id, handle=f"architect_{user_id[:5]}")
            session.add(profile)
            await session.commit()
            await session.refresh(profile)
        return profile

@router.post("/profiles/{user_id}", response_model=UserProfile)
async def update_user_profile(user_id: str, payload: dict):
    async with AsyncSession(async_engine) as session:
        statement = select(UserProfile).where(UserProfile.user_id == user_id)
        result = await session.execute(statement)
        profile = result.scalars().first()
        if not profile:
            profile = UserProfile(user_id=user_id, handle=payload.get("handle", f"user_{user_id[:5]}"))
            session.add(profile)
        
        if "display_name" in payload: profile.display_name = payload["display_name"]
        if "handle" in payload: profile.handle = payload["handle"]
        if "bio" in payload: profile.bio = payload["bio"]
        if "avatar_url" in payload: profile.avatar_url = payload["avatar_url"]
        if "banner_url" in payload: profile.banner_url = payload["banner_url"]
        
        profile.updated_at = datetime.utcnow()
        session.add(profile)
        await session.commit()
        await session.refresh(profile)
        return profile

@router.get("/settings/{user_id}", response_model=UserSettings)
async def get_user_settings(user_id: str):
    async with AsyncSession(async_engine) as session:
        statement = select(UserSettings).where(UserSettings.user_id == user_id)
        result = await session.execute(statement)
        settings = result.scalars().first()
        if not settings:
            settings = UserSettings(user_id=user_id, profile={}, security={}, notifications={}, ai_models={}, storage={}, billing={})
            session.add(settings)
            await session.commit()
            await session.refresh(settings)
        return settings

@router.post("/settings/{user_id}", response_model=UserSettings)
async def update_user_settings(user_id: str, payload: dict):
    async with AsyncSession(async_engine) as session:
        statement = select(UserSettings).where(UserSettings.user_id == user_id)
        result = await session.execute(statement)
        settings = result.scalars().first()
        if not settings:
            settings = UserSettings(user_id=user_id, profile={}, security={}, notifications={}, ai_models={}, storage={}, billing={})
            session.add(settings)
        
        if "profile" in payload: settings.profile = payload["profile"]
        if "security" in payload: settings.security = payload["security"]
        if "notifications" in payload: settings.notifications = payload["notifications"]
        if "ai_models" in payload: settings.ai_models = payload["ai_models"]
        if "storage" in payload: settings.storage = payload["storage"]
        if "billing" in payload: settings.billing = payload["billing"]
        
        settings.updated_at = datetime.utcnow()
        session.add(settings)
        await session.commit()
        await session.refresh(settings)
        return settings

@router.get("/balances/{user_id}", response_model=UserBalance)
async def get_user_balance(user_id: str):
    async with AsyncSession(async_engine) as session:
        statement = select(UserBalance).where(UserBalance.user_id == user_id)
        result = await session.execute(statement)
        balance = result.scalars().first()
        if not balance:
            balance = UserBalance(user_id=user_id, credits=5000, current_tier="MASTER ARCHITECT")
            session.add(balance)
            await session.commit()
            await session.refresh(balance)
        return balance
