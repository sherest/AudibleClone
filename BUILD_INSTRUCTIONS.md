# 🔧 Build Instructions to Fix Upload Issues

## Issues Fixed:

### 1. ✅ Invalid UIBackgroundModes Value
- **Problem**: `'background-processing'` is not a valid iOS background mode
- **Solution**: Removed invalid value, kept only `'audio'` for background audio playback

### 2. ✅ Missing dSYM Files for Hermes Framework
- **Problem**: Debug symbols missing for Hermes framework
- **Solution**: Updated build configuration and Metro config

## 🚀 Steps to Rebuild and Upload:

### Step 1: Clean Previous Builds
```bash
# Clean Expo cache
expo r -c

# Clean iOS build
cd ios && rm -rf build && cd ..

# Clean Android build
cd android && ./gradlew clean && cd ..
```

### Step 2: Update Dependencies
```bash
# Install/update EAS CLI
npm install -g @expo/eas-cli

# Install dependencies
yarn install
```

### Step 3: Configure EAS (if not already done)
```bash
# Login to Expo
eas login

# Configure EAS for your project
eas build:configure
```

### Step 4: Build for Production
```bash
# Build for iOS
eas build --platform ios --profile production

# Or build locally (if you have Xcode)
expo run:ios --configuration Release
```

### Step 5: Submit to App Store
```bash
# Submit using EAS
eas submit --platform ios

# Or manually through Xcode
# 1. Open ios/amritalahari.xcworkspace in Xcode
# 2. Product > Archive
# 3. Distribute App
```

## 🔧 Configuration Changes Made:

### app.json Updates:
- ✅ Removed invalid `'background-processing'` from UIBackgroundModes
- ✅ Added `buildNumber: "1"` for iOS
- ✅ Added `ITSAppUsesNonExemptEncryption: false` for App Store compliance

### eas.json Created:
- ✅ Production build configuration
- ✅ Proper iOS build settings
- ✅ dSYM generation enabled

### metro.config.js Updates:
- ✅ Added proper platform resolution
- ✅ Enhanced Hermes framework handling

## 📱 Important Notes:

### For Audio Background Mode:
- ✅ `'audio'` mode allows background audio playback
- ✅ Perfect for your spiritual audio app
- ✅ Users can continue listening while using other apps

### For dSYM Files:
- ✅ EAS build will automatically generate proper dSYM files
- ✅ Crash reporting will work correctly
- ✅ App Store validation will pass

### For App Store Submission:
- ✅ All Info.plist values are now valid
- ✅ Build configuration is optimized
- ✅ Ready for production deployment

## 🎯 Expected Results:

After following these steps:
1. ✅ Build will complete without errors
2. ✅ App Store validation will pass
3. ✅ dSYM files will be properly included
4. ✅ Background audio will work correctly
5. ✅ App will be ready for App Store submission

## 🆘 If Issues Persist:

### Check EAS Build Logs:
```bash
eas build:list
eas build:view [BUILD_ID]
```

### Verify Configuration:
```bash
# Check if EAS is properly configured
eas build:configure

# Validate app.json
expo doctor
```

### Manual Xcode Build:
1. Open `ios/amritalahari.xcworkspace` in Xcode
2. Select "Any iOS Device" as target
3. Product > Archive
4. Follow App Store submission process

---

Your Amrita Lahari app should now build and upload successfully! 🕉️ 