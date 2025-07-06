import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';

import { realtimeDb } from '../../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { useLanguage } from '../../providers/LanguageContext';

// Define types for languages and snapshot
interface Language {
  code: string;
  name: string;
}

const Settings = () => {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languagesRef = ref(realtimeDb, 'languages');
        onValue(languagesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const languageList: Language[] = Object.keys(data).map(key => ({ code: data[key].code, name: data[key].name }));
            setLanguages(languageList);
            // Set default language to English if available
            const defaultLanguage = languageList.find(lang => lang.name.toLowerCase() === 'english');
            if (defaultLanguage) {
              setSelectedLanguage(defaultLanguage);
            }
          }
        });
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, []);

  const renderLanguageItem = ({ item }: { item: Language }) => (
    <TouchableOpacity onPress={() => {
      setSelectedLanguage(item);
      setModalVisible(false);
    }}>
      <Text style={{ color: '#FFFFFF', padding: 10 }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className='flex-1 p-5 gap-2'>
      <Text className='text-white'>Select Language</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} className='border border-white rounded-lg p-2'>
        <Text className='text-white'>{selectedLanguage ? selectedLanguage.name : 'Choose a language'}</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: '#333', borderRadius: 10, width: '80%', maxHeight: '50%' }}>
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Settings; 