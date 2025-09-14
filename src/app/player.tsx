import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import PlaybackBar from '@/components/PlaybackBar';
import SkeletonPlaceholder from '@/components/SkeletonPlaceholder';

import { useAudioPlayerStatus } from 'expo-audio';
import { usePlayer } from '@/providers/PlayerProvider';
import { useLanguage } from '@/providers/LanguageContext';
import { useTheme } from '@/providers/ThemeProvider';

export default function PlayerScreen() {
  const { player, book, currentAlbum, playNextSong, playPreviousSong, clearPlayer } = usePlayer();
  const { selectedLanguage } = useLanguage();
  const { colors } = useTheme();
  const playerStatus = useAudioPlayerStatus(player);

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
        <SkeletonPlaceholder width="95%" height={300} borderRadius={30} style={{ alignSelf: 'center' }} />
      ) : (
        <Image
          source={{ uri: book.thumbnail_url }}
          style={{width: '95%', aspectRatio: 1, borderRadius: 30, alignSelf: 'center'}}
        />
      )}

      <View style={{gap: 32, flex: 1, justifyContent: 'flex-end'}}>
        {/* Title */}
        {isTitleLoading ? (
          <SkeletonPlaceholder width="80%" height={32} borderRadius={4} style={{ alignSelf: 'center' }} />
        ) : (
          <Text style={{color: colors.text.primary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}
            numberOfLines={2}
            ellipsizeMode='tail'
          >
            {getLocalizedContent(book.title, 'eng') || 'Unknown Title'}
          </Text>
        )}

        {/* Author */}
        {book?.author && (
          <Text style={{color: colors.text.primary, fontSize: 18, textAlign: 'center', opacity: 0.8}}>
            {getLocalizedContent(book.author, 'eng') || 'Unknown Artist'}
          </Text>
        )}

        <PlaybackBar
          currentTime={playerStatus.currentTime}
          duration={playerStatus.duration}
          onSeek={(seconds: number) => player.seekTo(seconds)}
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
              playerStatus.playing ? player.pause() : player.play()
            }
          >
            <Ionicons
              name={playerStatus.playing ? 'pause' : 'play'}
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