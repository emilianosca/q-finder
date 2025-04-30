import hashlib
import math
from typing import List
from sqlalchemy.orm import Session
from .db import FaqModel # Keep this

# Constants
VECTOR_DIMENSIONS = 128
DEFAULT_SEARCH_LIMIT = 5
DEFAULT_MIN_SIMILARITY = 0.3


def text_to_vector(text: str, n_features: int = VECTOR_DIMENSIONS) -> List[float]:
    vector: List[float] = [0.0] * n_features
    words = text.lower().split()
    if not words: return vector
    for word in words:
        hash_digest = hashlib.md5(word.encode('utf-8')).hexdigest()
        index = int(hash_digest, 16) % n_features
        vector[index] += 1.0
    return vector

def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    if len(vec_a) != len(vec_b): raise ValueError("Vector lengths must match")
    dot_product = 0.0
    norm_a_sq = 0.0
    norm_b_sq = 0.0
    for i in range(len(vec_a)):
        dot_product += vec_a[i] * vec_b[i]
        norm_a_sq += vec_a[i] * vec_a[i]
        norm_b_sq += vec_b[i] * vec_b[i]
    if norm_a_sq == 0.0 or norm_b_sq == 0.0: return 0.0
    norm_a = math.sqrt(norm_a_sq)
    norm_b = math.sqrt(norm_b_sq)
    similarity = dot_product / (norm_a * norm_b)
    return max(0.0, min(1.0, similarity))


def find_most_similar(
    db: Session,
    query: str,
    top_n: int = DEFAULT_SEARCH_LIMIT,
    min_similarity_threshold: float = DEFAULT_MIN_SIMILARITY
) -> List[FaqModel]:
    """
    Finds FAQs most similar to the query using cosine similarity on hashed vectors.

    Uses the provided database session to fetch all FAQs, vectorizes query and
    FAQs (question + answer), calculates similarity, filters by threshold,
    sorts by score, and returns top N.

    Args:
        db: The SQLAlchemy session. <Added
        query: The search query string.
        top_n: Max number of results to return.
        min_similarity_threshold: Minimum score for a result to be included.

    Returns:
        List of FaqModel objects meeting criteria, sorted by similarity, or [].
    """
  
    faqs = db.query(FaqModel).all() 
    if not faqs:
        return []

    # Vectorization & Similarity Calculation happens here
    query_vec = text_to_vector(query)
    if sum(query_vec) == 0.0:
        return []

    scored_faqs = []
    for faq in faqs:
        combined_text = f"{faq.question} {faq.answer}"
        faq_vec = text_to_vector(combined_text)
        score = cosine_similarity(query_vec, faq_vec)

        if score >= min_similarity_threshold:
            scored_faqs.append((faq, score))

    # Sorting & Ranking ---
    scored_faqs.sort(key=lambda item: item[1], reverse=True)

    return [faq for faq, score in scored_faqs[:top_n]]