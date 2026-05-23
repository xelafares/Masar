<p align="center">
  <img src="static/images/fulllogowhite.png" alt="Masar Logo" width="280"/>
</p>
<h1 align="center">مسار — Masar</h1>
<p align="center">
  <strong>Your Career Path, Simplified</strong><br/>
  A career development & job discovery platform built for the job market.
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
</p>

Masar is a full-stack career development and job discovery platform. It aggregates real job listings from employment portals and pairs them with structured career roadmaps, bridging the gap between finding a job and being ready for one. Built during the <a href="https://qimma.dev/" target="_blank" rel="noopener noreferrer">Qimma Hackathon</a>..

---

## Features

- **Job Discovery** — Browse jobs scraped in real-time from job portals
- **Advanced Filtering** — Filter by title, company, location, work type, and date range
- **Career Roadmaps** — Step-by-step learning paths organized by role, skill, or trending topic
- **Bookmarks** — Save and manage favorite job listings
- **User Profiles** — Customize your profile with skills, bio, and profile picture
- **Authentication** — Secure signup and login with hashed passwords
- **Arabic RTL** — Full right-to-left Arabic interface
- **Responsive** — Mobile-friendly design

---

## Tech Stack

| Layer      | Technologies                          |
|------------|---------------------------------------|
| Backend    | Python, FastAPI, Uvicorn, Jinja2      |
| Frontend   | HTML5, CSS3, Vanilla JavaScript       |
| Database   | SQLite, SQLAlchemy ORM                |
| Scraping   | BeautifulSoup4, Requests              |
| Validation | Pydantic                              |

---

## Project Structure

```
Masar/
├── app/                    # Main application backend
│   ├── main.py             # FastAPI app, routes & API endpoints
│   ├── models.py           # SQLAlchemy models (User, Bookmark)
│   ├── schemas.py          # Pydantic schemas
│   ├── crud.py             # Database CRUD operations
│   ├── database.py         # DB connection & session config
│   ├── app.db              # Users & bookmarks database
│   └── jobs.db             # Scraped job listings database
│
├── JobScraper/             # Job scraping module
│   ├── main.py             # Scraper FastAPI endpoints
│   ├── scrapers.py         # Jadarat & Tamheer scraping logic
│   ├── models.py           # Job model
│   ├── crud.py             # Job CRUD operations
│   └── database.py         # Scraper DB connection
│
├── static/
│   ├── css/                # Modular stylesheets
│   ├── js/                 # Page-specific JavaScript
│   └── images/
│
├── *.html                  # Frontend pages
├── requirements.txt
└── README.md
```

---

## Getting Started

**Prerequisites:** Python 3.10+, pip

```bash
# Clone the repo
git clone https://github.com/xelafares/Masar.git
cd Masar

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Linux / macOS
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Run the application
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000` in your browser.

**Running the job scraper (optional)**

```bash
uvicorn JobScraper.main:app --port 8001 --reload
curl -X POST http://127.0.0.1:8001/scrape/all
```

---

## API Reference

### Authentication

| Method | Endpoint       | Description              |
|--------|----------------|--------------------------|
| POST   | /api/signup    | Create a new account     |
| POST   | /api/login     | Login                    |
| POST   | /api/logout    | Logout                   |
| GET    | /api/me        | Get current user profile |
| PUT    | /api/me        | Update profile           |

### Jobs

| Method | Endpoint        | Description                          |
|--------|-----------------|--------------------------------------|
| GET    | /api/jobs       | List jobs (supports filtering)       |
| GET    | /api/jobs/{id}  | Get job details by ID                |

### Bookmarks

| Method | Endpoint                  | Description            |
|--------|---------------------------|------------------------|
| GET    | /api/bookmarks            | Get all bookmarks      |
| POST   | /api/bookmarks/{job_id}   | Toggle job bookmark    |

### Scraper

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| POST   | /scrape/jadarat   | Scrape Jadarat portal    |
| POST   | /scrape/tamheer   | Scrape Tamheer portal    |
| POST   | /scrape/all       | Scrape all sources       |
| GET    | /jobs             | Get all scraped jobs     |
| GET    | /jobs/{id}        | Get scraped job by ID    |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## License

## License
Built for the <a href="https://qimma.dev/" target="_blank" rel="noopener noreferrer">Qimma Hackathon</a>.
