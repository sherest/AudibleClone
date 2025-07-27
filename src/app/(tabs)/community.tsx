import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useLanguage } from '../../providers/LanguageContext';
import { realtimeDb } from '../../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';

interface CommunityEvent {
  id: string;
  title: { [key: string]: string };
  date: string;
  time: string;
  location: { [key: string]: string };
  description: { [key: string]: string };
  image_url?: string;
  attendees: number;
}

interface CommunityPost {
  id: string;
  user: string;
  content: { [key: string]: string };
  timestamp: string;
  likes: number;
  comments: number;
  avatar_url?: string;
}

const CommunityScreen = () => {
  const { selectedLanguage } = useLanguage();
  const [communityEvents, setCommunityEvents] = useState<CommunityEvent[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const fetchCommunityEvents = () => {
      const eventsRef = ref(realtimeDb, 'community_events');
      onValue(eventsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCommunityEvents(Object.values(data));
        }
      });
    };

    const fetchCommunityPosts = () => {
      const postsRef = ref(realtimeDb, 'community_posts');
      onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCommunityPosts(Object.values(data));
        }
      });
    };

    fetchCommunityEvents();
    fetchCommunityPosts();
  }, [selectedLanguage]);

  const stats = [
    { label: { en: 'Members', hi: 'सदस्य' }, value: '1,234', icon: 'users' },
    { label: { en: 'Events', hi: 'कार्यक्रम' }, value: '45', icon: 'calendar' },
    { label: { en: 'Discussions', hi: 'चर्चाएं' }, value: '89', icon: 'comments' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <FontAwesome5 name="users" size={24} color="#e94560" />
        <Text style={styles.headerTitle}>
          {selectedLanguage?.code === 'hi' ? 'समुदाय' : 'Community'}
        </Text>
      </View>

      {/* Community Stats */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <FontAwesome5 name={stat.icon} size={20} color="#e94560" />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>
              {stat.label[selectedLanguage?.code as keyof typeof stat.label] || stat.label.en}
            </Text>
          </View>
        ))}
      </View>

      {/* Create Post */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedLanguage?.code === 'hi' ? 'अपना अनुभव साझा करें' : 'Share Your Experience'}
        </Text>
        <View style={styles.postInputContainer}>
          <TextInput
            style={styles.postInput}
            placeholder={selectedLanguage?.code === 'hi' ? 'अपना आध्यात्मिक अनुभव यहाँ लिखें...' : 'Share your spiritual experience here...'}
            placeholderTextColor="#8b8b8b"
            value={newPost}
            onChangeText={setNewPost}
            multiline
          />
          <TouchableOpacity style={styles.postButton}>
            <MaterialIcons name="send" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedLanguage?.code === 'hi' ? 'आगामी कार्यक्रम' : 'Upcoming Events'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {communityEvents.map((event, index) => (
            <View key={index} style={styles.eventCard}>
              <Image 
                source={{ uri: event.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200' }}
                style={styles.eventImage}
              />
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>
                  {event.title[selectedLanguage?.code as keyof typeof event.title] || event.title.en}
                </Text>
                <Text style={styles.eventDate}>{event.date} • {event.time}</Text>
                <Text style={styles.eventLocation}>
                  {event.location[selectedLanguage?.code as keyof typeof event.location] || event.location.en}
                </Text>
                <View style={styles.eventFooter}>
                  <Text style={styles.attendees}>{event.attendees} attending</Text>
                  <TouchableOpacity style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>
                      {selectedLanguage?.code === 'hi' ? 'शामिल हों' : 'Join'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Community Posts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedLanguage?.code === 'hi' ? 'समुदाय पोस्ट' : 'Community Posts'}
        </Text>
        {communityPosts.map((post, index) => (
          <View key={index} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image 
                source={{ uri: post.avatar_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=50' }}
                style={styles.avatar}
              />
              <View style={styles.postInfo}>
                <Text style={styles.postUser}>{post.user}</Text>
                <Text style={styles.postTime}>{post.timestamp}</Text>
              </View>
            </View>
            <Text style={styles.postContent}>
              {post.content[selectedLanguage?.code as keyof typeof post.content] || post.content.en}
            </Text>
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={16} color="#8b8b8b" />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={16} color="#8b8b8b" />
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={16} color="#8b8b8b" />
                <Text style={styles.actionText}>
                  {selectedLanguage?.code === 'hi' ? 'शेयर' : 'Share'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#1a1a2e',
    margin: 20,
    borderRadius: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8b8b8b',
    marginTop: 2,
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
  postInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 15,
    alignItems: 'flex-end',
  },
  postInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 40,
  },
  postButton: {
    backgroundColor: '#e94560',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  eventCard: {
    width: 250,
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
  eventLocation: {
    fontSize: 12,
    color: '#8b8b8b',
    marginBottom: 10,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendees: {
    fontSize: 12,
    color: '#8b8b8b',
  },
  joinButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  postCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postInfo: {
    marginLeft: 10,
  },
  postUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  postTime: {
    fontSize: 12,
    color: '#8b8b8b',
  },
  postContent: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#16213e',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    fontSize: 14,
    color: '#8b8b8b',
    marginLeft: 5,
  },
});

export default CommunityScreen; 