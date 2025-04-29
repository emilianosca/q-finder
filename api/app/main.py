# api/app/main.py

import os
from datetime import datetime

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from .db import SessionLocal, FaqModel
from .search import find_most_similar

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  

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
@app.get("/api/search", response_model=FaqRead)
def search_faq(query: str):
    best = find_most_similar(query)
    if not best:
        raise HTTPException(404, "No hay FAQs disponibles")
    return FaqRead(
        id=best.id,
        question=best.question,
        answer=best.answer,
        createdAt=best.created_at,
        updatedAt=best.updated_at,
        slug=best.slug
    )
