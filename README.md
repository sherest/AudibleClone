# 🕉️ Amrita Lahari - Sacred Audio App

A modern, cross-platform mobile application for spiritual chants, prayers, and meditation. Built with React Native and Expo, Amrita Lahari provides a serene digital space for accessing sacred audio content in multiple languages.

![Amrita Lahari App](assets/icon.png)

## 🌟 Features

### 🎵 **Audio Experience**
- **Album-Based Playback**: Organize spiritual content into albums with multiple songs
- **Multi-Language Support**: Content available in English, Hindi, and Bengali
- **Background Audio**: Continue listening while using other apps
- **Mini Player**: Quick access to currently playing content
- **Full-Screen Player**: Immersive listening experience with album artwork

### 🏠 **Home Screen**
- **Auto-Playing Carousel**: Featured content with smooth animations
- **Dynamic Content**: Real-time updates from Firebase
- **Localized Greetings**: Personalized welcome messages
- **Quick Actions**: Easy access to join community and information

### 📚 **Content Sections**
- **Kirtan**: Traditional devotional songs and chants
- **Satprasanga**: Spiritual discourses and teachings
- **Community**: Connect with like-minded individuals
- **About**: Information about the spiritual organization

### 🌐 **Localization**
- **Multi-Language UI**: Complete interface in English, Hindi, and Bengali
- **Dynamic Content**: All text content adapts to selected language
- **Cultural Sensitivity**: Respectful representation of spiritual content

### 🔧 **Technical Features**
- **Real-time Data**: Firebase Realtime Database integration
- **Cloud Storage**: Secure audio and image hosting
- **Offline Support**: Local caching for better performance
- **Push Notifications**: Stay updated with new content
- **Responsive Design**: Optimized for all device sizes

## 📱 Screenshots

### Home Screen
- Auto-playing carousel with featured content
- Localized greetings and quick actions
- Modern card-based design

### Audio Player
- Full-screen immersive player
- Album artwork display
- Playback controls and progress bar
- Multi-language song information

