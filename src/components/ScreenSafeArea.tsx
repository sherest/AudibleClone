import { PropsWithChildren } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  topColor: string;
}>;

// Reserves and colors the status-bar area (required now that Android is edge-to-edge),
// then renders screen content below it.
export default function ScreenSafeArea({ children, style, topColor }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: insets.top, backgroundColor: topColor }} />
      <View style={[{ flex: 1 }, style]}>{children}</View>
    </View>
  );
}
