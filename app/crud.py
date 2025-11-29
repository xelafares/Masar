from sqlalchemy.orm import Session
from . import models, schemas


# --- USER ---
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    # Note: In production, hash the password here!
    db_user = models.User(
        username=user.username,
        email=user.email,
        password=user.password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# --- JOBS ---
def get_jobs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Job).offset(skip).limit(limit).all()


def create_job(db: Session, job: schemas.JobCreate):
    db_job = models.Job(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job


# --- BOOKMARKS ---
def create_bookmark(db: Session, user_id: int, job_id: int):
    # Check if already exists
    existing = db.query(models.Bookmark).filter(
        models.Bookmark.user_id == user_id,
        models.Bookmark.job_id == job_id
    ).first()

    if existing:
        return existing  # Already bookmarked

    db_bookmark = models.Bookmark(user_id=user_id, job_id=job_id)
    db.add(db_bookmark)
    db.commit()
    db.refresh(db_bookmark)
    return db_bookmark


def get_user_bookmarks(db: Session, user_id: int):
    return db.query(models.Job).join(models.Bookmark).filter(models.Bookmark.user_id == user_id).all()