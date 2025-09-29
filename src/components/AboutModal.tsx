import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ImageBackground, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../providers/ThemeProvider';
import { useLanguage } from '../providers/LanguageContext';

interface AboutData {
  data: Array<{
    ban: string;
    eng: string;
    hin: string;
  }>;
  title: {
    ban: string;
    eng: string;
    hin: string;
  };
}

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
  aboutData: AboutData | null;
}

const AboutModal: React.FC<AboutModalProps> = ({ visible, onClose, aboutData }) => {
  const { colors } = useTheme();
  const { selectedLanguage } = useLanguage();

  const getLocalizedContent = (content: Record<string, string>, fallback: string = 'eng') => {
    const langCode = selectedLanguage?.code || fallback;
    return content[langCode] || content[fallback] || '';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        {/* Background Image */}
        <ImageBackground 
          source={require('../../assets/gurujibackground.png')} 
          style={styles.backgroundImage}
          resizeMode="repeat"
        />
        
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.headerLeft}>
            <FontAwesome5 name="info-circle" size={22} color={colors.primary} />
            {aboutData?.title ? (
              <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                {getLocalizedContent(aboutData.title)}
              </Text>
            ) : (
              <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                About
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome5 name="times" size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        <View style={[styles.contentCard, { backgroundColor: colors.background.secondary }]}>
          {aboutData?.data && Array.isArray(aboutData.data) ? (
            aboutData.data.map((paragraph, index) => (
              <View key={index} style={styles.paragraphContainer}>
                <Text style={[styles.paragraphText, { color: colors.text.primary }]}>
                  {getLocalizedContent(paragraph)}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.paragraphContainer}>
              <Text style={[styles.paragraphText, { color: colors.text.primary }]}>
                Welcome to our app! This is the about section where you can learn more about our mission and values.
              </Text>
            </View>
          )}
        </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contentCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  paragraphContainer: {
    marginBottom: 20,
  },
  paragraphText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
});

export default AboutModal;
