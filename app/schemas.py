from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
import re


# --- USER ---
class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r"[A-Z]", v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r"\d", v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]", v):
            raise ValueError('Password must contain at least one special character')
        return v


class UserLogin(BaseModel):
    email: str
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    job_title: Optional[str] = None
    bio: Optional[str] = None
    avatar_data: Optional[str] = None


class User(UserBase):
    id: int
    job_title: Optional[str] = None
    bio: Optional[str] = None
    avatar_data: Optional[str] = None

    class Config:
        from_attributes = True


# --- JOB ---
class JobBase(BaseModel):
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
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


class Bookmark(BaseModel):
    id: int
    user_id: int
    job_id: int

    class Config:
        from_attributes = True


# -----------------
# --- NEW: PROGRESS ---
# -----------------

class ProgressBase(BaseModel):
    user_id: int
    roadmap_id: str
    step_id: str


class ProgressCreate(ProgressBase):
    pass


class Progress(ProgressBase):
    id: int

    class Config:
        from_attributes = True