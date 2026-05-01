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
    lore_metadata: Dict[str, Any] = Field(default_factory=dict, sa_type=JSON)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CastMember(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    series_id: Optional[int] = Field(default=None, index=True)
    project_id: Optional[int] = Field(default=None, index=True)
    name: str = Field(index=True)
    role: str = Field(default="Character")
    description: Optional[str] = None
    visual_dna: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class NarrativeBeat(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    script_id: Optional[int] = Field(default=None, index=True)
    project_id: Optional[int] = Field(default=None, index=True)
    title: str = Field(index=True)
    content: str
    order: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ReusableCharacter(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    name: str = Field(index=True)
    backstory: Optional[str] = None
    personality: Optional[str] = None
    visual_traits: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
