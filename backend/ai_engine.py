import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from backend.database import async_engine
from backend.models.user import UserSettings

from loguru import logger

# Load .env from root directory
dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)

def _use_vertexai() -> bool:
    return os.getenv("GOOGLE_GENAI_USE_VERTEXAI", "").strip().lower() in ("1", "true", "yes")


def build_genai_client(api_key: str | None = None) -> genai.Client:
    use_vertexai = _use_vertexai()
    if use_vertexai:
        client_kwargs = {
            "vertexai": True,
        }
        project = os.getenv("GOOGLE_CLOUD_PROJECT")
        location = os.getenv("GOOGLE_CLOUD_LOCATION")
        if project:
            client_kwargs["project"] = project
        if location:
            client_kwargs["location"] = location
        if api_key:
            client_kwargs["api_key"] = api_key
        return genai.Client(**client_kwargs)

    if api_key:
        return genai.Client(api_key=api_key)

    return genai.Client()


class AIEngine:
    def __init__(self, model_name="gemini-1.5-flash-latest"):
        self.model_name = model_name

    async def _get_client(self, user_id: str = None):
        """Retrieves a genai.Client initialized with the best available API key."""
        api_key = None
        
        # 1. Try to get key from User Settings
        if user_id:
            try:
                async with AsyncSession(async_engine) as session:
                    statement = select(UserSettings).where(UserSettings.user_id == user_id)
                    result = await session.exec(statement)
                    settings = result.first()
                    if settings and settings.ai_models:
                        api_key = settings.ai_models.get("gemini_api_key")
            except Exception as e:
                logger.warning(f"[AI Engine] Failed to fetch user settings for {user_id}: {e}")

        # 2. Fallback to Env
        if not api_key:
            api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("VITE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")

        if not api_key and not _use_vertexai():
            raise ValueError("No Gemini API key found in user settings or environment.")

        return build_genai_client(api_key=api_key)

    async def generate_lore(self, title: str, description: str, user_id: str = None):
        prompt = f"""
        Role: Master World Architect
        Task: Initialize World Lore for a new production.
        Title: {title}
        Core Concept: {description}

        Generate a detailed world setting including:
        1. Setting Name
        2. Era/Tone
        3. Core Conflict
        4. Unique World Mechanics

        Return only a JSON object.
        """
        logger.info(f"PROCESS: [🗺️] Architecting World Lore: <cyan>{title}</cyan> (User: {user_id})")
        client = await self._get_client(user_id)
        response = await client.aio.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )
        return response.text

    async def generate_characters(self, lore: str, count=3, user_id: str = None):
        prompt = f"""
        Role: Lead Character Designer
        Task: Create {count} core characters for this world.
        World Lore: {lore}

        For each character, provide:
        - Name
        - Role (Main, Rival, Support)
        - Archetype
        - Visual DNA (detailed prompt)
        - Core Motivation
        - Secret

        Return only a JSON array of objects.
        """
        logger.info(f"PROCESS: [🧬] Sequencing Character DNA... (User: {user_id})")
        client = await self._get_client(user_id)
        response = await client.aio.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )
        return response.text

    async def generate_script_beats(self, title: str, lore: str, characters: str, user_id: str = None):
        prompt = f"""
        Role: Narrative Director
        Task: Outline the first 10 narrative beats for the pilot episode.
        Series: {title}
        World: {lore}
        Cast: {characters}

        For each beat, provide:
        - Label
        - Description
        - Visual Cue
        - Est. Duration

        Return only a JSON array of objects.
        """
        logger.info(f"PROCESS: [🎬] Scripting Pilot Beats... (User: {user_id})")
        client = await self._get_client(user_id)
        response = await client.aio.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )
        return response.text

ai_engine = AIEngine()
