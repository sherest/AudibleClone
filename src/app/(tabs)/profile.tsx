import { View, Text } from 'react-native';

export default function Profile() {
  return (
    <View className='flex-1 justify-center items-center'>
      <Text className='text-white text-2xl font-bold'>Profile</Text>
      <Text className='text-white text-lg mt-4'>Welcome to your profile!</Text>
    </View>
  );
} 