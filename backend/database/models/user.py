from typing import Optional, Dict
from datetime import datetime
from sqlmodel import SQLModel, Field, Column, JSON
from fastapi_users_db_sqlmodel import SQLModelBaseUserDB

class User(SQLModelBaseUserDB, table=True):
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}
    failed_login_attempts: int = Field(default=0, nullable=False)
    locked_until: Optional[datetime] = Field(default=None)

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
    level: int = Field(default=1)
    experience: int = Field(default=0)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserSettings(SQLModel, table=True):
    __tablename__ = "user_settings"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(unique=True, index=True)
    profile: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    security: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    notifications: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    ai_models: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    studio_defaults: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    storage: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    billing: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<UserSettings(id={self.id}, user_id={self.user_id})>"
    def __str__(self):
        return self.user_id
