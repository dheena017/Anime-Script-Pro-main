import pytest
from httpx import AsyncClient
from fastapi import status
from backend.fastapi_app import app

@pytest.mark.asyncio
async def test_create_and_get_template():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Register a user
        register_resp = await ac.post("/auth/register", json={
            "email": "testuser@example.com",
            "password": "testpassword"
        })
        assert register_resp.status_code == status.HTTP_201_CREATED
        # Login to get JWT
        login_resp = await ac.post("/auth/jwt/login", data={
            "username": "testuser@example.com",
            "password": "testpassword"
        })
        assert login_resp.status_code == status.HTTP_200_OK
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        # Create a template
        create_resp = await ac.post("/templates", json={"name": "Test Template"}, headers=headers)
        assert create_resp.status_code == status.HTTP_200_OK
        template_id = create_resp.json()["id"]
        # Get the template
        get_resp = await ac.get(f"/templates/{template_id}", headers=headers)
        assert get_resp.status_code == status.HTTP_200_OK
        assert get_resp.json()["name"] == "Test Template"
