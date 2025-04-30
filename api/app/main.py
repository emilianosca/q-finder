# api/app/main.py

import os
from datetime import datetime
from typing import List
from fastapi import FastAPI, HTTPException, Path, Query, Depends 
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session 

from .db import SessionLocal, FaqModel
from .search import find_most_similar

#  basic API metadata (good practice)
app = FastAPI(
    title="Q-Finder FAQ API",
    description="API for managing and searching FAQs using vector similarity.",
    version="1.0.0",
)

# === Repo setup

#  allowed origins
origins = [
    "http://localhost:3000", 
    
    # todo! not ready for prod, use env vars! like: 
    # os.getenv("FRONTEND_URL", "http://localhost:3000") # Example using env var
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # in prod specify methods (GET, POST) 
    allow_headers=["*"], # in prod specify headers (Content-Type, Authorization)
)


# === Schemas
class FaqBase(BaseModel): 
    question: str
    answer:   str

class FaqCreate(FaqBase): # Inherits question/answer
    pass 

class FaqRead(FaqBase): # Inherits question/answer
    id:        int
    created_at: datetime 
    updated_at: datetime
    slug:      str

    class Config:
        from_attributes = True 


# === Dependency for DB Session ─
def get_db():
    """FastAPI dependency to manage database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# === Helpers
def make_slug(text: str) -> str:
    import re
    text = text.lower().strip()
    text = re.sub(r'[\s\.\?]+', '-', text) # Replace spaces, dots, q-marks with dash
    text = re.sub(r'-+', '-', text)       # Collapse multiple dashes
    text = text.strip('-')                # Remove leading/trailing dashes
    return text


# === CRUD Layer
def create_faq_db(db: Session, faq_data: FaqCreate) -> FaqModel:
    """Creates a new FAQ entry in the database."""
    slug = make_slug(faq_data.question)
    existing_faq = db.query(FaqModel).filter_by(slug=slug).first()
    if existing_faq:
        raise HTTPException(status_code=400, detail="FAQ with this slug already exists")

    new_faq = FaqModel(
        question=faq_data.question,
        answer=faq_data.answer,
        slug=slug
    )
    db.add(new_faq)
    db.commit()
    db.refresh(new_faq)
    return new_faq

def get_faq_by_id_db(db: Session, faq_id: int) -> FaqModel | None:
    """Retrieves a single FAQ by its ID."""
    return db.query(FaqModel).get(faq_id)

def get_all_faqs_db(db: Session, limit: int, randomize: bool) -> List[FaqModel]:
    """Retrieves a list of FAQs, optionally randomized."""
    query = db.query(FaqModel)
    if randomize:
        from sqlalchemy.sql import func
        query = query.order_by(func.random())
    else:
        query = query.order_by(FaqModel.created_at.desc())
    return query.limit(limit).all()

# === API Endpoints 


@app.post("/api/faq", response_model=FaqRead, status_code=201)
def create_faq_endpoint(payload: FaqCreate, db: Session = Depends(get_db)):
    """
    Create a new FAQ entry and return the created FAQ.
    """
    new_faq = create_faq_db(db, payload)
    return new_faq


@app.get("/api/search", response_model=List[FaqRead])
def search_faq_endpoint(
    query: str = Query(..., description="Text to search FAQs for"),
    limit: int = Query(5, ge=1, le=20, description="Max number of results"),
    db: Session = Depends(get_db) 
):
    """
    Return up to `limit` FAQs most similar to the given query.
    Returns an empty list if no relevant FAQs are found above the threshold.
    """
    results = find_most_similar(db, query, top_n=limit) #
    return results 


@app.get("/api/faqs/{id}", response_model=FaqRead)
def get_faq_by_id_endpoint(
    id: int = Path(..., ge=1, description="ID of the FAQ to retrieve"),
    db: Session = Depends(get_db) # Inject DB session
):
    """
    Fetch one FAQ by its integer ID.
    """
    # faq = db.query(FaqModel).get(faq_id) # Old way
    faq = get_faq_by_id_db(db, id) # Using CRUD function
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return faq


@app.get("/api/faqs", response_model=List[FaqRead])
def get_faqs_endpoint(
    limit: int = Query(20, ge=1, le=100, description="Max number of FAQs to return"),
    randomize: bool = Query(True, description="Shuffle the pool before slicing"),
    db: Session = Depends(get_db) # Inject DB session
):
    """
    Fetch a list of FAQs, optionally randomized.
    """
    # faqs = db.query(FaqModel) ... # Old way
    faqs = get_all_faqs_db(db, limit, randomize) # Using CRUD function
    return faqs
