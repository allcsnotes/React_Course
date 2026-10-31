#!/bin/bash
# usage: ./use-version.sh <layer> [<layer> ...]
# Puts versions/common (the app files) into src/, then applies each layer in order (tests, mocks, setup).
# Example:  ./use-version.sh final v4x     (everything final, then the CartBar test without a wrapper)
set -e
cd "$(dirname "$0")"
if [ $# -eq 0 ]; then
  echo "usage: ./use-version.sh <layer> [<layer> ...]   (layers: $(ls versions | grep -v '^common$' | tr '\n' ' '))"
  exit 1
fi
for v in "$@"; do [ -d "versions/$v" ] || { echo "no such layer: $v"; exit 1; }; done
rm -rf src
mkdir src
cp -R versions/common/. src/
for v in "$@"; do cp -R versions/"$v"/. src/; done
echo "src/ now holds: common + $*"
