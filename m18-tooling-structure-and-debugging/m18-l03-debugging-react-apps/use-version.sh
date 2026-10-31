#!/bin/bash
# usage: ./use-version.sh <bug|log|fix|prof>
# src/ = versions/common (Receipt.tsx, main.tsx, index.css) + versions/<name>/CartPage.tsx
set -e
cd "$(dirname "$0")"
v="$1"
if [ -z "$v" ] || [ ! -f "versions/$v/CartPage.tsx" ]; then
  echo "usage: ./use-version.sh <name>   (one of: bug log fix prof)"
  exit 1
fi
mkdir -p src
cp versions/common/* src/
cp versions/"$v"/CartPage.tsx src/CartPage.tsx
echo "src/ now holds: common + $v"
