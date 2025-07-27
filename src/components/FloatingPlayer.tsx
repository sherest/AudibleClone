import { Text, View, Image, Pressable, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useAudioPlayerStatus } from 'expo-audio';
import { usePlayer } from '@/providers/PlayerProvider';
import { useLanguage } from '@/providers/LanguageContext';
import SkeletonPlaceholder from './SkeletonPlaceholder';

export default function FloatingPlayer() {
  const { player, book, clearPlayer } = usePlayer();
  const { selectedLanguage } = useLanguage();
  const playerStatus = useAudioPlayerStatus(player);

  const getLocalizedContent = (content: any, fallback: string = 'eng') => {
    if (!content) return '';
    
    // If content is already a string, return it directly
    if (typeof content === 'string') {
      console.log('FloatingPlayer: Content is string, returning directly:', content);
      return content;
    }
    
    // If content is an object with language keys
    if (typeof content === 'object' && content !== null) {
      const langCode = selectedLanguage?.code || fallback;
      const result = content[langCode] || content[fallback] || '';
      console.log('FloatingPlayer Localization:', { content, langCode, result });
      return result;
    }
    
    return '';
  };

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
            <Text className='text-2xl text-gray-100 font-bold' numberOfLines={2} ellipsizeMode='tail'>{getLocalizedContent(book.title, 'eng') || 'Unknown Title'}</Text>
          ) : (
            <SkeletonPlaceholder width="80%" height={24} borderRadius={4} style={{ marginBottom: 4 }} />
          )}
          
          {book.author ? (
            <Text className='text-gray-400' numberOfLines={1} ellipsizeMode='tail'>{getLocalizedContent(book.author, 'eng') || 'Unknown Artist'}</Text>
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

        {/* Clear Button */}
        <TouchableOpacity
          onPress={clearPlayer}
          className='p-1'
        >
          <Ionicons name="close" size={20} color="#e94560" />
        </TouchableOpacity>
      </Pressable>
    </Link>
  );
}
