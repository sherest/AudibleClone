import React, { Fragment, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground, Image } from 'react-native';
import ScreenSafeArea from './ScreenSafeArea';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../providers/ThemeProvider';
import { useLanguage } from '../providers/LanguageContext';
import { AboutItem } from '../hooks/useAboutScreen';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../lib/firebase';
import { Fonts } from '../lib/fonts';
import SkeletonPlaceholder from './SkeletonPlaceholder';
// @ts-ignore
import amritaLahariData from '../../assets/amrita_lehri.json';

interface AboutListProps {
  items: AboutItem[];
  onItemPress: (item: AboutItem) => void;
}

interface MenuData {
  amritaLahari: { [key: string]: string };
  community: { [key: string]: string };
  joinUs: { [key: string]: string };
  kirtan: { [key: string]: string };
  satprasanga: { [key: string]: string };
}

const AboutList: React.FC<AboutListProps> = ({ items, onItemPress }) => {
  const { colors } = useTheme();
  const { selectedLanguage } = useLanguage();
  const [menuData, setMenuData] = useState<MenuData | null>(null);

  const getLocalizedContent = (content: Record<string, string>, fallback: string = 'eng') => {
    const langCode = selectedLanguage?.code || fallback;
    return content[langCode] || content[fallback] || '';
  };

  useEffect(() => {
    const menuRef = ref(realtimeDb, 'menu');
    const unsubscribe = onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setMenuData(data);
    });
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: { item: AboutItem }) => (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: colors.background.secondary }]}
      onPress={() => onItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <FontAwesome5 name="book" size={18} color={colors.primary} />
          <Text style={[styles.itemTitle, { color: colors.text.primary }]} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        <View style={styles.itemFooter}>
          <FontAwesome5 name="chevron-right" size={14} color={colors.text.secondary} />
        </View>
      </View>
    </TouchableOpacity>
  );

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
        <View style={styles.headerLeft}>
          <Image source={require('../../assets/img/lahari-icon-selected.png')} 
          style={{width: 24, height: 24, borderRadius: 100}} resizeMode='contain' />
          {menuData?.amritaLahari ? (
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
              {getLocalizedContent(menuData.amritaLahari)}
            </Text>
          ) : (
            <SkeletonPlaceholder width={120} height={22} borderRadius={4} style={{ marginLeft: 15 }} />
          )}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={items || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              No items available at the moment.
            </Text>
          </View>
        }
      />
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
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  listContainer: {
    padding: 20,
  },
  itemContainer: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  itemContent: {
    padding: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 20,
    marginLeft: 12,
    flex: 1,
    fontFamily: Fonts.bengali,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  itemFooter: {
    alignItems: 'flex-end',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AboutList;
