# api/app/seed.py

"""Seeds the database with initial FAQ data from faq_seed.json."""

import json
import os
import sys 
from datetime import datetime

from sqlalchemy.exc import IntegrityError
from .db import SessionLocal, FaqModel

# load seeds
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SEED_FILE_PATH = os.path.join(BASE_DIR, "faq_seed.json")

try:
    with open(SEED_FILE_PATH, encoding="utf-8") as f:
        seed_data = json.load(f)
except FileNotFoundError:
    print(f"Error: Seed file not found at {SEED_FILE_PATH}", file=sys.stderr)
    sys.exit(1)
except json.JSONDecodeError:
    print(f"Error: Could not decode JSON from {SEED_FILE_PATH}", file=sys.stderr)
    sys.exit(1)


def parse_iso(dt_str: str) -> datetime:
    """Safely parses ISO 8601 datetime strings, removing 'Z'."""
    return datetime.fromisoformat(dt_str.replace("Z", "+00:00")) # std datetime 

def run_seed():
    """Connects to the DB and inserts seed data if slugs don't exist."""
    db = SessionLocal()
    inserted_count = 0
    skipped_count = 0

    try:
        for item in seed_data:
            # Check if slug exists 
            if db.query(FaqModel).filter_by(slug=item["slug"]).first():
                skipped_count += 1
                continue

            try:
                created = parse_iso(item["created_at"])
                updated = parse_iso(item["updated_at"])
            except KeyError as e:
                print(f"Warning: Missing timestamp key {e} in item with slug '{item.get('slug', 'N/A')}'. Skipping timestamps.", file=sys.stderr)
                created = None 
                updated = None 
            except ValueError as e:
                 print(f"Warning: Invalid date format in item with slug '{item.get('slug', 'N/A')}': {e}. Skipping timestamps.", file=sys.stderr)
                 created = None
                 updated = None


            faq = FaqModel(
                question=item["question"],
                answer=item["answer"],
                slug=item["slug"],
                created_at=created if created else func.now(), # for fallback
                updated_at=updated if updated else func.now(), # for fallback
            )
            db.add(faq)
            try:
                db.commit()
                inserted_count += 1
            except IntegrityError:
                db.rollback()
                print(f"Warning: IntegrityError on slug '{item['slug']}'. Rolled back this item.", file=sys.stderr)
                skipped_count += 1 
            except Exception as e:
                db.rollback()
                print(f"Error processing item with slug '{item.get('slug', 'N/A')}': {e}", file=sys.stderr)
                skipped_count += 1 
    finally:
        db.close() # Ensure session is closed

    print(f"Seeding complete. Inserted: {inserted_count}, Skipped/Existing: {skipped_count}")


if __name__ == "__main__":
    print("🌱 Running database seed script...")
    run_seed()
