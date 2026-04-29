from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class WorldLore(SQLModel, table=True):
    __tablename__ = "world_lores"
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<WorldLore(id={self.id}, title={self.title})>"
    def __str__(self):
        return self.title

class CastMember(SQLModel, table=True):
    __tablename__ = "cast_members"
    __table_args__ = {'extend_existing': True}
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    role: str = Field(default="MAIN")
    archetype: Optional[str] = None
    personality: Optional[str] = None
    appearance: Optional[str] = None
    visual_prompt: Optional[str] = None
    conflict: Optional[str] = None
    goal: Optional[str] = None
    flaw: Optional[str] = None
    speaking_style: Optional[str] = None
    secret: Optional[str] = None
    description: Optional[str] = None
    series_id: Optional[int] = Field(default=None, foreign_key="series.id")
    project_id: Optional[int] = Field(default=None, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<CastMember(id={self.id}, name={self.name})>"
    def __str__(self):
        return self.name

class NarrativeBeat(SQLModel, table=True):
    __tablename__ = "narrative_beats"
    id: Optional[int] = Field(default=None, primary_key=True)
    label: str
    description: str
    duration: str
    script_id: Optional[int] = Field(default=None, foreign_key="scripts.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<NarrativeBeat(id={self.id}, label={self.label})>"
    def __str__(self):
        return self.label

class ReusableCharacter(SQLModel, table=True):
    __tablename__ = "reusable_characters"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    name: str
    seed: Optional[int] = None
    reference_image_url: Optional[str] = None
    visual_prompt: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
