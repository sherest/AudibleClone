import React, { Fragment, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { realtimeDb } from '../../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { usePlayer } from '../../providers/PlayerProvider';

interface Song {
  fileName: string;
}

interface KirtanData {
  cover: string;
  coverPath?: string;
  coverPathRequest?: boolean;
  songs: Song[];
}

const Kirtan = () => {
  const { setBook } = usePlayer();
  const [kirtanData, setKirtanData] = useState<KirtanData[]>([]);
  const [basePath, setBasePath] = useState({ image: '', audio: '' });

  useEffect(() => {
    const fetchKirtanData = () => {
      const kirtanRef = ref(realtimeDb, 'kirtan');
      onValue(kirtanRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setKirtanData(data.data || []);
          setBasePath({
            image: data.basePath.image,
            audio: data.isFirebaseAudio ? data.basePath.audio : data.fallbackBasePath.audio,
          });
        }
      });
    };

    fetchKirtanData();
  }, []);

  const getCoverImage = async (index: number) => {
    const oKirtan = kirtanData[index];
    if (!oKirtan.coverPathRequest) {
      oKirtan.coverPathRequest = true;
      const storage = getStorage();
      const fileReference = await getDownloadURL(storageRef(storage, basePath.image + oKirtan.cover));
      oKirtan.coverPath = fileReference;
      setKirtanData([...kirtanData]); // Trigger re-render
    }
    return oKirtan.coverPath;
  };

  const addToPlayList = async (index: number) => {
    const oKirtan = kirtanData[index];
    const storage = getStorage();
    const audioUrl = basePath.audio + oKirtan.songs[0]?.fileName;

    // Ensure coverPath is fetched
    const coverPath = await getCoverImage(index);

    const book = {
      id: `kirtan-${index}`,
      title: `Kirtan ${index + 1}`,
      author: 'Unknown', // Replace with actual author if available
      audio_url: audioUrl,
      thumbnail_url: coverPath
    };
    setBook(book);
  };

  return (
    <Fragment>
    <SafeAreaView className='bg-[#1a1a2e]'></SafeAreaView>
    <SafeAreaView className='flex-1 bg-[#0f3460]'>
      {/* Header with Greeting */}
      <View className='flex-row items-center p-[20px] bg-[#1a1a2e]'>
        <View className='flex-1 flex-row items-center'>
          <MaterialIcons name="music-note" size={24} color="#e94560" style={{ marginRight: 10 }} />
          <Text className='text-white text-[24px] font-bold'>
            Kirtan
          </Text>
        </View>
      </View>
    <ScrollView className='flex-1 p-5'>
      {kirtanData.map((kirtan, index) => (
        <View key={index} className='p-3 rounded-lg mb-3'>
          <Text className='text-white font-bold'>Kirtan {index + 1}</Text>
          {kirtan.coverPath ? (
            <Image source={{ uri: kirtan.coverPath }} className='w-full h-40' />
          ) : (
            <Text>Loading...</Text>
          )}
          <TouchableOpacity onPress={() => addToPlayList(index)}>
            <Text className='text-blue-500 underline'>Add to Playlist</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
    </Fragment>
  );
};

export default Kirtan; 