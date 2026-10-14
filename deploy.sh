#!/usr/bin/env bash
# Publish v0 (the 2015 app in web/) to the Cloudflare Pages project interactivenn-v0
# (https://v0.interactivenn.fyi). Uses the cf CLI login on this machine; nothing secret is stored here.
set -euo pipefail
cd "$(dirname "$0")"
[ -z "$(git status --porcelain)" ] || { echo "Commit your changes first."; exit 1; }
out=$(mktemp -d)
cp -r web/. "$out/"
rm -f "$out/app.yaml"; find "$out" -name '*~' -delete
find "$out" -size +25M -print -delete   # Pages refuses files over 25 MiB
# whoami first: it refreshes the OAuth token, which the next line then reads.
export CLOUDFLARE_ACCOUNT_ID=$(cf auth whoami | python3 -c "import json,sys;print(json.load(sys.stdin)['accounts'][0]['id'])")
export CLOUDFLARE_API_TOKEN=$(python3 -c "import json,os;print(json.load(open(os.path.expanduser('~/.config/cloudflare/config/default.json')))['oauth_token'])")
cd "$out" && npx -y wrangler@4.149.0 pages deploy . --project-name interactivenn-v0 --branch main \
  --commit-hash "$(git -C "$OLDPWD" rev-parse --short HEAD)" --commit-message "$(git -C "$OLDPWD" log -1 --format=%s)"
rm -rf "$out"
