#!/usr/bin/env bash
set -euo pipefail

# Deploy Django backend to Cloud Run.
# Requirements:
#   - gcloud CLI installed and authenticated
#   - PROJECT_ID, REGION, SERVICE_NAME, ARTIFACT_REPO env vars set
#   - SECRET_KEY and other sensitive vars stored in Secret Manager or env

PROJECT_ID="${PROJECT_ID:?PROJECT_ID is required}"
REGION="${REGION:-us-central1}"
SERVICE_NAME="${SERVICE_NAME:-afri-backend}"
ARTIFACT_REPO="${ARTIFACT_REPO:-afri-backend-repo}"

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
  --set-env-vars "DJANGO_SETTINGS_MODULE=afri_cleans.settings"

echo "Deployment complete."

