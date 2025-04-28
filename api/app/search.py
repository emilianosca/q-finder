# api/app/search.py

from typing import Optional, List
from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .db import SessionLocal, FaqModel

# 128-dimensional hashing vectorizer (deterministic, no external API)
vectorizer = HashingVectorizer(
    n_features=128,
    alternate_sign=False,
    norm=None
)

def find_most_similar(query: str) -> Optional[FaqModel]:
    """Return the FAQ whose question is most similar to `query`."""
    db: Session = SessionLocal()
    faqs: List[FaqModel] = db.query(FaqModel).all()
    db.close()
    
    if not faqs:
        return None
    
    # Build question corpus + vectorize
    questions = [f.question for f in faqs]
    faq_vectors = vectorizer.transform(questions)
    query_vector = vectorizer.transform([query])

    # Compute cosine similarities and pick best index
    sims = cosine_similarity(query_vector, faq_vectors)[0]
    best_idx = int(sims.argmax())
    print(f"Best match: {best_idx} (similarity: {sims[best_idx]})")
    return faqs[best_idx]