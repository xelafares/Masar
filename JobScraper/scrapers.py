import requests
import time
import random
import re
from bs4 import BeautifulSoup
from utils import detect_remote, match_keyword, extract_tech_stack, extract_salary

# --- CONFIGURATION ---

DEV_KEYWORDS = [
    "developer", "software", "engineer", "backend", "frontend",
    "full stack", "machine learning", "devops", "ai", "data",
    "cloud", "python", "javascript", "java", "c++", "rust", "golang"
]

TECH_STACK_LIST = [
    "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "React", "Angular", "Vue",
    "Node.js", "Django", "Flask", "FastAPI", "Spring", "Docker", "Kubernetes", "AWS",
    "Azure", "GCP", "SQL", "NoSQL", "MongoDB", "PostgreSQL", "Redis", "Go", "Rust",
    "Swift", "Kotlin", "Flutter", "Terraform", "Jenkins", "Git", "Linux", "Machine Learning",
    "AI", "Data Science", "Pytorch", "TensorFlow"
]


def is_dev_job(title):
    title_lower = title.lower()
    return any(keyword in title_lower for keyword in DEV_KEYWORDS)


# --- SOURCE 1: REMOTIVE.IO (Reliable, Public API) ---
def scrape_remotive_jobs():
    print("--- Scraping Remotive.io (Backup Source) ---")
    all_jobs = []

    # Remotive has a public API for software dev jobs
    url = "https://remotive.com/api/remote-jobs?category=software-dev"

    try:
        resp = requests.get(url)
        data = resp.json()
        jobs = data.get("jobs", [])

        print(f"Remotive API returned {len(jobs)} raw jobs.")

        # Process only the first 50 to keep it fast for testing
        for job in jobs[:50]:
            title = job.get("title", "Unknown")
            company = job.get("company_name", "Unknown Company")
            description_html = job.get("description", "")

            # Clean HTML description
            soup = BeautifulSoup(description_html, "html.parser")
            clean_desc = soup.get_text(separator=" ", strip=True)

            # Combine text for analysis
            full_text = f"{title} {clean_desc}"

            # Extract Metadata
            detected_tech = extract_tech_stack(full_text, TECH_STACK_LIST)
            sal_min, sal_max = extract_salary(full_text)

            # Generate Logo URL (using the company name)
            # Make sure to handle spaces for filenames if you save them locally,
            # or just use the UI Avatars logic in the frontend if the file doesn't exist.
            logo_path = job.get("company_logo")  # Remotive provides actual logo URLs!

            # If no logo from API, fallback to local naming convention
            if not logo_path:
                logo_path = f"static/images/{company}.png"

            job_dict = {
                "title": title,
                "company": company,
                "tech": detected_tech,
                "remote": True,  # Remotive is 100% remote
                "location": job.get("candidate_required_location", "Remote"),
                "url": job.get("url"),
                "description": clean_desc,
                "source": "remotive",
                "salary_min": sal_min,
                "salary_max": sal_max,
                "logo_url": logo_path
            }

            all_jobs.append(job_dict)

    except Exception as e:
        print(f"Error scraping Remotive: {e}")

    return all_jobs


# --- SOURCE 2: AMAZON (Harder to scrape) ---
def scrape_amazon_all_pages():
    all_jobs = []
    limit = 10
    offset = 0

    print("--- Scraping Amazon ---")

    while True:
        # Random safety delay
        sleep_time = random.uniform(1.0, 3.0)
        print(f"Amazon: Waiting {sleep_time:.2f}s...")
        time.sleep(sleep_time)

        url = f"https://www.amazon.jobs/en/search.json?keyword=software%20development&offset={offset}&limit={limit}"

        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            resp = requests.get(url, headers=headers)

            if resp.status_code != 200:
                print(f"Amazon blocked request (Status {resp.status_code}). Stopping Amazon scrape.")
                break

            data = resp.json()
        except Exception as e:
            print(f"Error fetching Amazon data: {e}")
            break

        jobs = data.get("jobs", [])
        if not jobs:
            break

        for job in jobs:
            title = job.get("title", "Unknown")
            if not is_dev_job(title): continue

            job_path = job.get("job_path", "")
            full_url = f"https://www.amazon.jobs{job_path}" if job_path else "https://www.amazon.jobs"

            description = job.get("description", "")
            soup_desc = BeautifulSoup(description, "html.parser")
            clean_desc = soup_desc.get_text(separator=" ", strip=True)

            full_text = f"{title} {clean_desc}"
            detected_tech = extract_tech_stack(full_text, TECH_STACK_LIST)
            sal_min, sal_max = extract_salary(full_text)

            job_dict = {
                "title": title,
                "company": "Amazon",
                "tech": detected_tech,
                "remote": job.get("is_remote", False),
                "location": job.get("city", "") or job.get("location_name", ""),
                "url": full_url,
                "description": clean_desc,
                "source": "amazon",
                "salary_min": sal_min,
                "salary_max": sal_max,
                "logo_url": "static/images/Amazon.png"
            }
            all_jobs.append(job_dict)

        offset += limit
        if offset > 20: break  # Keep limit small for now

    return all_jobs


# --- MAIN EXPORT ---
def scrape_all_sources():
    all_results = {}

    # Try Amazon First
    amazon_jobs = scrape_amazon_all_pages()
    if amazon_jobs:
        all_results["amazon"] = amazon_jobs
    else:
        print("Amazon returned 0 jobs. Switching to backup source...")

    # Always fetch Remotive (Reliable source)
    remotive_jobs = scrape_remotive_jobs()
    all_results["remotive"] = remotive_jobs

    return all_results