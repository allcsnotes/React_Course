#!/bin/sh
# Usage (from inside web/):  sh ../use-version.sh NAME
# Swaps the code files in src/ for the snapshot versions/NAME/ (the CSS files stay).
set -e
[ -d "../versions/$1" ] || { echo "no such version: $1"; ls ../versions; exit 1; }
rm -f src/*.ts src/*.tsx src/*.jsx
cp ../versions/"$1"/* src/
echo "src/ now holds version $1"
