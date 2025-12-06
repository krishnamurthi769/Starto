from app.database import SessionLocal, engine
from app import models
import logging

logging.basicConfig(level=logging.INFO)

def test_connection():
    try:
        print("Testing DB Connection...")
        db = SessionLocal()
        print("Session created.")
        
        # Try to query categories
        categories = db.query(models.BusinessCategory).all()
        print(f"Categories found: {len(categories)}")
        for cat in categories:
            print(f"- {cat.name}")
            
        db.close()
        print("Success!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_connection()
