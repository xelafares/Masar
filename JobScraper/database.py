from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

# Points to the SAME file as the App (Up one level, then into 'app')
engine = create_engine("sqlite:///../app/jobs.db", echo=False)
SessionLocal = sessionmaker(bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)