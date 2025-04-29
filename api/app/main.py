# api/app/main.py

import os
from datetime import datetime

from fastapi import FastAPI, HTTPException, Path, Query
from fastapi.middleware.cors import CORSMiddleware  
from pydantic import BaseModel
from typing import List

from .db import SessionLocal, FaqModel
from .search import find_most_similar



app = FastAPI()

# ─── repo setup 
# ─── allowed origins 
origins = [
    "http://localhost:3000",            # frontend en dev
    "https://emilianosc...?.com",            # prod
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              
    # allow_origins=["*"],              # all origins
    allow_credentials=True,
    allow_methods=["*"],               
    allow_headers=["*"],                # Content-Type, Authorizatio etc
)


# ─── Schemas 
class FaqCreate(BaseModel):
    question: str
    answer:   str

class FaqRead(FaqCreate):
    id:        int
    createdAt: datetime
    updatedAt: datetime
    slug:      str

    class Config:
        orm_mode = True


# ─── Helpers 
def make_slug(text: str) -> str:
    return (
        text.lower()
            .strip()
            .replace(" ", "-")
            .replace("?", "")
            .replace(".", "")
    )


# ─── POST /api/faq 
@app.post("/api/faq", response_model=FaqRead)
def create_faq(payload: FaqCreate):
    db = SessionLocal()
    slug = make_slug(payload.question)

    if db.query(FaqModel).filter_by(slug=slug).first():
        db.close()
        raise HTTPException(400, "FAQ with this slug already exists")

    new = FaqModel(
        question=payload.question,
        answer=payload.answer,
        slug=slug
    )
    db.add(new)
    db.commit()
    db.refresh(new)
    db.close()

    return FaqRead(
        id=new.id,
        question=new.question,
        answer=new.answer,
        createdAt=new.created_at,
        updatedAt=new.updated_at,
        slug=new.slug
    )


# ─── GET /api/search 
@app.get("/api/search", response_model=List[FaqRead])
def search_faq(
    query: str = Query(..., description="Text to search FAQs for"),
    limit: int = Query(5, ge=1, le=20, description="Max number of results")
):
    """
    Return up to `limit` FAQs most similar to the given query.
    """
    results = find_most_similar(query, top_n=limit)
    if not results:
        # 404 if no FAQs at all (optional—could return empty list)
        raise HTTPException(status_code=404, detail="No FAQs available")
    # Convert ORM objects to Pydantic models
    return [
        FaqRead(
            id=f.id,
            question=f.question,
            answer=f.answer,
            createdAt=f.created_at,
            updatedAt=f.updated_at,
            slug=f.slug,
        )
        for f in results
    ]

# --- Get /faq/{faq_id} -- To get a specific FAQ by ID
@app.get("/api/faqs/{faq_id}", response_model=FaqRead)
def get_faq(
    faq_id: int = Path(..., ge=1, description="ID of the FAQ to retrieve"),
):
    """
    Fetch one FAQ by its integer ID.
    """
    db = SessionLocal()
    faq = db.query(FaqModel).get(faq_id)
    db.close()

    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")

    return FaqRead(
        id=faq.id,
        question=faq.question,
        answer=faq.answer,
        createdAt=faq.created_at,
        updatedAt=faq.updated_at,
        slug=faq.slug,
    )

# get all faqs
@app.get("/api/faqs", response_model=list[FaqRead])
def get_faqs(
    limit: int = Query(20, ge=1, le=100, description="Max number of FAQs to return"),
    randomize: bool = Query(True, description="Shuffle the pool before slicing")
):
    """
    Fetch all FAQs.
    """
    db = SessionLocal()
    q = db.query(FaqModel)
    if randomize:
        q = q.order_by(func.random())
    else:
        q = q.order_by(FaqModel.created_at.desc())
    faqs = q.limit(limit).all()
    db.close()

    return [
        FaqRead(
            id=faq.id,
            question=faq.question,
            answer=faq.answer,
            createdAt=faq.created_at,
            updatedAt=faq.updated_at,
            slug=faq.slug,
        )
        for faq in faqs
    ]
