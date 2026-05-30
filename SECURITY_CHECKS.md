## Security checks and verification

Run the **automated pre-deploy audit** from the repository root:

```bash
./scripts/security_checklist
# or
./scripts/afri security
```

Options:

| Flag | Effect |
|------|--------|
| `--quick` | Skip `npm run build` (faster) |
| `--skip-frontend` | Backend checks only |
| `--skip-backend` | Frontend checks only |
| `--skip-gitleaks` | Skip local gitleaks (CI still runs it) |
| `--verbose` | Show failing command output |

`./scripts/deploy-gcp.sh` runs `./scripts/security_checklist --quick --skip-gitleaks` before building.

Exit code **0** = all automated checks passed; **1** = at least one failure (do not deploy until fixed).

**Frontend-only audit:** `./scripts/security_checklist_frontend` or `./scripts/afri security-frontend` — see [frontend/SECURITY_CHECKS.md](frontend/SECURITY_CHECKS.md).

### What the script runs

| Area | Check |
|------|--------|
| Repo | No tracked `.env`; rg secret heuristics; `SECURITY.md` not template; `.dockerignore` |
| Frontend proxy | `nginx.conf` security headers |
| Secrets | gitleaks (if installed) |
| Backend | `manage.py check --deploy`; captcha production boot guard; Bandit; pip-audit |
| Frontend | Delegates to `scripts/security_checklist_frontend` (see [frontend/SECURITY_CHECKS.md](frontend/SECURITY_CHECKS.md)) |

CI mirrors most of this in [`.github/workflows/security-checks.yml`](.github/workflows/security-checks.yml).

### Manual verification after deployment

The script prints a reminder list; also verify:

1. Open the frontend over HTTPS; exercise booking/contact if enabled.
2. API errors must not expose stack traces or internal details.
3. CORS: only your frontend origin can call the API with credentials.
4. Cloud Run logs must not contain full request bodies or PII fields.
5. `/admin/` is restricted; captcha and rate limits active at the edge.

### Dependency maintenance

- **Python:** `pip list --outdated`; keep `requirements.txt` pinned or locked.
- **Node:** `npm audit` / `npm outdated`; dev-only eslint findings may remain after `npm audit fix`.

### Docker production stack

- Build images without baking in `.env` or database files (see `backend/.dockerignore`).
- Pass `SECRET_KEY`, database credentials, and `ALLOWED_HOSTS` at runtime ([DEPLOY.md](DEPLOY.md)).
- API 5xx responses omit detailed payloads when `DEBUG=false`.
