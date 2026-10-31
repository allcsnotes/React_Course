#!/bin/sh
# install, lint, type-check, test, build, deploy: first failure stops all
SHA="$1"
BRANCH="$2"
export VITE_BUILD_SHA="$SHA"

stage() {
  name="$1"; shift
  echo ""
  echo ">>> $name: $*"
  start=$(date +%s)
  "$@"
  code=$?
  secs=$(( $(date +%s) - start ))
  if [ "$code" -ne 0 ]; then
    echo "<<< $name FAILED with exit code $code after ${secs}s"
    echo "<<< pipeline stopped: nothing was deployed"
    exit "$code"
  fi
  echo "<<< $name passed in ${secs}s"
}

stage install npm ci
stage lint npm run lint
stage typecheck npm run typecheck
stage test npm test
stage build npm run build
if [ "$BRANCH" = "main" ]; then
  stage deploy sh scripts/deploy.sh "$SHA"
else
  echo "deploy skipped: $BRANCH is not main"
fi
echo "PIPELINE PASSED for $SHA"
