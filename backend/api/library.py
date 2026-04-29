from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
from backend.models import SavedPrompt, ReusableCharacter
from backend.database import async_engine
from backend.deps import get_auth_user_id

router = APIRouter(prefix="/api/library", tags=["Creative Library"])

@router.get("/prompts/{user_id}")
async def get_saved_prompts(user_id: str):
    async with AsyncSession(async_engine) as session:
        statement = select(SavedPrompt).where(SavedPrompt.user_id == user_id)
        results = await session.exec(statement)
        return results.all()

@router.post("/prompts")
async def create_saved_prompt(prompt: SavedPrompt):
    async with AsyncSession(async_engine) as session:
        session.add(prompt)
        await session.commit()
        await session.refresh(prompt)
        return prompt

@router.get("/characters/{user_id}")
async def get_characters(user_id: str):
    async with AsyncSession(async_engine) as session:
        statement = select(ReusableCharacter).where(ReusableCharacter.user_id == user_id)
        results = await session.exec(statement)
        return results.all()

@router.post("/characters")
async def create_character(char: ReusableCharacter):
    async with AsyncSession(async_engine) as session:
        session.add(char)
        await session.commit()
        await session.refresh(char)
        return char
