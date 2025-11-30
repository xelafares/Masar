from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. Main Database (Users & Bookmarks)
# This saves to Masar/app/app.db
SQLALCHEMY_APP_DB_URL = "sqlite:///./app/app.db"

engine_app = create_engine(SQLALCHEMY_APP_DB_URL, connect_args={"check_same_thread": False})
SessionApp = sessionmaker(autocommit=False, autoflush=False, bind=engine_app)

# 2. Jobs Database (The Scraper DB)
# This reads from Masar/app/jobs.db (Make sure you copied jobs.db here!)
SQLALCHEMY_JOBS_DB_URL = "sqlite:///./app/jobs.db"

engine_jobs = create_engine(SQLALCHEMY_JOBS_DB_URL, connect_args={"check_same_thread": False})
SessionJobs = sessionmaker(autocommit=False, autoflush=False, bind=engine_jobs)

Base = declarative_base()

# Dependency for User Data
def get_app_db():
    db = SessionApp()
    try:
        yield db
    finally:
        db.close()

# Dependency for Job Data
def get_jobs_db():
    db = SessionJobs()
    try:
        yield db
    finally:
        db.close()