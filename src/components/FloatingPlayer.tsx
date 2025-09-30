import { Text, View, Image, Pressable, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useAudioPlayerStatus } from 'expo-audio';
import { usePlayer } from '@/providers/PlayerProvider';
import { useLanguage } from '@/providers/LanguageContext';
import { useTheme } from '@/providers/ThemeProvider';
import SkeletonPlaceholder from './SkeletonPlaceholder';

export default function FloatingPlayer() {
  const { player, book, clearPlayer } = usePlayer();
  const { selectedLanguage } = useLanguage();
  const { colors } = useTheme();
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
      <Pressable style={{flexDirection: 'row', gap: 16, alignItems: 'center', padding: 8, backgroundColor: colors.background.secondary}}>
        {/* Thumbnail */}
        {isThumbnailLoading ? (
          <SkeletonPlaceholder width={64} height={64} borderRadius={8} />
        ) : (
          <Image
            source={{ uri: book.thumbnail_url }}
            style={{width: 64, aspectRatio: 1, borderRadius: 8}}
          />
        )}
        
        {/* Content */}
        <View style={{gap: 4, flex: 1}}>
          {book.title ? (
            <Text style={{fontSize: 24, color: colors.text.primary, fontWeight: 'bold'}} numberOfLines={2} ellipsizeMode='tail'>{getLocalizedContent(book.title, 'eng') || 'Unknown Title'}</Text>
          ) : (
            <SkeletonPlaceholder width="80%" height={24} borderRadius={4} style={{ marginBottom: 4 }} />
          )}
          
          {book.author ? (
            <Text style={{color: colors.text.secondary}} numberOfLines={1} ellipsizeMode='tail'>{getLocalizedContent(book.author, 'eng') || 'Unknown Artist'}</Text>
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
          color={colors.text.secondary}
          onPress={() =>
            playerStatus.playing ? player.pause() : player.play()
          }
        />

        {/* Clear Button */}
        <TouchableOpacity
          onPress={clearPlayer}
          style={{padding: 4}}
        >
          <Ionicons name="close" size={20} color={colors.primary} />
        </TouchableOpacity>
      </Pressable>
    </Link>
  );
}
