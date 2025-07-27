import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useLanguage } from '../../providers/LanguageContext';
import { realtimeDb } from '../../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface SatprasangaItem {
  id: string;
  title: { [key: string]: string };
  speaker: { [key: string]: string };
  duration: string;
  category: string;
  description: { [key: string]: string };
  thumbnail_url?: string;
  audio_url: string;
  date: string;
}

const SatprasangaScreen = () => {
  const { selectedLanguage } = useLanguage();
  const [satprasangaItems, setSatprasangaItems] = useState<SatprasangaItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchSatprasangaItems = () => {
      const satprasangaRef = ref(realtimeDb, 'satprasanga');
      onValue(satprasangaRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setSatprasangaItems(Object.values(data));
        }
      });
    };

    fetchSatprasangaItems();
  }, [selectedLanguage]);

  const categories = [
    { id: 'all', name: { en: 'All Discourses', hi: 'सभी प्रवचन' } },
    { id: 'bhagavad-gita', name: { en: 'Bhagavad Gita', hi: 'भगवद गीता' } },
    { id: 'upanishads', name: { en: 'Upanishads', hi: 'उपनिषद' } },
    { id: 'vedanta', name: { en: 'Vedanta', hi: 'वेदांत' } },
    { id: 'meditation', name: { en: 'Meditation', hi: 'ध्यान' } },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? satprasangaItems 
    : satprasangaItems.filter(item => item.category === selectedCategory);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <FontAwesome5 name="book-open" size={24} color="#e94560" />
        <Text style={styles.headerTitle}>
          {selectedLanguage?.code === 'hi' ? 'सत्प्रसंग' : 'Satprasanga'}
        </Text>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedCategoryText
            ]}>
              {category.name[selectedLanguage?.code as keyof typeof category.name] || category.name.en}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured Discourse */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedLanguage?.code === 'hi' ? 'विशेष प्रवचन' : 'Featured Discourse'}
        </Text>
        <View style={styles.featuredCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' }}
            style={styles.featuredImage}
          />
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>
              {selectedLanguage?.code === 'hi' ? 'कर्म योग का ज्ञान' : 'Knowledge of Karma Yoga'}
            </Text>
            <Text style={styles.featuredSpeaker}>
              {selectedLanguage?.code === 'hi' ? 'गुरुजी द्वारा' : 'By Guruji'}
            </Text>
            <Text style={styles.featuredDuration}>45:30</Text>
            <TouchableOpacity style={styles.playButton}>
              <MaterialIcons name="play-arrow" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Satprasanga List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedLanguage?.code === 'hi' ? 'प्रवचन सूची' : 'Discourse Collection'}
        </Text>
        {filteredItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.discourseItem}>
            <Image 
              source={{ uri: item.thumbnail_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100' }}
              style={styles.discourseImage}
            />
            <View style={styles.discourseContent}>
              <Text style={styles.discourseTitle}>
                {item.title[selectedLanguage?.code as keyof typeof item.title] || item.title.en}
              </Text>
              <Text style={styles.discourseSpeaker}>
                {item.speaker[selectedLanguage?.code as keyof typeof item.speaker] || item.speaker.en}
              </Text>
              <Text style={styles.discourseDuration}>{item.duration}</Text>
              <Text style={styles.discourseDate}>{item.date}</Text>
            </View>
            <TouchableOpacity style={styles.playIcon}>
              <MaterialIcons name="play-circle-outline" size={32} color="#e94560" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Uploads */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedLanguage?.code === 'hi' ? 'हाल के अपलोड' : 'Recent Uploads'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredItems.slice(0, 5).map((item, index) => (
            <View key={index} style={styles.recentCard}>
              <Image 
                source={{ uri: item.thumbnail_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150' }}
                style={styles.recentImage}
              />
              <View style={styles.recentContent}>
                <Text style={styles.recentTitle} numberOfLines={2}>
                  {item.title[selectedLanguage?.code as keyof typeof item.title] || item.title.en}
                </Text>
                <Text style={styles.recentSpeaker}>
                  {item.speaker[selectedLanguage?.code as keyof typeof item.speaker] || item.speaker.en}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
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