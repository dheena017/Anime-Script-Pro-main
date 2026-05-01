from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select
from typing import List, Optional
from backend.database.models import HelpCategory, FAQ, DocSection, DocArticle
from backend.database import AsyncSession, async_engine

router = APIRouter(prefix="/api", tags=["Support"])

@router.get("/help/categories", response_model=List[HelpCategory])
async def get_help_categories():
    async with AsyncSession(async_engine) as session:
        results = await session.exec(select(HelpCategory).order_by(HelpCategory.order))
        return results.all()

@router.get("/help/faqs", response_model=List[FAQ])
async def get_faqs(category_slug: Optional[str] = Query(None)):
    async with AsyncSession(async_engine) as session:
        statement = select(FAQ)
        if category_slug:
            statement = statement.where(FAQ.category_slug == category_slug)
        statement = statement.order_by(FAQ.order)
        results = await session.exec(statement)
        return results.all()

@router.get("/docs/sections", response_model=List[DocSection])
async def get_doc_sections():
    async with AsyncSession(async_engine) as session:
        results = await session.exec(select(DocSection).order_by(DocSection.order))
        return results.all()

@router.get("/docs/articles", response_model=List[DocArticle])
async def get_doc_articles(section_slug: Optional[str] = Query(None)):
    async with AsyncSession(async_engine) as session:
        statement = select(DocArticle)
        if section_slug:
            statement = statement.where(DocArticle.section_slug == section_slug)
        statement = statement.order_by(DocArticle.order)
        results = await session.exec(statement)
        return results.all()

@router.get("/help/search")
async def search_help(q: str):
    async with AsyncSession(async_engine) as session:
        # Simple search in FAQs and Articles
        faq_statement = select(FAQ).where(FAQ.question.contains(q))
        article_statement = select(DocArticle).where(DocArticle.title.contains(q))
        
        faqs = (await session.exec(faq_statement)).all()
        articles = (await session.exec(article_statement)).all()
        
        return {
            "faqs": faqs,
            "articles": articles
        }
