#!/bin/bash
# usage: ./set-version.sh <v1|v1b|v2|v2b|v3a|v3b|m2> [seed file]
# Copies variants/<name> over the app, resets data/reviews.json from a seed (default data/seed-1.json),
# builds the site and starts it with `next start` on port 5195 (in the background). Stop it with: kill $(cat start.pid)
set -e
cd "$(dirname "$0")"
v="$1"
[ -d "variants/$v" ] || { echo "usage: ./set-version.sh <name> [seed]   (one of: $(ls variants | grep -v css | tr '\n' ' '))"; exit 1; }
[ -f start.pid ] && kill "$(cat start.pid)" 2>/dev/null || true
find components -type f -delete 2>/dev/null || true
find lib -name session.ts -delete 2>/dev/null || true
cp -R variants/"$v"/. .
cp "${2:-data/seed-1.json}" data/reviews.json
find .next -delete 2>/dev/null || true
npx next build
[ "$v" = m2 ] && exit 0
npx next start -p 5195 > start.log 2>&1 &
echo $! > start.pid
until curl -s localhost:5195 > /dev/null; do sleep 1; done
echo "ready: http://localhost:5195  (version $v)"
