import time
import random
import logging
import requests

logger = logging.getLogger(__name__)

# (connect_timeout, read_timeout) in seconds
REQUEST_TIMEOUT = (10, 20)

def fetch_with_retry(session, url, throttle, max_retries=3):
    for attempt in range(max_retries):
        try:
            return throttle.get(session, url, timeout=REQUEST_TIMEOUT)
        except requests.HTTPError as e:
            code = e.response.status_code
            if code in (403, 404):
                return None
            if code == 429:
                wait = 60 * (attempt + 1)
                logger.warning(f"429 on {url}, backing off {wait}s")
                time.sleep(wait)
            elif attempt == max_retries - 1:
                raise
        except (requests.Timeout, requests.ConnectionError) as e:
            wait = (2 ** attempt) + random.uniform(0, 1)
            logger.warning(f"{type(e).__name__} on {url} (attempt {attempt + 1}/{max_retries}), retry in {wait:.1f}s")
            time.sleep(wait)
    return None
