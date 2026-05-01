import os
import sys
from sqlmodel import Session, create_engine, select, SQLModel
from datetime import datetime, timedelta
from loguru import logger

# Add parent directory to path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.database.models import (
    Tutorial, CommunityPost, Project, Template, 
    UserProfile, UserBalance, MediaAsset, Category,
    Series, Episode, Script, HelpCategory, FAQ, DocSection, DocArticle, Notification,
    WorldLore, CastMember, NarrativeBeat, ReusableCharacter, Scene
)


# Point to the exact database file used by the backend
DATABASE_URL = "sqlite:///backend/database/anime_script_pro.db"
engine = create_engine(DATABASE_URL)

LOCAL_USER_ID = "local-dev-architect-id"

def seed_all():
    logger.info("Initializing Full Studio Ecosystem...")
    # SQLModel.metadata.create_all(engine) # Handled by fastapi_app.py
    
    with Session(engine) as session:
        # 1. Seed Tutorials
        if not session.exec(select(Tutorial)).first():
            logger.info("Injecting Learning Center protocols...")
            tutorials = [
                Tutorial(
                    title="Mastering the Neural Forge",
                    description="Learn how to architect high-fidelity world lore using the G2.0 Pro engine.",
                    icon_name="Brain", duration="12m", level="Advanced", category="Architecture",
                    content="Deep dive into world building...", video_url="https://example.com/neural-forge"
                ),
                Tutorial(
                    title="Visual DNA & Character Casting",
                    description="A guide to synthesizing persistent character identities and aesthetic signatures.",
                    icon_name="Users", duration="8m", level="Professional", category="Character Design",
                    content="Learn how to create persistent visual DNA...", video_url="https://example.com/character-casting"
                ),
                Tutorial(
                    title="One-Prompt Production Loop",
                    description="Everything you need to know about the 4-Phase autonomous production cycle.",
                    icon_name="Zap", duration="5m", level="Beginner", category="Production",
                    content="Master the autonomous loop...", video_url="https://example.com/one-prompt"
                ),
                Tutorial(
                    title="Cinematic Prompt Engineering",
                    description="Mastering the art of visual cues and camera directives for AI image synthesis.",
                    icon_name="Camera", duration="15m", level="Expert", category="Visuals",
                    content="Learn cinematic prompting...", video_url="https://example.com/prompts"
                )
            ]
            for t in tutorials: session.add(t)

        # 2. Seed Templates (Blueprints)
        if not session.exec(select(Template)).first():
            logger.info("Forging Blueprint Library...")
            templates = [
                Template(
                    name="Shonen Catalyst", category="Action", icon="Sword", vibe="Kinetic & High-Retention",
                    description="High energy, intense pacing, and structural conflict loops.",
                    prompt="Synthesize a high-velocity battle narrative focused on elemental energy mastery.",
                    color="text-orange-500", border="border-orange-500/50", bg="bg-orange-500/10",
                    shadow="shadow-[0_0_15px_rgba(249,115,22,0.2)]", elements=["Energy Matrices", "Power Scalability"],
                    stats={"deployed": "42.4k", "success": "98%", "complexity": "Advanced"}
                ),
                Template(
                    name="Neural Cityscape", category="Sci-Fi", icon="Zap", vibe="Neon & Synthetic",
                    description="Dystopian high-tech systems and urban decay dynamics.",
                    prompt="Design a gritty neon-metropolis investigation involving neural-interface conspiracy.",
                    color="text-cyan-500", border="border-cyan-500/50", bg="bg-cyan-500/10",
                    shadow="shadow-[0_0_15px_rgba(6,182,212,0.2)]", elements=["Bionic Interfacing", "Information Warfare"],
                    stats={"deployed": "35.2k", "success": "99%", "complexity": "Expert"}
                ),
                Template(
                    name="Cognitive Inquiry", category="Psychological", icon="Brain", vibe="Abstract & Tense",
                    description="Internalized conflict and cognitive reality shifts.",
                    prompt="Engineer a psychological thriller exploring reality-bending dream manipulation.",
                    color="text-blue-500", border="border-blue-500/50", bg="bg-blue-500/10",
                    shadow="shadow-[0_0_15px_rgba(59,130,246,0.2)]", elements=["Mental Geometry", "Perception Logic"],
                    stats={"deployed": "19.3k", "success": "95%", "complexity": "Professional"}
                ),
                Template(
                    name="Isekai Nexus", category="Fantasy", icon="Globe", vibe="Ethereal & Expansive",
                    description="Rebirth dynamics, systemic progression, and metaphysical world-building.",
                    prompt="Architect a complex isekai universe with a unique 'System' logic and geopolitical magic conflict.",
                    color="text-emerald-500", border="border-emerald-500/50", bg="bg-emerald-500/10",
                    shadow="shadow-[0_0_15px_rgba(16,185,129,0.2)]", elements=["System Integration", "Aura Physics"],
                    stats={"deployed": "58.1k", "success": "97%", "complexity": "Professional"}
                ),
                Template(
                    name="Blossom Protocol", category="Romance", icon="Heart", vibe="Atmospheric & Emotional",
                    description="Slow-burn pacing, heavy internal monologue, and lighting-focused cinematic cues.",
                    prompt="Synthesize an atmospheric romance set in a rural Japanese town with a focus on 'Mono no aware'.",
                    color="text-rose-500", border="border-rose-500/50", bg="bg-rose-500/10",
                    shadow="shadow-[0_0_15px_rgba(244,63,94,0.2)]", elements=["Emotional Resonance", "Seasonal Aesthetics"],
                    stats={"deployed": "12.8k", "success": "96%", "complexity": "Intermediate"}
                )
            ]
            for t in templates: session.add(t)

        # 3. Seed Projects (My Library)
        if not session.exec(select(Project)).first():
            logger.info("Archiving Sample Productions...")
            p1 = Project(
                user_id=LOCAL_USER_ID, title="Solo Leveling: Reborn", content_type="Manhwa", 
                genre="Action", art_style="Digital Webtoon", episode_length="24 min",
                description="A modern day hunter gains a unique leveling system.",
                status="completed", model_used="gemini-2.0-pro-exp",
                prod_metadata={"script": "The shadows rise as Jin-Woo stands before the gate...", "episode": 1, "session": 1}
            )
            p2 = Project(
                user_id=LOCAL_USER_ID, title="Neon Ghost 2099", content_type="Anime", 
                genre="Sci-Fi", art_style="Cyberpunk Noir", episode_length="22 min",
                description="A rogue AI hunter discovers their own neural origin.",
                status="in_progress", model_used="gemini-3-flash-preview",
                prod_metadata={"script": "Rain slicked streets of Neo-Tokyo reflect the neon pulse...", "episode": 3, "session": 5}
            )
            session.add(p1)
            session.add(p2)
            session.commit()

            logger.info("Generating Production Narratives...")
            series = Series(title="Solo Leveling Saga", summary="The ascent of the world's weakest hunter.")
            session.add(series)
            session.commit()

            ep1 = Episode(project_id=p1.id, series_id=series.id, episode_number=1, title="The Double Dungeon", hook="A routine raid turns into a nightmare.")
            session.add(ep1)
            session.commit()

            script = Script(title="Ep 1: Reawakening", content="[INT. DUNGEON - NIGHT]\nJin-Woo grips his broken dagger. The giant statue's eyes glow red.", project_id=p1.id, episode_id=ep1.id, series_id=series.id)
            session.add(script)

            logger.info("Synthesizing Master Manifest: Project X...")
            px = Project(
                user_id=LOCAL_USER_ID, title="Project X: The Last Protocol", content_type="Anime", 
                genre="Seinen Horror", art_style="Oil Painting / Gritty", episode_length="24 min",
                description="In a world where memories are currency, a memory-less detective hunts a digital ghost.",
                status="active", model_used="God Mode Engine v2.0",
                prod_metadata={"phase": "Production", "completion": 65}
            )
            session.add(px)
            session.commit()

            # World Lore
            lore = WorldLore(
                user_id=LOCAL_USER_ID, project_id=px.id,
                architecture="Brutalist megastructures built on the ruins of a digital ocean.",
                atlas="The Floating City of Memoria, divided into sectors based on memory quality.",
                history="The Great Erasure (2088) wiped 90% of global data; memory became the new gold standard.",
                systems="The Synapse Exchange: A biological marketplace for trading childhood memories for survival.",
                culture="A neo-feudal society where 'Rich' means having a full childhood history.",
                full_lore_blob="[MASTER LORE MANIFEST]\nLocation: Memoria\nYear: 2105\nCore Conflict: Memory Theft..."
            )
            session.add(lore)

            # Cast Members
            c1 = CastMember(
                project_id=px.id, name="Detective Kaine", role="Protagonist",
                description="Stoic, wears a cracked neural mask. Only has 3 days of memories.",
                visual_dna="Noir aesthetic, glowing cyan eyes, weathered trench coat with fiber-optic stitching."
            )
            c2 = CastMember(
                project_id=px.id, name="The Oracle", role="Antagonist",
                description="A digital entity living in the forgotten servers. Wants to erase the world's last memory.",
                visual_dna="Glitch-effect silhouette, shifting patterns of binary code, translucent skin."
            )
            session.add(c1)
            session.add(c2)

            # Narrative Beats
            b1 = NarrativeBeat(project_id=px.id, title="The Awakening", content="Kaine discovers his first memory shard.", order=1)
            session.add(b1)

        # 4. Seed Community Posts
        if not session.exec(select(CommunityPost)).first():
            logger.info("Broadcasting Social Hub transmissions...")
            posts = [
                CommunityPost(
                    user_id="SYSTEM_ARCHITECT", title="NEON SYNDICATE: The Full Pilot Arc",
                    content="Check out this 60-episode masterpiece generated with the Cyber Pulse blueprint.",
                    likes=1420, views=25000, tags=["Cyberpunk", "Action", "GodMode"]
                ),
                CommunityPost(
                    user_id="AnimeCreator_99", title="The Dragon's Breath - New Script",
                    content="Just finished the world lore for my new Shonen series. The magic system is based on actual thermal dynamics!",
                    likes=85, views=1200, tags=["Shonen", "Magic", "WorldBuilding"]
                )
            ]
            for p in posts: session.add(p)

        # 5. Seed Media Assets
        if not session.exec(select(MediaAsset)).first():
            logger.info("Indexing Visual DNA...")
            assets = [
                MediaAsset(user_id=LOCAL_USER_ID, name="Jin-Woo Main Profile", url="assets/jinwoo_01.png", asset_type="IMAGE"),
                MediaAsset(user_id=LOCAL_USER_ID, name="Neo-Tokyo Skyline", url="assets/city_skyline.png", asset_type="IMAGE"),
                MediaAsset(user_id=LOCAL_USER_ID, name="Neural Interface UI", url="assets/ui_interface.png", asset_type="IMAGE")
            ]
            for a in assets: session.add(a)

        # 6. Seed User Data
        if not session.exec(select(UserProfile).where(UserProfile.user_id == LOCAL_USER_ID)).first():
            logger.info("Initializing Architect Credentials...")
            profile = UserProfile(
                user_id=LOCAL_USER_ID, 
                display_name="Lead Studio Architect",
                handle="architect",
                bio="Architect of the Anime Script Pro production environment.",
                avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=Architect"
            )
            balance = UserBalance(user_id=LOCAL_USER_ID, credits=15000)
            session.add(profile)
            session.add(balance)

        # 7. Seed Notifications
        if not session.exec(select(Notification)).first():
            logger.info("Dispatching System Transmissions...")
            notifs = [
                Notification(user_id=LOCAL_USER_ID, title="Neural Engine Update", message="Gemini 2.0 Pro Experimental is now the default orchestrator.", type="INFO"),
                Notification(user_id=LOCAL_USER_ID, title="Production Sync Successful", message="Your 'Neon Ghost 2099' project is now synced with the cloud.", type="SUCCESS"),
                Notification(user_id=LOCAL_USER_ID, title="Low Credits Warning", message="Your Neural Credit balance is below 1000. Consider top-up.", type="WARNING"),
            ]
            for n in notifs: session.add(n)

        # 8. Seed Help & Documentation
        if not session.exec(select(HelpCategory)).first():
            logger.info("Populating Help Hub and Documentation Archive...")
            
            # Categories
            categories = [
                HelpCategory(slug="getting-started", label="Getting Started", sub="Kickstart your first production", icon="Zap", color="text-yellow-500", order=1),
                HelpCategory(slug="script-architecting", label="Script Logic", sub="Advanced narrative mapping", icon="FileText", color="text-cyan-500", order=2),
                HelpCategory(slug="neural-rendering", label="Neural Engine", sub="Optimizing AI generations", icon="Cpu", color="text-fuchsia-500", order=3),
                HelpCategory(slug="security-privacy", label="Safe Studio", sub="Encryption & data protocols", icon="ShieldCheck", color="text-emerald-500", order=4),
            ]
            for c in categories: session.add(c)

            # FAQs
            faqs = [
                FAQ(question="How do I bypass standard anime tropes?", answer="Enable 'Cinematic Enforcer' in AI Settings to force higher-order narrative logic into your script generations.", is_frequent=True, order=1),
                FAQ(question="What is the 'God Mode' orchestrator?", answer="It is our proprietary multi-agent pipeline that manages script, cast, and world consistency autonomously.", is_frequent=True, order=2),
                FAQ(question="Can I export my project to industry standards?", answer="Yes, our 'Distribution' phase supports Fountain, Final Draft, and PDF exports formatted for SAG-AFTRA standards.", is_frequent=True, order=3),
                FAQ(question="Is my script training your models?", answer="By default, no. You can explicitly opt-out of all telemetry in the 'Neural Security' settings.", is_frequent=True, order=4),
            ]
            for f in faqs: session.add(f)

            # Doc Sections
            sections = [
                DocSection(slug="introduction", label="Architect Introduction", icon="Globe", order=1),
                DocSection(slug="core-concepts", label="Neural Core Concepts", icon="Cpu", order=2),
                DocSection(slug="scripting", label="Script Logic Syntax", icon="Terminal", order=3),
                DocSection(slug="data-vault", label="Data Vault Protocols", icon="Database", order=4),
                DocSection(slug="api-reference", label="Direct API Access", icon="Code", order=5),
                DocSection(slug="security", label="Security Hardening", icon="Lock", order=6),
            ]
            for s in sections: session.add(s)

            # Doc Articles
            articles = [
                DocArticle(
                    section_slug="introduction", slug="architectural-foundation", title="The Architectural Foundation",
                    content="Welcome to the core documentation for Anime Script Pro. This manual details the underlying neural logic, API integrations, and narrative mapping protocols that drive the 'God Mode' production suite.",
                    protocol_id="Protocol 001", order=1
                ),
                DocArticle(
                    section_slug="core-concepts", slug="neural-scaffolding", title="The Neural Scaffolding",
                    content="Productions are built on a hierarchy of Scenes -> Episodes -> Series. Each layer inherits constraints from the 'World Lore' database to ensure your characters never violate the established physics or history of your universe.",
                    order=1
                )
            ]
            for a in articles: session.add(a)

        session.commit()
    logger.success("Full Studio Ecosystem successfully seeded.")

if __name__ == "__main__":
    seed_all()
