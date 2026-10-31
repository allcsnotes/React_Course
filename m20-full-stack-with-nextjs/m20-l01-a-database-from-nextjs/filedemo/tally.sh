#!/bin/zsh
# 20 runs of race.ts: how many reviews end up in the file?
cd ${0:A:h}; ok2=0; one=0; broken=0
for i in {1..20}; do echo '[]' > reviews.json; node race.ts
  n=$(node -e 'try{console.log(JSON.parse(require("fs").readFileSync("reviews.json")).length)}catch(e){console.log("broken")}')
  case $n in 2) ok2=$((ok2+1));; 1) one=$((one+1));; *) broken=$((broken+1));; esac; done
echo "20 runs: both saved $ok2, one lost $one, file broken $broken"
