import os
from functools import lru_cache
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")


class Settings:
    """Security-sensitive configuration. Production fails closed on unsafe settings."""

    def __init__(self) -> None:
        self.environment = os.getenv("APP_ENV", "development").lower()
        self.is_production = self.environment == "production"
        self.database_url = os.getenv("DATABASE_URL", f"sqlite:///{ROOT_DIR / 'backend' / 'draveon.db'}")
        self.cors_origins = tuple(
            item.strip().rstrip("/")
            for item in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")
            if item.strip()
        )
        self.trusted_hosts = tuple(sorted({
            parsed.hostname
            for origin in self.cors_origins
            if (parsed := urlparse(origin)).hostname
        }))
        self.trusted_proxy_ips = frozenset(
            item.strip() for item in os.getenv("TRUSTED_PROXY_IPS", "127.0.0.1,::1").split(",") if item.strip()
        )
        self.max_request_bytes = int(os.getenv("MAX_REQUEST_BYTES", "65536"))
        self.session_seconds = int(os.getenv("SESSION_SECONDS", "28800"))
        self.remember_session_seconds = int(os.getenv("REMEMBER_SESSION_SECONDS", "2592000"))
        self.chat_session_seconds = int(os.getenv("CHAT_SESSION_SECONDS", "1800"))
        self.allow_public_signup = os.getenv("ALLOW_PUBLIC_SIGNUP", "true" if not self.is_production else "false").lower() == "true"
        self.auto_create_schema = os.getenv("AUTO_CREATE_SCHEMA", "true" if not self.is_production else "false").lower() == "true"
        self.cookie_secure = self.is_production
        self.validate()

    def validate(self) -> None:
        if not 1024 <= self.max_request_bytes <= 1_048_576:
            raise RuntimeError("MAX_REQUEST_BYTES must be between 1024 and 1048576")
        if not 300 <= self.chat_session_seconds <= 86_400:
            raise RuntimeError("CHAT_SESSION_SECONDS must be between 300 and 86400")
        if not 900 <= self.session_seconds <= 86_400 or not self.session_seconds <= self.remember_session_seconds <= 2_592_000:
            raise RuntimeError("Session lifetime configuration is invalid")
        if not self.trusted_hosts:
            raise RuntimeError("CORS_ALLOWED_ORIGINS must contain at least one absolute origin")
        if self.is_production:
            if self.database_url.startswith("sqlite:"):
                raise RuntimeError("Production requires a managed non-SQLite database")
            if self.auto_create_schema:
                raise RuntimeError("AUTO_CREATE_SCHEMA must be disabled in production; use migrations")
            if not self.cors_origins or any(origin == "*" for origin in self.cors_origins):
                raise RuntimeError("Production requires an explicit CORS origin allowlist")
            if any(urlparse(origin).scheme != "https" or not urlparse(origin).netloc for origin in self.cors_origins):
                raise RuntimeError("Production CORS origins must be absolute HTTPS origins")


@lru_cache
def get_settings() -> Settings:
    return Settings()
