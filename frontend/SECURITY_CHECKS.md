## Frontend security checks

Automated audit for the Vite/React SPA before Cloudflare Pages or Docker/nginx deploy.

```bash
./scripts/security_checklist_frontend
# or
./scripts/afri security-frontend
```

| Flag | Effect |
|------|--------|
| `--quick` | Skip `npm run build` |
| `--verbose` | Show locations for source-scan findings |

Full-stack audit (backend + frontend): `./scripts/security_checklist`.

### Automated checks

| Area | What runs |
|------|-----------|
| Git | `frontend/.env` not tracked |
| Config | `.env.example`, `public/_redirects`, `nginx.conf` security headers |
| Source | No `eval` / `document.write`; no secret-like `VITE_*` names; no raw-HTML Markdown; `dangerouslySetInnerHTML` only allowed for QR SVG |
| Dependencies | `npm ci`, `npm audit --audit-level=high` |
| Quality | `npm run lint`, `npm run build` (unless `--quick`) |
| Bundle | No secrets in `dist/`; production API URL not localhost when `.env.production` is used |

### Environment variables (client-safe only)

These are **embedded in the browser bundle** at build time:

| Variable | Purpose |
|----------|---------|
| `VITE_PUBLIC_SITE_ORIGIN` | Canonical site URL (QR, redirects) |
| `VITE_API_BASE_URL` | Backend API base (omit for static-only marketing build) |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA **site** key (never the secret) |
| `VITE_DEFAULT_VAT_RATE` | Fallback VAT display |
| `VITE_APPLY_VAT_BY_DEFAULT` | Fallback VAT flag |

**Never** put Django `SECRET_KEY`, `CONTACT_FORM_CAPTCHA_SECRET`, or API keys in `VITE_*`.

### Manual checks after deploy

1. Site loads only over **HTTPS**; security headers present (Cloudflare Pages Rules or nginx).
2. **CSP** allows your API origin and `https://www.google.com/recaptcha/` if booking is live.
3. Booking/contact forms do not leak stack traces in the UI.
4. `/book`, `/pricing`, `/brochure`, `/one-pager` deep links work (SPA fallback).
5. Third-party fonts/scripts match your privacy policy.

See also [deploy_frontend_cloudflare.md](deploy_frontend_cloudflare.md) and root [SECURITY_CHECKS.md](../SECURITY_CHECKS.md).
