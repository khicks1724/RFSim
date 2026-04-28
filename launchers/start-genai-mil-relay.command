#!/bin/bash
set -u

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BASE_DIR="$SCRIPT_DIR"
if [ ! -f "$BASE_DIR/genai-proxy.js" ] && [ -f "$SCRIPT_DIR/../genai-proxy.js" ]; then
  BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
fi
cd "$BASE_DIR" || exit 1

echo "RF Planner GenAI.mil Relay"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js was not found on this Mac."
  echo "Install Node.js, then run this launcher again."
  echo
  read -r -p "Press Enter to close..."
  exit 1
fi

if [ ! -f "$BASE_DIR/genai-proxy.js" ]; then
  echo "Could not find genai-proxy.js in:"
  echo "  $BASE_DIR"
  echo
  echo "Place this launcher in the same folder as genai-proxy.js, then try again."
  echo
  read -r -p "Press Enter to close..."
  exit 1
fi

echo "Starting the secure relay for the GenAI.mil provider..."
echo "Leave this window open while using www.rfsim.us."
echo

node "$BASE_DIR/genai-proxy.js" --local-model

EXIT_CODE=$?
echo
echo "Relay stopped with exit code $EXIT_CODE."
read -r -p "Press Enter to close..."
exit "$EXIT_CODE"
