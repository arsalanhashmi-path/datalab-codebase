from bs4 import BeautifulSoup

def parse_article(url: str, html: str) -> dict | None:
    soup = BeautifulSoup(html, "html.parser")

    def meta(prop=None, name=None):
        if prop:
            tag = soup.find("meta", property=prop)
        else:
            tag = soup.find("meta", attrs={"name": name})
        return tag["content"].strip() if tag and tag.get("content") else None

    article_tag = soup.find("article", attrs={"data-id": True})
    if not article_tag:
        return None

    body_paragraphs = soup.select(".story__content p")
    body_text = " ".join(p.get_text(strip=True) for p in body_paragraphs)
    body_html = str(soup.select_one(".story__content")) if soup.select_one(".story__content") else None

    return {
        "source":       "dawn",
        "url":          meta(prop="og:url") or url,
        "article_id":   article_tag.get("data-id"),
        "headline":     meta(prop="og:title"),
        "description":  meta(prop="og:description"),
        "author":       meta(name="author"),
        "author_url":   meta(prop="article:author"),
        "section":      meta(prop="article:section"),
        "image_url":    meta(prop="og:image"),
        "published_at": meta(prop="article:published_time"),
        "updated_at":   meta(prop="article:modified_time"),
        "body_text":    body_text or None,
        "body_html":    body_html,
    }
