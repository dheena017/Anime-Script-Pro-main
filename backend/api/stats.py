from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, Session
from typing import List
from backend.models import Category, Scene
from backend.database import engine

router = APIRouter(prefix="/api", tags=["Stats"])

@router.get("/categories", response_model=List[Category])
def get_categories():
    with Session(engine) as session:
        return session.exec(select(Category).order_by(Category.name)).all()

@router.get("/stats/progress")
def get_stats_progress(project_id: int):
    with Session(engine) as session:
        scenes = session.exec(select(Scene).where(Scene.project_id == project_id)).all()
        stats = {}
        for s in scenes:
            sess_idx = (s.scene_number - 1) // 192 + 1
            if sess_idx not in stats:
                stats[sess_idx] = {"session": sess_idx, "total": 0, "completed": 0, "in_production": 0}
            stats[sess_idx]["total"] += 1
            if s.status == "COMPLETED":
                stats[sess_idx]["completed"] += 1
            elif s.status != "QUEUED":
                stats[sess_idx]["in_production"] += 1
        return sorted(list(stats.values()), key=lambda x: x["session"])
