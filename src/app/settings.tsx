import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { useLanguage } from '../providers/LanguageContext';
import { realtimeDb } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';

const { width, height } = Dimensions.get('window');

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
  const [languages, setLanguages] = useState<Language[]>([]);



  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languagesRef = ref(realtimeDb, 'languages');
        onValue(languagesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const languageList: Language[] = Object.keys(data).map(key => ({ 
              code: data[key].code, 
              name: data[key].name 
            }));

            setLanguages(languageList);
            // Only set default language if no language is currently selected
            if (!selectedLanguage) {
              const defaultLanguage = languageList.find(lang => lang.name.toLowerCase() === 'english');
              if (defaultLanguage) {

                setSelectedLanguage(defaultLanguage);
              }
            }
          }
        });
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, [selectedLanguage]);

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
      'shi': 'Tashelhit',
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
      'nep': 'नेपालী',
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
        selectedLanguage?.code === item.code && styles.selectedLanguageItem
      ]}
      onPress={() => {
        setSelectedLanguage(item);
        onClose();
      }}
    >
      <Text style={[
        styles.languageText,
        selectedLanguage?.code === item.code && styles.selectedLanguageText
      ]}>
        {item.name}
      </Text>
      {selectedLanguage?.code === item.code && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Language</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              style={styles.languageList}
            />
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContainer: {
    width: width * 0.8,
    maxHeight: height * 0.6,
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#16213e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#16213e',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#ffffff',
  },
  content: {
    padding: 20,
  },
  currentLanguage: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  currentLanguageCode: {
    color: '#8b8b8b',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  languageList: {
    maxHeight: 300,
  },
  languageItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedLanguageItem: {
    backgroundColor: '#e94560',
  },
  languageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  selectedLanguageText: {
    fontWeight: 'bold',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsModal; 