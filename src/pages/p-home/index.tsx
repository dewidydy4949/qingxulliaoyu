import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudioManager } from '../../audio/AudioManager';
import styles from './styles.module.css';

// 心情选项配置
interface MoodOption {
  id: string;
  emoji: string;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}

// 二级情绪标签配置
interface EmotionTag {
  id: string;
  text: string;
  icon?: string;
}

// 每个主情绪对应的子标签
const emotionSubTags: Record<string, EmotionTag[]> = {
  overthinking: [
    { id: 'work-stress', text: '工作/学业压力', icon: '💼' },
    { id: 'replaying-moments', text: '反复回想囧事', icon: '🔄' },
    { id: 'future-worry', text: '担忧未来', icon: '🔮' },
    { id: 'random-thoughts', text: '停不下来的胡思乱想', icon: '🌪️' },
    { id: 'overanalysis', text: '过度分析细节', icon: '🔬' },
    { id: 'decision-paralysis', text: '选择困难', icon: '⚖️' }
  ],
  heartache: [
    { id: 'breakup', text: '分手失恋', icon: '💔' },
    { id: 'loneliness', text: '感到孤单', icon: '🌙' },
    { id: 'betrayal', text: '被背叛伤害', icon: '⚔️' },
    { id: 'missing-someone', text: '想念某人', icon: '💭' },
    { id: 'unrequited', text: '单恋苦涩', icon: '🥀' },
    { id: 'friendship-hurt', text: '友情伤害', icon: '👥' }
  ],
  insomnia: [
    { id: 'anxious-sleep', text: '焦虑性失眠', icon: '😰' },
    { id: 'irregular-schedule', text: '作息紊乱', icon: '⏰' },
    { id: 'screen-addiction', text: '睡前刷手机', icon: '📱' },
    { id: 'nightmare', text: '噩梦困扰', icon: '😨' },
    { id: 'early-awake', text: '凌晨早醒', icon: '🌅' },
    { id: 'racing-mind', text: '思绪奔涌难眠', icon: '🏃' }
  ],
  sadness: [
    { id: 'no-reason', text: '莫名的忧伤', icon: '🌫️' },
    { id: 'weather-influence', text: '天气影响心情', icon: '🌧️' },
    { id: 'hormonal', text: '荷尔蒙波动', icon: '🌊' },
    { id: 'past-memories', text: '触景生情', icon: '📸' },
    { id: 'disappointed', text: '感到失望', icon: '😔' },
    { id: 'empty-feeling', text: '内心空洞', icon: '🕳️' }
  ],
  anxiety: [
    { id: 'social-anxiety', text: '社交恐惧', icon: '👥' },
    { id: 'performance-pressure', text: '表现压力', icon: '🎭' },
    { id: 'health-worry', text: '健康焦虑', icon: '🏥' },
    { id: 'financial-stress', text: '经济压力', icon: '💰' },
    { id: 'panic-attack', text: '恐慌发作', icon: '🚨' },
    { id: 'overwhelmed', text: '感到不知所措', icon: '😵' }
  ],
  exhausted: [
    { id: 'physical-fatigue', text: '身体疲惫', icon: '😪' },
    { id: 'mental-burnout', text: '精神倦怠', icon: '🔋' },
    { id: 'emotional-drain', text: '情绪耗竭', icon: '🎭' },
    { id: 'overworked', text: '过度劳累', icon: '⚒️' },
    { id: 'lack-rest', text: '缺乏休息', icon: '⏸️' },
    { id: 'chronic-tired', text: '慢性疲劳', icon: '🐌' }
  ]
};

const moodOptions: MoodOption[] = [
  {
    id: 'overthinking',
    emoji: '🤯',
    title: '大脑停不下来',
    description: '思绪纷飞，无法平静',
    gradient: 'from-purple-600 to-indigo-600',
    iconColor: 'text-purple-400'
  },
  {
    id: 'heartache',
    emoji: '💔',
    title: '心里有点难受',
    description: '情绪低落，需要安慰',
    gradient: 'from-pink-600 to-rose-600',
    iconColor: 'text-pink-400'
  },
  {
    id: 'insomnia',
    emoji: '😵‍💫',
    title: '失眠/睡不着',
    description: '辗转反侧，难以入眠',
    gradient: 'from-blue-600 to-cyan-600',
    iconColor: 'text-blue-400'
  },
  {
    id: 'sadness',
    emoji: '🌧️',
    title: '莫名低落',
    description: '情绪低迷，需要陪伴',
    gradient: 'from-gray-600 to-slate-600',
    iconColor: 'text-gray-400'
  },
  {
    id: 'anxiety',
    emoji: '😰',
    title: '焦虑不安',
    description: '心慌意乱，需要平静',
    gradient: 'from-orange-600 to-red-600',
    iconColor: 'text-orange-400'
  },
  {
    id: 'exhausted',
    emoji: '🫠',
    title: '身心俱疲',
    description: '精疲力尽，需要充电',
    gradient: 'from-green-600 to-teal-600',
    iconColor: 'text-green-400'
  }
];

