import pytest
from httpx import AsyncClient, ASGITransport
from fastapi import status
from backend.fastapi_app import app, engine
from sqlmodel import SQLModel

@pytest.mark.asyncio
async def test_production_creation_flow():
    """
    Test the full production data flow from Project creation to Scene scaffolding.
    Ensures that the backend correctly handles the data and persists it (to a test DB).
    """
    # Create tables
    SQLModel.metadata.create_all(engine)
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Create a Project (Initial Foundation)
        project_data = {
            "user_id": "test_user_123",
            "name": "E2E Test Production",
            "content_type": "Anime",
            "prompt": "Gravity controlled by music.",
            "vibe": "Shonen Catalyst",
            "prod_metadata": {"engine": "2.0"}
        }
        resp = await ac.post("/api/projects", json=project_data)
        if resp.status_code not in [200, 201]:
            print(f"Project Creation Failed: {resp.status_code} - {resp.text}")
        assert resp.status_code == status.HTTP_201_CREATED or resp.status_code == 200
        project = resp.json()
        project_id = project["id"]
        assert project["name"] == project_data["name"]

        # 2. Add World Lore
        lore_data = {
            "project_id": project_id,
            "title": "System Foundation",
            "content": "The Umbra Realm coexists with the light.",
            "prod_metadata": {"source": "AI"}
        }
        resp = await ac.post("/api/world-lore", json=lore_data)
        assert resp.status_code == 201 or resp.status_code == 200

        # 3. Add Characters (Cast Profiles)
        cast_data = {
            "project_id": project_id,
            "characters": [
                {"name": "Shadow Weaver", "role": "Main", "archetype": "Anti-Hero"},
                {"name": "Lightbringer", "role": "Rival", "archetype": "Pure Soul"}
            ]
        }
        resp = await ac.post("/api/characters", json=cast_data)
        assert resp.status_code == 201 or resp.status_code == 200

        # 4. Add Sessions
        session_data = {
            "project_id": project_id,
            "sessions": [
                {"session_number": 1, "title": "Session 1", "summary": "Start"},
                {"session_number": 2, "title": "Session 2", "summary": "Middle"}
            ]
        }
        resp = await ac.post("/api/sessions", json=session_data)
        assert resp.status_code == 201 or resp.status_code == 200
        sessions = resp.json()
        assert len(sessions) == 2

        # 5. Add Episodes linked to a Session
        episode_data = {
            "project_id": project_id,
            "session_id": sessions[0]["id"],
            "episodes": [
                {"episode_number": 1, "title": "Ep 1", "hook": "The Shadow Awakens"},
                {"episode_number": 2, "title": "Ep 2", "hook": "First Note"}
            ]
        }
        resp = await ac.post("/api/episodes", json=episode_data)
        assert resp.status_code == 201 or resp.status_code == 200
        episodes = resp.json()

        # 6. Add Scenes linked to an Episode
        scene_data = {
            "project_id": project_id,
            "episode_id": episodes[0]["id"],
            "scenes": [
                {"scene_number": 1, "status": "QUEUED", "prompt": "Intro"},
                {"scene_number": 2, "status": "QUEUED", "prompt": "Conflict"}
            ]
        }
        resp = await ac.post("/api/scenes", json=scene_data)
        assert resp.status_code == 201 or resp.status_code == 200
        
        print(f"\n[Backend Audit] Full production lifecycle verified for Project {project_id}")
