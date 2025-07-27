import { View, Text, Pressable, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import PlaybackBar from '@/components/PlaybackBar';

import { useAudioPlayerStatus } from 'expo-audio';
import { usePlayer } from '@/providers/PlayerProvider';

export default function PlayerScreen() {
  const { player, book, currentAlbum, currentSongIndex, albumSongs, playNextSong, playPreviousSong, setAlbum } = usePlayer();
  const playerStatus = useAudioPlayerStatus(player);

  return (
    <SafeAreaView className='flex-1  p-4 py-10 gap-4'>
      <Pressable
        onPress={() => router.back()}
        className='absolute top-16 left-4 bg-gray-800 rounded-full p-2'
      >
        <Entypo name='chevron-down' size={24} color='white' />
      </Pressable>

      <Image
        source={{ uri: book.thumbnail_url }}
        className='w-[95%] aspect-square rounded-[30px] self-center'
      />

      <View className='gap-8 flex-1 justify-end'>
        <Text className='text-white text-2xl font-bold text-center'>
          {book.title}
        </Text>

        {albumSongs.length > 1 && (
          <View className='bg-gray-800 rounded-lg p-4 max-h-32'>
            <Text className='text-white text-sm font-semibold mb-2'>Album Songs</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {albumSongs.map((song, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setAlbum(currentAlbum, index)}
                  className={`flex-row items-center justify-between py-2 px-2 rounded ${
                    index === currentSongIndex ? 'bg-red-600' : ''
                  }`}
                >
                  <View className='flex-1'>
                    <Text className={`text-sm ${index === currentSongIndex ? 'text-white font-bold' : 'text-gray-300'}`}>
                      {song.title?.eng || song.title?.hin || song.title?.ban || 'Unknown'}
                    </Text>
                    <Text className='text-xs text-gray-400'>
                      {song.singer?.eng || song.singer?.hin || song.singer?.ban || 'Unknown'}
                    </Text>
                  </View>
                  {index === currentSongIndex && (
                    <Ionicons name='play' size={16} color='white' />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
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
      </View>
    </SafeAreaView>
  );
} 