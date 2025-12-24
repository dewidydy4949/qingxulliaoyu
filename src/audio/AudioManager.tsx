import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { audioUnlockService } from '../services/AudioUnlockService';

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
  unlockAndPlay: (trackId: string) => Promise<boolean>;
  fadeInPlay: (trackId: string, duration?: number) => Promise<void>;
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
  const [volume, setVolumeState] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // 使用可靠的CDN音频源（Jamendo免费音乐）
  const [tracks] = useState<AudioTrack[]>([
    {
      id: 'rain-ambient',
      name: '雨声环境音',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
    },
    {
      id: 'soft-piano',
      name: '柔和钢琴曲',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_5b29d689f9.mp3',
    },
    {
      id: 'sleep-music',
      name: '睡眠音乐',
      url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
    },
    {
      id: 'nature-sounds',
      name: '自然声音',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    },
    {
      id: 'meditation',
      name: '冥想音乐',
      url: 'https://cdn.pixabay.com/download/audio/2022/01/26/audio_d339a7b9f8.mp3',
    },
    {
      id: 'relaxing-nature',
      name: '放松自然音',
      url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_849f459c5e.mp3',
    }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
      // 设置初始音量为 0.3（不要太大声）
      audioRef.current.volume = 0.3;

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

    console.log('🎵 播放音频:', track.name, track.url);

    try {
      // 设置音频源
      audioRef.current.src = track.url;
      audioRef.current.crossOrigin = 'anonymous'; // 添加跨域支持
      setCurrentTrack(track);
      setProgress(0);

      // 播放音频
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ 音频播放成功');
            setIsPlaying(true);
          })
          .catch((error: any) => {
            console.error('❌ 音频播放失败:', error);
            console.error('❌ 错误名称:', error.name);
            console.error('❌ 错误消息:', error.message);
            setIsPlaying(false);
            alert('音频播放失败，请检查网络连接或更换音频');
          });
      }
    } catch (error) {
      console.error('❌ 播放音频时出错:', error);
      setIsPlaying(false);
      alert('音频播放失败，请检查网络连接或更换音频');
    }
  };

  // 解锁并播放音频 - 简化版
  const unlockAndPlay = async (trackId: string): Promise<boolean> => {
    try {
      // 简化版：直接播放，不依赖 AudioUnlockService
      play(trackId);
      return true;
    } catch (error) {
      console.error('Error in unlockAndPlay:', error);
      return false;
    }
  };

  // 音量渐入播放 - 简化版
  const fadeInPlay = async (trackId: string, duration: number = 2000): Promise<void> => {
    const track = tracks.find(t => t.id === trackId);
    if (!track || !audioRef.current) return;

    try {
      // 直接播放，不使用复杂的渐入逻辑
      audioRef.current.src = track.url;
      setCurrentTrack(track);
      setProgress(0);
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error in fadeInPlay:', error);
    }
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
    unlockAndPlay,
    fadeInPlay,
  };

  return (
    <AudioManagerContext.Provider value={value}>
      {children}
    </AudioManagerContext.Provider>
  );
};