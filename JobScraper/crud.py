from sqlalchemy.orm import Session
from models import Job
from utils import match_keyword

def save_job(db: Session, job_dict: dict, keywords: list[str]):
    text = (job_dict.get("title","") + " " + job_dict.get("description","")).lower()

    matched = match_keyword(text, keywords)
    if not matched:
        return None  # job does not match any keyword

    job_dict["job_key"] = matched

    existing = db.query(Job).filter(
        Job.title == job_dict["title"],
        Job.company == job_dict["company"]
    ).first()

    if existing:
        for key, value in job_dict.items():
            setattr(existing, key, value)
        db.commit()
        return existing

    new_job = Job(**job_dict)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job
