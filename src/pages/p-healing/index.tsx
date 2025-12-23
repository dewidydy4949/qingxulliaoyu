import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';
import { useAudioManager } from '../../audio/AudioManager';
import { fetchHealingText, HealingTextResponse } from '../../services/aiService';

// 心情配置
const moodConfig: Record<string, { title: string; emoji: string; bgVideo: string; audioTrack: string }> = {
  overthinking: {
    title: '让思绪缓缓流淌',
    emoji: '🤯',
    bgVideo: 'rain-window',
    audioTrack: 'rain-ambient'
  },
  heartache: {
    title: '让温暖拥抱你的心',
    emoji: '💔',
    bgVideo: 'fireplace',
    audioTrack: 'soft-piano'
  },
  insomnia: {
    title: '与月光一同入眠',
    emoji: '😵‍💫',
    bgVideo: 'night-sky',
    audioTrack: 'sleep-music'
  },
  sadness: {
    title: '让情绪自然流淌',
    emoji: '🌧️',
    bgVideo: 'gentle-rain',
    audioTrack: 'nature-sounds'
  },
  anxiety: {
    title: '在平静中找到安宁',
    emoji: '😰',
    bgVideo: 'calm-lake',
    audioTrack: 'meditation'
  },
  exhausted: {
    title: '让身心慢慢恢复',
    emoji: '🫠',
    bgVideo: 'forest-breeze',
    audioTrack: 'relaxing-nature'
  }
};

const ImmersiveHealingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { play, pause, isPlaying, isMuted, toggleMute } = useAudioManager();
  
  const [moodId] = useState(searchParams.get('mood') || 'overthinking');
  const [displayedText, setDisplayedText] = useState('');
  const [showInputOption, setShowInputOption] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const moodInfo = moodConfig[moodId] || moodConfig.overthinking;

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '疗愈空间 - 正在为你温柔陪伴';
    
    // 延迟显示内容，营造沉浸感
    setTimeout(() => {
      setIsContentVisible(true);
    }, 1000);

    // 等待用户交互后播放音乐
    if (hasUserInteracted) {
      const playAudioWithDelay = async () => {
        try {
          await play(moodInfo.audioTrack);
        } catch (error) {
          console.error('Audio play failed:', error);
          // 如果播放失败，静音后重试
          setTimeout(() => {
            play(moodInfo.audioTrack);
          }, 100);
        }
      };
      
      setTimeout(playAudioWithDelay, 500);
    }

    return () => { 
      document.title = originalTitle;
      pause(); // 页面离开时停止音乐
    };
  }, [hasUserInteracted, moodInfo.audioTrack]);

  // AI 文案获取和打字机效果
  useEffect(() => {
    const fetchAndDisplayText = async () => {
      try {
        const response: HealingTextResponse = await fetchHealingText({
          mood: moodId,
          reason: '',
        });
        
        if (response.success) {
          await typewriterEffect(response.text);
        } else {
          await typewriterEffect('深夜的星光，正温柔地注视着你。');
        }
      } catch (error) {
        console.error('Failed to fetch healing text:', error);
        await typewriterEffect('深夜的星光，正温柔地注视着你。');
      }
    };

    fetchAndDisplayText();
  }, [moodId]);

  // 打字机效果
  const typewriterEffect = async (text: string) => {
    setIsTyping(true);
    setDisplayedText('');
    
    for (let i = 0; i <= text.length; i++) {
      setDisplayedText(text.substring(0, i));
      await new Promise(resolve => setTimeout(resolve, 60)); // 60ms per character
    }
    
    setIsTyping(false);
  };

  const handleUserInteraction = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
  };

  const handleBackToMoods = () => {
    navigate('/home');
  };

  const handleSubmitInput = async () => {
    if (userInput.trim()) {
      setShowInputOption(false);
      const inputText = userInput.trim();
      setUserInput('');
      
      setDisplayedText('');
      setIsTyping(false);

      try {
        const response: HealingTextResponse = await fetchHealingText({
          mood: moodId,
          reason: '',
          userInput: inputText,
        });
        
        if (response.success) {
          await typewriterEffect(response.text);
        } else {
          await typewriterEffect('谢谢你分享这些，我在这里静静地陪伴着你。');
        }
      } catch (error) {
        console.error('Failed to fetch healing response:', error);
        await typewriterEffect('谢谢你分享这些，我在这里静静地陪伴着你。');
      } finally {
        // 清理完成
      }
    }
  };

  return (
    <div 
      className={`${styles.immersiveHealing} min-h-screen relative overflow-hidden`}
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      {/* 背景视频/图片 */}
      <div className={styles.backgroundContainer}>
        <div className={`${styles.backgroundOverlay} ${styles[`bg-${moodInfo.bgVideo}`]}`} />
        <div className={styles.vignette} />
      </div>

      {/* 音频控制按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        className={`${styles.audioButton} ${isPlaying ? styles.active : ''} ${!hasUserInteracted ? styles.pulse : ''}`}
        aria-label={isMuted ? '开启声音' : '静音'}
      >
        <i className={`fas ${isMuted || !isPlaying ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
        {!hasUserInteracted && <span className={styles.audioHint}>点击开启声音</span>}
      </button>

      {/* 返回按钮 */}
      <button
        onClick={handleBackToMoods}
        className={styles.backButton}
        aria-label="返回心情选择"
      >
        <i className="fas fa-times"></i>
      </button>

      {/* 主内容区域 */}
      <main className={styles.mainContent}>
        <div className={`max-w-4xl mx-auto px-6 py-12 text-center ${isContentVisible ? styles.visible : ''}`}>
          {/* 心情标题 */}
          <div className={`${styles.moodHeader} mb-16`}>
            <div className="text-6xl mb-4 animate-pulse">{moodInfo.emoji}</div>
            <h1 className="text-4xl md:text-5xl font-light text-white mb-2 leading-tight">
              {moodInfo.title}
            </h1>
          </div>

          {/* AI 生成的疗愈文案 */}
          <div className={`${styles.textContainer} mb-20`}>
            <p className={`${styles.healingText} ${isTyping ? styles.typing : ''} ${isContentVisible ? styles.visible : ''}`}>
              {displayedText}
              {isTyping && <span className={styles.cursor}>|</span>}
            </p>
          </div>

          {/* 底部操作区域 */}
          <div className={`${styles.bottomActions} ${isContentVisible ? styles.visible : ''}`}>
            {!showInputOption ? (
              <button
                onClick={() => setShowInputOption(true)}
                className={styles.talkMoreButton}
              >
                <i className="fas fa-comment-dots mr-2"></i>
                我想多说两句
              </button>
            ) : (
              <div className={styles.inputContainer}>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="在这里告诉我更多你的想法..."
                  className={styles.textInput}
                  rows={3}
                  maxLength={300}
                  autoFocus
                />
                <div className={styles.inputActions}>
                  <button
                    onClick={() => {
                      setShowInputOption(false);
                      setUserInput('');
                    }}
                    className={styles.cancelButton}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSubmitInput}
                    disabled={!userInput.trim()}
                    className={styles.submitButton}
                  >
                    发送
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 装饰性粒子效果 */}
      <div className={styles.particleContainer}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`${styles.particle} ${styles[`particle-${i + 1}`]}`}
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImmersiveHealingPage;