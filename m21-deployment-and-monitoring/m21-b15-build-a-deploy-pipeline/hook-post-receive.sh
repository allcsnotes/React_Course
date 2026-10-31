#!/bin/sh
# Runs on the "server" after every push, as a provider starts a run.
while read old new ref; do
  branch="${ref#refs/heads/}"
  sha=$(echo "$new" | cut -c1-7)
  dir="../runs/$sha"
  mkdir -p "$dir"
  git archive "$new" | tar -x -C "$dir"
  echo "pipeline for $sha on $branch, in a clean copy"
  (
    cd "$dir"
    unset GIT_DIR
    sh scripts/pipeline.sh "$sha" "$branch"
  )
done
