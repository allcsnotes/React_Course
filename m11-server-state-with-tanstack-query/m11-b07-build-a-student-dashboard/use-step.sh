#!/bin/sh
# Usage (from inside dashboard-web/):  sh ../use-step.sh NAME
# Replaces everything in src/ with the snapshot steps/NAME/.
set -e
[ -d "../steps/$1" ] || { echo "no such step: $1"; ls ../steps; exit 1; }
find src -type f -delete
cp ../steps/"$1"/* src/
echo "src/ now holds step $1"
