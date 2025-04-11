import './global.css';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View className='bg-slate-800 flex-1 items-center justify-center'>
      <Text className='text-2xl text-gray-100 font-bold'>
        Hello world from NativeWind
      </Text>

      <StatusBar style='auto' />
    </View>
  );
}
