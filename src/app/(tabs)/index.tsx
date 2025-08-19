import React, {Fragment, useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, SafeAreaView, Linking} from 'react-native';
import {useLanguage} from '../../providers/LanguageContext';
import {useTheme} from '../../providers/ThemeProvider';
import {FontAwesome5} from '@expo/vector-icons';
import SettingsModal from '../settings';
import {useJoinUs} from '../../providers/JoinUsProvider';
import HomeCarousel from '../../components/HomeCarousel';
import Constants from 'expo-constants';
import {realtimeDb} from '../../lib/firebase';
import {ref, onValue} from 'firebase/database';
import SkeletonPlaceholder from '../../components/SkeletonPlaceholder';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
    const {selectedLanguage} = useLanguage();
    const {colors} = useTheme();
    const {showJoinUs} = useJoinUs();
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [menuData, setMenuData] = useState<any>({});
    const [joinUsData, setJoinUsData] = useState<any>({});
    const [informationData, setInformationData] = useState<any>({});

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

        const fetchInformationData = () => {
            const informationRef = ref(realtimeDb, 'information');
            onValue(informationRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setInformationData(data);
                }
            });
        };

        fetchMenuData();
        fetchJoinUsData();
        fetchInformationData();
    }, [selectedLanguage]);
    return (
        <Fragment>
            <SafeAreaView style={{flex: 0, backgroundColor: colors.background.secondary}}></SafeAreaView>
            <SafeAreaView style={[styles.container, {backgroundColor: colors.background.primary}]}>
                {/* Header with Greeting */}
                <View style={[styles.header, {backgroundColor: colors.background.secondary}]}>
                    <View style={styles.greetingContainer}>
                        <FontAwesome5 name="praying-hands" size={22} color={colors.text.secondary} style={{marginRight: 10}}/>
                        {informationData?.greeting?.[selectedLanguage?.code || 'eng'] ? (
                            <Text style={[styles.greeting, {color: colors.text.primary}]}>
                                {informationData.greeting[selectedLanguage?.code || 'eng']}
                            </Text>
                        ) : (
                            <SkeletonPlaceholder width={150} height={24} borderRadius={4} />
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.languageSelector}
                        onPress={() => setSettingsVisible(true)}
                    >
                        <Text style={[styles.languageLabel, {color: colors.text.secondary}]}>
                            {selectedLanguage?.name || 'English'}
                        </Text>
                        <FontAwesome5 name="chevron-down" size={12} color={colors.text.secondary}/>
                    </TouchableOpacity>
                </View>
                <ScrollView style={[styles.container, {backgroundColor: colors.background.primary}]}>

                    {/* Home Carousel */}
                    <HomeCarousel autoPlayInterval={5000}/>


                    {/* Join Us Section */}
                    <View style={styles.section}>
                        <View style={[styles.joinUsCard, {backgroundColor: colors.background.secondary, borderLeftColor: colors.primary}]}>
                            <View style={styles.joinUsContent}>
                                {menuData?.joinUs?.[selectedLanguage?.code || 'eng'] ? (
                                    <Text style={[styles.joinUsTitle, {color: colors.text.primary}]}>
                                        {menuData.joinUs[selectedLanguage?.code || 'eng']}
                                    </Text>
                                ) : (
                                    <SkeletonPlaceholder width={120} height={20} borderRadius={4} style={{ marginBottom: 10 }} />
                                )}
                                
                                {joinUsData?.shortDescription?.[selectedLanguage?.code || 'eng'] ? (
                                    <Text style={[styles.joinUsDescription, {color: colors.text.secondary}]}>
                                        {joinUsData.shortDescription[selectedLanguage?.code || 'eng']}
                                    </Text>
                                ) : (
                                    <SkeletonPlaceholder width="80%" height={16} borderRadius={4} style={{ marginBottom: 20 }} />
                                )}
                                
                                {menuData?.joinUs?.[selectedLanguage?.code || 'eng'] ? (
                                    <TouchableOpacity
                                        style={[styles.joinUsButton, {backgroundColor: colors.primary}]}
                                        onPress={showJoinUs}
                                    >
                                        <Text style={[styles.joinUsButtonText, {color: colors.text.primary}]}>
                                            {menuData.joinUs[selectedLanguage?.code || 'eng']}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <SkeletonPlaceholder width={100} height={40} borderRadius={10} />
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Information Section */}
                    <View style={styles.section}>
                        <View style={[styles.infoCard, {backgroundColor: colors.background.secondary, borderLeftColor: colors.primary}]}>
                            {informationData?.title?.[selectedLanguage?.code || 'eng'] ? (
                                <Text style={[styles.infoTitle, {color: colors.text.primary}]}>
                                    {informationData.title[selectedLanguage?.code || 'eng']}
                                </Text>
                            ) : (
                                <SkeletonPlaceholder width={100} height={18} borderRadius={4} style={{ marginBottom: 15, alignSelf: 'center' }} />
                            )}
                            
                            <View style={styles.infoItem}>
                                <FontAwesome5 name="download" size={16} color={colors.primary} style={styles.infoIcon} />
                                <View style={styles.infoContent}>
                                    {informationData?.download?.[selectedLanguage?.code || 'eng'] ? (
                                        <Text style={[styles.infoLabel, {color: colors.text.primary}]}>
                                            {informationData.download[selectedLanguage?.code || 'eng']}
                                        </Text>
                                    ) : (
                                        <SkeletonPlaceholder width="70%" height={14} borderRadius={4} style={{ marginBottom: 5 }} />
                                    )}
                                    
                                    {informationData?.website?.href && informationData?.website?.label ? (
                                        <TouchableOpacity onPress={() => Linking.openURL(informationData.website.href)}>
                                            <Text style={[styles.infoLink, {color: colors.primary}]}>{informationData.website.label}</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <SkeletonPlaceholder width={180} height={14} borderRadius={4} style={{ marginBottom: 3 }} />
                                    )}
                                    
                                    {informationData?.app?.iOS?.[selectedLanguage?.code || 'eng'] ? (
                                        <Text style={[styles.infoText, {color: colors.text.secondary}]}>
                                            {informationData.app.iOS[selectedLanguage?.code || 'eng']}
                                        </Text>
                                    ) : (
                                        <SkeletonPlaceholder width="60%" height={14} borderRadius={4} />
                                    )}
                                </View>
                            </View>

                            <View style={styles.infoItem}>
                                <FontAwesome5 name="share" size={16} color={colors.primary} style={styles.infoIcon} />
                                <View style={styles.infoContent}>
                                    {informationData?.share?.language?.[selectedLanguage?.code || 'eng'] ? (
                                        <Text style={[styles.infoLabel, {color: colors.text.primary}]}>
                                            {informationData.share.language[selectedLanguage?.code || 'eng']}
                                        </Text>
                                    ) : (
                                        <SkeletonPlaceholder width="90%" height={14} borderRadius={4} style={{ marginBottom: 5 }} />
                                    )}
                                    
                                    {informationData?.share?.email ? (
                                        <TouchableOpacity onPress={() => Linking.openURL(`mailto:${informationData.share.email}`)}>
                                            <Text style={[styles.infoLink, {color: colors.primary}]}>{informationData.share.email}</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <SkeletonPlaceholder width={200} height={14} borderRadius={4} />
                                    )}
                                </View>
                            </View>

                            <View style={styles.versionContainer}>
                                <Text style={[styles.versionText, {color: colors.text.secondary}]}>
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    greetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    languageSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    languageLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 5,
    },

    section: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    
    joinUsCard: {
        borderRadius: 15,
        padding: 20,
        borderLeftWidth: 4,
    },
    joinUsContent: {
        alignItems: 'center',
    },
    joinUsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    joinUsDescription: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    joinUsButton: {
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    joinUsButtonText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    infoCard: {
      borderRadius: 15,
      padding: 20,
      borderLeftWidth: 4,
      marginBottom: 10,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
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
      marginBottom: 5,
      fontWeight: '500',
    },
    infoLink: {
      fontSize: 14,
      textDecorationLine: 'underline',
      marginBottom: 3,
    },
    infoText: {
      fontSize: 14,
    },
    versionContainer: {
      marginTop: 0,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: '#ffffff',
      alignItems: 'center',
    },
    versionText: {
      fontSize: 12,
      fontStyle: 'italic',
    },
});

export default HomeScreen;
