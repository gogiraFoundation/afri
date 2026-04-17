#!/usr/bin/env bash
set -euo pipefail

# Deploy Django backend to Cloud Run.
# Requirements:
#   - gcloud CLI installed and authenticated
#   - PROJECT_ID, REGION, SERVICE_NAME, ARTIFACT_REPO env vars set
#   - SECRET_KEY stored in Secret Manager via SECRET_KEY_SECRET

PROJECT_ID="${PROJECT_ID:?PROJECT_ID is required}"
REGION="${REGION:-us-central1}"
SERVICE_NAME="${SERVICE_NAME:-afri-backend}"
ARTIFACT_REPO="${ARTIFACT_REPO:-afri-backend-repo}"
ALLOWED_HOSTS="${ALLOWED_HOSTS:-}"
CSRF_TRUSTED_ORIGINS="${CSRF_TRUSTED_ORIGINS:-}"
CORS_ALLOWED_ORIGINS="${CORS_ALLOWED_ORIGINS:-}"
SECRET_KEY_SECRET="${SECRET_KEY_SECRET:-}"

if [[ -z "${ALLOWED_HOSTS}" ]]; then
  echo "Error: ALLOWED_HOSTS is required for production deploy."
  exit 1
fi

if [[ "${ALLOWED_HOSTS}" == *"*"* ]]; then
  echo "Error: wildcard ALLOWED_HOSTS is not allowed."
  exit 1
fi

if [[ -z "${SECRET_KEY_SECRET}" ]]; then
  echo "Error: SECRET_KEY_SECRET is required (Secret Manager secret name)."
  exit 1
fi

IMAGE="us-central1-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REPO}/${SERVICE_NAME}:$(date +%Y%m%d-%H%M%S)"

echo "Building image ${IMAGE}..."
gcloud auth configure-docker us-central1-docker.pkg.dev -q

gcloud builds submit \
  --project "${PROJECT_ID}" \
  --tag "${IMAGE}" \
  .

echo "Deploying to Cloud Run service ${SERVICE_NAME} in ${REGION}..."
gcloud run deploy "${SERVICE_NAME}" \
  --project "${PROJECT_ID}" \
  --image "${IMAGE}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --port 8000 \
  --max-instances 5 \
  --memory 512Mi \
  --set-env-vars "ENVIRONMENT=production" \
  --set-env-vars "DJANGO_SETTINGS_MODULE=afri_cleans.settings" \
  --set-env-vars "ALLOWED_HOSTS=${ALLOWED_HOSTS}" \
  --set-env-vars "CSRF_TRUSTED_ORIGINS=${CSRF_TRUSTED_ORIGINS}" \
  --set-env-vars "CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS}" \
  --set-secrets "SECRET_KEY=${SECRET_KEY_SECRET}:latest"

echo "Deployment complete."

