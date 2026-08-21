#!/bin/sh
# Build a distributable zip of the extension (Chrome Web Store / Edge Add-ons
# upload format, also fine for unzip-and-load-unpacked).
#
# - Includes only the files the extension actually ships
# - Strips the //-comment lines from manifest.json in the packed copy
#   (Chrome's parser accepts them, but strict store-side JSON tools may not)
set -eu
cd "$(dirname "$0")"

VERSION=$(sed -n 's/.*"version": "\([^"]*\)".*/\1/p' manifest.json)
STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT

cp -R content options icons rules.json background.js "$STAGE"/
grep -v '^[[:space:]]*//' manifest.json > "$STAGE/manifest.json"

mkdir -p dist
OUT="dist/yt-declutter-v$VERSION.zip"
rm -f "$OUT"
(cd "$STAGE" && zip -qr - .) > "$OUT"
echo "Packed $OUT"
