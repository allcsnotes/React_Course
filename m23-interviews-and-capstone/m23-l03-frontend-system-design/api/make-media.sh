#!/bin/sh
# Makes the 60 second test video for the video-player design: ffmpeg's test pattern with a running timer,
# cut into 10 pieces (segments) of 6 seconds, plus a playlist (the manifest) and one caption.
# Needs ffmpeg (https://ffmpeg.org). The result goes to api/media/ (it is not kept in this repository).
cd "$(dirname "$0")"
mkdir -p media
ffmpeg -y -loglevel error \
  -f lavfi -i "testsrc2=size=640x360:rate=24:duration=60" \
  -f lavfi -i "sine=frequency=440:duration=60" \
  -c:v libx264 -preset veryfast -g 144 -keyint_min 144 -sc_threshold 0 -pix_fmt yuv420p -b:v 800k \
  -c:a aac -b:a 64k \
  -f hls -hls_time 6 -hls_playlist_type vod -hls_segment_filename "media/seg-%03d.ts" media/index.m3u8
printf 'WEBVTT\n\n00:00.000 --> 00:05.000\nA test pattern with a running timer\n' > media/captions.vtt
ls media
