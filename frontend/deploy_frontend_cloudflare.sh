#!/usr/bin/env bash
set -euo pipefail

# Helper script to build the frontend for Cloudflare Pages.

echo "Installing dependencies..."
npm install

echo "Building for production..."
npm run build

echo "Build complete. Upload the 'dist' directory to Cloudflare Pages."

