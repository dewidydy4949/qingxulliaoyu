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
  isMuted: boolean;
  tracks: AudioTrack[];
  play: (trackId: string) => void;
  pause: () => void;
  toggleMute: () => void;
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
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tracks, setTracks] = useState<AudioTrack[]>([
    {
      id: 'rain-ambient',
      name: '雨声环境音',
      url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
    },
    {
      id: 'soft-piano',
      name: '柔和钢琴曲',
      url: 'https://actions.google.com/sounds/v1/ambiences/magical_chime.ogg',
    },
    {
      id: 'sleep-music',
      name: '睡眠音乐',
      url: 'https://actions.google.com/sounds/v1/ambiences/overnight_silence.ogg',
    },
    {
      id: 'nature-sounds',
      name: '自然声音',
      url: 'https://actions.google.com/sounds/v1/weather/thunder_crack.ogg',
    },
    {
      id: 'meditation',
      name: '冥想音乐',
      url: 'https://actions.google.com/sounds/v1/ambiences/rolling_brook.ogg',
    },
    {
      id: 'relaxing-nature',
      name: '放松自然音',
      url: 'https://actions.google.com/sounds/v1/weather/wind.ogg',
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

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
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
    isMuted,
    tracks,
    play,
    pause,
    toggleMute,
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