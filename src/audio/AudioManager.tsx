import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

export interface AudioTrack {
  id: string;
  name: string;
  url: string;
  duration?: number;
}

export interface AudioManagerContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  tracks: AudioTrack[];
  play: (trackId: string) => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  seek: (progress: number) => void;
  loadTracks: (tracks: AudioTrack[]) => void;
}

const AudioManagerContext = createContext<AudioManagerContextType | null>(null);

export const useAudioManager = () => {
  const context = useContext(AudioManagerContext);
  if (!context) {
    throw new Error('useAudioManager must be used within AudioManagerProvider');
  }
  return context;
};

export const AudioManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [tracks, setTracks] = useState<AudioTrack[]>([
    {
      id: 'piano-forest-1',
      name: '森林钢琴曲',
      url: '/audio/piano-forest-1.mp3',
    },
    {
      id: 'piano-meditation-1', 
      name: '冥想钢琴曲',
      url: '/audio/piano-meditation-1.mp3',
    },
    {
      id: 'piano-sleep-1',
      name: '睡眠钢琴曲', 
      url: '/audio/piano-sleep-1.mp3',
    }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
      
      const audio = audioRef.current;
      
      const updateTime = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('ended', handleEnded);
      audio.volume = volume;

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track || !audioRef.current) return;

    if (currentTrack?.id !== trackId) {
      audioRef.current.src = track.url;
      setCurrentTrack(track);
      setProgress(0);
    }

    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(error => console.error('Audio play failed:', error));
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  const seek = (newProgress: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const time = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(newProgress);
    }
  };

  const loadTracks = (newTracks: AudioTrack[]) => {
    setTracks(newTracks);
  };

  const value: AudioManagerContextType = {
    currentTrack,
    isPlaying,
    volume,
    progress,
    tracks,
    play,
    pause,
    setVolume,
    seek,
    loadTracks,
  };

  return (
    <AudioManagerContext.Provider value={value}>
      {children}
    </AudioManagerContext.Provider>
  );
};