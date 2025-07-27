import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useLanguage } from '../../providers/LanguageContext';
import { realtimeDb } from '../../lib/firebase';
import { ref, onValue } from 'firebase/database';

interface LatestUpload {
  title: { [key: string]: string };
  album_name: { [key: string]: string };
  year: string;
  upload_date: string;
}

const Index = () => {
  const { selectedLanguage } = useLanguage();
  const [menuItems, setMenuItems] = useState<any>({});
  const [latestUploads, setLatestUploads] = useState<LatestUpload[]>([]);

  useEffect(() => {
    const fetchMenuItems = () => {
      const menuRef = ref(realtimeDb, 'menu');
      onValue(menuRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setMenuItems(data);
        }
      });
    };

    const fetchLatestUploads = () => {
      const uploadsRef = ref(realtimeDb, 'latest/data');
      onValue(uploadsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setLatestUploads(Object.values(data));
        }
      });
    };

    fetchMenuItems();
    fetchLatestUploads();
  }, [selectedLanguage]);


  return (
    <ScrollView className='flex-1 p-5'>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mb-5'>
        {latestUploads.map((item, index) => (
          <View key={index} className='p-3 bg-red-800 rounded-lg mr-3'>
            <Text className='text-white font-bold'>{item.title[selectedLanguage!.code]}</Text>
            <Text className='text-white'>Album Name: {item.album_name[selectedLanguage!.code]}</Text>
            <Text className='text-white'>Year: {item.year}</Text>
            <Text className='text-white'>Upload Date: {item.upload_date}</Text>
          </View>
        ))}
      </ScrollView>
      <View className='home-menu-items'>
        <TouchableOpacity className='item item-icon-left mb-3'>
          <Text className='text-white'>{menuItems.kirtan?.[selectedLanguage!.code]}</Text>
        </TouchableOpacity>
        <TouchableOpacity className='item item-icon-left mb-3'>
          <Text className='text-white'>{menuItems.satprasanga?.[selectedLanguage!.code]}</Text>
        </TouchableOpacity>
        <TouchableOpacity className='item item-icon-left mb-3'>
          <Text className='text-white'>{menuItems.amritaLahari?.[selectedLanguage!.code]}</Text>
        </TouchableOpacity>
        <TouchableOpacity className='item item-icon-left mb-3'>
          <Text className='text-white'>{menuItems.community?.[selectedLanguage!.code]}</Text>
        </TouchableOpacity>
        <TouchableOpacity className='item item-icon-left mb-3'>
          <Text className='text-white'>{menuItems.joinUs?.[selectedLanguage!.code]}</Text>
        </TouchableOpacity>
      </View>
      <View className='info mt-5'>
        <Text className='text-white'>
          * For downloading the songs go to 
          <Text className='text-blue-500 underline' onPress={() => Linking.openURL('http://www.amritalahari.com')}>www.amritalahari.com</Text>
          or iTunes – search amrita lahari
        </Text>
        <Text className='text-white'>
          * To share kirtans, photos, stories and other Audio visual material of Guruji, please mail us at contact@amritalahari.com
        </Text>
        <Text className='text-white'>
          * To select a different language, go to settings on top right corner
        </Text>
      </View>
    </ScrollView>
  );
};

export default Index; 