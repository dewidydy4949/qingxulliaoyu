import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';
import { useAudioManager } from '../../audio/AudioManager';
import { fetchHealingText } from '../../services/aiService';
import DynamicBackground from '../../components/DynamicBackground';

// 子标签映射表
const subTagMapping: Record<string, string> = {
  'work-stress': '工作/学业压力',
  'replaying-moments': '反复回想囧事',
  'future-worry': '担忧未来',
  'random-thoughts': '停不下来的胡思乱想',
  'overanalysis': '过度分析细节',
  'decision-paralysis': '选择困难',
  'breakup': '分手失恋',
  'loneliness': '感到孤单',
  'betrayal': '被背叛伤害',
  'missing-someone': '想念某人',
  'unrequited': '单恋苦涩',
  'friendship-hurt': '友情伤害',
  'anxious-sleep': '焦虑性失眠',
  'irregular-schedule': '作息紊乱',
  'screen-addiction': '睡前刷手机',
  'nightmare': '噩梦困扰',
  'early-awake': '凌晨早醒',
  'racing-mind': '思绪奔涌难眠',
  'no-reason': '莫名的忧伤',
  'weather-influence': '天气影响心情',
  'hormonal': '荷尔蒙波动',
  'past-memories': '触景生情',
  'disappointed': '感到失望',
  'empty-feeling': '内心空洞',
  'social-anxiety': '社交恐惧',
  'performance-pressure': '表现压力',
  'health-worry': '健康焦虑',
  'financial-stress': '经济压力',
  'panic-attack': '恐慌发作',
  'overwhelmed': '感到不知所措',
  'physical-fatigue': '身体疲惫',
  'mental-burnout': '精神倦怠',
  'emotional-drain': '情绪耗竭',
  'overworked': '过度劳累',
  'lack-rest': '缺乏休息',
  'chronic-tired': '慢性疲劳'
};

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
  const { play, pause, isPlaying, isMuted, toggleMute, fadeInPlay, currentTrack } = useAudioManager();
  
  const [moodId] = useState(searchParams.get('mood') || 'overthinking');
  const [subTagId] = useState(searchParams.get('subTag') || '');
  const [healingText, setHealingText] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [showInputOption, setShowInputOption] = useState(false);
  const [inputText, setInputText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const moodInfo = moodConfig[moodId] || moodConfig.overthinking;

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '深夜疗愈空间 - 月光在等你';

    setTimeout(() => {
      setIsContentVisible(true);
    }, 1000);

    // 自动播放音频（用户已经在首页点击了卡片，所以可以自动播放）
    const autoPlayAudio = async () => {
      try {
        // 检查是否已经在播放同一个音频轨道
        if (currentTrack && currentTrack.id === moodInfo.audioTrack && isPlaying) {
          console.log('✅ 音频已在播放，无需重新播放:', moodInfo.audioTrack);
          return;
        }

        // 如果正在播放其他音频，先暂停
        if (isPlaying && currentTrack && currentTrack.id !== moodInfo.audioTrack) {
          pause();
          // 等待一小段时间确保暂停完成
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // 使用 fadeInPlay 实现渐入效果
        await fadeInPlay(moodInfo.audioTrack, 2000);
        console.log('✅ 音频自动播放成功');
      } catch (error) {
        console.warn('⚠️ 音频自动播放失败，用户可能需要手动点击播放按钮:', error);
        // 静默失败，不阻塞用户体验
      }
    };

    // 延迟一点播放，确保页面已加载
    const timer = setTimeout(() => {
      autoPlayAudio();
    }, 500);

    return () => {
      document.title = originalTitle;
      clearTimeout(timer);
      // 移除 pause()，让音频在页面切换时继续播放
      // 只有在用户主动离开应用时才应该停止音频
    };
  }, [pause, fadeInPlay, moodInfo.audioTrack, currentTrack, isPlaying]);

  useEffect(() => {
    const fetchAndDisplayText = async () => {
      await typewriterEffect('正在倾听你的心声...');
      
      try {
        setIsLoading(true);
        const text = await fetchHealingText(moodId, '');
        setHealingText(text);
        setIsLoading(false);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        setDisplayedText('');
        await typewriterEffect(text);
      } catch (error) {
        console.error('Failed to fetch healing text:', error);
        setIsLoading(false);
        setDisplayedText('');
        const errorText = '月光似乎被云层遮住了，网络连接有点不稳定，请再试一次。';
        setHealingText(errorText);
        await typewriterEffect(errorText);
      }
    };

    fetchAndDisplayText();
  }, [moodId, subTagId]);

  const typewriterEffect = async (text: string) => {
    setIsTyping(true);
    setDisplayedText('');
    
    // 更细腻的打字效果 - 逐字显示，像墨水在纸上慢慢晕开
    for (let i = 0; i <= text.length; i++) {
      setDisplayedText(text.substring(0, i));
      // 根据字符类型调整速度，营造更自然的节奏
      const char = text[i - 1];
      const delay = char === '。' || char === '，' || char === '！' || char === '？' 
        ? 120  // 标点符号稍作停顿
        : char === '\n' 
        ? 80   // 换行稍作停顿
        : 50;  // 普通字符
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    setIsTyping(false);
  };

  const handleBackToMoods = () => {
    navigate('/home');
  };

  // 语音识别初始化
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'zh-CN';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          const newInput = userInput + (userInput ? ' ' : '') + transcript;
          setUserInput(newInput);
          setInputText(newInput);
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleChatSubmit = async () => {
    if (!inputText.trim()) {
      return;
    }

    try {
      // 第一步：设置加载状态，显示临时文字
      setIsLoading(true);
      setDisplayedText('');
      setHealingText('正在倾听星空的回响...');
      await typewriterEffect('正在倾听星空的回响...');

      // 第二步：调用 AI 服务
      const text = await fetchHealingText(moodId, inputText);

      // 第三步：更新显示文字，关闭加载状态
      setHealingText(text);
      setIsLoading(false);
      setDisplayedText('');
      await typewriterEffect(text);

      // 清空输入框
      setInputText('');
      setUserInput('');
      setShowInputOption(false);
    } catch (error) {
      // 第四步：错误处理
      console.error('AI Service Error:', error);
      setIsLoading(false);
      const errorText = '月光似乎被云层遮住了，网络连接有点不稳定，请再试一次。';
      setHealingText(errorText);
      setDisplayedText('');
      await typewriterEffect(errorText);
    }
  };

  const handleAudioToggle = async () => {
    console.log('🎧 音频按钮被点击, isPlaying:', isPlaying, 'isMuted:', isMuted);

    // 如果已静音，先取消静音
    if (isMuted) {
      toggleMute();
      return;
    }

    // 如果正在播放，则暂停
    if (isPlaying) {
      console.log('⏸️ 暂停播放');
      pause();
    } else {
      // 如果未播放，则开始播放
      console.log('▶️ 开始播放');
      try {
        await play(moodInfo.audioTrack);
      } catch (error) {
        console.error('播放失败:', error);
        // 静默失败，不显示错误弹窗
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 高科技动态背景 */}
      <DynamicBackground emotion={moodId} interactive={true} />
      
      {/* 粒子效果层 */}
      <div className="particle-container">
        {[...Array(60)].map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* 精致的声音控制按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAudioToggle();
        }}
        className={`fixed top-6 right-6 z-50 w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center group transition-all duration-300 hover:scale-110 ${
          isMuted 
            ? 'bg-white/10 border border-white/20' 
            : isPlaying 
            ? 'bg-white/15 border border-purple-400/40 shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
            : 'bg-white/10 border border-white/20'
        }`}
        aria-label={isMuted ? '取消静音' : isPlaying ? '暂停' : '播放'}
        title={isMuted ? '取消静音' : isPlaying ? '暂停' : '播放'}
      >
        {isMuted ? (
          <i className="fas fa-volume-mute text-white/70 group-hover:text-white text-sm transition-all"></i>
        ) : isPlaying ? (
          <i className="fas fa-volume-up text-purple-300 group-hover:text-purple-200 text-sm transition-all"></i>
        ) : (
          <i className="fas fa-volume-down text-white/60 group-hover:text-white/80 text-sm transition-all"></i>
        )}
      </button>

      {/* 返回按钮 */}
      <button
        onClick={handleBackToMoods}
        className="fixed top-24 left-8 z-50 w-12 h-12 tech-card flex items-center justify-center group transition-all duration-300 hover:scale-110"
        aria-label="返回心情选择"
      >
        <i className="fas fa-arrow-left text-blue-400 group-hover:text-purple-400 group-hover:scale-110 transition-all"></i>
      </button>

      {/* 主内容区域 */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className={`max-w-5xl mx-auto text-center ${isContentVisible ? 'animate-in slide-in-from-bottom duration-1000' : 'opacity-0'}`}>
          {/* 情绪状态显示 */}
          <div className="tech-card p-8 mb-12 relative overflow-hidden">
            <div className="absolute inset-0 data-stream opacity-30"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm flex items-center justify-center tech-card">
                  <span className="text-5xl">{moodInfo.emoji}</span>
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-spin-slow"></div>
              </div>
              <h1 className="tech-title text-3xl md:text-4xl mb-3">
                {moodInfo.title}
              </h1>
              <div className="tech-font text-sm text-gray-400 tracking-wider uppercase">
                深夜疗愈时刻
              </div>
            </div>
          </div>

          {/* AI 生成的疗愈文案 */}
          <div className="tech-card p-10 mb-12 relative">
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs tech-font text-green-400">正在倾听</span>
            </div>
            
            <div className="relative z-10">
              {isTyping && (
                <div className="flex items-center justify-center mb-6">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              )}
              
              <p className={`text-lg md:text-xl md:text-2xl text-gray-100 leading-relaxed font-light ${isTyping ? '' : ''} relative`}
                 style={{
                   fontFamily: "'Noto Serif SC', 'Georgia', 'Times New Roman', serif",
                   fontWeight: 300,
                   letterSpacing: '0.06em',
                   lineHeight: '2.5',
                   textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.1)'
                 }}>
                {displayedText}
                {isTyping && <span className="text-purple-300/60 animate-pulse ml-1">|</span>}
              </p>
            </div>
          </div>

          {/* 底部操作区域 */}
          <div className={`${isContentVisible ? 'animate-in slide-in-from-bottom duration-1000 delay-300' : 'opacity-0'}`}>
            {!showInputOption ? (
              <button
                onClick={() => setShowInputOption(true)}
                className="tech-button group"
              >
                <i className="fas fa-comment-dots mr-2 group-hover:animate-pulse"></i>
                我想和你聊聊
              </button>
            ) : (
              <div className="tech-card p-6 max-w-2xl mx-auto">
                <div className="relative mb-4">
                  <textarea
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      setUserInput(e.target.value);
                    }}
                    placeholder="告诉我你的想法..."
                    className="tech-input min-h-[120px] resize-none pr-12"
                    maxLength={300}
                    autoFocus
                    disabled={isLoading}
                  />
                  {/* 语音输入按钮 */}
                  <button
                    onMouseDown={startListening}
                    onMouseUp={stopListening}
                    onMouseLeave={stopListening}
                    onTouchStart={(e) => { e.preventDefault(); startListening(); }}
                    onTouchEnd={(e) => { e.preventDefault(); stopListening(); }}
                    disabled={isLoading}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isListening 
                        ? 'bg-red-500/20 text-red-400 animate-pulse scale-110' 
                        : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 hover:scale-110'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="按住说话"
                  >
                    <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'} text-sm`}></i>
                  </button>
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setShowInputOption(false);
                      setInputText('');
                      setUserInput('');
                    }}
                    disabled={isLoading}
                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:border-gray-500 hover:text-gray-200 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-times mr-2"></i>
                    取消
                  </button>
                  <button
                    onClick={handleChatSubmit}
                    disabled={!inputText.trim() || isLoading}
                    className="tech-button disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>
                    发送
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImmersiveHealingPage;