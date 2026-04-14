## Deploying the Afri frontend to Cloudflare Pages

1. **Build settings**
   - Framework preset: `None` (or `Vite`)
   - Build command: `npm run build`
   - Build output directory: `dist`

2. **Environment variables**
   - `VITE_API_BASE_URL` — set to the public URL of your Cloud Run backend (or a Cloudflare-proxied custom domain), e.g. `https://afri-backend-xxxx.a.run.app/api`.
   - Avoid putting any secrets in `VITE_` variables; they are public at build time.

3. **Production vs preview**
   - Use different `VITE_API_BASE_URL` values for production vs preview branches.

4. **Security headers (via Cloudflare Pages Rules / Workers)**
   - Add headers such as:
     - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
     - `X-Content-Type-Options: nosniff`
     - `X-Frame-Options: DENY`
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - A CSP tailored to your asset and API domains.