### Content Browsing
- Album-based organization
- Song count indicators
- Upload date information
- Modern list design

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Yarn** package manager
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (for iOS development)
- **Android Studio** (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/amrita-lahari.git
   cd amrita-lahari
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Realtime Database and Storage
   - Update `FirebaseConfig.ts` with your credentials
   - Set up the database structure (see Firebase Setup section)

4. **Start the development server**
   ```bash
   yarn start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   yarn ios
   
   # Android
   yarn android
   ```

## 🔥 Firebase Setup

### Database Structure

```json
{
  "latest": {
    "data": [
      {
        "title": {
          "eng": "English Title",
          "hin": "हिंदी शीर्षक",
          "ban": "বাংলা শিরোনাম"
        },
        "description": {
          "eng": "English Description",
          "hin": "हिंदी विवरण",
          "ban": "বাংলা বিবরণ"
        },
        "image": "image-url.jpg",
        "link": "https://example.com"
      }
    ]
  },
  "kirtan": {
    "data": [
      {
        "albumName": {
          "eng": "Album Name",
          "hin": "एल्बम नाम",
          "ban": "অ্যালবাম নাম"
        },
        "title": {
          "eng": "Album Title",
          "hin": "एल्बम शीर्षक",
          "ban": "অ্যালবাম শিরোনাম"
        },
        "cover": "cover-image.jpg",
        "songs": [
          {
            "fileName": "song.mp3",
            "title": {
              "eng": "Song Title",
              "hin": "गाना शीर्षक",
              "ban": "গান শিরোনাম"
            },
            "singer": {
              "eng": "Singer Name",
              "hin": "गायक नाम",
              "ban": "গায়ক নাম"
            }
          }
        ],
        "uploaded": "2021-12-13"
      }
    ],
    "basePath": {
      "audio": "lahari/mp3/",
      "image": "lahari/images/"
    },
    "fallbackBasePath": {
      "audio": "https://example.com/audio/"
    },
    "isFirebaseAudio": true
  },
  "menu": {
    "home": {
      "eng": "Home",
      "hin": "होम",
      "ban": "হোম"
    },
    "kirtan": {
      "eng": "Kirtan",
      "hin": "कीर्तन",
      "ban": "কীর্তন"
    }
  }
}
```

### Storage Structure

```
amrita-lahari.appspot.com/
├── lahari/
│   ├── mp3/           # Audio files
│   └── images/        # Cover images
```

## 🏗️ Project Structure

```
src/
├── app/                    # Main app screens
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── kirtan.tsx     # Kirtan content
│   │   ├── satprasanga.tsx # Satprasanga content
│   │   ├── about.tsx      # About screen
│   │   ├── community.tsx  # Community screen
│   │   └── _layout.tsx    # Tab layout
│   ├── player.tsx         # Full-screen player
│   ├── settings.tsx       # Settings screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── HomeCarousel.tsx   # Featured content carousel
│   ├── FloatingPlayer.tsx # Mini player
│   ├── PlaybackBar.tsx    # Audio progress bar
│   ├── SkeletonPlaceholder.tsx # Loading placeholders
│   └── JoinUsModal.tsx    # Community join modal
├── providers/             # Context providers
│   ├── PlayerProvider.tsx # Audio player state
│   ├── LanguageContext.tsx # Language selection
│   └── JoinUsProvider.tsx # Community state
└── lib/                   # Utility libraries
    └── firebase.ts        # Firebase configuration
```

## 🎯 Key Components

### Audio Player System
- **PlayerProvider**: Manages audio state and playback
- **FloatingPlayer**: Mini player for quick access
- **PlaybackBar**: Visual progress indicator
- **Album Navigation**: Next/previous song controls

### Localization System
- **LanguageContext**: Manages selected language
- **getLocalizedContent**: Helper function for text localization
- **Dynamic Content**: All UI text adapts to language

### Content Management
- **HomeCarousel**: Auto-playing featured content
- **Album Lists**: Organized content browsing
- **Skeleton Placeholders**: Loading states
- **Real-time Updates**: Firebase integration

## 🛠️ Technologies Used

### Core Framework
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript

### UI & Styling
- **NativeWind**: Tailwind CSS for React Native
- **React Native Reanimated**: Smooth animations
- **Expo Blur**: Visual effects

### Audio & Media
- **Expo Audio**: Audio playback and management
- **React Native Auto Height Image**: Responsive images

### Backend & Storage
- **Firebase**: Real-time database and storage
- **Cloud Functions**: Serverless backend logic

### Navigation
- **Expo Router**: File-based routing
- **React Navigation**: Tab and stack navigation

## 📦 Dependencies

### Core Dependencies
```json
{
  "expo": "~52.0.43",
  "react": "18.3.1",
  "react-native": "0.76.9",
  "expo-audio": "~0.3.5",
  "firebase": "^11.10.0",
  "nativewind": "^4.1.23",
  "react-native-momentum-carousel": "^2.0.0"
}
```

### Development Dependencies
```json
{
  "typescript": "^5.3.3",
  "@types/react": "~18.3.12",
  "@babel/core": "^7.25.2"
}
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
```

### App Configuration
- **Bundle ID**: `com.app.amritalahari`
- **App Name**: "Amrita Lahari"
- **Version**: 1.0.0
- **Platforms**: iOS, Android

## 🚀 Deployment

### iOS App Store
1. **Build for production**
   ```bash
   yarn build:ios
   ```

2. **Archive and upload**
   - Use Xcode to archive the project
   - Upload to App Store Connect

### Google Play Store
1. **Build APK/AAB**
   ```bash
   yarn build:android
   ```

2. **Upload to Play Console**
   - Generate signed APK/AAB
   - Upload to Google Play Console

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spiritual Community**: For providing sacred content
- **React Native Community**: For excellent documentation and tools
- **Expo Team**: For the amazing development platform
- **Firebase Team**: For reliable backend services

## 📞 Support

For support and questions:
- **Email**: support@amritalahari.com
- **Website**: https://amritalahari.com
- **Community**: Join our community through the app

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Multi-language support
- Album-based audio player
- Firebase integration
- Community features
- Auto-playing carousel
- Modern UI/UX design

---

**Amrita Lahari** - Bringing sacred audio content to the digital age 🕉️ 