#!/usr/bin/env bash
set -euo pipefail

# Helper script to build the frontend for Cloudflare Pages.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Running frontend security audit..."
if ! bash "$ROOT/scripts/security_checklist_frontend" --quick; then
  echo "Error: frontend security audit failed. Run: ./scripts/security_checklist_frontend --verbose"
  exit 1
fi
echo ""

echo "Installing dependencies..."
npm install

echo "Building for production..."
npm run build

echo "Build complete. Upload the 'dist' directory to Cloudflare Pages."

