import { AudioPlayer } from 'expo-audio';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAudioPlayer } from 'expo-audio';
import * as FileSystem from 'expo-file-system';
// TODO: Import Firebase storage functions when implementing Firebase integration
// import { storage } from '@/lib/firebase';

type PlayerContextType = {
  player: AudioPlayer;
  book: any;
  setBook: (book: any) => void;
  currentAlbum: any;
  currentSongIndex: number;
  albumSongs: any[];
  playNextSong: () => void;
  playPreviousSong: () => void;
  setAlbum: (album: any, songIndex?: number) => void;
  clearPlayer: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export default function PlayerProvider({ children }: PropsWithChildren) {
  // TODO: Replace this with Firebase auth/storage logic
  // const auth = getAuth();
  // const storage = getStorage();
  
  const [book, setBook] = useState<any | null>(null);
  const [audioUri, setAudioUri] = useState<string | undefined>();
  const [currentAlbum, setCurrentAlbum] = useState<any | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [albumSongs, setAlbumSongs] = useState<any[]>([]);

  useEffect(() => {
    getAudioUri();
  }, [book?.id]);

  const setAlbum = async (album: any, songIndex: number = 0) => {
    setCurrentAlbum(album);
    setAlbumSongs(album.songs || []);
    setCurrentSongIndex(songIndex);
    
    // Set the first song as the current book
    if (album.songs && album.songs[songIndex]) {
      const song = album.songs[songIndex];
      const newBook = {
        id: `${album.title?.eng || 'album'}-${songIndex}`,
        title: song.title?.eng || song.title?.hin || song.title?.ban || 'Unknown',
        author: song.singer?.eng || song.singer?.hin || song.singer?.ban || 'Unknown',
        audio_url: `${album.basePath?.audio || ''}${song.fileName}`,
        thumbnail_url: album.coverPath || undefined
      };
      setBook(newBook);
    }
  };

  const playNextSong = () => {
    if (currentAlbum && albumSongs.length > 0) {
      const nextIndex = (currentSongIndex + 1) % albumSongs.length;
      setAlbum(currentAlbum, nextIndex);
    }
  };

  const playPreviousSong = () => {
    if (currentAlbum && albumSongs.length > 0) {
      const prevIndex = currentSongIndex === 0 ? albumSongs.length - 1 : currentSongIndex - 1;
      setAlbum(currentAlbum, prevIndex);
    }
  };

  const clearPlayer = () => {
    // Stop the player if it's playing
    if (player) {
      player.pause();
    }
    // Clear all state
    setBook(null);
    setCurrentAlbum(null);
    setCurrentSongIndex(0);
    setAlbumSongs([]);
    setAudioUri(undefined);
  };

  const getAudioUri = async () => {
    if (!book) {
      return;
    }

    const localUri = await getLocalAudioUri();
    if (localUri) {
      setAudioUri(localUri);
      console.log('Local audio file found');
    } else if (book?.audio_url) {
      setAudioUri(book.audio_url);
      console.log('External audio file found');
    } else if (book.audio_file) {
      // TODO: Replace with Firebase Storage logic
      // const storageRef = ref(storage, `audios/${book.audio_file}`);
      // const downloadURL = await getDownloadURL(storageRef);
      // setAudioUri(downloadURL);
      
      // DUMMY CODE: For now, use a placeholder or external URL
      console.log('Audio file would be fetched from Firebase Storage');
      // Fallback to external URL if available
      setAudioUri(book.audio_url || undefined);
    }
  };

  const getLocalAudioUri = async () => {
    const file = `${FileSystem.documentDirectory}${book.id}.mp3`;
    const exists = await FileSystem.getInfoAsync(file);
    if (exists.exists) {
      return file;
    }
    return null;
  };

  const player = useAudioPlayer({ uri: audioUri });
  console.log('Playing: ', audioUri);

  return (
    <PlayerContext.Provider value={{ 
      player, 
      book, 
      setBook, 
      currentAlbum, 
      currentSongIndex, 
      albumSongs, 
      playNextSong, 
      playPreviousSong, 
      setAlbum,
      clearPlayer
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
