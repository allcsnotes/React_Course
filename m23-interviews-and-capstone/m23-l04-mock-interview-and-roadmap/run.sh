#!/bin/sh
# builds the four small files with esbuild into run/ (the runners import ./counters.mjs and ./clock.mjs next to them)
cd "$(dirname "$0")"
mkdir -p run
for n in counters clock run1 run2; do
  npx esbuild src/$n.jsx --format=esm --jsx=automatic --outfile=run/$n.mjs --log-level=error
done
