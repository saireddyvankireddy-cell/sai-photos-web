#!/bin/sh
# LaunchAgent wrapper: keeps pCloud AI indexing running on the Mac.
# Sign in once at the site URL. The web app automatically claims its session.
SITE="${SAI_SITE_URL:-http://localhost:4173}"
NODE="${SAI_NODE_BIN:-/Users/saireddy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node}"
REPO="/Users/saireddy/Downloads/Documents/Sai Photos"
SESS="$HOME/.sai-index-session"
while [ ! -s "$SESS" ]; do
  echo "[sai-index] Waiting for the one-time Mac browser sign-in."
  echo "[sai-index] Open $SITE in the Mac browser, sign in to pCloud; automatic indexing starts after the shared restore."
  sleep 60
done
export SAI_SITE_URL="$SITE"
export SAI_SESSION_COOKIE_FILE="$SESS"
exec "$NODE" "$REPO/scripts/mac-index.mjs"
