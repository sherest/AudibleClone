import { AudioPlayer } from 'expo-audio';
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useSupabase } from '@/lib/supabase';

type PlayerContextType = {
  player: AudioPlayer;
  book: any;
  setBook: (book: any) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export default function PlayerProvider({ children }: PropsWithChildren) {
  const supabase = useSupabase();
  const [book, setBook] = useState<any | null>(null);

  let uri = book?.audio_url;

  if (!uri && book?.audio_file) {
    const { data } = supabase.storage
      .from('audios')
      .getPublicUrl(book.audio_file);
    uri = data.publicUrl;
  }

  const player = useAudioPlayer({ uri });

  return (
    <PlayerContext.Provider value={{ player, book, setBook }}>
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
