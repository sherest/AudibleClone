import { Text, View, Image, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useAudioPlayerStatus } from 'expo-audio';
import { usePlayer } from '@/providers/PlayerProvider';
import SkeletonPlaceholder from './SkeletonPlaceholder';

export default function FloatingPlayer() {
  const { player, book } = usePlayer();
  const playerStatus = useAudioPlayerStatus(player);

  // console.log(JSON.stringify(playerStatus, null, 2));

  if (!book) return null;

  // Check if thumbnail is loading (when it's the music icon placeholder)
  const isThumbnailLoading = !book.thumbnail_url || book.thumbnail_url === require('../../assets/img/music-icon.png');

  return (
    <Link href='/player' asChild>
      <Pressable className='flex-row gap-4 items-center p-2 bg-slate-900'>
        {/* Thumbnail */}
        {isThumbnailLoading ? (
          <SkeletonPlaceholder width={64} height={64} borderRadius={8} />
        ) : (
          <Image
            source={{ uri: book.thumbnail_url }}
            className='w-16 aspect-square rounded-md'
          />
        )}
        
        {/* Content */}
        <View className='gap-1 flex-1'>
          {book.title ? (
            <Text className='text-2xl text-gray-100 font-bold' numberOfLines={2} ellipsizeMode='tail'>{book.title}</Text>
          ) : (
            <SkeletonPlaceholder width="80%" height={24} borderRadius={4} style={{ marginBottom: 4 }} />
          )}
          
          {book.author ? (
            <Text className='text-gray-400' numberOfLines={1} ellipsizeMode='tail'>{book.author}</Text>
          ) : (
            <SkeletonPlaceholder width="60%" height={16} borderRadius={4} />
          )}
        </View>

        {/* Play Button */}
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
