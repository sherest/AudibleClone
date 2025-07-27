import React, { Fragment, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useLanguage } from '../../providers/LanguageContext';
import { realtimeDb } from '../../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SatprasangaScreen = () => {

  return (
    <Fragment>
    <SafeAreaView style={{flex: 0, backgroundColor: '#1a1a2e'}}></SafeAreaView>
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <FontAwesome5 name="book-open" size={24} color="#e94560" />
        <Text style={styles.headerTitle}>
          Satprasanga
        </Text>
      </View>
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Text>Sample Page</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3460',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 25,
    backgroundColor: '#16213e',
  },
  selectedCategory: {
    backgroundColor: '#e94560',
  },
  categoryText: {
    color: '#8b8b8b',
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  featuredCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  featuredImage: {
    width: '100%',
    height: 150,
  },
  featuredContent: {
    padding: 15,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  featuredSpeaker: {
    fontSize: 14,
    color: '#8b8b8b',
    marginBottom: 5,
  },
  featuredDuration: {
    fontSize: 12,
    color: '#e94560',
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: '#e94560',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  discourseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  discourseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  discourseContent: {
    flex: 1,
    marginLeft: 15,
  },
  discourseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  discourseSpeaker: {
    fontSize: 14,
    color: '#8b8b8b',
    marginBottom: 2,
  },
  discourseDuration: {
    fontSize: 12,
    color: '#e94560',
    marginBottom: 2,
  },
  discourseDate: {
    fontSize: 12,
    color: '#8b8b8b',
  },
  playIcon: {
    marginLeft: 10,
  },
  recentCard: {
    width: 150,
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    marginRight: 15,
    overflow: 'hidden',
  },
  recentImage: {
    width: '100%',
    height: 100,
  },
  recentContent: {
    padding: 10,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  recentSpeaker: {
    fontSize: 12,
    color: '#8b8b8b',
  },
});

export default SatprasangaScreen; 