# Anime-Script-Pro: Consolidated Dual Database Architecture

The database architecture has been consolidated into two primary schemas, removing all redundant legacy files and ensuring a single source of truth for both **User Data** and **Website Content**.

## 🏗️ 1. User Storage (`user_storage.sql`)
**Purpose:** Handles all data that is private and unique to each user.

### Key Table Groups:
- **Identity**: `profiles` and `user_settings`.
- **Production Hub**: `projects`, `sessions`, `episodes`, `narrative_beats`.
- **Creative Core**: `world_lore`, `characters`, `character_relationships`.
- **Generation Output**: `scripts`, `scenes`.
- **User Assets**: `user_assets`, `prompt_library`.
- **Engagement**: `feedback`, `notifications`, `generation_logs`.

**Security:** Protected by Row Level Security (RLS) to ensure users can only access their own production data.

---

## 🌐 2. Website Content (`website_content.sql`)
**Purpose:** Manages global, shared content that powers the platform's features.

### Key Table Groups:
- **Taxonomy**: `site_categories`, `site_tags`.
- **Marketplace Presets**: `site_templates`.
- **Academy**: `tutorials`.
- **Infrastructure**: `site_config`, `ai_models`.
- **Broadcast**: `announcements`.

**Performance:** Optimized for high-frequency reads and platform-wide caching.

---

## 📂 Cleanup & Migration
- **DELETED**: `SUPABASE_SCHEMA.sql` (Root) - Merged into User Storage.
- **DELETED**: `schema.sql` (Backend) - Merged and Split into the dual-database system.
- **UPDATED**: `seed.sql` now populates the consolidated Website Content tables.

## 🚀 Deployment
1.  **Production (Postgres/Supabase)**: Run `user_storage.sql` and `website_content.sql` in the SQL Editor.
2.  **Local (SQLite)**: The `connection.py` logic automatically maps these schemas to the local `anime_script_pro.db`.
