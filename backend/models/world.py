from datetime import datetime
from typing import Optional, Dict, Any
from sqlmodel import SQLModel, Field, JSON

class WorldLore(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    project_id: Optional[int] = Field(default=None, index=True)
    
    # Modular Lore Data
    architecture: Optional[str] = Field(default=None)
    atlas: Optional[str] = Field(default=None)
    history: Optional[str] = Field(default=None)
    systems: Optional[str] = Field(default=None)
    culture: Optional[str] = Field(default=None)
    
    # Metadata
    full_lore_blob: Optional[str] = Field(default=None)
    metadata: Dict[str, Any] = Field(default_factory=dict, sa_type=JSON)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
