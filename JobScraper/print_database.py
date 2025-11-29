from database import SessionLocal
from models import Job

def print_jobs():
    db = SessionLocal()
    for job in db.query(Job).all():
        print(f"Title: {job.title}")
        print(f"Company: {job.company}")
        print(f"Location: {job.location}")
        print(f"Salary: {job.salary}")
        print(f"Remote: {'Yes' if job.remote else 'No'}")
        print(f"Source: {job.source}")
        print(f"Tech: {job.tech}")
        print(f"URL: {job.url}")
        print(f"Description: {job.description[:300]}...")
        print("-" * 50)
    db.close()

if __name__ == "__main__":
    print_jobs()
