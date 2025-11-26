import requests
from bs4 import BeautifulSoup
from utils import extract_tech, detect_remote

def scrape_amazon(query, location="", limit=20):
    url = "https://www.amazon.jobs/en/search.json"
    params = {"keywords": query, "locquery": location, "result_limit": limit}
    response = requests.get(url, params=params)
    if response.status_code != 200: return []

    jobs = []
    for job in response.json().get("jobs", []):
        description = job.get("title", "") + " " + job.get("category", "")
        jobs.append({
            "title": job.get("title"),
            "company": "Amazon",
            "location": f"{job.get('city')}, {job.get('country_code')}",
            "salary": None,
            "tech": extract_tech(description),
            "remote": detect_remote(description),
            "source": "Amazon"
        })
    return jobs

def scrape_indeed(query, location=""):
    url = f"https://www.indeed.com/jobs?q={query}&l={location}"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    if response.status_code != 200: return []

    soup = BeautifulSoup(response.text, "html.parser")
    jobs = []

    for job in soup.select(".job_seen_beacon"):
        title_tag = job.select_one("h2.jobTitle span")
        company_tag = job.select_one(".companyName")
        location_tag = job.select_one(".companyLocation")
        salary_tag = job.select_one(".salary-snippet")
        desc = job.get_text(" ", strip=True)

        jobs.append({
            "title": title_tag.get_text(strip=True) if title_tag else None,
            "company": company_tag.get_text(strip=True) if company_tag else None,
            "location": location_tag.get_text(strip=True) if location_tag else None,
            "salary": salary_tag.get_text(strip=True) if salary_tag else None,
            "tech": extract_tech(desc),
            "remote": detect_remote(desc),
            "source": "Indeed"
        })
    return jobs

# Unified interface
def scrape_jobs(source, query="", location="", limit=20):
    if source.lower() == "amazon":
        return scrape_amazon(query, location, limit)
    elif source.lower() == "indeed":
        return scrape_indeed(query, location)
    else:
        raise ValueError("Unknown source!")