import os
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from google import genai
from google.genai import types
from loguru import logger

logger.info(f"!!! AI MODULE INITIALIZED: {__file__} !!!")
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from backend.database import async_engine
from backend.models import Project
from backend.deps import get_auth_user_id
from backend.ai_engine import ai_engine
from backend.schemas import GenerationRequest, GenerationResponse

router = APIRouter(prefix="/api/ai", tags=["AI Engine"])

MODEL_MAP = {
    # 3.0 Series (Preview/Live)
    "gemini-3-flash-live": "gemini-flash-latest",
    "gemini 3 flash live": "gemini-flash-latest", 
    "gemini-3-flash": "gemini-3-flash-preview",
    "gemini-3-pro": "gemini-3-pro-preview",
    
    # 2.5 Series
    "gemini-2.5-flash": "gemini-flash-latest", # Diverting to stable latest
    "gemini-2.5-flash-lite": "gemini-flash-lite-latest",
    "gemini-2.5-pro": "gemini-pro-latest",
    
    # Standard Aliases
    "gemini-flash-latest": "gemini-flash-latest",
    "gemini-pro-latest": "gemini-pro-latest",
    "gemini-flash": "gemini-flash-latest",
    "gemini-pro": "gemini-pro-latest",
    
    # Legacy/Compatibility
    "gemini-1.5-flash": "gemini-flash-latest",
    "gemini-1.5-pro": "gemini-pro-latest",
}

@router.post("/generate", response_model=GenerationResponse)
async def generate_content(request: GenerationRequest):
    """
    Unified AI generation endpoint with robust model mapping and fallback.
    """
    raw_model = request.model.lower().strip()
    normalized_model = raw_model.replace(" ", "-")
    
    # Direct lookup in the map
    target_model = MODEL_MAP.get(normalized_model, MODEL_MAP.get(raw_model, normalized_model))
    
    # Second pass resolution (for double-aliased models)
    if target_model in MODEL_MAP:
        target_model = MODEL_MAP[target_model]
    
    # Final safety check against the known stable registry
    STABLE_MODELS = ["gemini-flash-latest", "gemini-pro-latest", "gemini-2.0-flash", "gemini-flash-lite-latest"]
    if target_model not in STABLE_MODELS and not target_model.endswith("-preview"):
        logger.warning(f"Resolved model '{target_model}' not in stable registry. Falling back to gemini-flash-latest.")
        target_model = "gemini-flash-latest"
    
    logger.info(f"AI Request: {request.model} -> Resolved to: {target_model}")

    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("VITE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="AI Engine API key not configured. Please add GOOGLE_API_KEY or VITE_GEMINI_API_KEY to your .env file.")
        
    try:
        client = genai.Client(api_key=api_key)
        
        config = {}
        if request.systemInstruction:
            config["system_instruction"] = request.systemInstruction
            
        response = client.models.generate_content(
            model=target_model,
            contents=request.prompt,
            config=types.GenerateContentConfig(**config) if config else None
        )
        
        # Extract text and handle potential response structures
        output_text = response.text if hasattr(response, "text") else str(response)
        
        # Convert usage metadata to dict if possible
        usage_dict = {}
        if hasattr(response, "usage_metadata") and response.usage_metadata:
            try:
                # The new SDK objects often have a model_dump or can be converted to dict
                usage_dict = {
                    "prompt_tokens": getattr(response.usage_metadata, "prompt_token_count", 0),
                    "candidates_tokens": getattr(response.usage_metadata, "candidates_token_count", 0),
                    "total_tokens": getattr(response.usage_metadata, "total_token_count", 0)
                }
            except Exception:
                usage_dict = {}

        return GenerationResponse(
            text=output_text,
            model_used=request.model,
            finish_reason="STOP", # Simplified for now
            usage=usage_dict
        )
    except Exception as e:
        logger.error(f"AI Generation failed: {e}")
        # Custom message to verify if this code is actually running
        raise HTTPException(status_code=500, detail=f"AI Engine Error (V2): {str(e)}")

@router.post("/generate/god-mode/{project_id}")
async def initialize_god_mode(project_id: int, user_id: str = Depends(get_auth_user_id)):
    """
    MASTER GENERATION LOOP: 
    1. Generates World Lore
    2. Designs a Core Cast
    3. Scaffolds the Pilot Narrative Beats
    """
    async with AsyncSession(async_engine) as session:
        project = await session.get(Project, project_id)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=404, detail="Project not found")

        try:
            # Phase 1: Neural Lore Architecture
            lore_raw = await ai_engine.generate_lore(project.title, project.description or "A new creative production.")
            project.prod_metadata["world_lore"] = lore_raw
            
            # Phase 2: Character DNA Synthesis
            cast_raw = await ai_engine.generate_characters(lore_raw)
            project.prod_metadata["cast_dna"] = cast_raw
            
            # Phase 3: Narrative Beat Scaffolding
            beats_raw = await ai_engine.generate_script_beats(project.title, lore_raw, cast_raw)
            project.prod_metadata["narrative_scaffolding"] = beats_raw
            
            project.status = "INITIALIZED"
            project.updated_at = datetime.utcnow()
            session.add(project)
            await session.commit()
            
            return {
                "status": "READY",
                "project_id": project_id,
                "workflow": "GOD_MODE_SYNC_COMPLETE"
            }
        except Exception as e:
            logger.error(f"God Mode Global Failure for project {project_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Global neural synthesis failed: {str(e)}")
