# api/app/search.py

from typing import List, Optional
from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .db import SessionLocal, FaqModel

# 128-dimensional hashing vectorizer (deterministic)  [oai_citation:3‡scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.HashingVectorizer.html?utm_source=chatgpt.com)
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

    # Extract questions and vectorize  [oai_citation:4‡scikit-learn](https://scikit-learn.org/0.24/modules/generated/sklearn.feature_extraction.text.HashingVectorizer.html?utm_source=chatgpt.com)
    questions = [f.question for f in faqs]
    faq_vectors = vectorizer.transform(questions)
    query_vector = vectorizer.transform([query])

    # Compute cosine similarities  [oai_citation:5‡scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html?utm_source=chatgpt.com) [oai_citation:6‡scikit-learn](https://scikit-learn.org/1.1/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html?utm_source=chatgpt.com)
    sims = cosine_similarity(query_vector, faq_vectors)[0]

    # Pair each FAQ with its similarity score
    scored = list(zip(faqs, sims))

    # Sort descending and take top_n
    scored.sort(key=lambda x: x[1], reverse=True)
    top = [faq for faq, score in scored[:top_n]]

    return top