import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { CarouselMomentum } from 'react-native-momentum-carousel';
import { realtimeDb } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { useLanguage } from '../providers/LanguageContext';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface CarouselItem {
  id: string;
  title: { [key: string]: string };
  description: { [key: string]: string };
  image_url: string;
  category?: string;
  date?: string;
}

interface HomeCarouselProps {
  autoPlayInterval?: number;
}

const HomeCarousel: React.FC<HomeCarouselProps> = ({ autoPlayInterval = 4000 }) => {
  const { selectedLanguage } = useLanguage();
  const [carouselData, setCarouselData] = useState<CarouselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCarouselData = () => {
      // Fetch from 'featured_content' or 'carousel_items' in Firebase
      const carouselRef = ref(realtimeDb, 'featured_content');
      onValue(carouselRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert object to array if needed
          const items = Array.isArray(data) ? data : Object.values(data);
          setCarouselData(items);
        } else {
          // Temporary sample data for testing
          setCarouselData([
            {
              id: 'temp1',
              title: { en: 'Sacred Morning Chants', hin: 'पवित्र सुबह के भजन' },
              description: { 
                en: 'Start your day with divine melodies and spiritual awakening', 
                hin: 'दिव्य धुनों और आध्यात्मिक जागरण के साथ अपना दिन शुरू करें' 
              },
              image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
              category: 'Meditation',
              date: '2024-01-15'
            },
            {
              id: 'temp2',
              title: { en: 'Evening Aarti', hin: 'शाम की आरती' },
              description: { 
                en: 'Join us for the sacred evening prayer ceremony', 
                hin: 'पवित्र शाम की प्रार्थना समारोह में हमसे जुड़ें' 
              },
              image_url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&h=200&fit=crop',
              category: 'Prayer',
              date: '2024-01-16'
            },
            {
              id: 'temp3',
              title: { en: 'Bhagavad Gita Study', hin: 'भगवद गीता का अध्ययन' },
              description: { 
                en: 'Deep dive into the wisdom of ancient scriptures', 
                hin: 'प्राचीन शास्त्रों के ज्ञान में गहराई से उतरें' 
              },
              image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop',
              category: 'Study',
              date: '2024-01-17'
            }
          ]);
        }
      });
    };

    fetchCarouselData();
  }, [selectedLanguage]);

  const renderCarouselItem = ({ item }: { item: CarouselItem }) => (
    <View style={styles.carouselItem}>
      <Image 
        source={{ uri: item.image_url }} 
        style={styles.carouselImage}
        resizeMode="cover"
      />
      <View style={styles.carouselOverlay}>
        <View style={styles.carouselContent}>
          {item.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {item.category}
              </Text>
            </View>
          )}
          <Text style={styles.carouselTitle}>
            {item.title[selectedLanguage?.code as keyof typeof item.title] || item.title.en}
          </Text>
          <Text style={styles.carouselDescription} numberOfLines={2}>
            {item.description[selectedLanguage?.code as keyof typeof item.description] || item.description.en}
          </Text>
          {item.date && (
            <View style={styles.dateContainer}>
              <FontAwesome5 name="calendar-alt" size={12} color="#e94560" />
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const onSnap = (index: number) => {
    setCurrentIndex(index);
  };

  // For debugging - always show carousel with sample data
  const displayData = carouselData.length > 0 ? carouselData : [
    {
      id: 'debug1',
      title: { en: 'Sacred Morning Chants', hin: 'पवित्र सुबह के भजन' },
      description: { 
        en: 'Start your day with divine melodies and spiritual awakening', 
        hin: 'दिव्य धुनों और आध्यात्मिक जागरण के साथ अपना दिन शुरू करें' 
      },
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
      category: 'Meditation',
      date: '2024-01-15'
    },
    {
      id: 'debug2',
      title: { en: 'Evening Aarti', hin: 'शाम की आरती' },
      description: { 
        en: 'Join us for the sacred evening prayer ceremony', 
        hin: 'पवित्र शाम की प्रार्थना समारोह में हमसे जुड़ें' 
      },
      image_url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&h=200&fit=crop',
      category: 'Prayer',
      date: '2024-01-16'
    }
  ];

  return (
    <View style={styles.carouselContainer}>
      <CarouselMomentum
        data={displayData}
        sliderWidth={width}
        itemWidth={width - 40}
        renderItem={renderCarouselItem}
        onSnap={onSnap}
        autoPlay={true}
        autoPlayInterval={autoPlayInterval}
        loop={true}
        inactiveScale={0.9}
        showPagination={true}
        paginationStyle={{
          container: styles.paginationContainer,
          bullet: styles.paginationBullet,
          activeBullet: styles.paginationActiveBullet,
        }}
        animation={0}
        customAnimation={false}
        onMomentumScrollEnd={() => {
          // Additional callback for smooth looping
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginVertical: 20,
  },
  carouselItem: {
    width: width - 40,
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    padding: 20,
  },
  carouselContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e94560',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  carouselDescription: {
    fontSize: 14,
    color: '#b0b0b0',
    lineHeight: 20,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#e94560',
    marginLeft: 5,
    fontWeight: '500',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationActiveBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e94560',
    marginHorizontal: 4,
  },
});

export default HomeCarousel; 