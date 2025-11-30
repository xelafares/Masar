from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


# --- Stored in app.db ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    bookmarks = relationship("Bookmark", back_populates="user")


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer)  # No ForeignKey to Job (different DB)

    user = relationship("User", back_populates="bookmarks")


# --- Stored in jobs.db ---
class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String)
    location = Column(String)
    description = Column(Text)

    # FIXED: Integers for filtering
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)

    tech_stack = Column(String)
    logo_url = Column(String, nullable=True)
    posted_date = Column(DateTime, default=datetime.utcnow)
    url = Column(String)