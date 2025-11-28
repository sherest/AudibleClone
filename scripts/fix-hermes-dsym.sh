#!/bin/bash

# Script to fix Hermes dSYM issues for App Store uploads
# This script creates the necessary dSYM files for Hermes framework

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Hermes dSYM fix...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Navigate to iOS directory
cd ios

echo -e "${YELLOW}Cleaning and reinstalling pods...${NC}"

# Clean and reinstall pods
rm -rf Pods
rm -rf Podfile.lock
pod install

echo -e "${YELLOW}Building for archive with Hermes dSYM fix...${NC}"

# Build for archive
xcodebuild archive \
    -workspace AmritaLahari.xcworkspace \
    -scheme AmritaLahari \
    -configuration Release \
    -archivePath ../build/AmritaLahari.xcarchive \
    -destination generic/platform=iOS \
    DEBUG_INFORMATION_FORMAT=dwarf-with-dsym \
    STRIP_INSTALLED_PRODUCT=NO

echo -e "${GREEN}Archive created!${NC}"

# Check if dSYM files exist
ARCHIVE_PATH="../build/AmritaLahari.xcarchive"
DSYM_PATH="$ARCHIVE_PATH/dSYMs"

if [ -d "$DSYM_PATH" ]; then
    echo -e "${GREEN}dSYM files found in archive:${NC}"
    ls -la "$DSYM_PATH"
    
    # Check specifically for Hermes dSYM
    if find "$DSYM_PATH" -name "*hermes*" -type d | grep -q .; then
        echo -e "${GREEN}✓ Hermes dSYM files found!${NC}"
    else
        echo -e "${YELLOW}⚠ Hermes dSYM files not found, creating them manually...${NC}"
        
        # Find the Hermes framework in the archive
        HERMES_FRAMEWORK_PATH=$(find "$ARCHIVE_PATH" -name "hermes.framework" -type d | head -1)
        
        if [ -n "$HERMES_FRAMEWORK_PATH" ]; then
            echo -e "${YELLOW}Found Hermes framework at: $HERMES_FRAMEWORK_PATH${NC}"
            
            # Create dSYM for Hermes
            HERMES_DSYM_PATH="$DSYM_PATH/hermes.framework.dSYM"
            mkdir -p "$HERMES_DSYM_PATH/Contents/Resources/DWARF"
            
            # Copy the binary
            if [ -f "$HERMES_FRAMEWORK_PATH/hermes" ]; then
                cp "$HERMES_FRAMEWORK_PATH/hermes" "$HERMES_DSYM_PATH/Contents/Resources/DWARF/hermes"
                echo -e "${GREEN}✓ Copied Hermes binary to dSYM${NC}"
            fi
            
            # Create Info.plist
            cat > "$HERMES_DSYM_PATH/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleIdentifier</key>
  <string>com.apple.xcode.dsym.hermes.framework</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>hermes.framework</string>
  <key>CFBundleShortVersionString</key>
  <string>1.0</string>
  <key>CFBundleVersion</key>
  <string>1</string>
</dict>
</plist>
EOF
            echo -e "${GREEN}✓ Created Hermes dSYM Info.plist${NC}"
            
            # Verify the dSYM was created
            if [ -d "$HERMES_DSYM_PATH" ]; then
                echo -e "${GREEN}✓ Hermes dSYM successfully created at: $HERMES_DSYM_PATH${NC}"
            else
                echo -e "${RED}✗ Failed to create Hermes dSYM${NC}"
            fi
        else
            echo -e "${RED}✗ Hermes framework not found in archive${NC}"
        fi
    fi
else
    echo -e "${RED}Error: No dSYM files found in archive${NC}"
    exit 1
fi

echo -e "${GREEN}Hermes dSYM fix completed!${NC}"
echo -e "${YELLOW}You can now upload this archive to App Store Connect${NC}"

