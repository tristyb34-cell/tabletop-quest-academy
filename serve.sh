#!/bin/bash
# Simple local server for Tabletop Quest Academy
# Serves on all interfaces so you can access from your phone
# Find your Mac's IP with: ifconfig | grep "inet " | grep -v 127.0.0.1
PORT=${1:-8080}
echo ""
echo "  Tabletop Quest Academy"
echo "  ======================"
echo ""
echo "  Desktop:  http://localhost:$PORT"
echo "  Mobile:   http://$(ipconfig getifaddr en0 2>/dev/null || echo '<your-ip>'):$PORT"
echo ""
echo "  Press Ctrl+C to stop"
echo ""
cd "$(dirname "$0")"
python3 -m http.server $PORT --bind 0.0.0.0
