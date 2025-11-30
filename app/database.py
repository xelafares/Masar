import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# --- Configuration ---
# Read DB URLs from environment variables (for Railway/deployment).
# Fall back to local paths for local development.

APP_DB_URL = os.getenv("SQLALCHEMY_APP_DB_URL", "sqlite:///./app/app.db")
JOBS_DB_URL = os.getenv("SQLALCHEMY_JOBS_DB_URL", "sqlite:///./app/jobs.db")


# 1. Main Database (Users & Bookmarks & Progress)
engine_app = create_engine(
    APP_DB_URL,
    connect_args={"check_same_thread": False}
)
SessionApp = sessionmaker(autocommit=False, autoflush=False, bind=engine_app)

# 2. Jobs Database (Scraped Job Listings)
engine_jobs = create_engine(
    JOBS_DB_URL,
    connect_args={"check_same_thread": False}
)
SessionJobs = sessionmaker(autocommit=False, autoflush=False, bind=engine_jobs)

Base = declarative_base()


# --- Dependencies (Used by FastAPI) ---
def get_app_db():
    db = SessionApp()
    try:
        yield db
    finally:
        db.close()

def get_jobs_db():
    db = SessionJobs()
    try:
        yield db
    finally:
        db.close()