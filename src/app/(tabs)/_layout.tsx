import {Tabs} from 'expo-router';
import {Ionicons, MaterialIcons, FontAwesome5} from '@expo/vector-icons';
import {BottomTabBar} from '@react-navigation/bottom-tabs';
import FloatingPlayer from '@/components/FloatingPlayer';
import {useEffect, useState} from 'react';
import {useLanguage} from '../../providers/LanguageContext';
import {realtimeDb} from '../../lib/firebase';
import {ref, onValue} from 'firebase/database';

export default function TabsLayout() {
    const {selectedLanguage} = useLanguage();
    const [menuData, setMenuData] = useState<any>({});

    useEffect(() => {
        const fetchMenuData = () => {
            const menuRef = ref(realtimeDb, 'menu');
            onValue(menuRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setMenuData(data);
                }
            });
        };

        fetchMenuData();
    }, [selectedLanguage]);

    return (
        <Tabs
            tabBar={(props) => (
                <>
                    <FloatingPlayer/>
                    <BottomTabBar {...props} />
                </>
            )}
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#1a1a2e',
                    borderTopColor: '#16213e',
                    paddingTop: 10,
                    paddingBottom: 10,
                    height: 90,
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
                    title: menuData?.about?.[selectedLanguage?.code || 'eng'] || 'About',
                    tabBarIcon: ({color, size}) => (
                        <FontAwesome5 name='info-circle' size={size} color={color}/>
                    ),
                }}/>
            <Tabs.Screen
                name='satprasanga'
                options={{
                    title: menuData?.satprasanga?.[selectedLanguage?.code || 'eng'] || 'Satprasanga',
                    tabBarIcon: ({color, size}) => (
                        <FontAwesome5 name='book-open' size={size} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name='index'
                options={{
                    title: menuData?.home?.[selectedLanguage?.code || 'eng'] || 'Home',
                    tabBarIcon: ({color, size}) => (
                        <FontAwesome5 name='praying-hands' size={size} color={color}/>
                        
                    ),
                }}/>
            <Tabs.Screen
                name='kirtan'
                options={{
                    title: menuData?.kirtan?.[selectedLanguage?.code || 'eng'] || 'Kirtan',
                    tabBarIcon: ({color, size}) => (
                        <MaterialIcons name='music-note' size={size} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name='community'
                options={{
                    title: menuData?.community?.[selectedLanguage?.code || 'eng'] || 'Community',
                    tabBarIcon: ({color, size}) => (
                        <FontAwesome5 name='users' size={size} color={color}/>
                    ),
                }}
            />
        </Tabs>
    );
}
