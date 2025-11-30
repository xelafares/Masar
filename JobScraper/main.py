# from database import SessionLocal, init_db
# from models import Job
# from scrapers import scrape_all_sources
# import datetime
#
#
# def save_job(db, job_data):
#     # 1. Debug: Check what data we received
#     # print(f"DEBUG: Processing {job_data['title']}...")
#
#     # Check duplicate by URL
#     existing = db.query(Job).filter(Job.url == job_data["url"]).first()
#
#     if existing:
#         print(f"Skipping duplicate: {job_data['title']}")
#         return
#
#     # Create new Job record
#     new_job = Job(
#         title=job_data["title"],
#         company=job_data["company"],
#         location=job_data["location"],
#         description=job_data["description"],
#
#         # Integers
#         salary_min=job_data["salary_min"],
#         salary_max=job_data["salary_max"],
#
#         tech_stack=job_data["tech"],
#         logo_url=job_data.get("logo_url"),
#
#         url=job_data["url"],
#         posted_date=datetime.datetime.utcnow()
#     )
#
#     try:
#         db.add(new_job)
#         db.commit()
#         print(f"SUCCESS: Saved {new_job.title} (Salary: {new_job.salary_min}-{new_job.salary_max})")
#     except Exception as e:
#         print(f"ERROR: Failed to save {new_job.title}. Reason: {e}")
#         db.rollback()
#
#
# def run():
#     print("--- 1. Initializing Database ---")
#     init_db()
#     db = SessionLocal()
#
#     print("--- 2. Scraping Jobs ---")
#     all_jobs_dict = scrape_all_sources()
#
#     amazon_jobs = all_jobs_dict.get("amazon", [])
#
#     print(f"--- 3. Saving to DB ---")
#     print(f"Found {len(amazon_jobs)} jobs from scraper.")
#
#     if len(amazon_jobs) == 0:
#         print("WARNING: No jobs found. Check your internet or the scraper logic.")
#
#     for job in amazon_jobs:
#         save_job(db, job)
#
#     db.close()
#     print("--- 4. Done ---")
#
#
# if __name__ == "__main__":
#     run()

from database import SessionLocal, init_db
from models import Job
from scrapers import scrape_all_sources
import datetime


def save_job(db, job_data):
    # Check duplicate by URL
    existing = db.query(Job).filter(Job.url == job_data["url"]).first()
    if existing:
        return

    new_job = Job(
        title=job_data["title"],
        company=job_data["company"],
        location=job_data["location"],
        description=job_data["description"],
        salary_min=job_data["salary_min"],
        salary_max=job_data["salary_max"],
        tech_stack=job_data["tech"],
        logo_url=job_data.get("logo_url"),
        url=job_data["url"],
        posted_date=datetime.datetime.utcnow()
    )

    try:
        db.add(new_job)
        db.commit()
        # Print shorter success message
        print(f"Saved: {new_job.title[:30]}...")
    except Exception as e:
        print(f"Error saving: {e}")
        db.rollback()


def run():
    print("--- 1. Initializing Database ---")
    init_db()
    db = SessionLocal()

    print("--- 2. Scraping Jobs ---")
    all_jobs_dict = scrape_all_sources()

    # Combine lists from all sources
    all_jobs_list = []
    for source, jobs in all_jobs_dict.items():
        print(f"Source '{source}' provided {len(jobs)} jobs.")
        all_jobs_list.extend(jobs)

    print(f"--- 3. Saving {len(all_jobs_list)} jobs to DB ---")

    for job in all_jobs_list:
        save_job(db, job)

    db.close()
    print("--- 4. Done ---")


if __name__ == "__main__":
    run()