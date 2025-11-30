from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, crud
from .database import engine_app, get_app_db, get_jobs_db

# Create tables for the App DB (Users, Bookmarks, Progress) automatically
models.Base.metadata.create_all(bind=engine_app)

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


# --- FRONTEND ROUTES ---
@app.get("/")
async def read_index():
    return FileResponse("index.html")


@app.get("/{filename}.html")
async def read_html(filename: str):
    return FileResponse(f"{filename}.html")


# --- AUTHENTICATION ---
@app.post("/api/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_app_db)):
    db_user_email = crud.get_user_by_email(db, email=user.email)
    if db_user_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    # FIX: Check for duplicate username (relies on crud.get_user_by_username)
    db_user_username = crud.get_user_by_username(db, username=user.username)
    if db_user_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    return crud.create_user(db=db, user=user)


@app.post("/api/login")
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_app_db)):
    user = crud.get_user_by_email(db, email=user_credentials.email)
    if not user or user.password != user_credentials.password:
        raise HTTPException(status_code=403, detail="Invalid Credentials")

    return {
        "status": "success",
        "user_id": user.id,
        "username": user.username
    }


# --- USER PROFILE ---
@app.get("/api/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_app_db)):
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.put("/api/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, profile: schemas.UserUpdate, db: Session = Depends(get_app_db)):
    db_user = crud.update_user_profile(db, user_id=user_id, profile=profile)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


# --- JOBS ---
@app.get("/api/jobs", response_model=List[schemas.Job])
def read_jobs(user_id: int = -1, skip: int = 0, limit: int = 100, jobs_db: Session = Depends(get_jobs_db),
              app_db: Session = Depends(get_app_db)):
    jobs = crud.get_jobs(jobs_db, skip=skip, limit=limit)
    bookmarked_ids = []
    if user_id != -1:
        bookmarked_ids = crud.get_user_bookmarked_ids(app_db, user_id=user_id)

    results = []
    for job in jobs:
        j_schema = schemas.Job.model_validate(job)
        if job.id in bookmarked_ids:
            j_schema.bookmarked = True
        results.append(j_schema)
    return results


# --- BOOKMARKS ---
@app.post("/api/bookmarks")
def add_bookmark(bookmark: schemas.BookmarkCreate, db: Session = Depends(get_app_db)):
    return crud.create_bookmark(db, user_id=bookmark.user_id, job_id=bookmark.job_id)


@app.delete("/api/bookmarks")
def delete_bookmark(bookmark: schemas.BookmarkCreate, db: Session = Depends(get_app_db)):
    crud.delete_bookmark(db, user_id=bookmark.user_id, job_id=bookmark.job_id)
    return {"status": "deleted"}


# --- NEW: PROGRESS API ---
@app.get("/api/progress/{user_id}", response_model=List[schemas.Progress])
def read_progress(user_id: int, db: Session = Depends(get_app_db)):
    return crud.get_user_progress(db, user_id=user_id)


@app.post("/api/progress", response_model=schemas.Progress)
def add_progress(data: schemas.ProgressCreate, db: Session = Depends(get_app_db)):
    return crud.create_progress(db, data=data)


@app.delete("/api/progress")
def delete_progress(data: schemas.ProgressCreate, db: Session = Depends(get_app_db)):
    crud.delete_progress(db, data=data)
    return {"status": "deleted"}