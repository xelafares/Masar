from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, crud
from .database import engine_app, get_app_db, get_jobs_db

# Create Tables only for App DB (Jobs DB is managed by the scraper)
models.Base.metadata.create_all(bind=engine_app)

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


# --- AUTH ---
@app.post("/api/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_app_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.post("/api/login")
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_app_db)):
    user = crud.get_user_by_email(db, email=user_credentials.email)
    if not user or user.password != user_credentials.password:
        raise HTTPException(status_code=403, detail="Invalid Credentials")
    return {"status": "success", "user_id": user.id, "username": user.username}


# --- JOBS ---
@app.get("/api/jobs", response_model=List[schemas.Job])
def read_jobs(
        user_id: int = -1,
        skip: int = 0,
        limit: int = 100,
        jobs_db: Session = Depends(get_jobs_db),
        app_db: Session = Depends(get_app_db)
):
    # 1. Get Jobs from jobs.db
    jobs = crud.get_jobs(jobs_db, skip=skip, limit=limit)

    # 2. Get Bookmarks from app.db
    bookmarked_ids = []
    if user_id != -1:
        bookmarked_ids = crud.get_user_bookmarked_ids(app_db, user_id=user_id)

    # 3. Merge
    results = []
    for job in jobs:
        j_schema = schemas.Job.model_validate(job)
        if job.id in bookmarked_ids:
            j_schema.bookmarked = True
        results.append(j_schema)

    return results


@app.post("/api/bookmarks")
def add_bookmark(bookmark: schemas.BookmarkCreate, db: Session = Depends(get_app_db)):
    return crud.create_bookmark(db, user_id=bookmark.user_id, job_id=bookmark.job_id)


# --- HTML SERVING ---
@app.get("/")
async def read_index():
    return FileResponse("index.html")


@app.get("/{page_name}.html")
async def read_html(page_name: str):
    return FileResponse(f"{page_name}.html")

@app.delete("/api/bookmarks")
def remove_bookmark(bookmark: schemas.BookmarkCreate, db: Session = Depends(get_app_db)):
    crud.delete_bookmark(db, user_id=bookmark.user_id, job_id=bookmark.job_id)
    return {"status": "removed"}