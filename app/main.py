from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, crud
from .database import SessionLocal, engine

# Create Database Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- API ENDPOINTS ----------------

@app.post("/api/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.post("/api/login")
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=user_credentials.email)
    # Simple check (In production compare hashes)
    if not user or user.password != user_credentials.password:
        raise HTTPException(status_code=403, detail="Invalid Credentials")

    return {"status": "success", "user_id": user.id, "username": user.username}


@app.get("/api/jobs", response_model=List[schemas.Job])
def read_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    jobs = crud.get_jobs(db, skip=skip, limit=limit)
    return jobs


@app.post("/api/jobs", response_model=schemas.Job)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    return crud.create_job(db=db, job=job)


# ---------------- STATIC FILES & HTML SERVING ----------------

# Mount the 'static' folder (CSS, JS, Images)
app.mount("/static", StaticFiles(directory="static"), name="static")


# Serve HTML files
@app.get("/")
async def read_index():
    return FileResponse("index.html")


@app.get("/{page_name}.html")
async def read_html(page_name: str):
    # This serves any .html file requested (e.g. /login.html, /job.html)
    return FileResponse(f"{page_name}.html")