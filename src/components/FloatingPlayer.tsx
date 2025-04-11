import { Text, View, Image, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useAudioPlayerStatus } from 'expo-audio';
import { usePlayer } from '@/providers/PlayerProvider';

export default function FloatingPlayer() {
  const { player, book } = usePlayer();
  const playerStatus = useAudioPlayerStatus(player);

  if (!book) return null;

  return (
    <Link href='/player' asChild>
      <Pressable className='flex-row gap-4 items-center p-2 bg-slate-900'>
        <Image
          source={{ uri: book.thumbnail_url }}
          className='w-16 aspect-square rounded-md'
        />
        <View className='gap-1 flex-1'>
          <Text className='text-2xl text-gray-100 font-bold'>{book.title}</Text>
          <Text className='text-gray-400'>{book.author}</Text>
        </View>

        <AntDesign
          name={
            playerStatus.isBuffering
              ? 'loading2'
              : playerStatus.playing
              ? 'pause'
              : 'playcircleo'
          }
          size={24}
          color='gainsboro'
          onPress={() =>
            playerStatus.playing ? player.pause() : player.play()
          }
        />
      </Pressable>
    </Link>
  );
}
