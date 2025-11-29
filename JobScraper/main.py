from database import SessionLocal, init_db
from crud import save_job
from scrapers import scrape_all_sources

KEYWORDS = [
    "python developer",
    "rust developer",
    "golang developer",
    "software engineer",
    "backend engineer",
    "full stack",
    "developer",
    "engineer",
    "machine learning",
    "data engineer"
]

def run_scraper():
    init_db()
    db = SessionLocal()

    all_jobs = scrape_all_sources()

    for source, jobs in all_jobs.items():
        print(f"Saving {len(jobs)} jobs from {source}...")
        for job in jobs:
            saved = save_job(db, job, KEYWORDS)
            if saved:
                print(f"Saved: {saved.company} | {saved.title} | {saved.url}")

    db.close()
    print("Scraping complete!")

if __name__ == "__main__":
    run_scraper()