import React, { Fragment, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useLanguage } from '../../providers/LanguageContext';
import { realtimeDb } from '../../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import SettingsModal from '../settings';
import { useJoinUs } from '../../providers/JoinUsProvider';
import HomeCarousel from '../../components/HomeCarousel';

const { width } = Dimensions.get('window');



interface SacredEvent {
  id: string;
  title: { [key: string]: string };
  date: string;
  description: { [key: string]: string };
  image_url?: string;
}

const SacredHomeScreen = () => {
  const { selectedLanguage } = useLanguage();
  const { showJoinUs } = useJoinUs();

  const [sacredEvents, setSacredEvents] = useState<SacredEvent[]>([]);
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    const fetchSacredEvents = () => {
      const eventsRef = ref(realtimeDb, 'sacred_events');
      onValue(eventsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setSacredEvents(Object.values(data));
        }
      });
    };

    fetchSacredEvents();
  }, [selectedLanguage]);



  return (
    <Fragment>
    <SafeAreaView style={{flex: 0, backgroundColor: '#1a1a2e'}}></SafeAreaView>
    <SafeAreaView style={styles.container}>
      {/* Header with Greeting */}
      <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <FontAwesome5 name="home" size={24} color="#e94560" style={{ marginRight: 10 }} />
            <Text style={styles.greeting}>
              {selectedLanguage?.code === 'hin' ? 'जय श्री कृष्णा' : 'Welcome!'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.languageSelector}
            onPress={() => setSettingsVisible(true)}
          >
            <Text style={styles.languageLabel}>
              {selectedLanguage?.name || 'English'}
            </Text>
            <FontAwesome5 name="chevron-down" size={12} color="#e94560" />
          </TouchableOpacity>
        </View>
      <ScrollView style={styles.container}>
        
        {/* Home Carousel */}
        <HomeCarousel autoPlayInterval={5000} />



        {/* Join Us Section */}
        <View style={styles.section}>
          <View style={styles.joinUsCard}>
            <View style={styles.joinUsContent}>
              <Text style={styles.joinUsTitle}>
                {selectedLanguage?.code === 'hin' ? 'हमसे जुड़ें' : 'Join Us'}
              </Text>
              <Text style={styles.joinUsDescription}>
                {selectedLanguage?.code === 'hin' 
                  ? 'समुदाय की गतिविधियों के बारे में अपडेट रहें' 
                  : 'Stay updated on community activities'}
              </Text>
              <TouchableOpacity 
                style={styles.joinUsButton}
                onPress={showJoinUs}
              >
                <Text style={styles.joinUsButtonText}>
                  {selectedLanguage?.code === 'hin' ? 'शामिल हों' : 'Join Now'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sacred Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedLanguage?.code === 'hin' ? 'पवित्र कार्यक्रम' : 'Sacred Events'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {sacredEvents.map((event, index) => (
              <View key={index} style={styles.eventCard}>
                <Image 
                  source={{ uri: event.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200' }}
                  style={styles.eventImage}
                />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>
                    {event.title[selectedLanguage?.code as keyof typeof event.title] || event.title.en}
                  </Text>
                  <Text style={styles.eventDate}>{event.date}</Text>
                  <Text style={styles.eventDescription} numberOfLines={2}>
                    {event.description[selectedLanguage?.code as keyof typeof event.description] || event.description.en}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Community Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedLanguage?.code === 'hin' ? 'समुदाय आंकड़े' : 'Community Stats'}
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <FontAwesome5 name="users" size={24} color="#4CAF50" />
              <Text style={styles.statNumber}>1,234</Text>
              <Text style={styles.statLabel}>
                {selectedLanguage?.code === 'hin' ? 'सदस्य' : 'Members'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <FontAwesome5 name="pray" size={24} color="#FF9800" />
              <Text style={styles.statNumber}>567</Text>
              <Text style={styles.statLabel}>
                {selectedLanguage?.code === 'hin' ? 'प्रार्थना' : 'Prayers'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <FontAwesome5 name="heart" size={24} color="#e94560" />
              <Text style={styles.statNumber}>890</Text>
              <Text style={styles.statLabel}>
                {selectedLanguage?.code === 'hin' ? 'भक्ति' : 'Devotion'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Settings Modal */}
      <SettingsModal 
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  languageLabel: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },
  wisdomCard: {
    backgroundColor: '#1a1a2e',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#e94560',
  },
  wisdomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  wisdomTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e94560',
    marginLeft: 8,
  },
  wisdomQuote: {
    fontSize: 16,
    color: '#ffffff',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 10,
  },
  wisdomAuthor: {
    fontSize: 14,
    color: '#8b8b8b',
    textAlign: 'right',
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: (width - 60) / 2,
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  eventCard: {
    width: 200,
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventContent: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 12,
    color: '#e94560',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 12,
    color: '#8b8b8b',
    lineHeight: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8b8b8b',
    marginTop: 2,
  },
  joinUsCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#e94560',
  },
  joinUsContent: {
    alignItems: 'center',
  },
  joinUsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  joinUsDescription: {
    fontSize: 16,
    color: '#8b8b8b',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  joinUsButton: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  joinUsButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SacredHomeScreen; 