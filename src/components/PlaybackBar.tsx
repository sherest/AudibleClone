import { useState } from 'react';
import { View, Text, Pressable, GestureResponderEvent } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

type PlaybackBarProps = {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
};

export default function PlaybackBar({
  currentTime,
  duration,
  onSeek,
}: PlaybackBarProps) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);

  const progress = currentTime / duration;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const onHandleSeek = (event: GestureResponderEvent) => {
    const pressX = event.nativeEvent.locationX;

    const percentage = pressX / width;
    const seekToSeconds = Math.min(
      Math.max(duration * percentage, 0),
      duration
    );

    onSeek(seekToSeconds);
  };

  return (
    <View style={{gap: 16}}>
      <Pressable
        onPress={onHandleSeek}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        style={{
          width: '100%', 
          backgroundColor: colors.background.secondary, 
          height: 8, 
          borderRadius: 4, 
          justifyContent: 'center',
          opacity: 0.6 // Make track darker
        }}
        hitSlop={20}
      >
        <View
          style={{
            backgroundColor: colors.primary, 
            height: '100%', 
            borderRadius: 4, 
            width: `${progress * 100}%`,
            opacity: 0.9 // Slightly transparent progress
          }}
        />
        <View
          style={{
            position: 'absolute', 
            width: 16, 
            height: 16, 
            transform: [{translateX: -8}], 
            borderRadius: 8, 
            backgroundColor: colors.text.primary, // Different color for handler
            left: `${progress * 100}%`,
            borderWidth: 2,
            borderColor: colors.background.primary,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 3
          }}
        />
      </Pressable>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <Text style={{color: colors.text.secondary}}>{formatTime(currentTime)}</Text>
        <Text style={{color: colors.text.secondary}}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}
