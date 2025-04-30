# api/app/search.py

from typing import List, Optional
from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .db import SessionLocal, FaqModel

# 128-dimensional hashing vectorizer (deterministic)  
vectorizer = HashingVectorizer(
    n_features=128,
    alternate_sign=False,
    norm=None
)

def find_most_similar(query: str, top_n: int = 5) -> List[FaqModel]:
    """
    Return up to `top_n` FAQs most similar to `query`, sorted descending by similarity.
    """
    db: Session = SessionLocal()
    faqs = db.query(FaqModel).all()
    db.close()

    if not faqs:
        return []

    # Extract questions and vectorize  
    questions = [f.question for f in faqs]
    faq_vectors = vectorizer.transform(questions)
    query_vector = vectorizer.transform([query])

    # Compute cosine similarities  
    sims = cosine_similarity(query_vector, faq_vectors)[0]

    # Pair each FAQ with its similarity score
    scored = list(zip(faqs, sims))

    # Sort descending and take top_n
    scored.sort(key=lambda x: x[1], reverse=True)
    top = [faq for faq, score in scored[:top_n]]

    return top