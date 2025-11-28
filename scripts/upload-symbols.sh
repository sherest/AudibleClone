#!/bin/bash

# Script to upload dSYM files including Hermes framework
# This script ensures that Hermes dSYM files are properly uploaded to App Store Connect

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting dSYM upload process...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Check if Xcode is available
if ! command -v xcodebuild &> /dev/null; then
    echo -e "${RED}Error: Xcode command line tools not found${NC}"
    exit 1
fi

# Navigate to iOS directory
cd ios

echo -e "${YELLOW}Cleaning and rebuilding pods...${NC}"

# Clean and reinstall pods to ensure proper dSYM generation
rm -rf Pods
rm -rf Podfile.lock
pod install

echo -e "${YELLOW}Building for archive...${NC}"

# Build for archive with proper dSYM generation
xcodebuild archive \
    -workspace AmritaLahari.xcworkspace \
    -scheme AmritaLahari \
    -configuration Release \
    -archivePath ../build/AmritaLahari.xcarchive \
    -destination generic/platform=iOS \
    DEBUG_INFORMATION_FORMAT=dwarf-with-dsym \
    STRIP_INSTALLED_PRODUCT=NO

echo -e "${GREEN}Archive created successfully!${NC}"

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
        echo -e "${YELLOW}⚠ Warning: Hermes dSYM files not found in archive${NC}"
        echo -e "${YELLOW}This might cause symbol upload issues${NC}"
    fi
else
    echo -e "${RED}Error: No dSYM files found in archive${NC}"
    exit 1
fi

echo -e "${GREEN}Archive is ready for upload to App Store Connect!${NC}"
echo -e "${YELLOW}You can now upload this archive using Xcode Organizer or Application Loader${NC}"

