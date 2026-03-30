import re
from bs4 import BeautifulSoup

def parse_article(url: str, html: str) -> dict | None:
    soup = BeautifulSoup(html, "html.parser")

    def meta(prop=None, name=None):
        if prop:
            tag = soup.find("meta", property=prop)
        else:
            tag = soup.find("meta", attrs={"name": name})
        return tag["content"].strip() if tag and tag.get("content") else None

    # Tribune story pages always have og:title; use it as presence check
    if not meta(prop="og:title"):
        return None

    # Extract article_id from the URL: /story/{id}/...
    match = re.search(r"/story/(\d+)", url)
    article_id = match.group(1) if match else None

    body_tag = soup.select_one("span.story-text")
    body_paragraphs = body_tag.select("p") if body_tag else []
    body_text = " ".join(p.get_text(strip=True) for p in body_paragraphs) or None
    body_html = str(body_tag) if body_tag else None

    return {
        "article_id":   article_id,
        "url":          meta(prop="og:url") or url,
        "headline":     meta(prop="og:title"),
        "description":  meta(prop="og:description"),
        "author":       meta(prop="article:author"),
        "section":      meta(prop="article:section"),
        "image_url":    meta(prop="og:image"),
        "published_at": meta(prop="article:published_time"),
        "updated_at":   meta(prop="article:modified_time"),
        "body_text":    body_text,
        "body_html":    body_html,
    }
