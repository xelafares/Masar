from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)  # In a real app, hash this!

    # Relationships
    bookmarks = relationship("Bookmark", back_populates="user")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String, index=True)
    location = Column(String)
    description = Column(String)
    salary_min = Column(Integer)
    salary_max = Column(Integer)
    tech_stack = Column(String)  # We will store as "React,Node,AWS"
    logo_url = Column(String)
    posted_date = Column(DateTime, default=datetime.utcnow)

    # Relationships
    bookmarked_by = relationship("Bookmark", back_populates="job")


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))

    user = relationship("User", back_populates="bookmarks")
    job = relationship("Job", back_populates="bookmarked_by")