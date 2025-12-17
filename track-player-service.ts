import TrackPlayer, { Event, State } from 'react-native-track-player';

/**
 * Background service to handle remote / notification controls.
 */
export default async function trackPlayerService() {
  // Ensure listeners are attached only once per service instance
  TrackPlayer.addEventListener(Event.RemoteDuck, async ({ paused, permanent }) => {
    if (permanent) {
      await TrackPlayer.stop();
      return;
    }
    if (paused) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext().catch(() => {});
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious().catch(() => {});
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => {
    TrackPlayer.seekTo(position);
  });
}

