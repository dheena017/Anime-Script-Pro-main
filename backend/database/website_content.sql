-- Database: Website Content (Global Platform Layer v3.0 - Ultimate Sync)
-- Purpose: Global presets, engine configuration, and educational platform data.
-- Aligned with: backend/database/models/ [system, assets, logs, engine]

-- 1. Site Taxonomy
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    color VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Blueprints & Presets
CREATE TABLE IF NOT EXISTS templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'All',
    icon VARCHAR(100) DEFAULT 'Sword',
    thumbnail TEXT,
    prompt TEXT DEFAULT '',
    color VARCHAR(100) DEFAULT 'text-cyan-500',
    border VARCHAR(100) DEFAULT 'border-cyan-500/50',
    bg VARCHAR(100) DEFAULT 'bg-cyan-500/10',
    shadow TEXT DEFAULT 'shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    elements JSONB DEFAULT '[]',
    vibe VARCHAR(100) DEFAULT 'Standard',
    stats JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS growth_strategies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    track VARCHAR(100) NOT NULL,
    prompt TEXT NOT NULL,
    description TEXT,
    icon VARCHAR(100) DEFAULT 'TrendingUp',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Academy & Knowledge Base
CREATE TABLE IF NOT EXISTS tutorials (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(100) NOT NULL,
    duration VARCHAR(50),
    level VARCHAR(50),
    category VARCHAR(100),
    content TEXT,
    video_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS help_categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(255) NOT NULL,
    sub TEXT,
    icon VARCHAR(100),
    color VARCHAR(100),
    "order" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category_slug VARCHAR(100),
    is_frequent BOOLEAN DEFAULT TRUE,
    "order" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS doc_sections (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    "order" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS doc_articles (
    id SERIAL PRIMARY KEY,
    section_slug VARCHAR(100),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    protocol_id VARCHAR(100),
    "order" INTEGER DEFAULT 0,
    article_metadata JSONB DEFAULT '{}'
);

-- 4. Infrastructure & Global Config
CREATE TABLE IF NOT EXISTS site_config (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seo_entries (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_models (
    id SERIAL PRIMARY KEY,
    model_id VARCHAR(100) UNIQUE NOT NULL,
    provider VARCHAR(100),
    display_name VARCHAR(255),
    capabilities JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    cost_per_token FLOAT DEFAULT 0.0
);

-- 5. Global Prompts & System Logging
CREATE TABLE IF NOT EXISTS prompts (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    context TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    source VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    level VARCHAR(20) DEFAULT 'INFO',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
