import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CarouselMomentum } from 'react-native-momentum-carousel';

const { width } = Dimensions.get('window');

const SimpleCarousel = () => {
  const testData = [
    { id: '1', title: 'Test Item 1' },
    { id: '2', title: 'Test Item 2' },
    { id: '3', title: 'Test Item 3' },
    { id: '4', title: 'Test Item 4' },
    { id: '5', title: 'Test Item 5' },
  ];

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.testItem}>
      <Text style={styles.testText}>{item.title}</Text>
    </View>
  );

  const onSnap = (index: number) => {
    console.log('Snapped to index:', index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Test Carousel</Text>
      <CarouselMomentum
        data={testData}
        sliderWidth={width}
        itemWidth={width - 40}
        renderItem={renderItem}
        onSnap={onSnap}
        autoPlay={true}
        autoPlayInterval={3000}
        loop={true}
        inactiveScale={0.9}
        showPagination={true}
        animation={0}
        customAnimation={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  testItem: {
    width: width - 40,
    height: 150,
    backgroundColor: '#e94560',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default SimpleCarousel; 