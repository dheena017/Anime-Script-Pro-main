from typing import Optional
from sqlmodel import SQLModel, Field

from datetime import datetime
from typing import Dict
from sqlalchemy import Column, JSON

class Template(SQLModel, table=True):
    __tablename__ = "templates"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<Template(id={self.id}, name={self.name})>"
    def __str__(self):
        return self.name

class Method(SQLModel, table=True):
    __tablename__ = "methods"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<Method(id={self.id}, name={self.name})>"
    def __str__(self):
        return self.name

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


class ProductionSession(SQLModel, table=True):
    __tablename__ = "sessions"
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(index=True)
    session_number: int
    title: str
    summary: str
    prod_metadata: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

class Episode(SQLModel, table=True):
    __tablename__ = "episodes"
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(index=True)
    session_id: Optional[int] = Field(default=None, foreign_key="sessions.id")
    episode_number: int
    title: str
    hook: Optional[str] = None
    summary: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

class Scene(SQLModel, table=True):
    __tablename__ = "scenes"
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(index=True)
    episode_id: int = Field(foreign_key="episodes.id")
    scene_number: int
    status: str = Field(default="QUEUED")
    visual_variance_index: int = Field(default=0)
    prompt: Optional[str] = None
    content: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Series(SQLModel, table=True):
    __tablename__ = "series"
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    summary: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<Series(id={self.id}, title={self.title})>"
    def __str__(self):
        return self.title

class Script(SQLModel, table=True):
    __tablename__ = "scripts"
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    episode_id: Optional[int] = Field(default=None, foreign_key="episodes.id")
    series_id: Optional[int] = Field(default=None, foreign_key="series.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<Script(id={self.id}, title={self.title})>"
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

class Storyboard(SQLModel, table=True):
    __tablename__ = "storyboards"
    id: Optional[int] = Field(default=None, primary_key=True)
    script_id: int = Field(foreign_key="scripts.id")
    image_url: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<Storyboard(id={self.id}, script_id={self.script_id})>"
    def __str__(self):
        return self.image_url

class SEOEntry(SQLModel, table=True):
    __tablename__ = "seo_entries"
    id: Optional[int] = Field(default=None, primary_key=True)
    keyword: str
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<SEOEntry(id={self.id}, keyword={self.keyword})>"
    def __str__(self):
        return self.keyword

class Prompt(SQLModel, table=True):
    __tablename__ = "prompts"
    id: Optional[int] = Field(default=None, primary_key=True)
    text: str
    context: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<Prompt(id={self.id}, text={self.text[:20]})>"
    def __str__(self):
        return self.text

class ScreeningRoomEntry(SQLModel, table=True):
    __tablename__ = "screening_room_entries"
    id: Optional[int] = Field(default=None, primary_key=True)
    script_id: int = Field(foreign_key="scripts.id")
    feedback: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<ScreeningRoomEntry(id={self.id}, script_id={self.script_id})>"
    def __str__(self):
        return f"ScreeningRoomEntry {self.id}"


class UserProfile(SQLModel, table=True):
    __tablename__ = "user_profiles"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(unique=True, index=True)
    display_name: str = Field(default="SHOGUN ARCHITECT")
    handle: str = Field(unique=True, index=True)
    avatar_url: Optional[str] = None
    banner_url: Optional[str] = None
    bio: Optional[str] = None
    join_date: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserBalance(SQLModel, table=True):
    __tablename__ = "user_balances"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(unique=True, index=True)
    credits: int = Field(default=5000)
    current_tier: str = Field(default="MASTER ARCHITECT")
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class MediaAsset(SQLModel, table=True):
    __tablename__ = "media_assets"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    asset_type: str = Field(default="IMAGE") # "IMAGE", "VIDEO", "AUDIO"
    url: str
    prompt: Optional[str] = None
    prod_metadata: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserFavorite(SQLModel, table=True):
    __tablename__ = "user_favorites"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    asset_id: int = Field(foreign_key="media_assets.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SavedPrompt(SQLModel, table=True):
    __tablename__ = "saved_prompts"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    label: str
    prompt_text: str
    category: Optional[str] = None # e.g. "Style", "Lighting"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ReusableCharacter(SQLModel, table=True):
    __tablename__ = "reusable_characters"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    name: str
    seed: Optional[int] = None
    reference_image_url: Optional[str] = None
    visual_prompt: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserSettings(SQLModel, table=True):
    __tablename__ = "user_settings"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(unique=True, index=True)
    profile: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    security: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    notifications: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    ai_models: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    storage: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    billing: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<UserSettings(id={self.id}, user_id={self.user_id})>"
    def __str__(self):
        return self.user_id

class Project(SQLModel, table=True):
    __tablename__ = "projects"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    name: str
    content_type: str = Field(default="ANIME")
    prompt: Optional[str] = None
    vibe: Optional[str] = None
    prod_metadata: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

    def __repr__(self):
        return f"<Project(id={self.id}, name={self.name})>"
    def __str__(self):
        return self.name

class Category(SQLModel, table=True):
    __tablename__ = "categories"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    color: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PromptLibrary(SQLModel, table=True):
    __tablename__ = "prompt_library"
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(index=True)
    scen_id: Optional[int] = None
    prompt_text: str
    lighting_cues: Optional[str] = None
    visual_style: Optional[str] = None
    seed: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Tutorial(SQLModel, table=True):
    __tablename__ = "tutorials"
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    icon_name: str
    duration: str
    level: str
    category: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<Tutorial(id={self.id}, title={self.title})>"
    def __str__(self):
        return self.title
