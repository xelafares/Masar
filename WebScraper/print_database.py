from database import SessionLocal
from models import Job

def print_jobs():
    db = SessionLocal()
    jobs = db.query(Job).all()  # get all jobs
    if not jobs:
        print("No jobs in the database.")
        db.close()
        return

    for job in jobs:
        print(f"ID: {job.id}")
        print(f"Title: {job.title}")
        print(f"Company: {job.company}")
        print(f"Location: {job.location}")
        print(f"Salary: {job.salary}")
        print(f"Tech: {job.tech}")
        print(f"Remote: {job.remote}")
        print(f"Source: {job.source}")
        print("-" * 50)

    db.close()