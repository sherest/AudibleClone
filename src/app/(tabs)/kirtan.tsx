import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { realtimeDb } from '../../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
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
  );
};

export default Kirtan; 