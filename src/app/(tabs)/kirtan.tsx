import React, { Fragment, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, Dimensions, Image } from 'react-native';
import { realtimeDb } from '../../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { usePlayer } from '../../providers/PlayerProvider';
import { useLanguage } from '../../providers/LanguageContext';
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
      <View key={index} style={styles.kirtanItem}>
        {/* Left Side - Thumbnail */}
        <View style={styles.thumbnailContainer}>
          <View style={styles.thumbnail}>
            <FontAwesome5 name="music" size={24} color="#ffffff" />
          </View>
          {/* Song Count Badge */}
          <View style={styles.songCountBadge}>
            <Text style={styles.songCountText}>{songCount}</Text>
          </View>
        </View>

        {/* Middle Section - Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.albumName}>{albumName}</Text>
          <View style={styles.dateContainer}>
            <FontAwesome5 name="calendar-alt" size={10} color="#e94560" style={styles.dateIcon} />
            <Text style={styles.year}>{uploadedDate}</Text>
          </View>
        </View>

        {/* Right Side - Actions */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={() => addToPlayList(index)}
          >
            <FontAwesome5 name="play" size={12} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: '#1a1a2e'}}></SafeAreaView>
        <SafeAreaView style={styles.container}>
          {/* Header Skeleton */}
          <View style={styles.header}>
            <MaterialIcons name="music-note" size={22} color="#e94560" style={{ marginRight: 10 }} />
            <SkeletonPlaceholder width={100} height={22} borderRadius={4} />
          </View>

          {/* Content Skeleton */}
          <ScrollView style={styles.scrollContainer}>
            {[1, 2, 3, 4, 5].map((index) => (
              <View key={index} style={styles.kirtanItem}>
                <View style={styles.thumbnailContainer}>
                  <SkeletonPlaceholder width={60} height={60} borderRadius={8} />
                  <SkeletonPlaceholder width={20} height={20} borderRadius={10} style={{ position: 'absolute', top: -5, right: -5 }} />
                </View>
                <View style={styles.contentContainer}>
                  <SkeletonPlaceholder width="80%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />
                  <SkeletonPlaceholder width="60%" height={14} borderRadius={4} style={{ marginBottom: 6 }} />
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
      <SafeAreaView style={{flex: 0, backgroundColor: '#1a1a2e'}}></SafeAreaView>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="music-note" size={22} color="#e94560" style={{ marginRight: 10 }} />
          <Text style={styles.headerTitle}>Kirtan</Text>
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
    backgroundColor: '#0f3460',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  kirtanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
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
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  albumName: {
    fontSize: 14,
    color: '#8b8b8b',
    marginBottom: 2,
  },
  year: {
    fontSize: 12,
    color: '#e94560',
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
    backgroundColor: '#e94560',
    borderRadius: 25,
    minWidth: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a2e',
  },
  songCountText: {
    color: '#ffffff',
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
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

});

export default Kirtan; 