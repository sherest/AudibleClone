import React, { Fragment, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Modal, ImageBackground } from 'react-native';
import { useLanguage } from '../../providers/LanguageContext';
import { useTheme } from '../../providers/ThemeProvider';
import { useJoinUs } from '../../providers/JoinUsProvider';
import { realtimeDb } from '../../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { FontAwesome5 } from '@expo/vector-icons';
import SkeletonPlaceholder from '../../components/SkeletonPlaceholder';

interface Event {
  title: { [key: string]: string };
  description: { [key: string]: string };
  when: { [key: string]: string };
}

interface Message {
  name: string;
  message: string;
  date: string;
  time: string;
  email: string;
  phone: number;
}

interface BiographyData {
  ban: string;
  eng: string;
  hin: string;
  [key: string]: string;
}

interface AnnouncementData {
  ban: string;
  eng: string;
  hin: string;
  title?: { [key: string]: string };
  button?: { [key: string]: string };
}

interface MenuData {
  amritaLahari: { [key: string]: string };
  community: { [key: string]: string };
  joinUs: { [key: string]: string };
  kirtan: { [key: string]: string };
  satprasanga: { [key: string]: string };
}

interface CommunityData {
  events: {
    data: Event[];
    lang: string;
  };
  messages: {
    data: Message[];
    fields: {
      add_your_message: { [key: string]: string };
    };
    announcement?: AnnouncementData;
  };
  biography: {
    data: BiographyData[];
  };
  tabs: {
    events: { [key: string]: string };
    messages: { [key: string]: string };
    biography: { [key: string]: string };
  };
}

