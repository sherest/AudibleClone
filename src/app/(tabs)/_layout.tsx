import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import FloatingPlayer from '@/components/FloatingPlayer';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <>
          <FloatingPlayer />
          <BottomTabBar {...props} />
        </>
      )}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopColor: '#16213e',
        },
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#8b8b8b',
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#ffffff',
        headerShown: false,
      }}
    >
      <Tabs.Screen 
        name='about' 
        options={{ 
          title: 'About',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name='info-circle' size={size} color={color} />
          ),
        }} />
      <Tabs.Screen
        name='satprasanga'
        options={{
          title: 'Satprasanga',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name='book-open' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name='index' 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name='home' size={size} color={color} />
          ),
        }} />
      <Tabs.Screen
        name='kirtan'
        options={{
          title: 'Kirtan',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='music-note' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='community'
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name='users' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 