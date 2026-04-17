# Deploying to Google Cloud Run (Django backend)

This guide covers deploying the **Afri Cleans Django backend** to Google Cloud Run, either manually via a script or automatically via Cloud Build (CI/CD).

## Prerequisites

- **Google Cloud SDK** (`gcloud`) installed and authenticated:
  - Install: [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
  - Log in: `gcloud auth login`
  - Set project: `gcloud config set project YOUR_PROJECT_ID`
- **Billing** enabled on the GCP project
- **APIs** enabled (Cloud Build, Cloud Run, Container Registry):
  ```bash
  gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com
  ```

## One-time setup

1. **Create or select a GCP project**
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Enable required APIs** (see above).

3. **Set production environment variables on Cloud Run**  
   Do not put secrets in code or in `cloudbuild.yaml`. Configure them once on the Cloud Run service or pass them when deploying:
   - **SECRET_KEY** (required in production): a long random string for Django.
  - **ALLOWED_HOSTS**: required hostnames only, e.g. `afri-api-xxxxx.run.app,api.example.com` (no wildcard, no `https://`).
   - **CSRF_TRUSTED_ORIGINS** (if your frontend talks to the API): e.g. `https://your-frontend-domain.com`.
   - Optional: `DEBUG=0`, `DEFAULT_VAT_RATE`, `APPLY_VAT_BY_DEFAULT`, etc.

   You can set these when running the deploy script (see below) or in the Cloud Run console: **Cloud Run → your service → Edit & deploy → Variables & secrets**.

4. **(Optional) Artifact Registry**  
   The current setup uses **Container Registry** (`gcr.io`). To use Artifact Registry instead, create a repo and update the image URLs in `scripts/deploy-gcp.sh` and `cloudbuild.yaml`.

---

## Manual deploy

From the repository root:

```bash
# Set Secret Manager secret name for production (required)
export SECRET_KEY_SECRET="afri-django-secret-key"

# Required: allowed hosts (hostnames only; no scheme)
export ALLOWED_HOSTS="afri-api-xxxxx.run.app"

# Deploy (uses gcloud default project and script defaults)
./scripts/deploy-gcp.sh
```

**Script options and env vars:**

| Option / Env           | Default          | Description                    |
|------------------------|------------------|--------------------------------|
| `-p` / `GCP_PROJECT_ID` | `gcloud` project | GCP project ID                  |
| `-r` / `REGION`         | `us-central1`    | Cloud Run region               |
| `-s` / `SERVICE_NAME`   | `afri-api`       | Cloud Run service name         |
| `IMAGE_NAME`            | `afri-api`       | Container image name           |
| `SECRET_KEY_SECRET`     | (none)           | Secret Manager secret name for Django `SECRET_KEY` |
| `ALLOWED_HOSTS`         | (required)       | Comma-separated hostnames only (no wildcard, no scheme) |

Example with options:

```bash
export SECRET_KEY_SECRET="afri-django-secret-key"
./scripts/deploy-gcp.sh --project my-gcp-project --region europe-west1 --service afri-api
```

The script will:

1. Build the container image with Cloud Build (context: `backend/`).
2. Push the image to Container Registry.
3. Deploy the image to Cloud Run and print the service URL.

---

## CI/CD with Cloud Build

To deploy automatically on every push to `main`:

1. **Connect your repository** to Cloud Build (GitHub, Cloud Source Repositories, etc.) in the GCP Console: **Cloud Build → Triggers**.

2. **Create a trigger**:
   - Event: **Push to a branch**
   - Branch: `^main$`
   - Configuration: **Cloud Build configuration file**
   - Location: **Repository**; path: `cloudbuild.yaml`

3. **Substitution variables** (optional; defaults are in `cloudbuild.yaml`):
   - `_PROJECT_ID`: filled automatically with the build project.
   - `_REGION`: e.g. `us-central1`.
   - `_SERVICE_NAME`: e.g. `afri-api`.
   - `_IMAGE_NAME`: e.g. `afri-api`.

4. **Secrets**  
   Do not put `SECRET_KEY` in `cloudbuild.yaml`. Either:
   - Set **SECRET_KEY** (and other env vars) on the Cloud Run service in the console or in a one-time `gcloud run deploy` with `--set-env-vars`, or  
   - Use **Secret Manager** and reference the secret in the deploy step (e.g. `--set-secrets=SECRET_KEY=my-secret:latest`).

5. **Run manually from CLI** (without a trigger):
   ```bash
   gcloud builds submit --config=cloudbuild.yaml .
   ```
   Ensure env vars (and secrets) for the Cloud Run service are already set from a previous deploy or in the console.

After the trigger is set up, each push to `main` will build the backend image and deploy it to Cloud Run.

---

## Post-deploy

- **Service URL**: Shown at the end of `./scripts/deploy-gcp.sh` or in **Cloud Run → your service**. The API base is `https://YOUR_SERVICE_URL/api/`.
- **Database**: The default deployment uses SQLite on the container filesystem (data is not persisted across revisions). For production, consider migrating to **Cloud SQL** and setting `DATABASE_URL` (or equivalent) in the Cloud Run service.
- **Static files**: `collectstatic` runs at build time. For high traffic, consider serving static files from Cloud Storage or a CDN.

---

## Docker Compose (full stack)

From the repository root, a production-style stack is defined in [`docker-compose.yml`](docker-compose.yml):

- **db**: PostgreSQL 16 (persistent volume `postgres_data`).
- **backend**: Django + Gunicorn on port `8080` (migrations run on container start).
- **frontend**: Nginx serving the Vite build and proxying `/api/` to the backend (same-origin API calls use `VITE_API_BASE_URL=/api` at build time).

**Run locally:**

```bash
export POSTGRES_PASSWORD="a-strong-password"
export SECRET_KEY="a-long-random-django-secret-key"
docker compose up --build
```

Then open `http://localhost` (frontend on port 80) or `http://localhost:8080` for the API only.

**Security notes:**

- Override `POSTGRES_PASSWORD` and `SECRET_KEY` for any real deployment; never commit real secrets.
- Set `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` to your public site URLs when the browser origin is not `http://localhost`.
- Set `TRUST_X_FORWARDED_PROTO=true` when TLS terminates at a reverse proxy (included in `docker-compose.yml`).
- For HTTPS-only cookies and HSTS, keep `ENVIRONMENT=production` and `DEBUG=False` (as in compose) and tune `SECURE_SSL_REDIRECT` / `SECURE_HSTS_*` via environment if needed.
