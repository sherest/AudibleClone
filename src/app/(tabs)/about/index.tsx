import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';

import { useLanguage } from '../../../providers/LanguageContext';
import { useTheme } from '../../../providers/ThemeProvider';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../../../lib/firebase';
import { FontAwesome5 } from '@expo/vector-icons';
import { useJoinUs } from '../../../providers/JoinUsProvider';
import SkeletonPlaceholder from '../../../components/SkeletonPlaceholder';
import AboutList from '../../../components/AboutList';
import { AboutItem } from '../../../hooks/useAboutScreen';
import { useFonts } from '../../../lib/useFonts';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import amritaLahariData from '../../../../assets/amrita_lehri.json';

interface MenuData {
  amritaLahari: { [key: string]: string };
  community: { [key: string]: string };
  joinUs: { [key: string]: string };
  kirtan: { [key: string]: string };
  satprasanga: { [key: string]: string };
}

const AboutScreen = () => {
  const { selectedLanguage } = useLanguage();
  const { colors } = useTheme();
  const { showJoinUs } = useJoinUs();
  const { fontsLoaded, fontError } = useFonts();
  const [aboutItems, setAboutItems] = useState<AboutItem[]>([]);
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSeenAboutModal, setHasSeenAboutModal] = useState<boolean | null>(null);
  const router = useRouter();

  const getLocalizedContent = (content: Record<string, string>, fallback: string = 'eng') => {
    const langCode = selectedLanguage?.code || fallback;
    return content[langCode] || content[fallback] || '';
  };

  const handleItemPress = (item: AboutItem) => {
    router.push({
      pathname: '/about/detail',
      params: { 
        id: item.id.toString(),
        title: item.title,
        content: item.content
      }
    });
  };

  // Check if user has seen the about modal
  useEffect(() => {
    const checkModalStatus = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('hasSeenAboutModal');
        setHasSeenAboutModal(hasSeen === 'true');
      } catch (error) {
        console.error('Error checking modal status:', error);
        setHasSeenAboutModal(false);
      }
    };
    checkModalStatus();
  }, []);

  // Show modal when user first navigates to about screen
  useFocusEffect(
    useCallback(() => {
      if (hasSeenAboutModal === false) {
        router.push('/about-modal');
        // Mark as seen after showing
        AsyncStorage.setItem('hasSeenAboutModal', 'true');
        setHasSeenAboutModal(true);
      }
    }, [hasSeenAboutModal, router])
  );

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      
      // Fetch menu data
      const menuRef = ref(realtimeDb, 'menu');
      onValue(menuRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setMenuData(data);
        }
      });

      // Load JSON data for list
      try {
        const items: AboutItem[] = amritaLahariData.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
        }));
        setAboutItems(items);
        setLoading(false);
      } catch (error) {
        console.error('Error loading Amrita Lahari data:', error);
        setLoading(false);
      }
    };
    
    // Only fetch data when fonts are loaded
    if (fontsLoaded) {
      fetchData();
    }
  }, [selectedLanguage, fontsLoaded]);

  if (loading || !fontsLoaded) {
    return (
      <Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: colors.background.secondary}}></SafeAreaView>
        <SafeAreaView style={[styles.container, {backgroundColor: colors.background.primary}]}>
          {/* Header Skeleton */}
          <View style={[styles.header, {backgroundColor: colors.background.secondary}]}>
            <View style={styles.headerLeft}>
              <FontAwesome5 name="info-circle" size={22} color={colors.primary} />
              <SkeletonPlaceholder width={150} height={22} borderRadius={4} style={{ marginLeft: 15 }} />
            </View>
          </View>

          {/* Content Skeleton */}
          <View style={styles.content}>
            <View style={[styles.contentCard, {backgroundColor: colors.background.secondary}]}>
              {fontError ? (
                <Text style={[styles.paragraphText, {color: colors.text.primary}]}>
                  Font loading error: {fontError}
                </Text>
              ) : (
                [1, 2, 3, 4].map((index) => (
                  <View key={index} style={styles.paragraphContainer}>
                    <SkeletonPlaceholder width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                    <SkeletonPlaceholder width="95%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                    <SkeletonPlaceholder width="90%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                    <SkeletonPlaceholder width="85%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                  </View>
                ))
              )}
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }

  return (
    <AboutList
      items={aboutItems}
      onItemPress={handleItemPress}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contentCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  paragraphContainer: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  paragraphText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
});

export default AboutScreen;
