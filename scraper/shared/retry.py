import time
import random
import logging
import requests

logger = logging.getLogger(__name__)

def fetch_with_retry(session, url, throttle, max_retries=3):
    for attempt in range(max_retries):
        try:
            return throttle.get(session, url, timeout=15)
        except requests.HTTPError as e:
            code = e.response.status_code
            if code == 404:
                return None
            if code == 429:
                wait = 60 * (attempt + 1)
                logger.warning(f"429 on {url}, backing off {wait}s")
                time.sleep(wait)
            elif attempt == max_retries - 1:
                raise
        except requests.Timeout:
            wait = (2 ** attempt) + random.uniform(0, 1)
            logger.warning(f"Timeout on {url}, retry in {wait:.1f}s")
            time.sleep(wait)
    return None
