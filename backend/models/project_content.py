from datetime import datetime
from typing import Optional, Dict, Any, List
from sqlmodel import SQLModel, Field, JSON

class ProjectContent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    project_id: Optional[int] = Field(default=None, index=True)
    
    # Cast & Character Data
    cast_profiles: Optional[str] = Field(default=None)
    cast_data: Dict[str, Any] = Field(default_factory=dict, sa_type=JSON)
    
    # Narrative Data
    scenes: List[Dict[str, Any]] = Field(default_factory=list, sa_type=JSON)
    script_content: Optional[str] = Field(default=None)
    series_plan: List[Dict[str, Any]] = Field(default_factory=list, sa_type=JSON)
    
    # Production Data
    storyboard: Dict[str, Any] = Field(default_factory=dict, sa_type=JSON)
    seo_metadata: Optional[str] = Field(default=None)
    
    # Protocols & Prompts
    custom_prompts: Dict[str, str] = Field(default_factory=dict, sa_type=JSON)
    active_protocols: List[str] = Field(default_factory=list, sa_type=JSON)
    
    # Screening Room
    screening_logs: List[Dict[str, Any]] = Field(default_factory=list, sa_type=JSON)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
