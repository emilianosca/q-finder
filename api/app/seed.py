# api/app/seed.py

import json
import os
from datetime import datetime

from sqlalchemy.exc import IntegrityError

from .db import SessionLocal, FaqModel

# load seeds
here = os.path.dirname(__file__)
with open(os.path.join(here, "faq_seed.json"), encoding="utf-8") as f:
    seed_data = json.load(f)

def parse_iso(dt_str: str) -> datetime:
    return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))

def run_seed():
    db = SessionLocal()
    inserted = 0

    for item in seed_data:
        # check if slug exists
        if db.query(FaqModel).filter_by(slug=item["slug"]).first():
            continue

        faq = FaqModel(
            id=item.get("id"),
            question=item["question"],
            answer=item["answer"],
            slug=item["slug"],
            # override timestamps if you care, else omit:
            created_at=parse_iso(item["createdAt"]),
            updated_at=parse_iso(item["updatedAt"]),
        )

        db.add(faq)
        
        inserted += 1
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
    db.close()
    print(f"✔️  Inserted {inserted} new FAQs.")

if __name__ == "__main__":
    run_seed()