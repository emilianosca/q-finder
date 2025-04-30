# api/app/db.py

"""This file is responsible for setting up the database conf and SQLAlchemy (orm) models."""

import os
from sqlalchemy import (
    create_engine, Column, Integer, String, DateTime, func
)
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.sql import func 

# db URL 
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./faq.db")

engine = create_engine(
    DATABASE_URL,
    # not really used in here for now but good to have
    connect_args={"check_same_thread": False} # Required for SQLite with multithreading (FastAPI). 
)

SessionLocal = sessionmaker(
    bind=engine, autoflush=False, autocommit=False
)
Base = declarative_base()

class FaqModel(Base):
    """SQLAlchemy model representing a Frequently Asked Question (FAQ)."""
    __tablename__ = "faqs"
    id         = Column(Integer, primary_key=True, index=True)
    question   = Column(String,  nullable=False)
    answer     = Column(String,  nullable=False)
    created_at = Column(
        DateTime, nullable=False, server_default=func.now()
    )
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )
    slug = Column(String, unique=True, index=True) # IMPORTANT FOR SEO! Unique slug for each FAQ 

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)