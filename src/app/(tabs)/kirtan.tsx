import React, { Fragment, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, Dimensions, Image } from 'react-native';
import { realtimeDb } from '../../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { usePlayer } from '../../providers/PlayerProvider';
import { useLanguage } from '../../providers/LanguageContext';
import { useTheme } from '../../providers/ThemeProvider';
import SkeletonPlaceholder from '../../components/SkeletonPlaceholder';

// Import fallback music icon
const musicIcon = require('../../../assets/img/music-icon.png');

const { width } = Dimensions.get('window');

interface Song {
  fileName: string;
  singer: {
    eng: string;
    hin: string;
    ban: string;
  };
  title: {
    eng: string;
    hin: string;
    ban: string;
  };
}

interface KirtanData {
  albumName: {
    eng: string;
    hin: string;
    ban: string;
  };
  cover: string;
  description: {
    eng: string;
    hin: string;
    ban: string;
  };
  songs: Song[];
  title: {
    eng: string;
    hin: string;
    ban: string;
  };
  uploaded: string;
  year: string;
}

const Kirtan = () => {
  const { setAlbum } = usePlayer();
  const { selectedLanguage } = useLanguage();
  const { colors } = useTheme();
  const [kirtanData, setKirtanData] = useState<KirtanData[]>([]);
  const [basePath, setBasePath] = useState({ image: '', audio: '' });
  const [loading, setLoading] = useState(true);

  const getLocalizedContent = (content: Record<string, string>, fallback: string = 'eng') => {
    const langCode = selectedLanguage?.code || fallback;
    return content[langCode] || content[fallback] || '';
  };

  useEffect(() => {
    const fetchKirtanData = () => {
      setLoading(true);
      const kirtanRef = ref(realtimeDb, 'kirtan');
      onValue(kirtanRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setKirtanData(data.data || []);
          setBasePath({
            image: data.basePath.image,
            audio: data.isFirebaseAudio ? data.basePath.audio : data.fallbackBasePath.audio,
          });
          

        }
        setLoading(false);
      });
    };

    fetchKirtanData();
  }, [selectedLanguage]);





  const addToPlayList = async (index: number) => {
    const oKirtan = kirtanData[index];
    
    // Fetch Firebase Storage image for the player
    let coverPath = musicIcon;
    try {
      const storage = getStorage();
      const fileReference = await getDownloadURL(storageRef(storage, basePath.image + oKirtan.cover));
      coverPath = fileReference;
    } catch (error) {
      console.error('Error loading cover image for player:', error);
      // Use fallback music icon if Firebase Storage image is not available
    }

    // Add basePath to album data for audio URL construction
    const albumWithBasePath = {
      ...oKirtan,
      basePath: basePath,
      coverPath: coverPath
    };

    // Set the album with the first song (index 0)
    setAlbum(albumWithBasePath, 0);
    
    // Don't auto-play - let user manually start playback from mini-player or full player
    // This prevents the native shared object error
  };

  const renderKirtanItem = (kirtan: KirtanData, index: number) => {
    const title = getLocalizedContent(kirtan.title);
    const albumName = getLocalizedContent(kirtan.albumName);
    const songCount = kirtan.songs?.length || 0;
    
    // Format uploaded date (e.g., "2021-12-13" -> "Dec 13, 2021")
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    };
    const uploadedDate = formatDate(kirtan.uploaded);

    return (
      <View key={index} style={[styles.kirtanItem, {backgroundColor: colors.background.secondary}]}>
        {/* Left Side - Thumbnail */}
        <View style={styles.thumbnailContainer}>
          <View style={[styles.thumbnail, {backgroundColor: colors.primary}]}>
            <FontAwesome5 name="music" size={24} color={colors.text.primary} />
          </View>
          {/* Song Count Badge */}
          <View style={[styles.songCountBadge, {backgroundColor: colors.primary, borderColor: colors.background.secondary}]}>
            <Text style={[styles.songCountText, {color: colors.text.primary}]}>{songCount}</Text>
          </View>
        </View>

        {/* Middle Section - Content */}
        <View style={styles.contentContainer}>
          <Text style={[styles.albumName, {color: colors.text.primary}]}>{albumName}</Text>
          <Text style={[styles.title, {color: colors.text.secondary}]} numberOfLines={1}>{title}</Text>
          <View style={styles.dateContainer}>
            <FontAwesome5 name="calendar-alt" size={10} color={colors.primary} style={styles.dateIcon} />
            <Text style={[styles.year, {color: colors.primary}]}>{uploadedDate}</Text>
          </View>
        </View>

        {/* Right Side - Actions */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.playButton, {borderColor: colors.text.primary}]}
            onPress={() => addToPlayList(index)}
          >
            <FontAwesome5 name="play" size={12} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: colors.background.secondary}}></SafeAreaView>
        <SafeAreaView style={[styles.container, {backgroundColor: colors.background.primary}]}>
          {/* Header Skeleton */}
          <View style={[styles.header, {backgroundColor: colors.background.secondary}]}>
            <MaterialIcons name="music-note" size={22} color={colors.primary} style={{ marginRight: 10 }} />
            <SkeletonPlaceholder width={100} height={22} borderRadius={4} />
          </View>

          {/* Content Skeleton */}
          <ScrollView style={styles.scrollContainer}>
            {[1, 2, 3, 4, 5].map((index) => (
              <View key={index} style={[styles.kirtanItem, {backgroundColor: colors.background.secondary}]}>
                <View style={styles.thumbnailContainer}>
                  <SkeletonPlaceholder width={60} height={60} borderRadius={8} />
                  <SkeletonPlaceholder width={20} height={20} borderRadius={10} style={{ position: 'absolute', top: -5, right: -5 }} />
                </View>
                <View style={styles.contentContainer}>
                  <SkeletonPlaceholder width="60%" height={16} borderRadius={4} style={{ marginBottom: 4 }} />
                  <SkeletonPlaceholder width="80%" height={14} borderRadius={4} style={{ marginBottom: 6 }} />
                  <View style={styles.dateContainer}>
                    <SkeletonPlaceholder width={10} height={10} borderRadius={5} style={{ marginRight: 4 }} />
                    <SkeletonPlaceholder width="50%" height={12} borderRadius={4} />
                  </View>
                </View>
                <View style={styles.actionContainer}>
                  <SkeletonPlaceholder width={40} height={40} borderRadius={20} />
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: colors.background.secondary}}></SafeAreaView>
      <SafeAreaView style={[styles.container, {backgroundColor: colors.background.primary}]}>
        {/* Header */}
        <View style={[styles.header, {backgroundColor: colors.background.secondary}]}>
          <MaterialIcons name="music-note" size={22} color={colors.primary} style={{ marginRight: 10 }} />
          <Text style={[styles.headerTitle, {color: colors.text.primary}]}>Kirtan</Text>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {kirtanData.map((kirtan, index) => renderKirtanItem(kirtan, index))}
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3460', // This will be overridden by theme
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e', // This will be overridden by theme
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff', // This will be overridden by theme
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  kirtanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e', // This will be overridden by theme
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#e94560', // This will be overridden by theme
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 14,
    color: '#8b8b8b', // This will be overridden by theme
    marginBottom: 2,
  },
  albumName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff', // This will be overridden by theme
    marginBottom: 4,
  },
  year: {
    fontSize: 12,
    color: '#e94560', // This will be overridden by theme
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 4,
  },
  songCountBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e94560', // This will be overridden by theme
    borderRadius: 25,
    minWidth: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a2e', // This will be overridden by theme
  },
  songCountText: {
    color: '#ffffff', // This will be overridden by theme
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionContainer: {
    alignItems: 'center',
  },
  playButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff', // This will be overridden by theme
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

});

export default Kirtan; 