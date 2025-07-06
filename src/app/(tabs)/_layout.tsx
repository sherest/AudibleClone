import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
    >
      <Tabs.Screen 
        name='index' 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home' size={size} color={color} />
          ),
        }} />
      <Tabs.Screen
        name='library'
        options={{
          title: 'Library',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='library' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='discover'
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='search' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='settings' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 