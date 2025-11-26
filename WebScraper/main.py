from database import Base, engine, SessionLocal
from models import Job
from scrapers import scrape_jobs
from print_database import print_jobs

# Create tables if not exist
Base.metadata.create_all(bind=engine)

# Duplicate-safe add/update
def add_or_update_job(db, job_dict):
    existing = db.query(Job).filter(Job.title == job_dict["title"], Job.company == job_dict["company"]).first()
    if existing:
        # Update existing job
        existing.location = job_dict.get("location")
        existing.salary = job_dict.get("salary")
        existing.tech = job_dict.get("tech")
        existing.remote = job_dict.get("remote")
        existing.source = job_dict.get("source")
        db.commit()
        return existing
    # Otherwise insert new
    new_job = Job(**job_dict)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

def run_scraper():
    db = SessionLocal()

    sources = ["amazon", "indeed"]
    queries = ["python developer", "rust developer"]

    for source in sources:
        for query in queries:
            print(f"Scraping {source} for {query}...")
            jobs = scrape_jobs(source, query)
            for job in jobs:
                add_or_update_job(db, job)

    db.close()
    print("Scraping finished!")

if __name__ == "__main__":
    run_scraper()
    print_jobs()