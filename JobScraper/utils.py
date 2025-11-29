def detect_remote(text: str):
    text = text.lower()
    return ("remote" in text) or ("work from home" in text)

def match_keyword(text: str, keywords: list[str]):
    text = text.lower()
    for kw in keywords:
        if kw.lower() in text:
            return kw  # return the keyword that matched
    return None
