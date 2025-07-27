import React, {Fragment, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, SafeAreaView} from 'react-native';
import {useLanguage} from '../../providers/LanguageContext';
import {FontAwesome5} from '@expo/vector-icons';
import SettingsModal from '../settings';
import {useJoinUs} from '../../providers/JoinUsProvider';
import HomeCarousel from '../../components/HomeCarousel';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
    const {selectedLanguage} = useLanguage();
    const {showJoinUs} = useJoinUs();
    const [settingsVisible, setSettingsVisible] = useState(false);
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
                                    {selectedLanguage?.code === 'hin' ? 'हमसे जुड़ें' : 'Join Us'}
                                </Text>
                                <Text style={styles.joinUsDescription}>
                                    {selectedLanguage?.code === 'hin'
                                        ? 'समुदाय की गतिविधियों के बारे में अपडेट रहें'
                                        : 'Stay updated on community activities'}
                                </Text>
                                <TouchableOpacity
                                    style={styles.joinUsButton}
                                    onPress={showJoinUs}
                                >
                                    <Text style={styles.joinUsButtonText}>
                                        {selectedLanguage?.code === 'hin' ? 'शामिल हों' : 'Join Now'}
                                    </Text>
                                </TouchableOpacity>
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
        padding: 20,
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
});

export default HomeScreen;
