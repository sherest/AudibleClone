import React, { useState, useEffect, Fragment } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';

import { useLanguage } from '../../providers/LanguageContext';
import { useTheme } from '../../providers/ThemeProvider';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../../lib/firebase';
import { FontAwesome5 } from '@expo/vector-icons';
import { useJoinUs } from '../../providers/JoinUsProvider';
import SkeletonPlaceholder from '../../components/SkeletonPlaceholder';
import AboutModal from '../../components/AboutModal';
import AboutList from '../../components/AboutList';
import AboutDetail from '../../components/AboutDetail';
import { useAboutScreen, AboutItem } from '../../hooks/useAboutScreen';

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
  const { colors } = useTheme();
  const { showJoinUs } = useJoinUs();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [aboutItems, setAboutItems] = useState<AboutItem[]>([]);
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const {
    currentView,
    selectedItem,
    hasSeenModal,
    closeModal,
    navigateToDetail,
    navigateBackToList,
  } = useAboutScreen();

  // Fallback if hook fails
  if (!currentView) {
    return (
      <Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: colors.background.secondary}}></SafeAreaView>
        <SafeAreaView style={[styles.container, {backgroundColor: colors.background.primary}]}>
          <View style={[styles.header, {backgroundColor: colors.background.secondary}]}>
            <View style={styles.headerLeft}>
              <FontAwesome5 name="info-circle" size={22} color={colors.primary} />
              <Text style={[styles.headerTitle, {color: colors.text.primary}]}>
                About
              </Text>
            </View>
          </View>
          <View style={styles.content}>
            <View style={[styles.contentCard, {backgroundColor: colors.background.secondary}]}>
              <Text style={[styles.paragraphText, {color: colors.text.primary}]}>
                Loading...
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }

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
        try {
          const data = snapshot.val();
          if (data) {
            setAboutData(data);
            // Convert about data to list items
            if (data.data && Array.isArray(data.data)) {
              const items: AboutItem[] = data.data.map((item: any, index: number) => ({
                id: `about-${index}`,
                title: item.title || { ban: '', eng: '', hin: '' },
                description: {
                  ban: item.ban ? item.ban.substring(0, 100) + '...' : '',
                  eng: item.eng ? item.eng.substring(0, 100) + '...' : '',
                  hin: item.hin ? item.hin.substring(0, 100) + '...' : '',
                },
                content: {
                  ban: item.ban || '',
                  eng: item.eng || '',
                  hin: item.hin || '',
                },
              }));
              setAboutItems(items);
            } else {
              // If no data, create some default items
              const defaultItems: AboutItem[] = [
                {
                  id: 'about-1',
                  title: { ban: 'About Us', eng: 'About Us', hin: 'हमारे बारे में' },
                  description: { ban: 'Learn more about our mission...', eng: 'Learn more about our mission...', hin: 'हमारे मिशन के बारे में और जानें...' },
                  content: { ban: 'Default content', eng: 'Default content', hin: 'डिफ़ॉल्ट सामग्री' },
                }
              ];
              setAboutItems(defaultItems);
            }
          } else {
            // If no data from Firebase, create default items
            const defaultItems: AboutItem[] = [
              {
                id: 'about-1',
                title: { ban: 'About Us', eng: 'About Us', hin: 'हमारे बारे में' },
                description: { ban: 'Learn more about our mission...', eng: 'Learn more about our mission...', hin: 'हमारे मिशन के बारे में और जानें...' },
                content: { ban: 'Default content', eng: 'Default content', hin: 'डिफ़ॉल्ट सामग्री' },
              }
            ];
            setAboutItems(defaultItems);
          }
        } catch (error) {
          console.error('Error processing about data:', error);
          // Set default items on error
          const defaultItems: AboutItem[] = [
            {
              id: 'about-1',
              title: { ban: 'About Us', eng: 'About Us', hin: 'हमारे बारे में' },
              description: { ban: 'Learn more about our mission...', eng: 'Learn more about our mission...', hin: 'हमारे मिशन के बारे में और जानें...' },
              content: { ban: 'Default content', eng: 'Default content', hin: 'डिफ़ॉल्ट सामग्री' },
            }
          ];
          setAboutItems(defaultItems);
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

  if (loading || hasSeenModal === null) {
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
              {[1, 2, 3, 4].map((index) => (
                <View key={index} style={styles.paragraphContainer}>
                  <SkeletonPlaceholder width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                  <SkeletonPlaceholder width="95%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                  <SkeletonPlaceholder width="90%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                  <SkeletonPlaceholder width="85%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                </View>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }

  return (
    <Fragment>
      {/* Modal for first-time users */}
      {currentView === 'modal' && (
        <AboutModal
          visible={true}
          onClose={closeModal}
          aboutData={aboutData}
        />
      )}

      {/* List view for returning users */}
      {currentView === 'list' && (
        <AboutList
          items={aboutItems}
          onItemPress={navigateToDetail}
        />
      )}

      {/* Detail view for selected item */}
      {currentView === 'detail' && selectedItem && (
        <AboutDetail
          item={selectedItem}
          onBack={navigateBackToList}
        />
      )}
    </Fragment>
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