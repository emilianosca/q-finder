# api/app/db.py

import os
from sqlalchemy import (
    create_engine, Column, Integer, String, DateTime, func
)
from sqlalchemy.orm import declarative_base, sessionmaker

# ─── Database URL (env override) ───────────────────────────────────────────────
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./faq.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(
    bind=engine, autoflush=False, autocommit=False
)
Base = declarative_base()

class FaqModel(Base):
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
    slug       = Column(String, unique=True, index=True)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)