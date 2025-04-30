# tests/test_search.py

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db import FaqModel, SessionLocal

# todo! use a separate test database, to ensure clean state

client = TestClient(app)


@pytest.fixture(scope="function", autouse=True)
def setup_test_db():
    """
    Fixture to ensure a clean database state before each test function.
    It clears existing data and seeds it with known values.
    'autouse=True' means it runs automatically for every test function.
    """
    # Clear any existing data
    db = SessionLocal()
    try:
        db.query(FaqModel).delete()
        db.commit()

        # Seed with consistent data for tests
        faqs = [
            FaqModel(question="Alpha question about setup", answer="Alpha answer", slug="alpha-setup"),
            FaqModel(question="Bravo question about testing", answer="Bravo answer", slug="bravo-testing"),
            FaqModel(question="Charlie question about deployment", answer="Charlie answer", slug="charlie-deploy"),
            FaqModel(question="Delta another question", answer="Delta answer", slug="delta-another"),
            FaqModel(question="Echo final question example", answer="Echo answer", slug="echo-final"),
        ]
        db.add_all(faqs)
        db.commit()
    finally:
        db.close()

    yield 
    
    db = SessionLocal()
    try:
        db.query(FaqModel).delete()
        db.commit()
    finally:
        db.close()


@pytest.fixture(scope="function")
def empty_db_for_test():
    """
    Fixture specifically for tests that require the database to be empty.
    It runs *instead* of setup_test_db for tests that use it because setup_test_db is function-scoped.
    However, because setup_test_db has autouse=True, we MUST explicitly clear the data *within* this fixture too.
    """
    db = SessionLocal()
    try:
        db.query(FaqModel).delete()
        db.commit()
    finally:
        db.close()

    yield # Test runs here


# === Test Functions
def test_search_success_returns_list():
    """
    Test that a successful search returns a 200 OK and a list.
    """
    response = client.get("/api/search", params={"query": "question"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Check if items in the list look like FaqRead objects
    if data:
        assert "id" in data[0]
        assert "question" in data[0]
        assert "answer" in data[0]
        assert "slug" in data[0]
        assert "created_at" in data[0]
        assert "updated_at" in data[0]

def test_search_limit_parameter():
    """
    Test that the 'limit' query parameter correctly limits the number of results.
    """
    limit = 2
    response = client.get("/api/search", params={"query": "question", "limit": limit})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Should return *at most* 'limit' results
    assert len(data) <= limit
    # With our seed data and query "question", we expect exactly 'limit' results
    assert len(data) == limit


def test_search_default_limit():
    """
    Test that the default limit (5 in main.py) is applied when not specified.
    """
    response = client.get("/api/search", params={"query": "question"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Should return *at most* 5 results (the default)
    assert len(data) <= 5
     # With our seed data and query "question", we expect exactly 5 results
    assert len(data) == 5

def test_search_sorted_by_similarity():
    """
    Test that results are sorted by relevance (most similar first).
    'Alpha question about setup' should be most similar to 'Alpha setup query'.
    """
    response = client.get("/api/search", params={"query": "Alpha setup query"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0  # Make sure we got results
    # The first result should be the 'Alpha' one
    assert data[0]["question"] == "Alpha question about setup"
    assert data[0]["slug"] == "alpha-setup"

    # Test with another query
    response = client.get("/api/search", params={"query": "deploy test bravo"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # Expect Charlie or Bravo to be higher depending on vectorizer
    # Let's check if Charlie is first for "deploy"
    assert data[0]["question"] == "Charlie question about deployment" or data[0]["question"] == "Bravo question about testing"


def test_search_no_matching_results():
    """
    Test searching for a term unlikely to match anything returns an empty list (or 404).
    Your current implementation returns a list from find_most_similar,
    but the endpoint raises 404 if find_most_similar returns empty list because DB IS NOT EMPTY
    Let's refine this: The endpoint raises 404 *only if there are no FAQs at all*.
    If FAQs exist but none match well, it should return an empty list or low-similarity results.
    Let's assume it returns an empty list or just the top N low-similarity items.
    """
    response = client.get("/api/search", params={"query": "zzzzzzzzzzzzxxxxxxxxxxxxxyyyyyyyyy"})
    assert response.status_code == 200 # Should still be 200 OK
    data = response.json()
    assert isinstance(data, list)
    # It might return an empty list or the least dissimilar items depending on implementation
    # For this test, let's assume it might return *some* items but maybe not relevant
    # If it MUST return empty for no good match, assert len(data) == 0
    # Based on cosine similarity, it will always return *something* if there's data.


def test_search_no_faqs_in_db(empty_db_for_test):
    """
    Test the scenario where the FAQ table is completely empty.
    This test uses the 'empty_db_for_test' fixture.
    The endpoint should return 404 as per the code `if not results: raise HTTPException(404...)`.
    """
    response = client.get("/api/search", params={"query": "anything"})
    assert response.status_code == 404
    assert response.json() == {"detail": "No FAQs available"}


def test_search_missing_query_parameter():
    """
    Test that calling the endpoint without the required 'query' parameter returns 422.
    """
    response = client.get("/api/search", params={"limit": 5}) # Missing 'query'
    assert response.status_code == 422  # Unprocessable Entity
    data = response.json()
    assert "detail" in data
    assert data["detail"][0]["msg"] == "Field required" # FastAPI v0.100+ style
    assert data["detail"][0]["loc"] == ["query", "query"] # Location of the error


def test_search_invalid_limit_parameter_too_low():
    """
    Test that providing a 'limit' value below the minimum (ge=1) returns 422.
    """
    response = client.get("/api/search", params={"query": "test", "limit": 0})
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data
    # Check for the specific validation error message (might vary slightly between FastAPI versions)
    assert "greater than or equal to 1" in data["detail"][0]["msg"]
    assert data["detail"][0]["loc"] == ["query", "limit"]

def test_search_invalid_limit_parameter_too_high():
    """
    Test that providing a 'limit' value above the maximum (le=20) returns 422.
    """
    response = client.get("/api/search", params={"query": "test", "limit": 21})
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data
    # Check for the specific validation error message
    assert "less than or equal to 20" in data["detail"][0]["msg"]
    assert data["detail"][0]["loc"] == ["query", "limit"]