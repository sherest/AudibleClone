import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { CarouselMomentum, CarouselMomentumAnimationType } from 'react-native-momentum-carousel';
import { realtimeDb } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { useLanguage } from '../providers/LanguageContext';
import { useTheme } from '../providers/ThemeProvider';
import { FontAwesome5 } from '@expo/vector-icons';
import SkeletonPlaceholder from './SkeletonPlaceholder';

const { width } = Dimensions.get('window');

interface CarouselItem {
  album_name: { eng: string };
  description: { eng: string };
  title: { eng: string };
  upload_date: string;
  year: number;
}

interface HomeCarouselProps {
  autoPlayInterval?: number;
}

const HomeCarousel: React.FC<HomeCarouselProps> = ({ autoPlayInterval = 4000 }) => {
  const { selectedLanguage } = useLanguage();
  const { colors } = useTheme();
  const [carouselData, setCarouselData] = useState<CarouselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCarouselData = () => {
      // Fetch from 'latest' section in Firebase
      const carouselRef = ref(realtimeDb, 'latest');
      onValue(carouselRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.data && Array.isArray(data.data)) {
          setCarouselData(data.data);
        }
      });
    };

    fetchCarouselData();
  }, [selectedLanguage]);

  const renderCarouselItem = ({ item }: { item: CarouselItem }) => (
    <View style={[styles.carouselItem, {backgroundColor: colors.background.secondary}]}>
      <View style={[styles.carouselImage, {backgroundColor: colors.background.secondary}]}>
        <FontAwesome5 name="music" size={60} color={colors.primary} style={styles.musicIcon} />
      </View>
      <View style={[styles.carouselOverlay, {backgroundColor: `rgba(${colors.background.secondary.replace('#', '')}, 0.8)`}]}>
        <View style={styles.carouselContent}>
          <View style={[styles.categoryBadge, {backgroundColor: colors.primary}]}>
            <Text style={[styles.categoryText, {color: colors.text.primary}]}>
              {item.album_name.eng}
            </Text>
          </View>
          <Text style={[styles.carouselTitle, {color: colors.text.primary}]}>
            {item.title.eng}
          </Text>
          <Text style={[styles.carouselDescription, {color: colors.text.secondary}]} numberOfLines={2}>
            {item.description.eng}
          </Text>
          <View style={styles.dateContainer}>
            <FontAwesome5 name="calendar-alt" size={12} color={colors.primary} />
            <Text style={[styles.dateText, {color: colors.primary}]}>{item.upload_date} • {item.year}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const onSnap = (index: number) => {
    setCurrentIndex(index);
  };

  if (carouselData.length === 0) {
    return (
      <View style={{...styles.carouselContainer, marginHorizontal: 20}}>
        <View style={[styles.carouselItem, {backgroundColor: colors.background.secondary}]}>
          <View style={[styles.carouselImage, {backgroundColor: colors.background.secondary}]}>
            <FontAwesome5 name="music" size={60} color={colors.primary} style={styles.musicIcon} />
          </View>
          <View style={[styles.carouselOverlay, {backgroundColor: `rgba(${colors.background.secondary.replace('#', '')}, 0.8)`}]}>
            <View style={styles.carouselContent}>
              <SkeletonPlaceholder width={80} height={20} borderRadius={2} style={{ marginBottom: 8 }} />
              <SkeletonPlaceholder width="90%" height={18} borderRadius={4} style={{ marginBottom: 5 }} />
              <SkeletonPlaceholder width="70%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
              <SkeletonPlaceholder width={120} height={12} borderRadius={4} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.carouselContainer}>
      <CarouselMomentum
        data={carouselData}
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
          activeBullet: [styles.paginationActiveBullet, {backgroundColor: colors.primary}],
        }}
        animation={CarouselMomentumAnimationType.Default}
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
    marginTop: 20,
    marginBottom: 10
  },
  carouselItem: {
    width: width - 40,
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicIcon: {
    opacity: 0.7,
  },
  carouselOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 25,
  },
  carouselContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  carouselDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
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
    marginHorizontal: 4,
  },
});

export default HomeCarousel; 