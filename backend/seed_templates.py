import asyncio
import os
import sys
from sqlmodel import Session, create_engine, select, SQLModel
from datetime import datetime
from loguru import logger

# Add parent directory to path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.models import Template

# Point to the exact database file used by the backend
DATABASE_URL = "sqlite:///backend/anime_script_pro.db"
engine = create_engine(DATABASE_URL)

# Hardcoded templates from templateConstants.ts
QUICK_TEMPLATES = [
    { 
        "name": 'Shonen Catalyst', 
        "category": 'Action',
        "icon": "Sword", 
        "thumbnail": '/shonen_battle_thumbnail_1776537245370.png',
        "prompt": 'Synthesize a high-velocity battle narrative focused on elemental energy mastery and hierarchical tournament structures.',
        "color": 'text-orange-500',
        "border": 'border-orange-500/50',
        "bg": 'bg-orange-500/10',
        "shadow": 'shadow-[0_0_15px_rgba(249,115,22,0.2)]',
        "description": 'High energy, intense pacing, and structural conflict loops.',
        "elements": ['Energy Matrices', 'Power Scalability', 'System Rivalries'],
        "vibe": 'Kinetic & High-Retention',
        "stats": { "deployed": '42.4k', "success": '98%', "complexity": 'Advanced' }
    },
    { 
        "name": 'Dimensional Revision', 
        "category": 'Isekai',
        "icon": "Globe", 
        "thumbnail": '/dark_isekai_thumbnail_1776537262155.png',
        "prompt": 'Architect a cross-dimensional regression saga featuring a modern-day specialist navigating a low-fantasy political landscape.',
        "color": 'text-purple-500',
        "border": 'border-purple-500/50',
        "bg": 'bg-purple-500/10',
        "shadow": 'shadow-[0_0_15px_rgba(168,85,247,0.2)]',
        "description": 'Dimensional shift logic with a focus on system exploitation.',
        "elements": ['World-Logic Variance', 'Strategic Dominance', 'Progression Loops'],
        "vibe": 'Calculated & Immersive',
        "stats": { "deployed": '28.1k', "success": '94%', "complexity": 'Professional' }
    },
    { 
        "name": 'Neural Cityscape', 
        "category": 'Sci-Fi',
        "icon": "Zap", 
        "thumbnail": '/cyberpunk_thumbnail_1776537282821.png',
        "prompt": 'Design a gritty neon-metropolis investigation involving neural-interface conspiracy and megacorporation dominance.',
        "color": 'text-cyan-500',
        "border": 'border-cyan-500/50',
        "bg": 'bg-cyan-500/10',
        "shadow": 'shadow-[0_0_15px_rgba(6,182,212,0.2)]',
        "description": 'Dystopian high-tech systems and urban decay dynamics.',
        "elements": ['Bionic Interfacing', 'Information Warfare', 'Corporate Hegemony'],
        "vibe": 'Neon & Synthetic',
        "stats": { "deployed": '35.2k', "success": '99%', "complexity": 'Expert' }
    },
    { 
        "name": 'Supernatural Resonance', 
        "category": 'Horror',
        "icon": "Ghost", 
        "thumbnail": '/supernatural_school_thumbnail_1776537301525.png',
        "prompt": 'Generate a supernatural school-life drama centering on localized urban legends and group-based mystery solving.',
        "color": 'text-emerald-500',
        "border": 'border-emerald-500/50',
        "bg": 'bg-emerald-500/10',
        "shadow": 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
        "description": 'Localized supernatural friction within group environments.',
        "elements": ['Eerie Atmosphere', 'Recursive Mystery', 'Social Dynamics'],
        "vibe": 'Unsettling & Human',
        "stats": { "deployed": '15.7k', "success": '92%', "complexity": 'Standard' }
    },
    { 
        "name": 'Cognitive Inquiry', 
        "category": 'Psychological',
        "icon": "Brain", 
        "thumbnail": '/dream_detective_thumbnail_1776537317644.png',
        "prompt": 'Engineer a psychological thriller exploring reality-bending dream manipulation and forensic memory analysis.',
        "color": 'text-blue-500',
        "border": 'border-blue-500/50',
        "bg": 'bg-blue-500/10',
        "shadow": 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
        "description": 'Internalized conflict and cognitive reality shifts.',
        "elements": ['Mental Geometry', 'Perception Logic', 'Heuristic Stakes'],
        "vibe": 'Abstract & Tense',
        "stats": { "deployed": '19.3k', "success": '95%', "complexity": 'Professional' }
    },
    { 
        "name": 'Mechanical Epoch', 
        "category": 'Sci-Fi',
        "icon": "Flame", 
        "thumbnail": '/mecha_rebellion_thumbnail_1776537334398.png',
        "prompt": 'Design a heavy-machinery conflict narrative involving experimental unit piloting and large-scale colony defense.',
        "color": 'text-red-500',
        "border": 'border-red-500/50',
        "bg": 'bg-red-500/10',
        "shadow": 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
        "description": 'Industrial-scale combat and tactical hardware logic.',
        "elements": ['Rigid Frames', 'Orbital Mechanics', 'Resource Attrition'],
        "vibe": 'Heavy & Scale-Driven',
        "stats": { "deployed": '21.8k', "success": '97%', "complexity": 'Advanced' }
    },
    { 
        "name": 'Celestial Paradigm', 
        "category": 'Magical',
        "icon": "Heart", 
        "thumbnail": '/magical_girl_thumbnail_1776537629295.png',
        "prompt": 'Construct a transformation-based narrative involving celestial energy seals and cosmic-shadow containment.',
        "color": 'text-fuchsia-500',
        "border": 'border-fuchsia-500/50',
        "bg": 'bg-fuchsia-500/10',
        "shadow": 'shadow-[0_0_15px_rgba(217,70,239,0.2)]',
        "description": 'Aesthetic-driven metamorphosis and moral clarity.',
        "elements": ['Dynamic Flux', 'Visual Radiance', 'Aligned Unity'],
        "vibe": 'Ethereal & Vibrant',
        "stats": { "deployed": '14.2k', "success": '91%', "complexity": 'Standard' }
    },
    { 
        "name": 'Tactical Kinetic', 
        "category": 'Sports',
        "icon": "Trophy", 
        "thumbnail": '/sports_anime_thumbnail_1776537646600.png',
        "prompt": 'Design a high-stakes competitive narrative focused on speed-based strategy and underdog technical synergy.',
        "color": 'text-yellow-500',
        "border": 'border-yellow-500/50',
        "bg": 'bg-yellow-500/10',
        "shadow": 'shadow-[0_0_15px_rgba(234,179,8,0.2)]',
        "description": 'High-pacing athletic logic and group-synergy loops.',
        "elements": ['Strategic Velocity', 'Skill-Tree Scaling', 'Peak Flow State'],
        "vibe": 'Relentless & Focused',
        "stats": { "deployed": '16.9k', "success": '96%', "complexity": 'Standard' }
    },
    { 
        "name": 'Hardboiled Logic', 
        "category": 'Mystery',
        "icon": "Search", 
        "thumbnail": '/detective_noir_thumbnail_1776537665824.png',
        "prompt": 'Synthesize an investigative noir saga centered on anomalous crime solving in a rain-saturated urban landscape.',
        "color": 'text-zinc-400',
        "border": 'border-zinc-500/50',
        "bg": 'bg-zinc-500/10',
        "shadow": 'shadow-[0_0_15px_rgba(113,113,122,0.2)]',
        "description": 'Analytical deductive logic and atmospheric tension.',
        "elements": ['Analytical Friction', 'Systemic Rot', 'Recursive Clues'],
        "vibe": 'Gritty & Precise',
        "stats": { "deployed": '13.5k', "success": '89%', "complexity": 'Professional' }
    },
    { 
        "name": 'Elimination Protocol', 
        "category": 'Action',
        "icon": "Hash", 
        "thumbnail": '/survival_game_thumbnail_1776537679688.png',
        "prompt": 'Architect a high-stakes game-theory narrative involving localized trap environments and social-trauma mechanics.',
        "color": 'text-rose-600',
        "border": 'border-rose-600/50',
        "bg": 'bg-rose-600/10',
        "shadow": 'shadow-[0_0_15px_rgba(225,29,72,0.2)]',
        "description": 'Tense social commentary and high-stakes games.',
        "elements": ['Game Theory', 'Social Darwinism', 'Psychological Stress'],
        "vibe": 'Brutal & Strategic',
        "stats": { "deployed": '17.4k', "success": '93%', "complexity": 'Professional' }
    }
]

def seed():
    # Force table creation
    logger.info("Ensuring tables are created...")
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Clear existing templates
        logger.info("Cleaning up old blueprints...")
        existing = session.exec(select(Template)).all()
        for e in existing:
            session.delete(e)
        session.commit()
        
        logger.info(f"Injecting {len(QUICK_TEMPLATES)} fresh blueprints...")
        for t_data in QUICK_TEMPLATES:
            template = Template(
                name=t_data["name"],
                description=t_data["description"],
                category=t_data["category"],
                icon=t_data["icon"],
                thumbnail=t_data["thumbnail"],
                prompt=t_data["prompt"],
                color=t_data["color"],
                border=t_data["border"],
                bg=t_data["bg"],
                shadow=t_data["shadow"],
                elements=t_data["elements"],
                vibe=t_data["vibe"],
                stats=t_data["stats"]
            )
            session.add(template)
        
        session.commit()
        logger.success("Forge Library is now powered by the Database.")

if __name__ == "__main__":
    seed()
