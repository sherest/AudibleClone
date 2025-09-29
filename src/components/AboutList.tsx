import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../providers/ThemeProvider';
import { useLanguage } from '../providers/LanguageContext';
import { AboutItem } from '../hooks/useAboutScreen';

interface AboutListProps {
  items: AboutItem[];
  onItemPress: (item: AboutItem) => void;
}

const AboutList: React.FC<AboutListProps> = ({ items, onItemPress }) => {
  const { colors } = useTheme();
  const { selectedLanguage } = useLanguage();

  const getLocalizedContent = (content: Record<string, string>, fallback: string = 'eng') => {
    const langCode = selectedLanguage?.code || fallback;
    return content[langCode] || content[fallback] || '';
  };

  const renderItem = ({ item }: { item: AboutItem }) => (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: colors.background.secondary }]}
      onPress={() => onItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <FontAwesome5 name="info-circle" size={18} color={colors.primary} />
          <Text style={[styles.itemTitle, { color: colors.text.primary }]}>
            {getLocalizedContent(item.title)}
          </Text>
        </View>
        <Text style={[styles.itemDescription, { color: colors.text.secondary }]} numberOfLines={2}>
          {getLocalizedContent(item.description)}
        </Text>
        <View style={styles.itemFooter}>
          <FontAwesome5 name="chevron-right" size={14} color={colors.text.secondary} />
        </View>
      </View>
    </TouchableOpacity>
  );

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
        <View style={styles.headerLeft}>
          <FontAwesome5 name="list" size={22} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Amrita Lahari
          </Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={items || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
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
