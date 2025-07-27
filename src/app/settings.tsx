import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
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
    console.log('Settings modal - selected language changed:', selectedLanguage);
  }, [selectedLanguage]);

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
            console.log('Available languages:', languageList);
            setLanguages(languageList);
            // Only set default language if no language is currently selected
            if (!selectedLanguage) {
              const defaultLanguage = languageList.find(lang => lang.name.toLowerCase() === 'english');
              if (defaultLanguage) {
                console.log('Setting default language:', defaultLanguage);
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
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Language</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.currentLanguage}>
              Current: {selectedLanguage ? selectedLanguage.name : 'Choose a language'}
            </Text>
            
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              style={styles.languageList}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.8,
    maxHeight: height * 0.6,
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
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