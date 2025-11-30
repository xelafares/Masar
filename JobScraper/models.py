from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String)
    location = Column(String)
    description = Column(Text)

    # FIXED: Integers
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)

    tech_stack = Column(String)
    logo_url = Column(String, nullable=True)
    posted_date = Column(DateTime, default=datetime.utcnow)
    url = Column(String)