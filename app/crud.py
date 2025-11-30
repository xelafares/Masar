from sqlalchemy.orm import Session
from typing import List
from . import models, schemas
from sqlalchemy import func


# ========================
#    USER OPERATIONS
# ========================

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        username=user.username,
        email=user.email,
        password=user.password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user_profile(db: Session, user_id: int, profile: schemas.UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None

    if profile.username: db_user.username = profile.username
    if profile.email: db_user.email = profile.email
    if profile.job_title: db_user.job_title = profile.job_title
    if profile.bio: db_user.bio = profile.bio
    if profile.avatar_data: db_user.avatar_data = profile.avatar_data

    db.commit()
    db.refresh(db_user)
    return db_user


# ========================
#    JOB OPERATIONS
# ========================
def get_jobs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Job).offset(skip).limit(limit).all()


# ========================
#   BOOKMARK OPERATIONS
# ========================
def create_bookmark(db: Session, user_id: int, job_id: int):
    existing = db.query(models.Bookmark).filter(
        models.Bookmark.user_id == user_id,
        models.Bookmark.job_id == job_id
    ).first()

    if existing: return existing

    db_bookmark = models.Bookmark(user_id=user_id, job_id=job_id)
    db.add(db_bookmark)
    db.commit()
    db.refresh(db_bookmark)
    return db_bookmark


def delete_bookmark(db: Session, user_id: int, job_id: int):
    db.query(models.Bookmark).filter(
        models.Bookmark.user_id == user_id,
        models.Bookmark.job_id == job_id
    ).delete()
    db.commit()


def get_user_bookmarked_ids(db: Session, user_id: int):
    results = db.query(models.Bookmark.job_id).filter(models.Bookmark.user_id == user_id).all()
    return [r[0] for r in results]


# ========================
#   NEW: PROGRESS OPERATIONS
# ========================

def create_progress(db: Session, data: schemas.ProgressCreate):
    existing = db.query(models.Progress).filter(
        models.Progress.user_id == data.user_id,
        models.Progress.roadmap_id == data.roadmap_id,
        models.Progress.step_id == data.step_id
    ).first()

    if existing:
        return existing

    db_progress = models.Progress(**data.model_dump())
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress


def delete_progress(db: Session, data: schemas.ProgressCreate):
    db.query(models.Progress).filter(
        models.Progress.user_id == data.user_id,
        models.Progress.roadmap_id == data.roadmap_id,
        models.Progress.step_id == data.step_id
    ).delete()
    db.commit()


def get_user_progress(db: Session, user_id: int) -> List[schemas.Progress]:
    return db.query(models.Progress).filter(models.Progress.user_id == user_id).all()