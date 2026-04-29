import os
import httpx
from fastapi import Request, HTTPException, Depends
from loguru import logger
from typing import Optional

async def get_auth_user_id(request: Request):
    """
    Dependency that extracts user ID from either FastAPI-Users or Supabase JWT.
    """
    auth_header = request.headers.get("Authorization")
    
    # Handle development/bypass mode
    if os.getenv("BYPASS_AUTH") == "true":
        return "local-dev-architect-id"
        
    if not auth_header:
        if os.getenv("ENV") == "development":
            return "local-dev-architect-id"
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    # Try Supabase verification
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        supabase_url = os.getenv('VITE_SUPABASE_URL')
        supabase_key = os.getenv('VITE_SUPABASE_ANON_KEY')
        
        if supabase_url and supabase_key:
            url = f"{supabase_url}/auth/v1/user"
            headers = {
                "apikey": supabase_key,
                "Authorization": auth_header
            }
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(url, headers=headers)
                    if response.status_code == 200:
                        user_data = response.json()
                        return str(user_data["id"])
            except Exception as e:
                logger.error(f"Supabase auth check failed: {e}")

    # Fallback for local development
    if os.getenv("ENV") == "development":
         return "local-dev-architect-id"
         
    raise HTTPException(status_code=401, detail="Invalid authentication credentials")
