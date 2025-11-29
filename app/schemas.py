from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

# --- JOB SCHEMAS ---
class JobBase(BaseModel):
    title: str
    company: str
    location: str
    description: str
    salary_min: int
    salary_max: int
    tech_stack: str
    logo_url: str

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: int
    posted_date: datetime
    class Config:
        from_attributes = True

# --- BOOKMARK SCHEMAS ---
class BookmarkCreate(BaseModel):
    user_id: int
    job_id: int

class Bookmark(BaseModel):
    id: int
    user_id: int
    job_id: int
    class Config:
        from_attributes = True