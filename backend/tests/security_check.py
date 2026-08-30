"""Framework-free regression checks for the security-critical backend paths."""
import os
import tempfile
import uuid
from http.cookies import SimpleCookie
from pathlib import Path

os.environ.update({
    "APP_ENV": "development",
    "DATABASE_URL": f"sqlite:///{Path(tempfile.gettempdir()) / f'draveon-security-check-{uuid.uuid4()}.db'}",
    "AUTO_CREATE_SCHEMA": "true",
    "CORS_ALLOWED_ORIGINS": "http://localhost:3000",
    "API_KEY_1": "",
    "API_KEY_2": "",
    "API_KEY_3": "",
    "API_KEY_4": "",
    "API_KEY_5": "",
    "API_KEY_6": "",
})

from fastapi import HTTPException, Request, Response  # noqa: E402
from sqlalchemy import text  # noqa: E402
from app.database import SessionLocal, engine  # noqa: E402
from app.main import (  # noqa: E402
    LoginRequest,
    ProfileUpdate,
    SignupRequest,
    current_auth_session,
    login,
    logout,
    signup,
    update_me,
)


def request(cookies: str = "", csrf: str | None = None) -> Request:
    headers = [(b"cookie", cookies.encode())] if cookies else []
    if csrf:
        headers.append((b"x-csrf-token", csrf.encode()))
    return Request({"type": "http", "method": "POST", "path": "/api/v1/auth/me", "headers": headers, "client": ("127.0.0.1", 48000), "scheme": "http", "server": ("testserver", 80)})


def run() -> None:
    email, password = "security-check@example.net", "StrongPassword2026"
    with SessionLocal() as db:
        response = Response()
        signup(SignupRequest(name="Security Check", email=email, password=password), request(), response, db)
        with engine.connect() as connection:
            password_hash = connection.execute(text("SELECT password_hash FROM users WHERE email=:email"), {"email": email}).scalar_one()
        assert password_hash.startswith("$argon2") and password not in password_hash

        cookies = SimpleCookie()
        for value in response.headers.getlist("set-cookie"):
            cookies.load(value)
        auth, csrf = cookies["draveon_session"].value, cookies["draveon_csrf"].value
        cookie_header = f"draveon_session={auth}; draveon_csrf={csrf}"
        try:
            update_me(ProfileUpdate(company="DRAVEON"), request(cookie_header), db)
            raise AssertionError("A state change without CSRF protection was accepted")
        except HTTPException as exc:
            assert exc.status_code == 403
        assert update_me(ProfileUpdate(company="DRAVEON"), request(cookie_header, csrf), db)["user"]["company"] == "DRAVEON"
        assert current_auth_session(request(cookie_header), db).user.email == email
        logout(request(cookie_header, csrf), Response(), db)
        try:
            current_auth_session(request(cookie_header), db)
            raise AssertionError("A logged-out session was accepted")
        except HTTPException as exc:
            assert exc.status_code == 401
        assert login(LoginRequest(email=email, password=password), request(), Response(), db)["user"]["email"] == email


if __name__ == "__main__":
    run()
    print("security regression checks passed")
