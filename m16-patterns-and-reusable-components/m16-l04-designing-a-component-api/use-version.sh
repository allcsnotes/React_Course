#!/bin/bash
# usage: ./use-version.sh <version-folder-name>
# Clears the demo files in src/ (keeps main.tsx and index.css), copies versions/common (if any),
# then copies the files of versions/<name> into src/.
set -e
cd "$(dirname "$0")"
v="$1"
if [ -z "$v" ] || [ ! -d "versions/$v" ] || [ "$v" = common ]; then
  echo "usage: ./use-version.sh <name>   (one of: $(ls versions | grep -v '^common$' | tr '\n' ' '))"
  exit 1
fi
for f in src/*.tsx src/*.ts; do
  [ -e "$f" ] || continue
  [ "$(basename "$f")" = main.tsx ] || rm -f "$f"
done
if [ -d versions/common ]; then cp versions/common/* src/ 2>/dev/null || true; fi
cp versions/"$v"/* src/
echo "src/ now holds version: $v"
