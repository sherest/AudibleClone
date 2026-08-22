import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet, useWindowDimensions, Platform, BackHandler } from 'react-native';
import { useLanguage } from '../providers/LanguageContext';
import { useTheme } from '../providers/ThemeProvider';
import { realtimeDb } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';

// Define types for languages and snapshot
interface Language {
  code: string;
  name: string;
}

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal = ({ visible, onClose }: SettingsModalProps) => {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const { colors } = useTheme();
  const { height } = useWindowDimensions();
  const sheetHeight = Math.min(height * 0.7, 560);
  const [languages, setLanguages] = useState<Language[]>([]);



  useEffect(() => {
    const languagesRef = ref(realtimeDb, 'languages');
    const unsubscribe = onValue(languagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const languageList: Language[] = Object.keys(data).map(key => ({
          code: data[key].code,
          name: data[key].name,
        }));
        setLanguages(languageList);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android' || !visible) return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });

    return () => subscription.remove();
  }, [onClose, visible]);

  const getLocalizedLanguageName = (languageCode: string, englishName: string) => {
    const localizedNames: { [key: string]: string } = {
      'eng': 'English',
      'hin': 'हिंदी',
      'ban': 'বাংলা',
      'spa': 'Español',
      'fra': 'Français',
      'deu': 'Deutsch',
      'ita': 'Italiano',
      'por': 'Português',
      'rus': 'Русский',
      'jpn': '日本語',
      'kor': '한국어',
      'chi': '中文',
      'ara': 'العربية',
      'tur': 'Türkçe',
      'nld': 'Nederlands',
      'swe': 'Svenska',
      'nor': 'Norsk',
      'dan': 'Dansk',
      'fin': 'Suomi',
      'pol': 'Polski',
      'cze': 'Čeština',
      'hun': 'Magyar',
      'rum': 'Română',
      'bul': 'Български',
      'gre': 'Ελληνικά',
      'heb': 'עברית',
      'per': 'فارسی',
      'urd': 'اردو',
      'tam': 'தமிழ்',
      'tel': 'తెలుగు',
      'kan': 'ಕನ್ನಡ',
      'mal': 'മലയാളം',
      'mar': 'मराठी',
      'guj': 'ગુજરાતી',
      'pun': 'ਪੰਜਾਬੀ',
      'ben': 'বাংলা',
      'asm': 'অসমীয়া',
      'ori': 'ଓଡ଼ିଆ',
      'sin': 'සිංහල',
      'nep': 'नेपाली',
      'bod': 'བོད་ཡིག',
      'mya': 'မြန်မာဘာသာ',
      'tha': 'ไทย',
      'lao': 'ລາວ',
      'khm': 'ខ្មែរ',
      'vie': 'Tiếng Việt',
      'ind': 'Bahasa Indonesia',
      'msa': 'Bahasa Melayu',
      'fil': 'Filipino',
      'swa': 'Kiswahili',
      'zul': 'isiZulu',
      'xho': 'isiXhosa',
      'afr': 'Afrikaans',
      'amh': 'አማርኛ',
      'hau': 'Hausa',
      'yor': 'Yorùbá',
      'igb': 'Igbo',
      'som': 'Soomaali',
      'orm': 'Afaan Oromoo',
      'tig': 'ትግርኛ',
      'wol': 'Wolof',
      'ful': 'Fulfulde',
      'bam': 'Bamanankan',
      'sus': 'Sosoxui',
      'man': 'Manding',
      'dyu': 'Julakan',
      'son': 'Soŋay',
      'zgh': 'ⵜⴰⵎⴰⵣⵉⵖⵜ',
      'ber': 'Tamaziɣt',
      'kab': 'Taqbaylit',
      'rif': 'Tarifit',
      'shi': 'Tashelhit'
    };
    
    return localizedNames[languageCode] || englishName;
  };

  const renderLanguageItem = ({ item }: { item: Language }) => (
    <TouchableOpacity 
      style={[
        styles.languageItem,
        selectedLanguage?.code === item.code && [styles.selectedLanguageItem, {backgroundColor: colors.primary}]
      ]}
      onPress={() => {
        setSelectedLanguage(item);
        onClose();
      }}
    >
      <Text style={[
        styles.languageText,
        {color: colors.text.primary},
        selectedLanguage?.code === item.code && styles.selectedLanguageText
      ]}>
        {item.name}
      </Text>
      {selectedLanguage?.code === item.code && (
        <Text style={[styles.checkmark, {color: colors.background.secondary}]}>✓</Text>
      )}
    </TouchableOpacity>
  );

  const content = (
    <View style={styles.backdrop}>
      {/* Tap backdrop to close */}
      <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} activeOpacity={1} />

      {/* Sheet */}
      <View style={[styles.sheet, { backgroundColor: colors.background.primary, height: sheetHeight }]}> 
        <View style={[styles.handle]} />

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border?.primary ?? '#333' }]}> 
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Select Language</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, { color: colors.text.primary }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={languages}
          renderItem={renderLanguageItem}
          keyExtractor={(item) => item.code}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={true}
        />
      </View>
    </View>
  );

  if (!visible) {
    return null;
  }

  if (Platform.OS === 'android') {
    return <View style={styles.androidOverlay}>{content}</View>;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {content}
    </Modal>
  );
};

const styles = StyleSheet.create({
  androidOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
    elevation: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    elevation: 12,
    zIndex: 1,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#555',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 6,
  },
  closeButtonText: {
    fontSize: 20,
  },
  list: {
    flex: 1,
    paddingHorizontal: 10,
  },
  listContent: {
    paddingBottom: 10,
  },
  languageItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedLanguageItem: {},
  languageText: {
    fontSize: 16,
  },
  selectedLanguageText: {
    fontWeight: 'bold',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsModal; 