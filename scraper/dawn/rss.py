import logging
import feedparser
from shared.session import make_session
from shared.throttle import Throttle
from shared.retry import fetch_with_retry
from shared.db import get_client, upsert_article, start_run, finish_run
from dawn.parser import parse_article

logger = logging.getLogger(__name__)

FEEDS = [
    "https://www.dawn.com/feeds/home",
    "https://www.dawn.com/feeds/pakistan",
    "https://www.dawn.com/feeds/world",
    "https://www.dawn.com/feeds/business",
    "https://www.dawn.com/feeds/opinion",
]

def run():
    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s %(levelname)s %(message)s")
    session = make_session()
    throttle = Throttle(min_delay=2.0, max_delay=6.0, burst_every=10, burst_delay=15.0)
    run_id = start_run("dawn", "rss")

    found = new = failed = 0
    last_id = None

    for feed_url in FEEDS:
        feed = feedparser.parse(feed_url)
        for entry in feed.entries:
            url = entry.link
            found += 1

            existing = get_client().table("articles") \
                .select("url").eq("url", url).execute()
            if existing.data:
                continue

            response = fetch_with_retry(session, url, throttle)
            if response is None:
                failed += 1
                continue

            article = parse_article(url, response.text)
            if not article:
                failed += 1
                continue

            if upsert_article(article):
                new += 1
                last_id = article.get("article_id")
                logger.info(f"Saved [{last_id}] {article['headline']}")
            else:
                failed += 1

    status = "success" if failed == 0 else "partial" if new > 0 else "failed"
    finish_run(run_id, found, new, failed, last_id, status)
    logger.info(f"Done — found={found} new={new} failed={failed}")

if __name__ == "__main__":
    run()
