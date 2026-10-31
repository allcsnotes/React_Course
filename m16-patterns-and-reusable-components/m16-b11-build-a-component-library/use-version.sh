#!/bin/bash
# usage: ./use-version.sh <name>
# Puts versions/<name> into src/ (the files of src/ui and src/App.tsx are replaced; index.css and main.tsx stay).
set -e
cd "$(dirname "$0")"
v="$1"
if [ -z "$v" ] || [ ! -d "versions/$v" ]; then
  echo "usage: ./use-version.sh <name>   (one of: $(ls versions | tr '\n' ' '))"
  exit 1
fi
find src/ui -type f -delete
cp versions/"$v"/ui/* src/ui/
cp versions/"$v"/App.tsx src/App.tsx
echo "src/ now holds version: $v"
