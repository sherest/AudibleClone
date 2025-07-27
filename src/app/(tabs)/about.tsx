import React, { useState, useEffect, Fragment } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLanguage } from '../../providers/LanguageContext';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../../lib/firebase';
import { FontAwesome5 } from '@expo/vector-icons';
import { useJoinUs } from '../../providers/JoinUsProvider';

interface AboutData {
  data: Array<{
    ban: string;
    eng: string;
    hin: string;
  }>;
  title: {
    ban: string;
    eng: string;
    hin: string;
  };
}

interface MenuData {
  amritaLahari: { [key: string]: string };
  community: { [key: string]: string };
  joinUs: { [key: string]: string };
  kirtan: { [key: string]: string };
  satprasanga: { [key: string]: string };
}

const AboutScreen = () => {
  const { selectedLanguage } = useLanguage();
  const { showJoinUs } = useJoinUs();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);

  const getLocalizedContent = (content: Record<string, string>, fallback: string = 'eng') => {
    const langCode = selectedLanguage?.code || fallback;
    return content[langCode] || content[fallback] || '';
  };

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      
      // Fetch about data
      const aboutRef = ref(realtimeDb, 'amrita_lahari/about');
      onValue(aboutRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setAboutData(data);
        }
      });

      // Fetch menu data
      const menuRef = ref(realtimeDb, 'menu');
      onValue(menuRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setMenuData(data);
        }
        setLoading(false);
      });
    };
    fetchData();
  }, [selectedLanguage]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  return (
    <Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: '#1a1a2e'}}></SafeAreaView>
        <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FontAwesome5 name="info-circle" size={24} color="#e94560" />
          <Text style={styles.headerTitle}>
            {aboutData?.title && getLocalizedContent(aboutData.title)}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        <View style={styles.contentCard}>
          {aboutData?.data.map((paragraph, index) => (
            <View key={index} style={styles.paragraphContainer}>
              <Text style={styles.paragraphText}>
                {getLocalizedContent(paragraph)}
              </Text>
            </View>
          ))}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#16213e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 15,
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
  content: {
    flex: 1,
    padding: 20,
  },
  contentCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  paragraphContainer: {
    marginBottom: 20,
  },
  paragraphText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    textAlign: 'justify',
  },
});

export default AboutScreen; 