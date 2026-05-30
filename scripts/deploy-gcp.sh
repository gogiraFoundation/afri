#!/usr/bin/env bash
# Deploy Afri Django backend to Google Cloud Run.
# Prerequisites: gcloud CLI installed and authenticated (gcloud auth login, gcloud config set project PROJECT_ID)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$REPO_ROOT/backend"

# Config (override with env or pass as needed)
GCP_PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${REGION:-us-central1}"
SERVICE_NAME="${SERVICE_NAME:-afri-api}"
IMAGE_NAME="${IMAGE_NAME:-afri-api}"

# Env vars for Cloud Run
# - ALLOWED_HOSTS must be explicitly provided (comma-separated)
# - SECRET_KEY must be injected via Secret Manager using SECRET_KEY_SECRET
SECRET_KEY_SECRET="${SECRET_KEY_SECRET:-}"
ALLOWED_HOSTS="${ALLOWED_HOSTS:-}"
CSRF_TRUSTED_ORIGINS="${CSRF_TRUSTED_ORIGINS:-}"
CORS_ALLOWED_ORIGINS="${CORS_ALLOWED_ORIGINS:-}"

usage() {
  echo "Usage: $0 [OPTIONS]"
  echo "Deploy Afri backend to Cloud Run."
  echo ""
  echo "Options:"
  echo "  -p, --project ID    GCP project ID (or set GCP_PROJECT_ID)"
  echo "  -r, --region REGION Region (default: us-central1)"
  echo "  -s, --service NAME  Cloud Run service name (default: afri-api)"
  echo "  -h, --help          Show this help"
  echo ""
  echo "Environment:"
  echo "  GCP_PROJECT_ID, REGION, SERVICE_NAME, IMAGE_NAME"
  echo "  ALLOWED_HOSTS (required)"
  echo "  CSRF_TRUSTED_ORIGINS, CORS_ALLOWED_ORIGINS (recommended for production)"
  echo "  SECRET_KEY_SECRET (required; Secret Manager secret name)"
  exit 0
}

while [[ $# -gt 0 ]]; do
  case $1 in
    -p|--project) GCP_PROJECT_ID="$2"; shift 2 ;;
    -r|--region)  REGION="$2"; shift 2 ;;
    -s|--service) SERVICE_NAME="$2"; shift 2 ;;
    -h|--help)    usage ;;
    *)            echo "Unknown option: $1"; exit 1 ;;
  esac
done

if [[ -z "$GCP_PROJECT_ID" ]]; then
  echo "Error: GCP project not set. Use: gcloud config set project PROJECT_ID or set GCP_PROJECT_ID."
  exit 1
fi

if [[ -z "$ALLOWED_HOSTS" ]]; then
  echo "Error: ALLOWED_HOSTS is required and must not contain wildcard values."
  echo "Example: ALLOWED_HOSTS=api.example.com,afri-api-xyz.a.run.app"
  exit 1
fi

if [[ "$ALLOWED_HOSTS" == *"*"* ]]; then
  echo "Error: wildcard ALLOWED_HOSTS is not allowed."
  exit 1
fi

if ! command -v gcloud &>/dev/null; then
  echo "Error: gcloud CLI not found. Install from https://cloud.google.com/sdk/docs/install."
  exit 1
fi

echo "Running pre-deploy security audit..."
if ! bash "$SCRIPT_DIR/security_checklist" --quick --skip-gitleaks; then
  echo "Error: security audit failed. Fix issues or run: ./scripts/security_checklist --verbose"
  exit 1
fi
echo ""

IMAGE_URL="gcr.io/${GCP_PROJECT_ID}/${IMAGE_NAME}"

echo "Project:  $GCP_PROJECT_ID"
echo "Region:   $REGION"
echo "Service:  $SERVICE_NAME"
echo "Image:    $IMAGE_URL"
echo ""

# Build with Cloud Build (context = backend directory)
echo "Building container image..."
gcloud builds submit --tag "$IMAGE_URL" "$BACKEND_DIR"

# Build env vars for deploy
ENV_VARS="DEBUG=0,ENVIRONMENT=production,ALLOWED_HOSTS=${ALLOWED_HOSTS},DJANGO_SETTINGS_MODULE=afri_cleans.settings"
if [[ -n "$CSRF_TRUSTED_ORIGINS" ]]; then
  ENV_VARS="${ENV_VARS},CSRF_TRUSTED_ORIGINS=${CSRF_TRUSTED_ORIGINS}"
fi
if [[ -n "$CORS_ALLOWED_ORIGINS" ]]; then
  ENV_VARS="${ENV_VARS},CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS}"
fi

SECRET_ARGS=()
if [[ -n "$SECRET_KEY_SECRET" ]]; then
  SECRET_ARGS+=(--set-secrets "SECRET_KEY=${SECRET_KEY_SECRET}:latest")
else
  echo "Error: provide SECRET_KEY_SECRET (Secret Manager secret name)."
  exit 1
fi

echo "Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE_URL" \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  "${SECRET_ARGS[@]}" \
  --set-env-vars "$ENV_VARS"

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format 'value(status.url)' 2>/dev/null || true)
echo ""
echo "Deployment complete."
if [[ -n "$SERVICE_URL" ]]; then
  echo "Service URL: $SERVICE_URL"
  echo "API base:    $SERVICE_URL/api/"
fi
