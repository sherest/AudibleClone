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
  coverPath?: string;
  coverPathRequest?: boolean;
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
  const { setBook } = usePlayer();
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

  const getCoverImage = async (index: number) => {
    const oKirtan = kirtanData[index];
    if (!oKirtan.coverPathRequest) {
      oKirtan.coverPathRequest = true;
      try {
        const storage = getStorage();
        const fileReference = await getDownloadURL(storageRef(storage, basePath.image + oKirtan.cover));
        oKirtan.coverPath = fileReference;
        setKirtanData([...kirtanData]); // Trigger re-render
      } catch (error) {
        console.error('Error loading cover image:', error);
        // Use fallback music icon if Firebase Storage image is not available
        oKirtan.coverPath = musicIcon;
      }
    }
    return oKirtan.coverPath;
  };

  const addToPlayList = async (index: number) => {
    const oKirtan = kirtanData[index];
    const audioUrl = basePath.audio + oKirtan.songs[0]?.fileName;

    // Ensure coverPath is fetched
    const coverPath = await getCoverImage(index);

    const book = {
      id: `kirtan-${index}`,
      title: getLocalizedContent(oKirtan.title),
      author: getLocalizedContent(oKirtan.songs[0]?.singer || { eng: 'Unknown' }),
      audio_url: audioUrl,
      thumbnail_url: coverPath
    };
    setBook(book);
  };

  const renderKirtanItem = (kirtan: KirtanData, index: number) => {
    const title = getLocalizedContent(kirtan.title);
    const author = getLocalizedContent(kirtan.songs[0]?.singer || { eng: 'Unknown' });

    return (
      <View key={index} style={styles.kirtanItem}>
        {/* Left Side - Thumbnail */}
        <View style={styles.thumbnailContainer}>
          {kirtan.coverPath ? (
            <Image 
              source={typeof kirtan.coverPath === 'string' ? { uri: kirtan.coverPath } : kirtan.coverPath}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.thumbnail}>
              <FontAwesome5 name="music" size={24} color="#ffffff" />
            </View>
          )}
        </View>

        {/* Middle Section - Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.author}>By {author}</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '0%' }]} />
            </View>
            <Text style={styles.progressText}>Not started</Text>
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
                <SkeletonPlaceholder width={60} height={60} borderRadius={8} />
                <View style={styles.contentContainer}>
                  <SkeletonPlaceholder width="80%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />
                  <SkeletonPlaceholder width="60%" height={14} borderRadius={4} style={{ marginBottom: 12 }} />
                  <SkeletonPlaceholder width="100%" height={4} borderRadius={2} style={{ marginBottom: 4 }} />
                  <SkeletonPlaceholder width="40%" height={12} borderRadius={4} />
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
    padding: 8,
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
  author: {
    fontSize: 14,
    color: '#8b8b8b',
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2a2a3e',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e94560',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#8b8b8b',
  },
  actionContainer: {
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

});

export default Kirtan; 