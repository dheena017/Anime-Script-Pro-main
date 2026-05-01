import os
import httpx
from fastapi import Request, HTTPException, Depends
from loguru import logger
from typing import Optional

from jose import jwt
from backend.auth_utils import SECRET_KEY, ALGORITHM

async def get_auth_user_id(request: Request):
    """
    Dependency that extracts user ID from the local JWT token.
    """
    auth_header = request.headers.get("Authorization")
    # Debug: log incoming auth headers for diagnosis
    try:
        logger.debug(f"AUTH DEP: Authorization={auth_header} x-bypass-auth={request.headers.get('x-bypass-auth')}")
    except Exception:
        pass
    
    # Handle development/bypass mode
    # Allow bypass via env or proxy header during development
    if os.getenv("BYPASS_AUTH") == "true" or request.headers.get('x-bypass-auth') == 'true':
        logger.debug("AUTH DEP: bypass active via env/header")
        return "local-dev-architect-id"
        
    if not auth_header:
        if os.getenv("ENV") == "development":
            return "local-dev-architect-id"
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        
        try:
            # First, try to decode as a local JWT
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            if user_id:
                return str(user_id)
        except Exception:
            # If local decoding fails, try Supabase (for transition period/compatibility)
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

    # Final fallback for local development
    if os.getenv("ENV") == "development":
         return "local-dev-architect-id"
         
    raise HTTPException(status_code=401, detail="Invalid authentication credentials")
