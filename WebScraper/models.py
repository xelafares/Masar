from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    company = Column(String)
    location = Column(String)
    salary = Column(String)
    tech = Column(String)
    remote = Column(Boolean)
    source = Column(String)  # Amazon, Indeed, etc.