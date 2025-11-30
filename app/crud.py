from sqlalchemy.orm import Session
from . import models, schemas

# --- USER ---
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(username=user.username, email=user.email, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- JOBS ---
def get_jobs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Job).offset(skip).limit(limit).all()

# --- BOOKMARKS ---
def create_bookmark(db: Session, user_id: int, job_id: int):
    existing = db.query(models.Bookmark).filter(
        models.Bookmark.user_id == user_id,
        models.Bookmark.job_id == job_id
    ).first()
    if existing:
        return existing

    db_bookmark = models.Bookmark(user_id=user_id, job_id=job_id)
    db.add(db_bookmark)
    db.commit()
    db.refresh(db_bookmark)
    return db_bookmark

def get_user_bookmarked_ids(db: Session, user_id: int):
    results = db.query(models.Bookmark.job_id).filter(models.Bookmark.user_id == user_id).all()
    return [r[0] for r in results]

def delete_bookmark(db: Session, user_id: int, job_id: int):
    db.query(models.Bookmark).filter(
        models.Bookmark.user_id == user_id,
        models.Bookmark.job_id == job_id
    ).delete()
    db.commit()