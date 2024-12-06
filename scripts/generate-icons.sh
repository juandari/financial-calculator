#!/bin/bash

# Ensure you have ImageMagick installed
# Install on macOS: brew install imagemagick
# Install on Ubuntu: sudo apt-get install imagemagick

# Input SVG file
INPUT_SVG="./icons/financial_calculator_icon_512x512.png"

# Output directory
mkdir -p icons

# Icon sizes for PWA and various platforms
SIZES=(
    16 32 48 72 96 128 144 152 192 256 384 512
)

# Generate PNG icons
for size in "${SIZES[@]}"; do
    convert -background none "$INPUT_SVG" -resize "${size}x${size}" "icons/icon-${size}x${size}.png"
done

# Generate Apple touch icons
APPLE_SIZES=(
    57 60 72 76 114 120 144 152 167 180 192 512
)

for size in "${APPLE_SIZES[@]}"; do
    convert -background none "$INPUT_SVG" -resize "${size}x${size}" "icons/apple-icon-${size}x${size}.png"
done

echo "Icons generated successfully in the 'icons' directory!"