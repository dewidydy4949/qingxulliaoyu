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
  play: (trackId: string) => Promise<void>;
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

  // 使用测试音频链接（雨声白噪音）和本地音频文件作为备用
  const [tracks, setTracks] = useState<AudioTrack[]>([
    {
      id: 'rain-ambient',
      name: '雨声白噪音',
      url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
    },
    {
      id: 'soft-piano',
      name: '冥想钢琴曲',
      url: '/audio/piano-meditation-1.mp3',
    },
    {
      id: 'sleep-music',
      name: '睡眠钢琴曲',
      url: '/audio/piano-sleep-1.mp3',
    },
    {
      id: 'nature-sounds',
      name: '雨声白噪音',
      url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
    },
    {
      id: 'meditation',
      name: '冥想钢琴曲',
      url: '/audio/piano-meditation-1.mp3',
    },
    {
      id: 'relaxing-nature',
      name: '睡眠钢琴曲',
      url: '/audio/piano-sleep-1.mp3',
    }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
      // 设置初始音量为 0.3（不要太大声）
      audioRef.current.volume = 0.3;
      // 设置循环播放（适合白噪音和轻音乐）
      audioRef.current.loop = true;

      const audio = audioRef.current;

      const updateTime = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      const handleEnded = () => {
        // 如果设置了循环，ended 事件不会触发
        // 但为了兼容性，仍然处理
        if (!audio.loop) {
          setIsPlaying(false);
          setProgress(0);
        }
      };

      const handleError = (e: any) => {
        console.error('音频元素错误:', e);
        setIsPlaying(false);
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = async (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track || !audioRef.current) {
      console.warn('❌ 找不到音频轨道或音频元素未初始化');
      return;
    }

    // 如果已经在播放同一个音频，直接返回
    if (currentTrack && currentTrack.id === trackId && isPlaying) {
      console.log('✅ 音频已在播放，无需重新加载:', track.name);
      return;
    }

    console.log('🎵 播放音频:', track.name, track.url);

    try {
      // 先解锁音频上下文（处理浏览器自动播放策略）
      await audioUnlockService.unlockAudio();

      // 如果当前正在播放其他音频，先暂停
      if (isPlaying && currentTrack && currentTrack.id !== trackId) {
        audioRef.current.pause();
      }

      // 检查是否需要重新设置音频源（通过比较 track ID 而不是 URL，因为 URL 可能格式不同）
      const needsReload = !currentTrack || currentTrack.id !== trackId;
      
      if (needsReload) {
        // 设置音频源
        audioRef.current.src = track.url;
        audioRef.current.crossOrigin = 'anonymous';
        // 确保循环播放（适合白噪音和轻音乐）
        audioRef.current.loop = true;
        setCurrentTrack(track);
        setProgress(0);

        // 加载音频
        audioRef.current.load();

        // 等待音频加载完成
        await new Promise<void>((resolve, reject) => {
          if (!audioRef.current) {
            reject(new Error('音频元素不存在'));
            return;
          }

          const audio = audioRef.current!;

          const handleCanPlay = () => {
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('error', handleError);
            resolve();
          };

          const handleError = (e: any) => {
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('error', handleError);
            reject(new Error(`音频加载失败: ${audio.error?.message || '未知错误'}`));
          };

          // 如果已经可以播放，直接 resolve
          if (audio.readyState >= 2) {
            resolve();
            return;
          }

          audio.addEventListener('canplay', handleCanPlay);
          audio.addEventListener('error', handleError);

          // 设置超时（5秒）
          setTimeout(() => {
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('error', handleError);
            reject(new Error('音频加载超时'));
          }, 5000);
        });
      } else {
        // 如果音频源相同，只需要更新当前轨道信息
        setCurrentTrack(track);
        // 如果音频已暂停，确保它能继续播放（但不需要等待加载）
        if (audioRef.current.paused) {
          // 音频已加载，直接尝试播放
          console.log('✅ 恢复播放已加载的音频');
        }
      }

      // 播放音频 - 明确调用 play() 并处理 promise rejection
      try {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          console.log('✅ 音频播放成功');
          setIsPlaying(true);
        } else {
          // 如果没有返回 promise，直接设置为播放状态
          setIsPlaying(true);
        }
      } catch (playError: any) {
        // 处理播放失败（可能是浏览器自动播放策略限制）
        console.warn('⚠️ 音频播放被阻止:', playError.name, playError.message);
        setIsPlaying(false);
        
        // 如果是 NotAllowedError，说明需要用户交互
        if (playError.name === 'NotAllowedError') {
          console.warn('💡 提示：需要用户交互才能播放音频');
        }
        
        // 重新抛出错误，让调用者知道播放失败
        throw playError;
      }
    } catch (error: any) {
      console.error('❌ 音频播放失败:', error);
      console.error('❌ 错误名称:', error.name);
      console.error('❌ 错误消息:', error.message);
      setIsPlaying(false);
      
      // 使用更友好的错误提示（不阻塞用户）
      const errorMessage = error.message || '音频播放失败';
      console.warn('音频播放错误:', errorMessage);
      
      // 尝试使用备用音频或静默失败（不显示 alert）
      // 如果用户需要，可以在 UI 上显示一个非阻塞的提示
    }
  };

  // 解锁并播放音频
  const unlockAndPlay = async (trackId: string): Promise<boolean> => {
    try {
      await play(trackId);
      return true;
    } catch (error) {
      console.error('Error in unlockAndPlay:', error);
      return false;
    }
  };

  // 音量渐入播放
  const fadeInPlay = async (trackId: string, duration: number = 2000): Promise<void> => {
    try {
      // 先正常播放
      await play(trackId);
      
      if (!audioRef.current) return;

      // 然后实现渐入效果
      const audio = audioRef.current;
      const targetVolume = volume;
      const steps = 60;
      const stepDuration = duration / steps;
      let currentStep = 0;

      audio.volume = 0;

      const fadeInterval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        audio.volume = targetVolume * progress;

        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          audio.volume = targetVolume;
        }
      }, stepDuration);
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