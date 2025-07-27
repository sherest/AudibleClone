# Carousel Setup Guide

## Overview
The home page now includes an auto-playing carousel that displays featured content from your Firebase database. The carousel automatically loops through items and supports both English and Hindi languages.

## Features
- ✅ Auto-playing carousel with continuous loop
- ✅ Configurable timing (currently set to 5 seconds)
- ✅ Firebase integration for dynamic content
- ✅ Multi-language support (English/Hindi)
- ✅ Pagination indicators
- ✅ Smooth animations and scaling effects
- ✅ Responsive design

## Firebase Database Setup

### 1. Database Structure
Create a new node in your Firebase Realtime Database called `featured_content` with the following structure:

```json
{
  "featured_content": {
    "item1": {
      "id": "item1",
      "title": {
        "en": "Sacred Morning Chants",
        "hin": "पवित्र सुबह के भजन"
      },
      "description": {
        "en": "Start your day with divine melodies and spiritual awakening",
        "hin": "दिव्य धुनों और आध्यात्मिक जागरण के साथ अपना दिन शुरू करें"
      },
      "image_url": "https://example.com/image1.jpg",
      "category": "Meditation",
      "date": "2024-01-15"
    },
    "item2": {
      "id": "item2",
      "title": {
        "en": "Evening Aarti",
        "hin": "शाम की आरती"
      },
      "description": {
        "en": "Join us for the sacred evening prayer ceremony",
        "hin": "पवित्र शाम की प्रार्थना समारोह में हमसे जुड़ें"
      },
      "image_url": "https://example.com/image2.jpg",
      "category": "Prayer",
      "date": "2024-01-16"
    }
  }
}
```

### 2. Required Fields
Each carousel item must have:
- `id`: Unique identifier
- `title`: Object with language codes (`en`, `hin`)
- `description`: Object with language codes (`en`, `hin`)
- `image_url`: URL of the image to display

### 3. Optional Fields
- `category`: Category badge (e.g., "Meditation", "Prayer")
- `date`: Date string for display

## Customization

### Changing Auto-play Interval
To change the carousel timing, modify the `autoPlayInterval` prop in `src/app/(tabs)/index.tsx`:

```tsx
<HomeCarousel autoPlayInterval={3000} /> // 3 seconds
<HomeCarousel autoPlayInterval={7000} /> // 7 seconds
```

### Styling
The carousel styles can be customized in `src/components/HomeCarousel.tsx`. Key style properties:
- `carouselItem`: Individual slide styling
- `carouselImage`: Image styling
- `carouselOverlay`: Text overlay styling
- `paginationContainer`: Pagination dots styling

### Animation Types
The carousel supports three animation types:
- `0`: Default animation
- `1`: Stack animation (currently used)
- `2`: Tinder animation

## Troubleshooting

### Carousel Not Showing
1. Check if Firebase data exists under `featured_content` node
2. Verify image URLs are accessible
3. Check console for any errors

### Images Not Loading
1. Ensure image URLs are valid and accessible
2. Check network connectivity
3. Verify Firebase database permissions

### Performance Issues
1. Optimize image sizes (recommended: 400x200px)
2. Use compressed images
3. Consider using image caching libraries

## Sample Data
Use the sample data in `src/lib/sampleCarouselData.ts` as a reference for your Firebase setup.

## Dependencies
The carousel uses:
- `react-native-momentum-carousel`: Main carousel library
- `react-native-reanimated`: Animation support (already installed)

## Support
For issues with the carousel library, refer to the [official documentation](https://github.com/raouldandresy/react-native-momentum-carousel). 