const CommunityScreen = () => {
  const { selectedLanguage } = useLanguage();
  const { colors } = useTheme();
  const { showJoinUs } = useJoinUs();
  const [activeTab, setActiveTab] = useState<'events' | 'messages' | 'biography'>('events');
  const [communityData, setCommunityData] = useState<CommunityData | null>(null);
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // Helper function to safely get localized content
  const getLocalizedContent = (content: Record<string, string>, fallback: string = 'eng') => {
    const langCode = selectedLanguage?.code || fallback;
    return content[langCode] || content[fallback] || '';
  };

  useEffect(() => {
    setLoading(true);
    const communityRef = ref(realtimeDb, 'community');
    const unsubCommunity = onValue(communityRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setCommunityData(data);
    });

    const menuRef = ref(realtimeDb, 'menu');
    const unsubMenu = onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setMenuData(data);
      setLoading(false);
    });

    return () => {
      unsubCommunity();
      unsubMenu();
    };
  }, []);

  const tabs = [
    { key: 'events', icon: 'calendar-alt' },
    { key: 'messages', icon: 'envelope' },
    { key: 'biography', icon: 'user' },
  ];

  if (loading) {
    return (
      <Fragment>
        <SafeAreaView style={{flex: 0, backgroundColor: colors.background.secondary}}></SafeAreaView>
        <SafeAreaView style={[styles.container, {backgroundColor: colors.background.primary}]}>
          {/* Header Skeleton */}
          <View style={[styles.header, {backgroundColor: colors.background.secondary}]}>
            <FontAwesome5 name="users" size={22} color={colors.primary} />
            <SkeletonPlaceholder width={120} height={22} borderRadius={4} style={{ marginLeft: 10, flex: 1 }} />
            <SkeletonPlaceholder width={80} height={36} borderRadius={10} />
          </View>

          {/* Tab Navigation Skeleton */}
          <View style={[styles.tabContainer, {backgroundColor: colors.background.secondary}]}>
            {[1, 2, 3].map((index) => (
              <View key={index} style={styles.tabButton}>
                <FontAwesome5 name="circle" size={16} color={colors.text.secondary} />
                <SkeletonPlaceholder width={60} height={14} borderRadius={4} style={{ marginLeft: 8 }} />
              </View>
            ))}
          </View>

          {/* Content Skeleton */}
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              {[1, 2, 3].map((index) => (
                <View key={index} style={[styles.eventCard, {backgroundColor: colors.background.secondary}]}>
                  <View style={styles.eventHeader}>
                    <FontAwesome5 name="calendar-alt" size={16} color={colors.primary} />
                    <SkeletonPlaceholder width={150} height={18} borderRadius={4} style={{ marginLeft: 10 }} />
                  </View>
                  <SkeletonPlaceholder width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                  <SkeletonPlaceholder width="90%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                  <SkeletonPlaceholder width="80%" height={16} borderRadius={4} style={{ marginBottom: 10 }} />
                  <SkeletonPlaceholder width={120} height={14} borderRadius={4} />
                </View>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }

  const renderEventsContent = () => {
    if (!communityData?.events?.data) {
      return (
        <View style={styles.section}>
          {[1, 2, 3].map((index) => (
            <View key={index} style={[styles.eventCard, {backgroundColor: colors.background.secondary}]}>
              <View style={styles.eventHeader}>
                <FontAwesome5 name="calendar-alt" size={16} color={colors.primary} />
                <SkeletonPlaceholder width={150} height={18} borderRadius={4} style={{ marginLeft: 10 }} />
              </View>
              <SkeletonPlaceholder width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
              <SkeletonPlaceholder width="90%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
              <SkeletonPlaceholder width="80%" height={16} borderRadius={4} style={{ marginBottom: 10 }} />
              <SkeletonPlaceholder width={120} height={14} borderRadius={4} />
            </View>
          ))}
        </View>
      );
    }
    
    return (
      <View style={styles.section}>
        {communityData.events.data.map((event, index) => (
          <View key={index} style={[styles.eventCard, {backgroundColor: colors.background.secondary}]}>
            <View style={styles.eventHeader}>
              <FontAwesome5 name="calendar-alt" size={16} color={colors.primary} />
              <Text style={[styles.eventTitle, {color: colors.text.primary}]}>
                {getLocalizedContent(event.title)}
              </Text>
            </View>
            <Text style={[styles.eventDescription, {color: colors.text.primary}]}>
              {getLocalizedContent(event.description)}
            </Text>
            <Text style={[styles.eventDate, {color: colors.primary}]}>
              {getLocalizedContent(event.when)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderMessagesContent = () => {
    if (!communityData?.messages?.data) {
      return (
        <View style={styles.section}>
          {[1, 2, 3].map((index) => (
            <View key={index} style={[styles.messageCard, {backgroundColor: colors.background.secondary}]}>
              <View style={styles.messageHeader}>
                <FontAwesome5 name="user" size={16} color={colors.primary} />
                <SkeletonPlaceholder width={100} height={16} borderRadius={4} style={{ marginLeft: 10 }} />
              </View>
              <SkeletonPlaceholder width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
              <SkeletonPlaceholder width="95%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
              <SkeletonPlaceholder width="90%" height={16} borderRadius={4} style={{ marginBottom: 10 }} />
              <SkeletonPlaceholder width={120} height={14} borderRadius={4} />
            </View>
          ))}
        </View>
      );
    }
    
    return (
      <View style={styles.section}>
        {communityData.messages.data.map((message, index) => (
          <View key={index} style={[styles.messageCard, {backgroundColor: colors.background.secondary}]}>
            <View style={styles.messageHeader}>
              <FontAwesome5 name="user" size={16} color={colors.primary} />
              <Text style={[styles.messageName, {color: colors.text.primary}]}>{message.name}</Text>
            </View>
            <Text style={[styles.messageText, {color: colors.text.primary}]}>{message.message}</Text>
            <Text style={[styles.messageTime, {color: colors.text.secondary}]}>{message.date} {message.time}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderBiographyContent = () => {
    if (!communityData?.biography?.data) {
      return (
        <View style={styles.section}>
          <View style={[styles.biographyCard, {backgroundColor: colors.background.secondary}]}>
            {[1, 2, 3, 4].map((index) => (
              <View key={index} style={{ marginBottom: 16 }}>
                <SkeletonPlaceholder width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                <SkeletonPlaceholder width="95%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                <SkeletonPlaceholder width="90%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                <SkeletonPlaceholder width="85%" height={16} borderRadius={4} />
              </View>
            ))}
          </View>
        </View>
      );
    }
    
    return (
      <View style={styles.section}>
        <View style={[styles.biographyCard, {backgroundColor: colors.background.secondary}]}>
          {communityData.biography.data.map((paragraph, index) => (
            <Text key={index} style={[styles.biographyText, {color: colors.text.primary}]}>
              {getLocalizedContent(paragraph)}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return renderEventsContent();
      case 'messages':
        return renderMessagesContent();
      case 'biography':
        return renderBiographyContent();
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: colors.background.secondary}}></SafeAreaView>
      <SafeAreaView style={[styles.container, {backgroundColor: colors.background.primary}]}>
        {/* Background Image */}
        <ImageBackground 
          source={require('../../../assets/gurujibackground.png')} 
          style={styles.backgroundImage}
          resizeMode="repeat"
        />
        {/* Header */}
        <View style={[styles.header, {backgroundColor: colors.background.secondary}]}>
          <FontAwesome5 name="users" size={22} color={colors.primary} />
          {menuData?.community ? (
            <Text style={[styles.headerTitle, {color: colors.text.primary}]}>
              {getLocalizedContent(menuData.community)}
            </Text>
          ) : (
            <SkeletonPlaceholder width={120} height={22} borderRadius={4} style={{ marginLeft: 10, flex: 1 }} />
          )}
          {menuData?.joinUs ? (
            <TouchableOpacity style={[styles.joinUsButton, {backgroundColor: colors.primary}]} onPress={showJoinUs}>
              <Text style={[styles.joinUsButtonText, {color: colors.background.secondary}]}>
                {getLocalizedContent(menuData.joinUs)}
              </Text>
            </TouchableOpacity>
          ) : (
            <SkeletonPlaceholder width={80} height={36} borderRadius={10} />
          )}
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabContainer, {backgroundColor: colors.background.secondary}]}>
          {communityData?.tabs ? (
            tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  activeTab === tab.key && [styles.activeTabButton, {backgroundColor: colors.background.tertiary}]
                ]}
                onPress={() => setActiveTab(tab.key as 'events' | 'messages' | 'biography')}
              >
                <FontAwesome5 
                  name={tab.icon} 
                  size={16} 
                  color={activeTab === tab.key ? colors.background.secondary : colors.text.secondary} 
                />
                <Text style={[
                  styles.tabText,
                  {color: activeTab === tab.key ? colors.background.secondary : colors.text.secondary}
                ]}>
                  {getLocalizedContent(communityData.tabs[tab.key as keyof typeof communityData.tabs])}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            // Show skeleton placeholders for tabs
            tabs.map((tab) => (
              <View key={tab.key} style={styles.tabButton}>
                <FontAwesome5 name={tab.icon} size={16} color={colors.text.secondary} />
                <SkeletonPlaceholder width={60} height={14} borderRadius={4} style={{ marginLeft: 8 }} />
              </View>
            ))
          )}
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>

        {/* Floating Action Button - Only visible in Messages tab */}
        {activeTab === 'messages' && communityData?.messages?.announcement && (
          <TouchableOpacity 
            style={[styles.fab, {backgroundColor: colors.primary}]}
            onPress={() => setShowAnnouncementModal(true)}
          >
            <FontAwesome5 name="plus" size={20} color={colors.background.secondary} />
          </TouchableOpacity>
        )}

        {/* Announcement Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showAnnouncementModal}
          onRequestClose={() => setShowAnnouncementModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, {backgroundColor: colors.background.secondary}]}>
              <View style={[styles.modalHeader, {backgroundColor: colors.background.secondary, borderBottomColor: colors.border.primary}]}>
                <FontAwesome5 name="info-circle" size={24} color={colors.primary} />
                {communityData?.messages?.announcement?.title ? (
                  <Text style={[styles.modalTitle, {color: colors.text.primary}]}>
                    {getLocalizedContent(communityData.messages.announcement.title)}
                  </Text>
                ) : (
                  <SkeletonPlaceholder width={150} height={18} borderRadius={4} style={{ marginLeft: 10, flex: 1 }} />
                )}
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowAnnouncementModal(false)}
                >
                  <FontAwesome5 name="times" size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                {communityData?.messages?.announcement ? (
                  <Text style={[styles.modalMessage, {color: colors.text.primary}]}>
                    {getLocalizedContent({
                      ban: communityData.messages.announcement.ban,
                      eng: communityData.messages.announcement.eng,
                      hin: communityData.messages.announcement.hin
                    })}
                  </Text>
                ) : (
                  <View>
                    <SkeletonPlaceholder width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                    <SkeletonPlaceholder width="95%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                    <SkeletonPlaceholder width="90%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                    <SkeletonPlaceholder width="85%" height={16} borderRadius={4} />
                  </View>
                )}
              </View>
              {communityData?.messages?.announcement?.button ? (
                <TouchableOpacity 
                  style={[styles.modalButton, {backgroundColor: colors.primary}]}
                  onPress={() => setShowAnnouncementModal(false)}
                >
                  <Text style={[styles.modalButtonText, {color: colors.background.secondary}]}>
                    {getLocalizedContent(communityData.messages.announcement.button)}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={[styles.modalButton, {backgroundColor: colors.primary}]}>
                  <SkeletonPlaceholder width={100} height={20} borderRadius={4} />
                </View>
              )}
            </View>
          </View>
        </Modal>
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
    flex: 1,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: '#16213e',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b8b8b',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#e94560',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  eventDescription: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
    lineHeight: 24,
  },
  eventDate: {
    fontSize: 14,
    color: '#e94560',
    fontWeight: '600',
  },
  messageCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  messageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
    lineHeight: 24,
  },
  messageTime: {
    fontSize: 14,
    color: '#8b8b8b',
  },
  biographyCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
  },
  biographyText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'justify',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 0,
    width: '85%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#e94560',
    margin: 20,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.65,
    zIndex: -1,
  },
});

export default CommunityScreen; 