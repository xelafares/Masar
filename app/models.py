from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime
# Assuming 'Base' is imported from your local database.py
from .database import Base


# --- Stored in app.db (User data, Bookmarks, Progress) ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    # Profile Data
    job_title = Column(String, default="Aspiring Developer")
    bio = Column(Text, default="")
    avatar_data = Column(Text, nullable=True)  # Stores Base64 string

    bookmarks = relationship("Bookmark", back_populates="user")
    progress = relationship("Progress", back_populates="user")


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer)

    user = relationship("User", back_populates="bookmarks")


# NEW MODEL: Progress Tracking
class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    roadmap_id = Column(String, index=True)  # e.g., 'frontend_dev'
    step_id = Column(String, index=True)  # e.g., 'fe_1'

    # Ensure a user can complete a specific step only once
    __table_args__ = (
        UniqueConstraint('user_id', 'roadmap_id', 'step_id', name='uq_user_roadmap_step'),
    )

    user = relationship("User", back_populates="progress")


# --- Stored in jobs.db (Scraped Job Listings) ---
class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String)
    location = Column(String)
    description = Column(Text)

    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)

    tech_stack = Column(String)
    logo_url = Column(String, nullable=True)
    posted_date = Column(DateTime, default=datetime.utcnow)
    url = Column(String)