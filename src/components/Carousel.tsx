/**
 * Custom Carousel — New Architecture (Fabric) compatible.
 *
 * Drop-in replacement for react-native-momentum-carousel.
 * Built on react-native-reanimated (already a project dependency).
 * Deliberately avoids findNodeHandle which is removed in New Arch.
 */
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  memo,
} from 'react';
import {
  View,
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';

// ─── Animation types ────────────────────────────────────────────────────────

export enum CarouselMomentumAnimationType {
  Default,
  Stack,
  Tinder,
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface CarouselProps<Item> {
  data: Item[];
  sliderWidth?: number;
  itemWidth?: number;
  renderItem: ListRenderItem<Item>;
  keyExtractor?: (item: Item, index: number) => string;
  onSnap: (index: number) => void;
  autoPlay?: boolean;
  loop?: boolean;
  autoPlayInterval?: number;
  inactiveScale?: number;
  showPagination?: boolean;
  paginationStyle?: {
    container?: StyleProp<ViewStyle>;
    bullet?: StyleProp<ViewStyle>;
    activeBullet?: StyleProp<ViewStyle>;
  };
  animation?: CarouselMomentumAnimationType;
  customAnimation?: boolean;
  onMomentumScrollEnd?: () => void;
  onMomentumScrollBegin?: () => void;
  carouselStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
}

export interface CarouselRef {
  getCurrentIndex: () => number;
  goToIndex: (index: number) => void;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  count: number;
  currentIndex: number;
  paginationStyle?: CarouselProps<unknown>['paginationStyle'];
}

const Pagination: React.FC<PaginationProps> = ({ count, currentIndex, paginationStyle }) => (
  <View
    style={[
      {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
      },
      paginationStyle?.container,
    ]}
  >
    {Array.from({ length: count }).map((_, i) => (
      <View
        key={i}
        style={[
          {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.4)',
            marginHorizontal: 4,
          },
          paginationStyle?.bullet,
          i === currentIndex && [
            { backgroundColor: 'rgba(255,255,255,0.9)' },
            paginationStyle?.activeBullet,
          ],
        ]}
      />
    ))}
  </View>
);

// ─── Item wrapper with animation ─────────────────────────────────────────────

interface AnimatedItemProps {
  info: ListRenderItemInfo<any>;
  renderItem: ListRenderItem<any>;
  itemWidth: number;
  scrollX: SharedValue<number>;
  inactiveScale?: number;
  animation: CarouselMomentumAnimationType;
  customAnimation?: boolean;
  itemStyle?: StyleProp<ViewStyle>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  info,
  renderItem,
  itemWidth,
  scrollX,
  inactiveScale = 0.9,
  animation,
  customAnimation,
  itemStyle,
}) => {
  const inputRange = [
    (info.index - 1) * itemWidth,
    info.index * itemWidth,
    (info.index + 1) * itemWidth,
  ];

  const defaultStyle = useAnimatedStyle(() => {
    if (customAnimation) return {};
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [inactiveScale, 1, inactiveScale],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ scale }] };
  });

  const stackStyle = useAnimatedStyle(() => {
    if (customAnimation) return {};
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [inactiveScale, 1, inactiveScale],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP,
    );
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [200, 0, 200],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ scale }, { translateX }] };
  });

  const tinderStyle = useAnimatedStyle(() => {
    if (customAnimation) return {};
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [inactiveScale, 1, inactiveScale],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP,
    );
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [100, 0, 100],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [30, 0, 0],
      Extrapolation.CLAMP,
    );
    const rotate = interpolate(
      scrollX.value,
      inputRange,
      [22, 0, 0],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
      transform: [
        { scale },
        { translateX },
        { translateY },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  let animStyle;
  if (!customAnimation) {
    if (animation === CarouselMomentumAnimationType.Stack) animStyle = stackStyle;
    else if (animation === CarouselMomentumAnimationType.Tinder) animStyle = tinderStyle;
    else animStyle = defaultStyle;
  }

  return (
    <Animated.View
      style={[
        { width: itemWidth },
        animStyle,
        itemStyle,
      ]}
    >
      {renderItem(info)}
    </Animated.View>
  );
};

const AnimatedItemMemo = memo(AnimatedItem);

// ─── Main CarouselMomentum component ─────────────────────────────────────────

function CarouselMomentumInner<Item>(
  {
    data,
    sliderWidth = 0,
    itemWidth = 0,
    renderItem,
    keyExtractor,
    onSnap,
    autoPlay,
    loop,
    autoPlayInterval = 3000,
    inactiveScale,
    showPagination,
    paginationStyle,
    animation = CarouselMomentumAnimationType.Default,
    customAnimation,
    onMomentumScrollEnd,
    onMomentumScrollBegin,
    carouselStyle,
    itemStyle,
  }: CarouselProps<Item>,
  ref: React.ForwardedRef<CarouselRef>,
) {
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Item> | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentIndexRef = useRef(0);

  // Keep ref in sync with state (so interval callback always has fresh value)
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useImperativeHandle(ref, () => ({
    getCurrentIndex: () => currentIndexRef.current,
    goToIndex,
  }));

  const goToIndex = useCallback(
    (index: number) => {
      const target = loop ? ((index % data.length) + data.length) % data.length : index;
      flatListRef.current?.scrollToOffset({ offset: target * itemWidth, animated: true });
      setCurrentIndex(target);
      currentIndexRef.current = target;
      onSnap(target);
    },
    [loop, data.length, itemWidth, onSnap],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const next = Math.round(event.contentOffset.x / itemWidth);
      if (next !== currentIndexRef.current) {
        runOnJS(setCurrentIndex)(next);
        runOnJS(onSnap)(next);
      }
    },
  });

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) return;
    autoplayRef.current = setInterval(() => {
      const next = loop
        ? (currentIndexRef.current + 1) % data.length
        : currentIndexRef.current + 1;
      if (!loop && next > data.length - 1) {
        stopAutoplay();
        return;
      }
      goToIndex(next);
    }, autoPlayInterval);
  }, [autoPlayInterval, loop, data.length, goToIndex, stopAutoplay]);

  useEffect(() => {
    if (autoPlay) startAutoplay();
    else stopAutoplay();
    return stopAutoplay;
  }, [autoPlay, startAutoplay, stopAutoplay]);

  const keyExtractorInternal = useCallback(
    (item: Item, index: number) =>
      keyExtractor ? keyExtractor(item, index) : String(index),
    [keyExtractor],
  );

  const renderItemInternal = useCallback<ListRenderItem<Item>>(
    (info) => (
      <AnimatedItemMemo
        info={info as ListRenderItemInfo<any>}
        renderItem={renderItem as ListRenderItem<any>}
        itemWidth={itemWidth}
        scrollX={scrollX}
        inactiveScale={inactiveScale}
        animation={animation}
        customAnimation={customAnimation}
        itemStyle={itemStyle}
      />
    ),
    [animation, customAnimation, inactiveScale, itemStyle, itemWidth, renderItem, scrollX],
  );

  return (
    <View style={[{ width: sliderWidth }, carouselStyle]}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={keyExtractorInternal}
        renderItem={renderItemInternal}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        decelerationRate="fast"
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentContainerStyle={{
          paddingHorizontal: (sliderWidth - itemWidth) / 2,
        }}
      />
      {showPagination && (
        <Pagination
          count={data.length}
          currentIndex={currentIndex}
          paginationStyle={paginationStyle}
        />
      )}
    </View>
  );
}

const CarouselMomentum = memo(
  forwardRef(CarouselMomentumInner),
) as <Item>(
  props: CarouselProps<Item> & { ref?: React.Ref<CarouselRef> },
) => React.ReactElement;

export default CarouselMomentum;
