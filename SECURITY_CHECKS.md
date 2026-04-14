## Security checks and verification

### Automated checks

- **Django deploy checks**
  - From the `backend` directory run:
    - `python manage.py check --deploy`

- **Frontend linting**
  - From the `frontend` directory run:
    - `npm run lint`

### Dependency checks

- **Python**
  - Periodically run `pip list --outdated` and update critical packages.

- **Node**
  - Run `npm audit` and `npm outdated` and address high/critical issues.

### Manual verification after deployment

1. Open the frontend on Cloudflare Pages over HTTPS.
2. Exercise the booking and contact forms:
   - Confirm success and failure messages do not reveal stack traces or internal details.
3. Inspect API responses (browser dev tools → Network):
   - On errors, responses should be generic and not contain secrets or implementation details.
4. Check CORS:
   - Only your expected frontend domains should be allowed to call the backend.
5. Review logs in Cloud Run:
   - Ensure logs do not contain full request bodies, card numbers, IDs, or other sensitive fields.

### Docker production stack

- Build images without baking in `.env` or database files (see `backend/.dockerignore` and `frontend/.dockerignore`).
- Pass `SECRET_KEY`, database credentials, and `ALLOWED_HOSTS` at runtime (see root `docker-compose.yml` and [DEPLOY.md](DEPLOY.md)).
- API errors in production omit detailed payloads on 5xx responses; unhandled `/api/` exceptions return JSON without stack traces when `DEBUG=false`.

### npm audit (dev tooling)

- Remaining `npm audit` findings may come from **eslint** dev-dependencies (not shipped in the browser bundle). Re-run `npm audit` after `npm audit fix`; use `npm audit fix --force` only after reviewing breaking changes.

