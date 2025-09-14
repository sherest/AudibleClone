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
        style={{width: '100%', backgroundColor: colors.background.tertiary, height: 8, borderRadius: 4, justifyContent: 'center'}}
        hitSlop={20}
      >
        <View
          style={{backgroundColor: colors.primary, height: '100%', borderRadius: 4, width: `${progress * 100}%`}}
        />
        <View
          style={{position: 'absolute', width: 12, height: 12, transform: [{translateX: -6}], borderRadius: 6, backgroundColor: colors.primary, left: `${progress * 100}%`}}
        />
      </Pressable>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <Text style={{color: colors.text.secondary}}>{formatTime(currentTime)}</Text>
        <Text style={{color: colors.text.secondary}}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}
