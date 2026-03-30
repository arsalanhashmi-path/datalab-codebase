import logging
import os
import socket
from bs4 import BeautifulSoup
from shared.session import make_session
from shared.throttle import Throttle
from shared.retry import fetch_with_retry
from shared.db import get_client, upsert_article, start_run, finish_run
from shared.checkpoint import get_checkpoint, save_checkpoint
from dawn.parser import parse_article

logger = logging.getLogger(__name__)

def get_max_live_id() -> int | None:
    session = make_session()
    try:
        r = session.get("https://www.dawn.com", timeout=15)
        soup = BeautifulSoup(r.text, "html.parser")
        ids = [
            int(tag["data-id"])
            for tag in soup.find_all(attrs={"data-id": True})
            if str(tag.get("data-id", "")).isdigit()
        ]
        return max(ids) if ids else None
    except Exception as e:
        logger.error(f"Could not fetch max live ID: {e}")
        return None

def run():
    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s %(levelname)s %(message)s")
    socket.setdefaulttimeout(30)  # covers DNS resolution, which requests timeout= does not
    session = make_session()
    throttle = Throttle(min_delay=2.0, max_delay=6.0, burst_every=10, burst_delay=15.0)

    override = os.environ.get("OVERRIDE_START_ID", "").strip()
    start_id = int(override) if override.isdigit() else get_checkpoint("dawn")
    override_max = os.environ.get("OVERRIDE_MAX_ID", "").strip()
    max_id = int(override_max) if override_max.isdigit() else get_max_live_id()

    if not start_id:
        logger.error("Cannot determine start_id — no checkpoint for 'dawn' and no OVERRIDE_START_ID set")
        return
    if not max_id:
        logger.error("Cannot determine max_id — failed to fetch live ID from dawn.com homepage")
        return

    if start_id >= max_id:
        logger.info("Already up to date")
        return

    total = max_id - start_id
    logger.info(f"Sequential scrape: {start_id + 1} → {max_id} ({total} IDs to check)")
    run_id = start_run("dawn", "sequential")
    found = new = failed = skipped = 0
    last_id = str(start_id)

    for article_id in range(start_id + 1, max_id + 1):
        url = f"https://www.dawn.com/news/{article_id}"
        found += 1

        if found % 25 == 0:
            pct = found / total * 100
            logger.info(f"Progress: {found}/{total} ({pct:.1f}%) — new={new} skipped={skipped} failed={failed} | current ID={article_id}")

        response = fetch_with_retry(session, url, throttle)
        if response is None:
            skipped += 1
            if found <= 50:
                logger.info(f"Skipped [{article_id}] — no content (404/403)")
            else:
                logger.debug(f"Skipped [{article_id}] — no content (404/403)")
            continue

        article = parse_article(url, response.text)
        if not article:
            failed += 1
            logger.warning(f"Parse failed [{article_id}]")
            continue

        if upsert_article(article):
            new += 1
            last_id = str(article_id)
            save_checkpoint("dawn", article_id)
            logger.info(f"Saved [{article_id}] {article['headline']}")
        else:
            failed += 1
            logger.warning(f"Upsert failed [{article_id}]")

    status = "success" if failed == 0 else "partial" if new > 0 else "failed"
    finish_run(run_id, found, new, failed, last_id, status)
    logger.info(f"Done — found={found} new={new} skipped={skipped} failed={failed}")

if __name__ == "__main__":
    run()
