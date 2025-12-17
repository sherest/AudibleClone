import { setAudioModeAsync, setIsAudioActiveAsync } from 'expo-audio';
import TrackPlayer, {
  Capability,
  Event,
  AppKilledPlaybackBehavior,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
// TODO: Import Firebase storage functions when implementing Firebase integration
// import { storage } from '@/lib/firebase';

type PlayerContextType = {
  book: any;
  setBook: (book: any) => void;
  currentAlbum: any;
  currentSongIndex: number;
  albumSongs: any[];
  playNextSong: () => void;
  playPreviousSong: () => void;
  setAlbum: (album: any, songIndex?: number) => void;
  clearPlayer: () => void;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seekTo: (seconds: number) => Promise<void>;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export default function PlayerProvider({ children }: PropsWithChildren) {
  // TODO: Replace this with Firebase auth/storage logic
  // const auth = getAuth();
  // const storage = getStorage();
  
  const [book, setBook] = useState<any | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<any | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [albumSongs, setAlbumSongs] = useState<any[]>([]);

  // Configure audio session for background playback
  useEffect(() => {
    const setupAudioSession = async () => {
      try {
        await setAudioModeAsync({
          shouldPlayInBackground: true,
          playsInSilentMode: true,
          interruptionMode: 'doNotMix',
          allowsRecording: false,
          shouldRouteThroughEarpiece: false,
        });
        await setIsAudioActiveAsync(true);
        console.log('Audio session configured for background playback');
      } catch (error) {
        console.error('Failed to configure audio session:', error);
      }
    };

    setupAudioSession();
  }, []);

  // Set up Track Player once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.setRepeatMode(RepeatMode.Queue);
        await TrackPlayer.updateOptions({
          android: {
            appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
          },
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
            Capability.Stop,
          ],
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
          ],
          progressUpdateEventInterval: 2,
          alwaysPauseOnInterruption: true,
        });
        console.log('TrackPlayer setup complete');
      } catch (error) {
        console.error('Failed to setup TrackPlayer:', error);
      }
    })();

    return () => {
      mounted = false;
      // Do not destroy TrackPlayer to allow background playback to continue
    };
  }, []);

  const setAlbum = async (album: any, songIndex: number = 0) => {
    setCurrentAlbum(album);
    setAlbumSongs(album.songs || []);
    setCurrentSongIndex(songIndex);
    
    // Set the first song as the current book
    if (album.songs && album.songs[songIndex]) {
      const song = album.songs[songIndex];
      console.log('Raw song data from album:', song);
      console.log('Song title type:', typeof song.title, song.title);
      console.log('Song singer type:', typeof song.singer, song.singer);
      
      const newBook = {
        id: `${album.title?.eng || 'album'}-${songIndex}`,
        title: song.title || {}, // Ensure it's an object
        author: song.singer || {}, // Ensure it's an object
        audio_url: `${album.basePath?.audio || ''}${song.fileName}`,
        thumbnail_url: album.coverPath || undefined
      };
      console.log('Setting new book:', newBook);
      setBook(newBook);

      try {
        await TrackPlayer.reset();
        const queue = album.songs.map((track: any, index: number) => ({
          id: `${album.title?.eng || 'album'}-${index}`,
          url: `${album.basePath?.audio || ''}${track.fileName}`,
          title: getLocalizedText(track.title),
          artist: getLocalizedText(track.singer),
          artwork: album.coverPath,
        }));
        await TrackPlayer.add(queue);
        await TrackPlayer.skip(songIndex);
        await TrackPlayer.play();
        await TrackPlayer.updateMetadataForTrack(queue[songIndex].id, {
          title: queue[songIndex].title,
          artist: queue[songIndex].artist,
          artwork: queue[songIndex].artwork,
        });
      } catch (error) {
        console.error('Failed to set album queue in TrackPlayer:', error);
      }
    }
  };

  const ensureQueue = async () => {
    const queue = await TrackPlayer.getQueue();
    if (!queue.length && currentAlbum?.songs?.length) {
      const mapped = currentAlbum.songs.map((track: any, index: number) => ({
        id: `${currentAlbum.title?.eng || currentAlbum.albumName?.eng || 'album'}-${index}`,
        url: `${currentAlbum.basePath?.audio || ''}${track.fileName}`,
        title: getLocalizedText(track.title),
        artist: getLocalizedText(track.singer),
        artwork: currentAlbum.coverPath,
      }));
      await TrackPlayer.reset();
      await TrackPlayer.add(mapped);
    }
  };

  const playNextSong = async () => {
    try {
      await ensureQueue();
      const queue = await TrackPlayer.getQueue();
      if (!queue.length) return;
      const nextIndex = (currentSongIndex + 1) % queue.length;
      await TrackPlayer.skip(nextIndex);
      await TrackPlayer.play();
    } catch (error) {
      console.warn('No next track to skip to:', error);
    }
  };

  const playPreviousSong = async () => {
    try {
      await ensureQueue();
      const queue = await TrackPlayer.getQueue();
      if (!queue.length) return;
      const prevIndex = currentSongIndex === 0 ? queue.length - 1 : currentSongIndex - 1;
      await TrackPlayer.skip(prevIndex);
      await TrackPlayer.play();
    } catch (error) {
      console.warn('No previous track to skip to:', error);
    }
  };

  const clearPlayer = async () => {
    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
    } catch (error) {
      console.error('Failed to clear TrackPlayer:', error);
    }
    setBook(null);
    setCurrentAlbum(null);
    setCurrentSongIndex(0);
    setAlbumSongs([]);
  };

  // TrackPlayer status hooks
  const playbackState = usePlaybackState();
  const progress = useProgress();

  // Derived flags
  const currentPlaybackState =
    typeof playbackState === 'object' ? playbackState.state : playbackState;
  const isPlaying = currentPlaybackState === State.Playing;
  const isBuffering = currentPlaybackState === State.Buffering;

  // Keep book/currentSongIndex in sync with TrackPlayer events
  useEffect(() => {
    const sub = TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async ({ index, track }) => {
      if (index === undefined || index === null || track === undefined) return;
      try {
        setCurrentSongIndex(index);
        setBook((prev: any) => ({
          ...(prev || {}),
          id: track.id,
          title: track.title || prev?.title,
          author: track.artist || prev?.author,
          audio_url: (track as any).url,
          thumbnail_url: (track as any).artwork || prev?.thumbnail_url,
        }));
        await TrackPlayer.updateMetadataForTrack(track.id, {
          title: track.title,
          artist: track.artist,
          artwork: (track as any).artwork,
        });
      } catch (error) {
        console.error('Failed to handle track change:', error);
      }
    });

    return () => sub.remove();
  }, []);

  // Helper function to get localized content
  const getLocalizedText = (content: any, fallback: string = 'eng'): string => {
    if (!content) return '';
    if (typeof content === 'string') return content;
    if (typeof content === 'object' && content !== null) {
      return content[fallback] || content['eng'] || '';
    }
    return '';
  };

  const play = async () => {
    await TrackPlayer.play();
  };

  const pause = async () => {
    await TrackPlayer.pause();
  };

  const seekTo = async (seconds: number) => {
    await TrackPlayer.seekTo(seconds);
  };

  // expo-audio currently does not expose lock-screen metadata helpers.
  // Playback continues in background via audio mode set above.

  return (
    <PlayerContext.Provider value={{ 
      book, 
      setBook, 
      currentAlbum, 
      currentSongIndex, 
      albumSongs, 
      playNextSong, 
      playPreviousSong, 
      setAlbum,
      clearPlayer,
      isPlaying,
      isBuffering,
      currentTime: progress.position,
      duration: progress.duration,
      play,
      pause,
      seekTo
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
