import { View, Text, Pressable, Image, TouchableOpacity, ImageBackground, StyleSheet, Animated } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';

import PlaybackBar from '@/components/PlaybackBar';
import SkeletonPlaceholder from '@/components/SkeletonPlaceholder';

import { usePlayer } from '@/providers/PlayerProvider';
import { useLanguage } from '@/providers/LanguageContext';
import { useTheme } from '@/providers/ThemeProvider';

export default function PlayerScreen() {
  const { book, currentAlbum, playNextSong, playPreviousSong, clearPlayer, isPlaying, currentTime, duration, play, pause, seekTo } = usePlayer();
  const { selectedLanguage } = useLanguage();
  const { colors } = useTheme();
  const [showMore, setShowMore] = useState(false);
  
  // Animation values
  const animatedWidth = useRef(new Animated.Value(65)).current; // Start with collapsed size
  const animatedHeight = useRef(new Animated.Value(250)).current;

  // Animation effect
  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedWidth, {
        toValue: showMore ? 50 : 65,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedHeight, {
        toValue: showMore ? 200 : 250,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [showMore]);

  // Debug logging
  console.log('Player Debug:', { 
    book: book ? { title: book.title, author: book.author } : null,
    currentAlbum: currentAlbum ? { albumName: currentAlbum.albumName } : null,
    selectedLanguage 
  });

  const getLocalizedContent = (content: any, fallback: string = 'eng') => {
    if (!content) return '';
    
    // If content is already a string, return it directly
    if (typeof content === 'string') {
      console.log('Content is string, returning directly:', content);
      return content;
    }
    
    // If content is an object with language keys
    if (typeof content === 'object' && content !== null) {
      const langCode = selectedLanguage?.code || fallback;
      const result = content[langCode] || content[fallback] || '';
      console.log('Localization:', { content, langCode, result });
      return result;
    }
    
    return '';
  };

  // If no book is loaded, show empty state
  if (!book) {
    return (
      <SafeAreaView style={{flex: 1, paddingHorizontal: 20, paddingVertical: 8, gap: 16, backgroundColor: colors.background.primary}}>
        <Pressable
          onPress={() => router.back()}
          style={{position: 'absolute', top: 60, left: 16, backgroundColor: colors.background.secondary, borderRadius: 20, padding: 8, zIndex: 20}}
        >
          <Entypo name='chevron-down' size={24} color={colors.text.primary} />
        </Pressable>

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: colors.text.primary, fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 16}}>
            No Audio Playing
          </Text>
          <Text style={{color: colors.text.secondary, textAlign: 'center'}}>
            Select an album from Kirtan or Satprasanga to start playing
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Check if data is loading
  const isThumbnailLoading = !book?.thumbnail_url || book.thumbnail_url === require('../../assets/img/music-icon.png');
  const isTitleLoading = !book?.title;
  const isAlbumNameLoading = !currentAlbum?.albumName;

  return (
    <SafeAreaView style={{flex: 1, paddingHorizontal: 20, paddingVertical: 8, gap: 16, backgroundColor: colors.background.primary}}>
      {/* Background Image */}
      <ImageBackground 
        source={require('../../assets/gurujibackground.png')} 
        style={styles.backgroundImage}
        resizeMode="repeat"
      />
      <Pressable
        onPress={() => router.back()}
        style={{position: 'absolute', top: 60, left: 16, backgroundColor: colors.background.secondary, borderRadius: 20, padding: 8, zIndex: 20}}
      >
        <Entypo name='chevron-down' size={24} color={colors.text.primary} />
      </Pressable>

      {/* Album Name */}
      {isAlbumNameLoading ? (
        <SkeletonPlaceholder width="60%" height={24} borderRadius={4} style={{ alignSelf: 'center', marginBottom: 20 }} />
      ) : (
        <Text style={{color: colors.text.primary, fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 20}}>
          {getLocalizedContent(currentAlbum?.albumName, 'eng') || 'Album'}
        </Text>
      )}

      {/* Album Cover */}
      {isThumbnailLoading ? (
        <Animated.View style={{ alignSelf: 'center' }}>
          <SkeletonPlaceholder 
            width="65%" 
            height={250} 
            borderRadius={30} 
            style={{ alignSelf: 'center' }} 
          />
        </Animated.View>
      ) : (
        <Animated.Image
          source={{ uri: book.thumbnail_url }}
          style={{
            width: animatedWidth.interpolate({
              inputRange: [50, 65],
              outputRange: ['45%', '65%'],
            }), 
            aspectRatio: 1, 
            borderRadius: 30, 
            alignSelf: 'center'
          }}
        />
      )}

      <View style={{gap: 32, flex: 1, justifyContent: 'flex-end'}}>
        {/* Title */}
        {isTitleLoading ? (
          <SkeletonPlaceholder width="80%" height={32} borderRadius={4} style={{ alignSelf: 'center' }} />
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Text style={{color: colors.text.primary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}
              numberOfLines={showMore ? undefined : 2}
              ellipsizeMode='tail'
            >
              {getLocalizedContent(book.title, 'eng') || 'Unknown Title'}
            </Text>
            <TouchableOpacity 
              onPress={() => setShowMore(!showMore)}
              style={{ marginTop: 8, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: colors.background.secondary, borderRadius: 12 }}
            >
              <Text style={{ color: colors.text.primary, fontSize: 14, fontWeight: '600' }}>
                {showMore ? 'Less' : 'More'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Author */}
        {book?.author && (
          <Text style={{color: colors.text.primary, fontSize: 18, textAlign: 'center', opacity: 0.8}}>
            {getLocalizedContent(book.author, 'eng') || 'Unknown Artist'}
          </Text>
        )}

        <PlaybackBar
          currentTime={currentTime}
          duration={duration}
          onSeek={(seconds: number) => seekTo(seconds)}
        />

        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={playPreviousSong}>
            <Ionicons name='play-skip-back' size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={playPreviousSong}>
            <Ionicons name='play-back' size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              isPlaying ? pause() : play()
            }
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={50}
              color={colors.text.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={playNextSong}>
            <Ionicons name='play-forward' size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={playNextSong}>
            <Ionicons name='play-skip-forward' size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Clear Player Button */}
        <TouchableOpacity
          onPress={clearPlayer}
          style={{marginTop: 24, alignSelf: 'center', backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20}}
        >
          <Text style={{color: colors.background.secondary, fontWeight: '600'}}>Clear Player</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.65,
    zIndex: -1,
  },
}); 