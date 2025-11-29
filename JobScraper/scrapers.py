import requests
from bs4 import BeautifulSoup
from utils import detect_remote, match_keyword

DEV_KEYWORDS = [
    "developer", "software", "engineer", "backend", "frontend",
    "full stack", "machine learning", "devops", "ai", "data",
    "cloud", "python", "javascript", "java", "c++", "rust", "golang"
]

def is_dev_job(title):
    title_lower = title.lower()
    return any(keyword in title_lower for keyword in DEV_KEYWORDS)

# --- Mock HTML scraper ---
def scrape_mock_html(html):
    soup = BeautifulSoup(html, "html.parser")
    jobs = []
    for job_div in soup.select(".job"):
        title = job_div.select_one(".title").get_text(strip=True)
        company = job_div.select_one(".company").get_text(strip=True)
        tech = job_div.select_one(".tech").get_text(strip=True)
        location = job_div.select_one(".location").get_text(strip=True)
        remote_text = job_div.select_one(".remote").get_text(strip=True)
        url = job_div.select_one("a")["href"]

        if is_dev_job(title):
            jobs.append({
                "title": title,
                "company": company,
                "tech": tech,
                "remote": remote_text.lower() == "yes",
                "location": location,
                "url": url,
                "description": job_div.get_text(strip=True),
                "source": "mock"
            })
    return jobs

# --- Amazon JSON scraper (pagination) ---
def scrape_amazon_all_pages():
    all_jobs = []
    limit = 10
    offset = 0
    KEYWORDS = [
        "python developer", "rust developer", "golang developer",
        "software engineer", "backend engineer", "full stack",
        "developer", "engineer", "machine learning", "data engineer"
    ]

    while True:
        url = f"https://www.amazon.jobs/en/search.json?keyword=developer&offset={offset}&limit={limit}"
        resp = requests.get(url)
        data = resp.json()

        jobs = data.get("jobs", [])
        if not jobs:
            break

        for job in jobs:
            title = job["title"]
            if not is_dev_job(title):
                continue

            job_dict = {
                "title": title,
                "company": "Amazon",
                "tech": ", ".join(job.get("job_functions", [])),
                "remote": job.get("is_remote", False),
                "location": job.get("city", ""),
                "url": f"https://www.amazon.jobs{job.get('url','')}",
                "description": job.get("description", ""),
                "source": "amazon",
                "salary": job.get("salary", "")
            }

            # optional: match against keywords
            if match_keyword(title + " " + job_dict["description"], KEYWORDS):
                all_jobs.append(job_dict)

        offset += limit

    print(f"Scraped {len(all_jobs)} Amazon jobs total.")
    return all_jobs

# --- Unified scraper ---
def scrape_all_sources():
    all_jobs = {}
    # all_jobs["mock"] = scrape_mock_html(open("mock_jobs.html").read())  # optional
    all_jobs["amazon"] = scrape_amazon_all_pages()
    return all_jobs
