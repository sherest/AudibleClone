import React, { Fragment, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLanguage } from '../../providers/LanguageContext';
import { useJoinUs } from '../../providers/JoinUsProvider';
import { realtimeDb } from '../../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { FontAwesome5 } from '@expo/vector-icons';

interface Event {
  title: { [key: string]: string };
  description: { [key: string]: string };
  when: { [key: string]: string };
}

interface Message {
  name: string;
  message: string;
  date: string;
  time: string;
  email: string;
  phone: number;
}

interface BiographyData {
  ban: string;
  eng: string;
  hin: string;
  [key: string]: string;
}

interface CommunityData {
  events: {
    data: Event[];
    lang: string;
  };
  messages: {
    data: Message[];
    fields: {
      add_your_message: { [key: string]: string };
    };
    announcement?: { [key: string]: string };
  };
  biography: {
    data: BiographyData[];
  };
  tabs: {
    events: { [key: string]: string };
    messages: { [key: string]: string };
    biography: { [key: string]: string };
  };
}

const CommunityScreen = () => {
  const { selectedLanguage } = useLanguage();
  const { showJoinUs } = useJoinUs();
  const [activeTab, setActiveTab] = useState<'events' | 'messages' | 'biography'>('events');
  const [communityData, setCommunityData] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to safely get localized content
  const getLocalizedContent = (content: Record<string, string>, fallback: string = 'eng') => {
    const langCode = selectedLanguage?.code || fallback;
    return content[langCode] || content[fallback] || '';
  };

  useEffect(() => {
    const fetchCommunityData = () => {
      setLoading(true);
      const communityRef = ref(realtimeDb, 'community');
      onValue(communityRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCommunityData(data);
        }
        setLoading(false);
      });
    };

    fetchCommunityData();
  }, [selectedLanguage]);

  const tabs = [
    { key: 'events', icon: 'calendar-alt' },
    { key: 'messages', icon: 'envelope' },
    { key: 'biography', icon: 'user' },
  ];

  if (loading) {
    return (
      <Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: '#1a1a2e'}}></SafeAreaView>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#e94560" />
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }

  const renderEventsContent = () => {
    if (!communityData?.events?.data) return null;
    
    return (
      <View style={styles.section}>
        {communityData.events.data.map((event, index) => (
          <View key={index} style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <FontAwesome5 name="calendar-alt" size={16} color="#e94560" />
              <Text style={styles.eventTitle}>
                {getLocalizedContent(event.title)}
              </Text>
            </View>
            <Text style={styles.eventDescription}>
              {getLocalizedContent(event.description)}
            </Text>
            <Text style={styles.eventDate}>
              {getLocalizedContent(event.when)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderMessagesContent = () => {
    if (!communityData?.messages?.data) return null;
    
    return (
      <View style={styles.section}>
        {communityData.messages.data.map((message, index) => (
          <View key={index} style={styles.messageCard}>
            <View style={styles.messageHeader}>
              <FontAwesome5 name="user" size={16} color="#e94560" />
              <Text style={styles.messageName}>{message.name}</Text>
            </View>
            <Text style={styles.messageText}>{message.message}</Text>
            <Text style={styles.messageTime}>{message.date} {message.time}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderBiographyContent = () => {
    if (!communityData?.biography?.data) return null;
    
    return (
      <View style={styles.section}>
        <View style={styles.biographyCard}>
          {communityData.biography.data.map((paragraph, index) => (
            <Text key={index} style={styles.biographyText}>
              {getLocalizedContent(paragraph)}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return renderEventsContent();
      case 'messages':
        return renderMessagesContent();
      case 'biography':
        return renderBiographyContent();
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: '#1a1a2e'}}></SafeAreaView>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <FontAwesome5 name="users" size={24} color="#e94560" />
          <Text style={styles.headerTitle}>
            {selectedLanguage?.code === 'hin' ? 'समुदाय' : 'Community'}
          </Text>
          <TouchableOpacity style={styles.joinUsButton} onPress={showJoinUs}>
            <Text style={styles.joinUsButtonText}>
              {selectedLanguage?.code === 'hin' ? 'शामिल हों' : 'Join Us'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                activeTab === tab.key && styles.activeTabButton
              ]}
              onPress={() => setActiveTab(tab.key as 'events' | 'messages' | 'biography')}
            >
              <FontAwesome5 
                name={tab.icon} 
                size={16} 
                color={activeTab === tab.key ? '#e94560' : '#8b8b8b'} 
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText
              ]}>
                {communityData && getLocalizedContent(communityData.tabs[tab.key as keyof typeof communityData.tabs])}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>

        {/* Floating Action Button - Only visible in Messages tab */}
        {activeTab === 'messages' && communityData?.messages?.announcement && (
          <TouchableOpacity 
            style={styles.fab}
            onPress={() => {
              const announcement = communityData.messages.announcement!;
              const message = getLocalizedContent(announcement);
              alert(message);
            }}
          >
            <FontAwesome5 name="plus" size={20} color="#ffffff" />
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3460',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 1,
  },
  joinUsButton: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  joinUsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: '#16213e',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b8b8b',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#e94560',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  eventDescription: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
    lineHeight: 24,
  },
  eventDate: {
    fontSize: 14,
    color: '#e94560',
    fontWeight: '600',
  },
  messageCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  messageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
    lineHeight: 24,
  },
  messageTime: {
    fontSize: 14,
    color: '#8b8b8b',
  },
  biographyCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
  },
  biographyText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'justify',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});

export default CommunityScreen; 