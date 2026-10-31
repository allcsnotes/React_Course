#!/bin/sh
# Usage (from inside allcsvideos-web/):  sh ../use-step.sh NAME
# Replaces src/ with the complete snapshot steps/NAME/src.
set -e
[ -d "../steps/$1/src" ] || { echo "no such step: $1"; ls ../steps; exit 1; }
rm -rf src
cp -R "../steps/$1/src" src
echo "src/ now holds step $1"
