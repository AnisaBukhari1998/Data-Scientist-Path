#!/bin/bash
set -e

INPUT_IMAGE="/Users/anisakhatun/.gemini/antigravity/brain/87d949d3-3012-49b9-a110-872b551175c4/app_icon_1784418344603.jpg"
OUTPUT_DIR="/Users/anisakhatun/Desktop/Data_Scientist/data-scientist-path-v2/electron"
ICONSET_DIR="/Users/anisakhatun/Desktop/Data_Scientist/data-scientist-path-v2/icon.iconset"

echo "Converting input image to PNG..."
sips -s format png "$INPUT_IMAGE" --out "$OUTPUT_DIR/app-icon.png"

echo "Creating iconset directory..."
mkdir -p "$ICONSET_DIR"

echo "Generating resized icon files..."
sips -z 16 16     "$OUTPUT_DIR/app-icon.png" --out "$ICONSET_DIR/icon_16x16.png"
sips -z 32 32     "$OUTPUT_DIR/app-icon.png" --out "$ICONSET_DIR/icon_16x16@2x.png"
sips -z 32 32     "$OUTPUT_DIR/app-icon.png" --out "$ICONSET_DIR/icon_32x32.png"
sips -z 64 64     "$OUTPUT_DIR/app-icon.png" --out "$ICONSET_DIR/icon_32x32@2x.png"
sips -z 128 128   "$OUTPUT_DIR/app-icon.png" --out "$ICONSET_DIR/icon_128x128.png"
sips -z 256 256   "$OUTPUT_DIR/app-icon.png" --out "$ICONSET_DIR/icon_128x128@2x.png"
sips -z 256 256   "$OUTPUT_DIR/app-icon.png" --out "$ICONSET_DIR/icon_256x256.png"
sips -z 512 512   "$OUTPUT_DIR/app-icon.png" --out "$ICONSET_DIR/icon_256x256@2x.png"
sips -z 512 512   "$OUTPUT_DIR/app-icon.png" --out "$ICONSET_DIR/icon_512x512.png"
sips -z 1024 1024 "$OUTPUT_DIR/app-icon.png" --out "$ICONSET_DIR/icon_512x512@2x.png"

echo "Compiling .icns file..."
iconutil -c icns "$ICONSET_DIR" --out "$OUTPUT_DIR/icon.icns"

echo "Cleaning up temporary files..."
rm -rf "$ICONSET_DIR"
rm -f "$OUTPUT_DIR/app-icon.png"

echo "Icon generation complete! Output saved at $OUTPUT_DIR/icon.icns"
