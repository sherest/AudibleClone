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

export default function PlayerScreen() {
  const { player, book, currentAlbum, playNextSong, playPreviousSong, clearPlayer } = usePlayer();
  const { selectedLanguage } = useLanguage();
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
      <SafeAreaView className='flex-1 px-5 py-2 gap-4 relative'>
        <Pressable
          onPress={() => router.back()}
          className='absolute top-[60px] left-4 bg-gray-800 rounded-full p-2 z-20'
        >
          <Entypo name='chevron-down' size={24} color='white' />
        </Pressable>

        <View className='flex-1 justify-center items-center'>
          <Text className='text-white text-xl font-semibold text-center mb-4'>
            No Audio Playing
          </Text>
          <Text className='text-gray-400 text-center'>
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
    <SafeAreaView className='flex-1 px-5 py-2 gap-4 relative'>
      <Pressable
        onPress={() => router.back()}
        className='absolute top-[60px] left-4 bg-gray-800 rounded-full p-2 z-20'
      >
        <Entypo name='chevron-down' size={24} color='white' />
      </Pressable>

      {/* Album Name */}
      {isAlbumNameLoading ? (
        <SkeletonPlaceholder width="60%" height={24} borderRadius={4} style={{ alignSelf: 'center', marginBottom: 20 }} />
      ) : (
        <Text className='text-white text-lg font-semibold text-center mb-5'>
          {getLocalizedContent(currentAlbum?.albumName, 'eng') || 'Album'}
        </Text>
      )}

      {/* Album Cover */}
      {isThumbnailLoading ? (
        <SkeletonPlaceholder width="95%" height={300} borderRadius={30} style={{ alignSelf: 'center' }} />
      ) : (
        <Image
          source={{ uri: book.thumbnail_url }}
          className='w-[95%] aspect-square rounded-[30px] self-center'
        />
      )}

      <View className='gap-8 flex-1 justify-end'>
        {/* Title */}
        {isTitleLoading ? (
          <SkeletonPlaceholder width="80%" height={32} borderRadius={4} style={{ alignSelf: 'center' }} />
        ) : (
          <Text className='text-white text-xl font-bold text-center'
            numberOfLines={2}
            ellipsizeMode='tail'
          >
            {getLocalizedContent(book.title, 'eng') || 'Unknown Title'}
          </Text>
        )}

        {/* Author */}
        {book?.author && (
          <Text className='text-white text-lg text-center opacity-80'>
            {getLocalizedContent(book.author, 'eng') || 'Unknown Artist'}
          </Text>
        )}

        <PlaybackBar
          currentTime={playerStatus.currentTime}
          duration={playerStatus.duration}
          onSeek={(seconds: number) => player.seekTo(seconds)}
        />

        <View className='flex-row items-center justify-between'>
          <TouchableOpacity onPress={playPreviousSong}>
            <Ionicons name='play-skip-back' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity onPress={playPreviousSong}>
            <Ionicons name='play-back' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              playerStatus.playing ? player.pause() : player.play()
            }
          >
            <Ionicons
              name={playerStatus.playing ? 'pause' : 'play'}
              size={50}
              color='white'
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={playNextSong}>
            <Ionicons name='play-forward' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity onPress={playNextSong}>
            <Ionicons name='play-skip-forward' size={24} color='white' />
          </TouchableOpacity>
        </View>

        {/* Clear Player Button */}
        <TouchableOpacity
          onPress={clearPlayer}
          className='mt-6 self-center bg-red-600 px-6 py-3 rounded-full'
        >
          <Text className='text-white font-semibold'>Clear Player</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 