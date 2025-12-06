import sys
import os

# Add the current directory to sys.path so we can import app modules
sys.path.append(os.getcwd())

from app.database import SessionLocal, Base, engine
from app import services

def main():
    print("Creating tables if they don't exist...")
    Base.metadata.create_all(bind=engine)
    
    print("Seeding database...")
    db = SessionLocal()
    try:
        services.seed_database(db)
        print("Database seeded successfully with 'Execution Intelligence' data!")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print(f"Database path expected at: {os.path.abspath('starto.db')}")
    main()
