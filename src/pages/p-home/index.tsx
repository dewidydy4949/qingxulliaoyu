import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '心情疗愈师 - 选择你的心情';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      setCurrentTime(timeString);
    };
    
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);
    
    return () => clearInterval(timeInterval);
  }, []);

  const handleMoodSelect = (moodId: string) => {
    if (isTransitioning) return;
    
    setSelectedMood(moodId);
    setCurrentMoodForSubTags(moodId);
    setShowSubTags(true);
  };

  const handleSubTagSelect = (subTagId: string) => {
    if (isTransitioning) return;
    
    setShowSubTags(false);
    setIsTransitioning(true);
    
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
    <div className={`${styles.pageWrapper} min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden`}>
      {/* 动态星云背景 */}
      <div className={styles.nebulaBackground}>
        <div className={styles.nebulaLayer1}></div>
        <div className={styles.nebulaLayer2}></div>
        <div className={styles.nebulaLayer3}></div>
        <div className={styles.starsContainer}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={styles.star}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* 主要内容 */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* 时间显示 */}
        <div className="text-center mb-12">
          <div className={`inline-block px-6 py-3 ${styles.glassCard} mb-8`}>
            <div className={`text-3xl font-light tracking-wide ${styles.timeDisplay}`}>{currentTime}</div>
            <div className={`text-sm ${styles.subtitle}`}>深夜时刻</div>
          </div>
        </div>

        {/* 标题 */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl mb-6 leading-tight ${styles.mainTitle}`}>
            今晚，<span className="font-medium">你的心情是</span>？
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${styles.subtitle}`}>
            选择最贴合你此刻感受的卡片，让我为你准备一份专属的疗愈体验
          </p>
        </div>

        {/* 心情卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {moodOptions.map((mood) => (
            <div
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className={`relative group cursor-pointer transform transition-all duration-700 ${
                selectedMood === mood.id ? 'scale-95 opacity-0' : 'scale-100 opacity-100 hover:scale-102'
              } ${selectedMood && selectedMood !== mood.id ? 'opacity-50' : ''}`}
            >
              <div className={`${styles.glassCard} p-8 h-full min-h-[200px] flex flex-col items-center justify-center text-center relative`}>
                {/* 毛玻璃背景层 */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl" />
                <div className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-0 group-hover:opacity-15 transition-all duration-700 rounded-3xl`} />
                
                {/* 边框光效 */}
                <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-white/20 transition-all duration-500" />
                <div className={`absolute inset-0 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-700 ${styles.glowShadow}`} 
                     style={{ '--glow-color': mood.gradient.includes('purple') ? '#6366f1' : 
                                    mood.gradient.includes('pink') ? '#ec4899' : 
                                    mood.gradient.includes('blue') ? '#3b82f6' : 
                                    mood.gradient.includes('gray') ? '#6b7280' : 
                                    mood.gradient.includes('orange') ? '#f97316' : '#10b981' } as React.CSSProperties} />
                
                {/* 内容层 */}
                <div className="relative z-10">
                  {/* 图标 */}
                  <div className={`text-6xl mb-4 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-lg`}>
                    {mood.emoji}
                  </div>
                  
                  {/* 标题 */}
                  <h3 className="text-xl font-medium text-white mb-3 drop-shadow-sm">
                    {mood.title}
                  </h3>
                  
                  {/* 描述 */}
                  <p className="text-sm text-white/80 leading-relaxed">
                    {mood.description}
                  </p>
                </div>
                
                {/* 悬停时的微光效果 */}
                <div className="absolute top-0 left-0 w-full h-full rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-2 left-2 w-2 h-2 bg-white/40 rounded-full blur-sm" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 bg-white/30 rounded-full blur-md" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="text-center">
          <p className="text-sm text-text-tertiary/60 animate-pulse">
            点击卡片，开启你的疗愈之旅
          </p>
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