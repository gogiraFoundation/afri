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

# Env vars for Cloud Run (set SECRET_KEY and optionally ALLOWED_HOSTS before running, or use --set-env-vars)
SECRET_KEY="${SECRET_KEY:-}"
ALLOWED_HOSTS="${ALLOWED_HOSTS:-*}"

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
  echo "Environment: GCP_PROJECT_ID, REGION, SERVICE_NAME, IMAGE_NAME, SECRET_KEY, ALLOWED_HOSTS"
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

if ! command -v gcloud &>/dev/null; then
  echo "Error: gcloud CLI not found. Install from https://cloud.google.com/sdk/docs/install."
  exit 1
fi

IMAGE_URL="gcr.io/${GCP_PROJECT_ID}/${IMAGE_NAME}"

echo "Project:  $GCP_PROJECT_ID"
echo "Region:   $REGION"
echo "Service:  $SERVICE_NAME"
echo "Image:    $IMAGE_URL"
echo ""

# Build with Cloud Build (context = backend directory)
echo "Building container image..."
gcloud builds submit --tag "$IMAGE_URL" "$BACKEND_DIR"

# Build env vars for deploy (SECRET_KEY required in production)
ENV_VARS="DEBUG=0,ALLOWED_HOSTS=${ALLOWED_HOSTS}"
if [[ -n "$SECRET_KEY" ]]; then
  ENV_VARS="${ENV_VARS},SECRET_KEY=${SECRET_KEY}"
else
  echo "Warning: SECRET_KEY not set. Set it for production (e.g. export SECRET_KEY=your-secret)."
fi

echo "Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE_URL" \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "$ENV_VARS"

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format 'value(status.url)' 2>/dev/null || true)
echo ""
echo "Deployment complete."
if [[ -n "$SERVICE_URL" ]]; then
  echo "Service URL: $SERVICE_URL"
  echo "API base:    $SERVICE_URL/api/"
fi
