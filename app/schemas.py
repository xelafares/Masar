from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# --- USER ---
class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class User(UserBase):
    id: int

    class Config:
        from_attributes = True


# --- JOB ---
class JobBase(BaseModel):
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None

    # FIXED: Integers
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None

    tech_stack: Optional[str] = None
    logo_url: Optional[str] = None
    url: Optional[str] = None


class JobCreate(JobBase):
    pass


class Job(JobBase):
    id: int
    posted_date: Optional[datetime] = None
    bookmarked: bool = False

    class Config:
        from_attributes = True


# --- BOOKMARK ---
class BookmarkCreate(BaseModel):
    user_id: int
    job_id: int