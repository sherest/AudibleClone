import {Tabs} from 'expo-router';
import {Ionicons, MaterialIcons, FontAwesome5} from '@expo/vector-icons';
import {BottomTabBar} from '@react-navigation/bottom-tabs';
import FloatingPlayer from '@/components/FloatingPlayer';
import {useEffect, useState} from 'react';
import {useLanguage} from '../../providers/LanguageContext';
import {useTheme} from '../../providers/ThemeProvider';
import {realtimeDb} from '../../lib/firebase';
import {ref, onValue} from 'firebase/database';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

const fontSize = {
    small: 10,
    medium: 12
}

// Custom Tab Bar Component
function CustomTabBar({ state, descriptors, navigation }: any) {
    const { colors } = useTheme();
    const { selectedLanguage } = useLanguage();
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

    const getTabTitle = (routeName: string) => {
        switch (routeName) {
            case 'about':
                return menuData?.about?.[selectedLanguage?.code || 'eng'] || 'About';
            case 'satprasanga':
                return menuData?.satprasanga?.[selectedLanguage?.code || 'eng'] || 'Satprasanga';
            case 'index':
                return menuData?.home?.[selectedLanguage?.code || 'eng'] || 'Home';
            case 'kirtan':
                return menuData?.kirtan?.[selectedLanguage?.code || 'eng'] || 'Kirtan';
            case 'community':
                return menuData?.community?.[selectedLanguage?.code || 'eng'] || 'Community';
            default:
                return routeName;
        }
    };

    const getTabIcon = (routeName: string, color: string, size: number, isFocused: boolean) => {
        switch (routeName) {
            case 'about':
                return <Image 
                    source={isFocused 
                        ? require('../../../assets/img/lahari-icon-selected.png') 
                        : require('../../../assets/img/lahari-icon.png')
                    } 
                    style={{width: 24, height: 24, borderRadius: 100}} 
                />;
            case 'satprasanga':
                return <FontAwesome5 name='book-open' size={size} color={color}/>;
            case 'index':
                return <FontAwesome5 name='praying-hands' size={size} color={color}/>;
            case 'kirtan':
                return <MaterialIcons name='music-note' size={size} color={color}/>;
            case 'community':
                return <FontAwesome5 name='users' size={size} color={color}/>;
            default:
                return null;
        }
    };

    return (
        <View style={[styles.tabBar, { backgroundColor: colors.background.secondary }]}>
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const tabTitle = getTabTitle(route.name);
                const iconColor = isFocused ? colors.primary : colors.text.primary;
                const textColor = isFocused ? colors.primary : colors.text.primary;

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={styles.tabItem}
                    >
                        {getTabIcon(route.name, iconColor, 20, isFocused)}
                        <Text style={[
                            styles.tabLabel,
                            { color: textColor },
                            { fontSize: selectedLanguage?.code === 'eng' ? fontSize.small : fontSize.medium }
                        ]}>
                            {tabTitle}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            tabBar={(props) => (
                <>
                    <FloatingPlayer/>
                    <CustomTabBar {...props} />
                </>
            )}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen name='about' options={{ href: '/about' }} />
            <Tabs.Screen name='satprasanga' />
            <Tabs.Screen name='index' />
            <Tabs.Screen name='kirtan' />
            <Tabs.Screen name='community' />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 10,
        height: 90,
        borderTopWidth: 1,
        borderTopColor: '#974608',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
        marginHorizontal: 2,
    },
    tabLabel: {
        marginTop: 4,
        fontWeight: '600',
        textAlign: 'center',
    },
});
