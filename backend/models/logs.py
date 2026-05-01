from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class SystemLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    source: str
    message: str
    level: str = "INFO" # INFO, WARNING, ERROR, CRITICAL
