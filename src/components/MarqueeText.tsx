import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Animated, LayoutChangeEvent } from 'react-native';

interface MarqueeTextProps {
  text: string;
  style?: any;
  speed?: number;
  delay?: number;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({ 
  text, 
  style, 
  speed = 50, 
  delay = 1000 
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (textWidth > containerWidth && containerWidth > 0) {
      setShouldAnimate(true);
      startAnimation();
    } else {
      setShouldAnimate(false);
      scrollX.setValue(0);
    }
  }, [textWidth, containerWidth, text]);

  const startAnimation = () => {
    const distance = textWidth - containerWidth;
    const duration = (distance / speed) * 1000; // Convert to milliseconds

    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(scrollX, {
          toValue: -distance,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.delay(delay),
        Animated.timing(scrollX, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const onTextLayout = (event: LayoutChangeEvent) => {
    setTextWidth(event.nativeEvent.layout.width);
  };

  const onContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View 
      style={{ overflow: 'hidden' }} 
      onLayout={onContainerLayout}
    >
      <Animated.Text
        style={[
          style,
          {
            transform: [{ translateX: scrollX }],
          },
        ]}
        onLayout={onTextLayout}
        numberOfLines={1}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

export default MarqueeText; 