const FlowBotHome: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showSubTags, setShowSubTags] = useState(false);
  const [currentMoodForSubTags, setCurrentMoodForSubTags] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState({ title: '', subtitle: '' });
  const navigate = useNavigate();
  const { unlockAndPlay, fadeInPlay } = useAudioManager();

  // 情绪到音频轨道的映射
  const moodAudioMapping: Record<string, string> = {
    overthinking: 'rain-ambient',
    heartache: 'soft-piano',
    insomnia: 'sleep-music',
    sadness: 'nature-sounds',
    anxiety: 'meditation',
    exhausted: 'relaxing-nature'
  };

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '心情疗愈师 - 选择你的心情';
    return () => { document.title = originalTitle; };
  }, []);

  // 获取北京时间并更新时间和问候语
  useEffect(() => {
    const updateTimeAndGreeting = () => {
      // 获取北京时间
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      const parts = formatter.formatToParts(now);
      const hours = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
      const minutes = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
      
      // 格式化时间显示 HH:mm
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      setCurrentTime(timeString);
      
      // 根据时间段设置问候语
      if (hours >= 5 && hours < 12) {
        // 05:00 - 11:59: 早晨
        setGreeting({
          title: '早安，新的一天开始了',
          subtitle: '无论昨夜如何，今天都是新的开始'
        });
      } else if (hours >= 12 && hours < 18) {
        // 12:00 - 17:59: 午后
        setGreeting({
          title: '午后，给自己喘口气的间隙',
          subtitle: '累了吗？在这里稍微停靠一下'
        });
      } else {
        // 18:00 - 04:59: 夜晚
        setGreeting({
          title: '夜深了，卸下防备吧',
          subtitle: '今晚，月光陪你入睡'
        });
      }
    };
    
    // 立即执行一次
    updateTimeAndGreeting();
    // 每秒更新一次
    const timeInterval = setInterval(updateTimeAndGreeting, 1000);
    
    return () => clearInterval(timeInterval);
  }, []);

  const handleMoodSelect = (moodId: string) => {
    if (isTransitioning) return;
    
    setSelectedMood(moodId);
    setCurrentMoodForSubTags(moodId);
    setShowSubTags(true);
  };

  const handleSubTagSelect = async (subTagId: string) => {
    if (isTransitioning || !currentMoodForSubTags) return;
    
    setShowSubTags(false);
    setIsTransitioning(true);

    // 获取对应的音频轨道
    const audioTrack = moodAudioMapping[currentMoodForSubTags];
    
    // 立即解锁并播放音频（用户交互触发）
    if (audioTrack) {
      try {
        await unlockAndPlay(audioTrack);
        console.log(`Audio unlocked and playing: ${audioTrack}`);
      } catch (error) {
        console.error('Failed to unlock and play audio:', error);
      }
    }
    
    // 延迟导航到疗愈页面，带子标签参数
    setTimeout(() => {
      navigate(`/healing?mood=${currentMoodForSubTags}&subTag=${subTagId}`);
    }, 800);
  };

  const handleSubTagClose = () => {
    setShowSubTags(false);
    setCurrentMoodForSubTags(null);
    setSelectedMood(null);
  };

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0a0e1a 0%, #050810 40%, #000000 100%)'
      }}
    >
      {/* 科技感网格背景 */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 15s linear infinite'
        }}
      />
      
      {/* 科技感数据流效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={`stream-${i}`}
            className="absolute"
            style={{
              left: `${(i * 12.5) + 5}%`,
              top: '-10%',
              width: '2px',
              height: '20%',
              background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.6), transparent)',
              filter: 'blur(1px)',
              animation: `dataFlow ${3 + (i % 3) * 0.5}s linear infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* 科技感光晕效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
            animation: 'glowPulse 4s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
            animation: 'glowPulse 5s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />
      </div>

      {/* 高科技背景 - 科技感粒子效果 */}
      <div className="particle-container">
        {[...Array(40)].map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
              background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.8), rgba(139, 92, 246, 0.8))',
              boxShadow: '0 0 8px rgba(59, 130, 246, 0.6), 0 0 12px rgba(139, 92, 246, 0.4)'
            }}
          />
        ))}
      </div>

      {/* 动态星云背景层 - 缓慢移动的梦境感背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 缓慢移动的星云效果 */}
        <div 
          className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full filter blur-3xl animate-float-slow"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 40%, transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full filter blur-3xl animate-float-slow-reverse"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 70%)',
            animationDelay: '3s'
          }}
        />
        <div 
          className="absolute top-1/2 right-1/3 w-[700px] h-[700px] rounded-full filter blur-3xl animate-breathe"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 70%)',
            animationDelay: '5s'
          }}
        />
      </div>
      
      {/* 主要内容 */}
      <div className="relative z-10 w-full max-w-6xl">
        {/* 时间显示 */}
        <div className="text-center mb-12">
          <div className="tech-card inline-block px-8 py-4 data-stream">
            <div className="tech-font text-4xl mb-2 glow-text">{currentTime || '--:--'}</div>
            <div className="text-xs text-gray-400 tech-font tracking-wider">北京时间</div>
          </div>
        </div>

        {/* 标题 - 动态问候语 */}
        <div className="text-center mb-16">
          <h1 className="tech-title text-5xl md:text-6xl mb-6">
            {greeting.title || '今晚，心情如何？'}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto tracking-wide">
            {greeting.subtitle || '选择最符合你心情的卡片，让我们陪你度过这个夜晚'}
          </p>
        </div>

        {/* 情绪模块网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {moodOptions.map((mood) => (
            <div
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className={`relative group cursor-pointer transition-all duration-700 ${
                selectedMood === mood.id ? 'scale-95 opacity-0' : 'scale-100 opacity-100 hover:scale-105'
              } ${selectedMood && selectedMood !== mood.id ? 'opacity-40' : ''}`}
            >
              <div className="glassmorphism-card p-8 h-full min-h-[220px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                {/* 毛玻璃背景层 */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl transition-all duration-500 group-hover:bg-white/8 group-hover:border-white/20" />
                
                {/* 微光效果 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-0 group-hover:opacity-10 transition-all duration-700 rounded-2xl`} />
                
                {/* 外发光效果（悬停时） */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" 
                     style={{
                       boxShadow: '0 0 40px rgba(139, 92, 246, 0.2), 0 0 80px rgba(59, 130, 246, 0.1)'
                     }} />
                
                {/* 内容层 */}
                <div className="relative z-10">
                  {/* 图标容器 */}
                  <div className="relative mb-4">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">{mood.emoji}</span>
                    </div>
                    {/* 环绕动画 */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:animate-spin-slow"></div>
                  </div>
                  
                  {/* 标题 */}
                  <h3 className="text-xl font-semibold text-white mb-3 tech-font tracking-wide">
                    {mood.title}
                  </h3>
                  
                  {/* 描述 */}
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {mood.description}
                  </p>
                </div>
                
                {/* 悬停时的光点效果 */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-2 left-2 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                  <div className="absolute bottom-2 right-2 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{animationDelay: '0.5s'}} />
                  <div className="absolute top-1/2 right-2 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{animationDelay: '1s'}} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="text-center">
          <div className="tech-card inline-block px-6 py-3">
            <p className="text-sm text-gray-400 tech-font tracking-wider animate-pulse">
              <i className="fas fa-hand-pointer mr-2"></i>
              点击卡片开始陪伴
            </p>
          </div>
        </div>
      </div>

      {/* 过渡动画遮罩 */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-black z-50 animate-fade-in" />
      )}

      {/* 二级情绪标签弹窗 */}
      {showSubTags && currentMoodForSubTags && (
        <div className={styles.subTagOverlay} onClick={handleSubTagClose}>
          <div 
            className={styles.subTagModal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗标题 */}
            <div className={styles.subTagHeader}>
              <div className="text-4xl mb-3">
                {moodOptions.find(m => m.id === currentMoodForSubTags)?.emoji}
              </div>
              <h2 className="text-2xl font-light text-white mb-2">
                具体是因为？
              </h2>
              <p className="text-white/70 text-center max-w-sm">
                选择最符合你当下感受的具体原因
              </p>
            </div>

            {/* 子标签网格 */}
            <div className={styles.subTagGrid}>
              {emotionSubTags[currentMoodForSubTags]?.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleSubTagSelect(tag.id)}
                  className={styles.subTagItem}
                >
                  {tag.icon && <span className="text-2xl mb-2">{tag.icon}</span>}
                  <span className="text-sm text-white/90 text-center leading-tight">
                    {tag.text}
                  </span>
                </button>
              ))}
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={handleSubTagClose}
              className={styles.subTagClose}
            >
              <i className="fas fa-times text-white/70 hover:text-white"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowBotHome;