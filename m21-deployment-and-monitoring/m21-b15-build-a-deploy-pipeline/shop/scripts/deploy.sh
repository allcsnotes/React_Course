#!/bin/sh
# Deploy: build an image with the finished site, then start it here.
SHA="$1"
IMAGE="m21b15-shop:$SHA"
URL=http://localhost:5825
docker build -t "$IMAGE" . || exit 1
docker rm -f m21b15-web > /dev/null 2>&1
docker run -d --name m21b15-web -p 5825:80 "$IMAGE" || exit 1
sleep 1
# smoke check: the page answers, and its code carries this commit id
JS=$(curl -fsS $URL | grep -o 'assets/index-[^"]*\.js') || exit 1
curl -fsS "$URL/$JS" | grep -q "$SHA" || exit 1
echo "smoke check passed: $URL serves $SHA"
