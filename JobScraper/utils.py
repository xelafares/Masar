import re


def detect_remote(text: str):
    text = text.lower()
    return ("remote" in text) or ("work from home" in text)


def match_keyword(text: str, keywords: list[str]):
    text = text.lower()
    for kw in keywords:
        if kw.lower() in text:
            return kw
    return None


def extract_tech_stack(text: str, tech_keywords: list[str]):
    found_tech = set()
    text = text.lower()
    for tech in tech_keywords:
        # Regex to match exact words (e.g., match "Go" but not "Google")
        pattern = r"(?:^|[\s,.\/;:\(\)])" + re.escape(tech.lower()) + r"(?:$|[\s,.\/;:\(\)])"
        if re.search(pattern, text):
            found_tech.add(tech)
    return ", ".join(found_tech)


def extract_salary(text: str):
    """
    Extracts salary ranges from text and converts them to integers.
    Returns: (min_salary, max_salary) or (None, None)
    """
    # Pattern looks for: $100,000 - $150,000 OR $100k - $150k
    pattern = r'\$([0-9]{2,3}(?:,[0-9]{3})*|([0-9]+)k)\s*(?:-|to)\s*\$([0-9]{2,3}(?:,[0-9]{3})*|([0-9]+)k)'

    match = re.search(pattern, text, re.IGNORECASE)

    if match:
        def parse_num(s):
            if not s: return 0
            s = s.lower().replace(',', '')
            if 'k' in s:
                try:
                    return int(float(s.replace('k', '')) * 1000)
                except ValueError:
                    return 0
            try:
                return int(s)
            except ValueError:
                return 0

        # Extract the full match string to parse specifically
        raw_str = match.group(0)
        # Find all number-like chunks in that specific match
        numbers = re.findall(r'[0-9]+(?:,[0-9]{3})*k?', raw_str, re.IGNORECASE)

        if len(numbers) >= 2:
            return parse_num(numbers[0]), parse_num(numbers[1])

    return None, None