
#commit job to database and return it
def save_job(db: Session, job_data: dict):
    job = Job(**job_data)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

#get jobs from database
def get_all_jobs(db: Session):
    return db.query(Job).all()
