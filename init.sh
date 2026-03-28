#!/bin/bash
# init.sh — Bootstrap script for Crypto Fear & Greed Dash
# No build tools needed — this is a static site using CDN dependencies

echo "=== Crypto Fear & Greed Dash — Init ==="

# Check if Python is available for local dev server
if command -v python3 &> /dev/null; then
    echo "Starting local dev server at http://localhost:8000"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Starting local dev server at http://localhost:8000"
    python -m http.server 8000
elif command -v npx &> /dev/null; then
    echo "Starting local dev server at http://localhost:8000"
    npx serve -l 8000
else
    echo "No server found. Please open index.html directly in your browser."
    echo "Or install Python or Node.js for a local dev server."
fi
