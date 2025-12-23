import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudioManager } from '../../audio/AudioManager';
import DynamicBackground from '../../components/DynamicBackground';
import EmotionSubTags from '../../components/EmotionSubTags';
import styles from './styles.module.css';

const HealingPage: React.FC = () => {
  const navigate = useNavigate();
  const { tracks, play, pause, isPlaying, currentTrack, volume, setVolume, progress, seek } = useAudioManager();
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [selectedSubTag, setSelectedSubTag] = useState<string>('');
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    setSelectedSubTag('');
    setShowMusicPlayer(true);
  };

  const handleSubTagSelect = (subTag: string) => {
    setSelectedSubTag(subTag);
  };

  const emotions = [
    { id: 'happy', label: '快乐', icon: '😊', color: '#FFD700' },
    { id: 'sad', label: '悲伤', icon: '😢', color: '#4169E1' },
    { id: 'calm', label: '平静', icon: '😌', color: '#55EFC4' },
    { id: 'energetic', label: '有活力', icon: '⚡', color: '#FF6348' },
    { id: 'anxious', label: '焦虑', icon: '😰', color: '#FF7675' }
  ];

  return (
    <div className={styles.healingPage}>
      <DynamicBackground emotion={selectedEmotion || 'calm'} />
      
      <div className={styles.content}>
        <button className={styles.backButton} onClick={() => navigate('/home')}>
          ← 返回
        </button>

        <header className={styles.header}>
          <h1 className={styles.title}>心情治愈空间</h1>
          <p className={styles.subtitle}>选择你现在的心情，让音乐帮助你</p>
        </header>

        <div className={styles.emotionGrid}>
          {emotions.map((emotion) => (
            <button
              key={emotion.id}
              className={`${styles.emotionCard} ${selectedEmotion === emotion.id ? styles.selected : ''}`}
              onClick={() => handleEmotionSelect(emotion.id)}
              style={{ borderColor: emotion.color }}
            >
              <div className={styles.emotionIcon}>{emotion.icon}</div>
              <div className={styles.emotionLabel}>{emotion.label}</div>
            </button>
          ))}
        </div>

        {selectedEmotion && (
          <EmotionSubTags 
            emotion={selectedEmotion} 
            onSubTagSelect={handleSubTagSelect}
          />
        )}

        {showMusicPlayer && (
          <div className={styles.musicPlayer}>
            <h3 className={styles.playerTitle}>为你推荐的治愈音乐</h3>
            
            <div className={styles.trackList}>
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className={`${styles.trackItem} ${currentTrack?.id === track.id ? styles.playing : ''}`}
                  onClick={() => currentTrack?.id === track.id ? pause() : play(track.id)}
                >
                  <div className={styles.trackInfo}>
                    <div className={styles.trackName}>{track.name}</div>
                    {currentTrack?.id === track.id && (
                      <div className={styles.playingIndicator}>正在播放...</div>
                    )}
                  </div>
                  <div className={styles.playButton}>
                    {currentTrack?.id === track.id && isPlaying ? '⏸️' : '▶️'}
                  </div>
                </div>
              ))}
            </div>

            {currentTrack && (
              <div className={styles.playerControls}>
                <div className={styles.progressBar}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => seek(Number(e.target.value))}
                    className={styles.progressSlider}
                  />
                </div>
                
                <div className={styles.volumeControl}>
                  <span>🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className={styles.volumeSlider}
                  />
                  <span>{Math.round(volume * 100)}%</span>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedSubTag && (
          <div className={styles.healingMessage}>
            <p>你选择了 <strong>{selectedEmotion}</strong> - <strong>{selectedSubTag}</strong></p>
            <p>让音乐陪伴你度过这个时刻...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealingPage;