import { View, Text, Pressable, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import PlaybackBar from '@/components/PlaybackBar';

import { useAudioPlayerStatus } from 'expo-audio';
import { usePlayer } from '@/providers/PlayerProvider';
import { useSupabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';

export default function PlayerScreen() {
  const { player, book } = usePlayer();
  const playerStatus = useAudioPlayerStatus(player);

  // console.log(JSON.stringify(playerStatus, null, 2));

  const supabase = useSupabase();

  const downloadBook = async () => {
    if (!book.audio_file) {
      console.log('Not in supabase storage');
      return;
    }

    const { data } = await supabase.storage
      .from('audios')
      .getPublicUrl(book.audio_file);

    const downloadResumable = FileSystem.createDownloadResumable(
      data.publicUrl,
      `${FileSystem.documentDirectory}${book.id}.mp3`,
      {},
      (progress) => {
        console.log(progress);
      }
    );
    try {
      const result = await downloadResumable.downloadAsync();
      console.log(result?.uri);
    } catch (error) {
      console.log(error);
    }
  };

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

        <PlaybackBar
          currentTime={playerStatus.currentTime}
          duration={playerStatus.duration}
          onSeek={(seconds: number) => player.seekTo(seconds)}
        />

        <View className='flex-row items-center justify-between'>
          <Ionicons name='play-skip-back' size={24} color='white' />
          <Ionicons name='play-back' size={24} color='white' />
          <Ionicons
            onPress={() =>
              playerStatus.playing ? player.pause() : player.play()
            }
            name={playerStatus.playing ? 'pause' : 'play'}
            size={50}
            color='white'
          />
          <Ionicons name='play-forward' size={24} color='white' />
          <Ionicons
            onPress={downloadBook}
            name='cloud-download-outline'
            size={24}
            color='white'
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
