#!/bin/bash
# usage: ./use-version.sh <version>      (v0, v1, v2, final, m1, m2)
# Puts versions/<version>/src into src/, and the configs (vite.config.ts, tsconfig.app.json) from versions/common,
# then any config that the version itself carries.
set -e
cd "$(dirname "$0")"
v="$1"
if [ -z "$v" ] || [ ! -d "versions/$v" ] || [ "$v" = common ]; then
  echo "usage: ./use-version.sh <version>   (one of: $(ls versions | grep -v '^common$' | tr '\n' ' '))"
  exit 1
fi
if [ -d versions/$v/src ]; then
  rm -rf src
  cp -R versions/$v/src src
fi
cp versions/common/vite.config.ts versions/common/tsconfig.app.json .
for f in vite.config.ts tsconfig.app.json; do [ -f versions/$v/$f ] && cp versions/$v/$f . || true; done
echo "src/ now holds version: $v"
