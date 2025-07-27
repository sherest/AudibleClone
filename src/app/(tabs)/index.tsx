import React, {Fragment, useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, SafeAreaView, Linking} from 'react-native';
import {useLanguage} from '../../providers/LanguageContext';
import {FontAwesome5} from '@expo/vector-icons';
import SettingsModal from '../settings';
import {useJoinUs} from '../../providers/JoinUsProvider';
import HomeCarousel from '../../components/HomeCarousel';
import Constants from 'expo-constants';
import {realtimeDb} from '../../lib/firebase';
import {ref, onValue} from 'firebase/database';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
    const {selectedLanguage} = useLanguage();
    const {showJoinUs} = useJoinUs();
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [menuData, setMenuData] = useState<any>({});
    const [joinUsData, setJoinUsData] = useState<any>({});

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

        const fetchJoinUsData = () => {
            const joinUsRef = ref(realtimeDb, 'join_us');
            onValue(joinUsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setJoinUsData(data);
                }
            });
        };

        fetchMenuData();
        fetchJoinUsData();
    }, [selectedLanguage]);
    return (
        <Fragment>
            <SafeAreaView style={{flex: 0, backgroundColor: '#1a1a2e'}}></SafeAreaView>
            <SafeAreaView style={styles.container}>
                {/* Header with Greeting */}
                <View style={styles.header}>
                    <View style={styles.greetingContainer}>
                        <FontAwesome5 name="home" size={24} color="#e94560" style={{marginRight: 10}}/>
                        <Text style={styles.greeting}>
                            {selectedLanguage?.code === 'hin' ? 'जय श्री कृष्णा' : 'Welcome!'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.languageSelector}
                        onPress={() => setSettingsVisible(true)}
                    >
                        <Text style={styles.languageLabel}>
                            {selectedLanguage?.name || 'English'}
                        </Text>
                        <FontAwesome5 name="chevron-down" size={12} color="#e94560"/>
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.container}>

                    {/* Home Carousel */}
                    <HomeCarousel autoPlayInterval={5000}/>


                    {/* Join Us Section */}
                    <View style={styles.section}>
                        <View style={styles.joinUsCard}>
                            <View style={styles.joinUsContent}>
                                <Text style={styles.joinUsTitle}>
                                    {menuData?.joinUs?.[selectedLanguage?.code || 'eng'] || 'Join Us'}
                                </Text>
                                <Text style={styles.joinUsDescription}>
                                    {joinUsData?.shortDescription?.[selectedLanguage?.code || 'eng'] || 'Stay updated on community activities'}
                                </Text>
                                <TouchableOpacity
                                    style={styles.joinUsButton}
                                    onPress={showJoinUs}
                                >
                                    <Text style={styles.joinUsButtonText}>
                                        {menuData?.joinUs?.[selectedLanguage?.code || 'eng'] || 'Join Now'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Information Section */}
                    <View style={styles.section}>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>
                                {selectedLanguage?.code === 'hin' ? 'जानकारी' : 'Information'}
                            </Text>
                            
                            <View style={styles.infoItem}>
                                <FontAwesome5 name="download" size={16} color="#e94560" style={styles.infoIcon} />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>
                                        {selectedLanguage?.code === 'hin' ? 'गाने डाउनलोड करने के लिए:' : 'For downloading the songs:'}
                                    </Text>
                                    <TouchableOpacity onPress={() => Linking.openURL('https://www.amritalahari.com')}>
                                        <Text style={styles.infoLink}>www.amritalahari.com</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.infoText}>
                                        {selectedLanguage?.code === 'hin' ? 'या iTunes - amrita lahari खोजें' : 'or iTunes - search amrita lahari'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.infoItem}>
                                <FontAwesome5 name="share" size={16} color="#e94560" style={styles.infoIcon} />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>
                                        {selectedLanguage?.code === 'hin' ? 'सामग्री साझा करने के लिए:' : 'To share kirtans, photos, stories and other Audio visual material of Guruji:'}
                                    </Text>
                                    <TouchableOpacity onPress={() => Linking.openURL('mailto:lahari.amrita@gmail.com')}>
                                        <Text style={styles.infoLink}>lahari.amrita@gmail.com</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.versionContainer}>
                                <Text style={styles.versionText}>
                                    Version {Constants.expoConfig?.version || '1.0.0'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Settings Modal */}
                <SettingsModal
                    visible={settingsVisible}
                    onClose={() => setSettingsVisible(false)}
                />
            </SafeAreaView>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f3460',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1a1a2e',
    },
    greetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    languageSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    languageLabel: {
        color: '#e94560',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 5,
    },

    section: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    
    joinUsCard: {
        backgroundColor: '#1a1a2e',
        borderRadius: 15,
        padding: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#e94560',
    },
    joinUsContent: {
        alignItems: 'center',
    },
    joinUsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
    },
    joinUsDescription: {
        fontSize: 16,
        color: '#8b8b8b',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    joinUsButton: {
      backgroundColor: '#e94560',
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    joinUsButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    infoCard: {
      backgroundColor: '#1a1a2e',
      borderRadius: 15,
      padding: 20,
      borderLeftWidth: 4,
      borderLeftColor: '#e94560',
      marginBottom: 10,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 15,
      textAlign: 'center',
    },
    infoItem: {
      flexDirection: 'row',
      marginBottom: 15,
      alignItems: 'flex-start',
    },
    infoIcon: {
      marginRight: 10,
      marginTop: 2,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 14,
      color: '#ffffff',
      marginBottom: 5,
      fontWeight: '500',
    },
    infoLink: {
      fontSize: 14,
      color: '#e94560',
      textDecorationLine: 'underline',
      marginBottom: 3,
    },
    infoText: {
      fontSize: 14,
      color: '#8b8b8b',
    },
    versionContainer: {
      marginTop: 0,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: '#333',
      alignItems: 'center',
    },
    versionText: {
      fontSize: 12,
      color: '#8b8b8b',
      fontStyle: 'italic',
    },
});

export default HomeScreen;
