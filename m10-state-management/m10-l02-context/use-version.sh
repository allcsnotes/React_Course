#!/bin/sh
# Usage (from inside web/):  sh ../use-version.sh NAME
# Replaces everything in src/ with the snapshot versions/NAME/.
set -e
[ -d "../versions/$1" ] || { echo "no such version: $1"; ls ../versions; exit 1; }
find src -type f -delete
cp ../versions/"$1"/* src/
echo "src/ now holds version $1"
