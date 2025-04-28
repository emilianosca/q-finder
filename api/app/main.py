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
    "https://tudominio.com",            # prod
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              
    # allow_origins=["*"],              # all origins
    allow_credentials=True,
    allow_methods=["*"],                # GET, POST, PUT…
    allow_headers=["*"],                # Content-Type, Authorization…
)


# ─── Schemas ────────────────────────────────────────────────────────────────
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


# ─── Helpers ────────────────────────────────────────────────────────────────
def make_slug(text: str) -> str:
    return (
        text.lower()
            .strip()
            .replace(" ", "-")
            .replace("?", "")
            .replace(".", "")
    )


# ─── POST /api/faq ───────────────────────────────────────────────────────────
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


# ─── GET /api/search ─────────────────────────────────────────────────────────
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

# # api/app/main.py

# import os

# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from datetime import datetime
# from .db import SessionLocal, FaqModel
# from .search import find_most_similar

# # ─── Database setup ───────────────────────────────────────────────────────────
# DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./faq.db")
# engine = create_engine(
#     DATABASE_URL, connect_args={"check_same_thread": False}
# )
# SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
# Base = declarative_base()

# class FaqModel(Base):
#     __tablename__ = "faqs"
#     id = Column(Integer, primary_key=True, index=True)
#     question = Column(String, nullable=False)
#     answer   = Column(String, nullable=False)
#     created_at = Column(
#         DateTime, nullable=False, server_default=func.now()
#     )
#     updated_at = Column(
#         DateTime, nullable=False,
#         server_default=func.now(),
#         onupdate=func.now()
#     )
#     slug = Column(String, unique=True, index=True)

# Base.metadata.create_all(bind=engine)

# # ─── Pydantic schemas ─────────────────────────────────────────────────────────
# class FaqCreate(BaseModel):
#     question: str
#     answer:   str

# class FaqRead(FaqCreate):
#     id: int
#     createdAt: datetime
#     updatedAt: datetime
#     slug: str

#     class Config:
#         orm_mode = True

# # ─── App & Helpers ────────────────────────────────────────────────────────────
# app = FastAPI()

# def make_slug(text: str) -> str:
#     return (
#         text.lower()
#             .strip()
#             .replace(" ", "-")
#             .replace("?", "")
#             .replace(".", "")
#     )

# # ─── POST /api/faq ─────────────────────────────────────────────────────────────
# @app.post("/api/faq", response_model=FaqRead)
# def create_faq(payload: FaqCreate):
#     db = SessionLocal()
#     slug = make_slug(payload.question)

#     # ensure uniqueness of slug
#     exists = db.query(FaqModel).filter_by(slug=slug).first()
#     if exists:
#         db.close()
#         raise HTTPException(400, "FAQ with this slug already exists")

#     new = FaqModel(
#         question=payload.question,
#         answer=payload.answer,
#         slug=slug
#     )
#     db.add(new)
#     db.commit()
#     db.refresh(new)
#     db.close()

#     return FaqRead(
#         id=new.id,
#         question=new.question,
#         answer=new.answer,
#         createdAt=new.created_at,
#         updatedAt=new.updated_at,
#         slug=new.slug
#     )



# # ─── GET /api/search ───────────────────────────────────────────────────────────
# @app.get("/api/search", response_model=FaqRead)
# def search_faq(query: str):
#     """Find the single FAQ whose question is most similar to `query`."""
#     best = find_most_similar(query)
#     if not best:
#         raise HTTPException(status_code=404, detail="No FAQs available")
#     return FaqRead(
#         id=best.id,
#         question=best.question,
#         answer=best.answer,
#         createdAt=best.created_at,
#         updatedAt=best.updated_at,
#         slug=best.slug
#     )