import { Stack } from 'expo-router';

export default function AboutLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: 'About'
        }} 
      />
      <Stack.Screen 
        name="detail" 
        options={{ 
          headerShown: false,
          title: 'About Detail',
          presentation: 'card'
        }} 
      />
    </Stack>
  );
}
