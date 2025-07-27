// Sample data structure for the carousel
// You can use this as a reference when setting up your Firebase database

export const sampleCarouselData = {
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
      "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
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
      "image_url": "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&h=200&fit=crop",
      "category": "Prayer",
      "date": "2024-01-16"
    },
    "item3": {
      "id": "item3",
      "title": {
        "en": "Bhagavad Gita Study",
        "hin": "भगवद गीता का अध्ययन"
      },
      "description": {
        "en": "Deep dive into the wisdom of ancient scriptures",
        "hin": "प्राचीन शास्त्रों के ज्ञान में गहराई से उतरें"
      },
      "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
      "category": "Study",
      "date": "2024-01-17"
    },
    "item4": {
      "id": "item4",
      "title": {
        "en": "Community Satsang",
        "hin": "समुदाय सत्संग"
      },
      "description": {
        "en": "Connect with fellow devotees in spiritual discourse",
        "hin": "आध्यात्मिक चर्चा में साथी भक्तों से जुड़ें"
      },
      "image_url": "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=200&fit=crop",
      "category": "Community",
      "date": "2024-01-18"
    },
    "item5": {
      "id": "item5",
      "title": {
        "en": "Sacred Music Concert",
        "hin": "पवित्र संगीत कार्यक्रम"
      },
      "description": {
        "en": "Experience the divine through classical devotional music",
        "hin": "शास्त्रीय भक्ति संगीत के माध्यम से दिव्य अनुभव करें"
      },
      "image_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
      "category": "Music",
      "date": "2024-01-19"
    }
  }
};

// Instructions for Firebase setup:
// 1. Go to your Firebase Realtime Database
// 2. Create a new node called "featured_content"
// 3. Add the above data structure under that node
// 4. The carousel will automatically fetch and display this content
// 5. You can modify the autoPlayInterval prop in the HomeCarousel component to change the timing

export default sampleCarouselData; 