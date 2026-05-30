## Deploying the Afri frontend to Cloudflare Pages

Static marketing site — no backend API required.

0. **Pre-deploy audit**

   ```bash
   ./scripts/security_checklist_frontend
   ```

   `deploy_frontend_cloudflare.sh` runs a quick audit before build. Details: [SECURITY_CHECKS.md](SECURITY_CHECKS.md).

1. **Build settings**
   - Root directory: `frontend`
   - Framework preset: `None` (or `Vite`)
   - Build command: `npm run build`
   - Build output directory: `dist`

2. **Environment variables**
   - `VITE_PUBLIC_SITE_ORIGIN` — your live site URL (e.g. `https://africleans.com`). Used for absolute links in print assets and legacy `/book` redirects.
   - Avoid putting secrets in `VITE_` variables; they are embedded in the client bundle at build time.
   - `VITE_API_BASE_URL` is **not needed** for the static marketing build (booking wizard is disabled).

3. **SPA routing**
   - [`public/_redirects`](public/_redirects) rewrites all paths to `index.html` so routes like `/brochure`, `/one-pager`, `/pricing`, and `/book` work on Cloudflare Pages.

4. **Deploy options**
   - **Git connect (recommended):** Cloudflare Dashboard → Workers & Pages → Create → Connect Git → select repo and settings above.
   - **Manual:** `./scripts/afri deploy cloudflare` (builds locally; upload `dist/` or connect repo).

5. **Security headers (optional — Cloudflare Pages Rules / Workers)**
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - A CSP tailored to your asset domains (no API domain needed for static mode).

6. **After deploy — smoke test**
   - Home page loads; contact section shows phone, WhatsApp, and email CTAs.
   - `/brochure` and `/one-pager` render; one-pager QR opens WhatsApp.
   - `/book` redirects to `/#contact`.
   - Deep links (e.g. `/pricing`) do not 404.
