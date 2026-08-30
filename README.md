# DRAVEON Platform

DRAVEON is a Next.js website with a FastAPI API for project enquiries, private visitor chat sessions, and optional user accounts.

## Local development

1. Copy `.env.example` to `.env`. Configure only newly issued provider keys locally; never commit `.env`.
2. Create and activate a Python virtual environment in `backend/` (`python3 -m venv venv && source venv/bin/activate`), then install `pip install -r requirements.txt`.
3. Run `PYTHONPATH=. uvicorn app.main:app --reload --port 8000` from `backend/` (with `venv` activated) or `./venv/bin/uvicorn app.main:app --reload --port 8000`.
4. Run `npm install` and `npm run dev` from `frontend/`. Browser API requests use same-origin `/api`, proxied locally to FastAPI.

## Production requirements

- Revoke and rotate every credential that was previously committed. Store replacement credentials in the deployment provider's secret manager.
- Set `APP_ENV=production`, `DATABASE_URL` to managed PostgreSQL, `CORS_ALLOWED_ORIGINS` to the exact HTTPS domain, and `AUTO_CREATE_SCHEMA=false`.
- Run managed database migrations before deployment. The application's automatic schema creation is intentionally blocked in production.
- Bind Uvicorn only to loopback/private networking and use the supplied Nginx configuration, or an equivalent TLS-terminating load balancer. Do not expose port 8000 publicly.
- Keep public signup disabled by default (`ALLOW_PUBLIC_SIGNUP=false`) until email verification and a transactional email service are configured. Do not add fake OAuth or demo credentials.
- Enforce shared rate limiting, WAF/DDoS protection, monitoring/alerting, encrypted backups, least-privilege database credentials, and a PII retention/deletion policy in infrastructure.
- Protect the repository with required CI, code review, secret scanning, dependency scanning, and branch protection.

## Security model

- Passwords use Argon2id and are never stored or handled in browser storage.
- Authentication uses random, opaque, HttpOnly, Secure-in-production, SameSite=Strict cookies. Server stores only token hashes; sessions expire and are revoked on logout/password change.
- State-changing authenticated actions require a server-validated CSRF token and same-origin check.
- Public enquiry and chat endpoints have strict request schemas, body limits, service allowlists, output-safe React rendering, and endpoint-specific abuse limits.
- Chat session identifiers are HttpOnly and never returned in responses. Chat content expires automatically.

Run `backend/tests/security_check.py` and the frontend production build before each release. CI runs both on pull requests, main-branch pushes, and weekly.
