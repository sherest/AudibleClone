import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../providers/ThemeProvider';
import { useLanguage } from '../providers/LanguageContext';
import { AboutItem } from '../hooks/useAboutScreen';

interface AboutDetailProps {
  item: AboutItem;
  onBack: () => void;
}

const AboutDetail: React.FC<AboutDetailProps> = ({ item, onBack }) => {
  const { colors } = useTheme();
  const { selectedLanguage } = useLanguage();

  const getLocalizedContent = (content: Record<string, string>, fallback: string = 'eng') => {
    const langCode = selectedLanguage?.code || fallback;
    return content[langCode] || content[fallback] || '';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Background Image */}
      <ImageBackground 
        source={require('../../assets/gurujibackground.png')} 
        style={styles.backgroundImage}
        resizeMode="repeat"
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background.secondary }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <FontAwesome5 name="info-circle" size={22} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            {getLocalizedContent(item.title)}
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        <View style={[styles.contentCard, { backgroundColor: colors.background.secondary }]}>
          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Overview
            </Text>
            <Text style={[styles.sectionText, { color: colors.text.primary }]}>
              {item.description ? getLocalizedContent(item.description) : 'No description available.'}
            </Text>
          </View>

          {/* Main Content */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Details
            </Text>
            <Text style={[styles.sectionText, { color: colors.text.primary }]}>
              {item.content ? getLocalizedContent(item.content) : 'No content available.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    textAlign: 'center',
  },
  headerRight: {
    width: 36, // Same width as back button for centering
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#ffffff',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
});

export default AboutDetail;
