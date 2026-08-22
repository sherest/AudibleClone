import React, { Fragment } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import ScreenSafeArea from './ScreenSafeArea';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../providers/ThemeProvider';
import { AboutItem } from '../hooks/useAboutScreen';
import { Fonts } from '../lib/fonts';

interface AboutDetailProps {
  item: AboutItem;
  onBack: () => void;
}

const AboutDetail: React.FC<AboutDetailProps> = ({ item, onBack }) => {
  const { colors } = useTheme();

  return (
    <Fragment>
      <ScreenSafeArea topColor={colors.background.secondary} style={[styles.container, { backgroundColor: colors.background.primary }]}>
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
            <FontAwesome5 name="book" size={22} color={colors.primary} />
            <Text style={[styles.headerTitle, { color: colors.text.primary }]} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
          <View style={[styles.contentCard, { backgroundColor: colors.background.secondary }]}>
            {/* Main Content */}
            <View style={styles.section}>
              <Text style={[styles.sectionText, { color: colors.text.primary }]}>
                {item.content || 'No content available.'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScreenSafeArea>
    </Fragment>
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
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    marginLeft: 12,
    textAlign: 'center',
    fontFamily: Fonts.bengali,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  headerRight: {
    width: 36, // Same width as back button for centering
  },
  content: {
    flex: 1,
    padding: 10,
  },
  contentCard: {
    borderRadius: 12,
    padding: 10,
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
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'justify',
    fontFamily: Fonts.bengali,
    textAlignVertical: 'top',
  },
});

export default AboutDetail;
