import os
import json
from google import genai
from dotenv import load_dotenv

from loguru import logger
load_dotenv()

# Explicitly pass the API key since the .env file uses the VITE_ prefix
api_key = os.getenv("VITE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

class AIEngine:
    def __init__(self, model_name="gemini-1.5-flash-latest"):
        self.model_name = model_name

    async def generate_lore(self, title: str, description: str):
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
        logger.info(f"[AI Engine] Synthesizing Lore for: {title}")
        response = await client.aio.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )
        return response.text

    async def generate_characters(self, lore: str, count=3):
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
        logger.info(f"[AI Engine] Sequencing Character DNA...")
        response = await client.aio.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )
        return response.text

    async def generate_script_beats(self, title: str, lore: str, characters: str):
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
        logger.info(f"[AI Engine] Scripting Pilot Beats...")
        response = await client.aio.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )
        return response.text

ai_engine = AIEngine()
