import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { useLanguage } from '../../providers/LanguageContext';
import { realtimeDb } from '../../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import SettingsModal from '../settings';

const { width } = Dimensions.get('window');

interface DailyWisdom {
  id: string;
  quote: { [key: string]: string };
  author: { [key: string]: string };
  category: string;
}

interface SacredEvent {
  id: string;
  title: { [key: string]: string };
  date: string;
  description: { [key: string]: string };
  image_url?: string;
}

const SacredHomeScreen = () => {
  const { selectedLanguage } = useLanguage();
  const [dailyWisdom, setDailyWisdom] = useState<DailyWisdom | null>(null);
  const [sacredEvents, setSacredEvents] = useState<SacredEvent[]>([]);
  const [quickActions, setQuickActions] = useState<any>({});
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    console.log('Current selected language:', selectedLanguage);
    
    const fetchDailyWisdom = () => {
      const wisdomRef = ref(realtimeDb, 'daily_wisdom');
      onValue(wisdomRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setDailyWisdom(data);
        }
      });
    };

    const fetchSacredEvents = () => {
      const eventsRef = ref(realtimeDb, 'sacred_events');
      onValue(eventsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setSacredEvents(Object.values(data));
        }
      });
    };

    const fetchQuickActions = () => {
      const actionsRef = ref(realtimeDb, 'quick_actions');
      onValue(actionsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setQuickActions(data);
        }
      });
    };

    fetchDailyWisdom();
    fetchSacredEvents();
    fetchQuickActions();
  }, [selectedLanguage]);

  const actionItems = [
    {
      id: 'meditation',
      icon: 'meditation',
                    title: { en: 'Meditation', hin: 'ध्यान' },
      color: '#4CAF50',
    },
    {
      id: 'prayer',
      icon: 'pray',
      title: { en: 'Daily Prayer', hin: 'दैनिक प्रार्थना' },
      color: '#FF9800',
    },
    {
      id: 'chanting',
      icon: 'music',
      title: { en: 'Sacred Chants', hin: 'पवित्र भजन' },
      color: '#9C27B0',
    },
    {
      id: 'community',
      icon: 'users',
      title: { en: 'Community', hin: 'समुदाय' },
      color: '#2196F3',
    },
  ];

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header with Greeting */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <FontAwesome5 name="sun" size={20} color="#FFD700" />
            <Text style={styles.greeting}>
              {selectedLanguage?.code === 'hin' ? 'जय श्री कृष्णा' : 'Jai Shri Krishna'}
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

        {/* Daily Wisdom Card */}
        {dailyWisdom && (
          <View style={styles.wisdomCard}>
            <View style={styles.wisdomHeader}>
              <FontAwesome5 name="quote-left" size={16} color="#e94560" />
              <Text style={styles.wisdomTitle}>
                {selectedLanguage?.code === 'hin' ? 'आज का ज्ञान' : 'Daily Wisdom'}
              </Text>
            </View>
            <Text style={styles.wisdomQuote}>
              "{dailyWisdom.quote[selectedLanguage?.code as keyof typeof dailyWisdom.quote] || dailyWisdom.quote.en}"
            </Text>
            <Text style={styles.wisdomAuthor}>
              — {dailyWisdom.author[selectedLanguage?.code as keyof typeof dailyWisdom.author] || dailyWisdom.author.en}
            </Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedLanguage?.code === 'hin' ? 'त्वरित कार्य' : 'Quick Actions'}
          </Text>
          <View style={styles.actionsGrid}>
            {actionItems.map((action) => (
              <TouchableOpacity key={action.id} style={styles.actionItem}>
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <FontAwesome5 name={action.icon} size={20} color="#ffffff" />
                </View>
                <Text style={styles.actionTitle}>
                  {action.title[selectedLanguage?.code as keyof typeof action.title] || action.title.en}
                </Text>
              </TouchableOpacity>
            ))}
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
    </>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
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
});

export default SacredHomeScreen; 