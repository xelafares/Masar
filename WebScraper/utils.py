import re

# Simple "AI-ish" tech extractor
TECH_KEYWORDS = ["python", "javascript", "java", "c++", "rust", "react", "sql", "docker", "aws"]

def extract_tech(description):
    description = description.lower()
    return ", ".join([t for t in TECH_KEYWORDS if t in description])

def detect_remote(description):
    description = description.lower()
    return bool(re.search(r"remote|virtual", description))