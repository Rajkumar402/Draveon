import hashlib
import hmac
import secrets
import time
from collections import OrderedDict, deque
from threading import Lock
from typing import Deque, Tuple

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerifyMismatchError


# Argon2id with explicit production-appropriate costs; each hash has a unique salt.
password_hasher = PasswordHasher(time_cost=3, memory_cost=65536, parallelism=2)


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> Tuple[bool, bool]:
    try:
        valid = password_hasher.verify(password_hash, password)
        return valid, valid and password_hasher.check_needs_rehash(password_hash)
    except (VerifyMismatchError, InvalidHashError):
        return False, False


def random_token() -> str:
    return secrets.token_urlsafe(32)


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def constant_time_equal(left: str, right: str) -> bool:
    return hmac.compare_digest(left.encode("utf-8"), right.encode("utf-8"))


class SlidingWindowRateLimiter:
    """A bounded single-process guard. Production additionally needs a shared gateway limiter."""

    def __init__(self, max_keys: int = 20_000) -> None:
        self.max_keys = max_keys
        self._events: "OrderedDict[str, Deque[float]]" = OrderedDict()
        self._lock = Lock()

    def allow(self, key: str, limit: int, window_seconds: int) -> Tuple[bool, int]:
        now = time.monotonic()
        with self._lock:
            events = self._events.get(key, deque())
            while events and now - events[0] >= window_seconds:
                events.popleft()
            if len(events) >= limit:
                return False, max(1, int(window_seconds - (now - events[0])) + 1)
            events.append(now)
            self._events[key] = events
            self._events.move_to_end(key)
            while len(self._events) > self.max_keys:
                self._events.popitem(last=False)
            return True, 0
