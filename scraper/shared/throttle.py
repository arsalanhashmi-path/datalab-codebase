import time
import random
import logging

logger = logging.getLogger(__name__)

class Throttle:
    def __init__(
        self,
        min_delay: float = 2.0,
        max_delay: float = 6.0,
        burst_every: int = 10,
        burst_delay: float = 15.0,
    ):
        self.min_delay = min_delay
        self.max_delay = max_delay
        self.burst_every = burst_every
        self.burst_delay = burst_delay
        self.request_count = 0
        self._last_request = 0.0

    def wait(self):
        self.request_count += 1
        if self.request_count % self.burst_every == 0:
            pause = self.burst_delay + random.uniform(0, 3.0)
            logger.debug(f"Burst pause {pause:.1f}s after {self.request_count} requests")
            time.sleep(pause)
            return
        delay = random.uniform(self.min_delay, self.max_delay)
        elapsed = time.time() - self._last_request
        remaining = delay - elapsed
        if remaining > 0:
            time.sleep(remaining)
        self._last_request = time.time()

    def get(self, session, url, **kwargs):
        self.wait()
        response = session.get(url, **kwargs)
        response.raise_for_status()
        return response
