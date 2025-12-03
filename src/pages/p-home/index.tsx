

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { audioConfigs, getAudioUrl, getFallbackAudioUrl } from '../../config/audioConfig';
import { Navigation } from '../../components/Navigation';

// 推荐内容数据接口
interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  audioUrl: string;
}

const HomePage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [globalSearchKeyword, setGlobalSearchKeyword] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');
  const [selectedEmotionTags, setSelectedEmotionTags] = useState<Set<string>>(new Set());
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  
  // 音频播放状态
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const navigate = useNavigate();
  
  // 推荐内容数据 - 从配置文件读取音频路径（使用useMemo缓存）
  const recommendations: RecommendationItem[] = useMemo(() => {
    return audioConfigs.map(config => ({
      id: config.id,
      title: config.title,
      description: config.description,
      duration: config.duration,
      audioUrl: getAudioUrl(config.id)
    }));
  }, []);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '情绪疗愈哄睡师 - 首页';
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
      const hour = now.getHours();
      let currentGreeting = '';
      
      if (hour < 6) {
        currentGreeting = '深夜好';
      } else if (hour < 12) {
        currentGreeting = '早上好';
      } else if (hour < 18) {
        currentGreeting = '下午好';
      } else {
        currentGreeting = '晚上好';
      }
      
      setCurrentTime(timeString);
      setGreeting(currentGreeting);
    };
    
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);
    
    return () => clearInterval(timeInterval);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleEmotionTagClick = (tag: string) => {
    const newSelectedTags = new Set(selectedEmotionTags);
    if (newSelectedTags.has(tag)) {
      newSelectedTags.delete(tag);
    } else {
      newSelectedTags.add(tag);
    }
    setSelectedEmotionTags(newSelectedTags);
  };

  const handleLikeToggle = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedItems = new Set(likedItems);
    if (newLikedItems.has(itemId)) {
      newLikedItems.delete(itemId);
    } else {
      newLikedItems.add(itemId);
    }
    setLikedItems(newLikedItems);
  };

  // 初始化音频元素
  useEffect(() => {
    const items = recommendations;
    items.forEach(item => {
      if (!audioRefs.current[item.id]) {
        // 确保 audioUrl 是有效的字符串
        if (!item.audioUrl || typeof item.audioUrl !== 'string') {
          console.error(`无效的音频URL: ${item.id}`, item.audioUrl);
          return;
        }
        
        // 尝试加载主音频URL
        try {
          const audio = new Audio(item.audioUrl);
          audio.preload = 'metadata';
        
        audio.addEventListener('ended', () => {
          setCurrentPlayingId(null);
        });
        
        audio.addEventListener('error', (e) => {
          console.error(`音频加载失败 (${item.title}), 主URL: ${item.audioUrl}`, e);
          
          // 如果主URL失败，尝试使用备用URL
          const fallbackUrl = getFallbackAudioUrl(item.id);
          if (fallbackUrl && audio.src !== fallbackUrl && !audio.src.includes(fallbackUrl)) {
            console.log(`尝试使用备用音频URL: ${fallbackUrl}`);
            audio.src = fallbackUrl;
            audio.load();
          } else {
            // 如果备用URL也失败，记录错误
            console.error(`所有音频URL都加载失败 (${item.title})`);
            console.error('提示：请检查音频文件是否存在，或配置正确的音频URL');
            setCurrentPlayingId(null);
          }
        });
        
          // 监听备用URL加载成功
          audio.addEventListener('loadeddata', () => {
            console.log(`音频加载成功: ${item.title}`);
          });
          
          audioRefs.current[item.id] = audio;
        } catch (error) {
          console.error(`创建音频对象失败 (${item.title}):`, error);
        }
      }
    });
    
    // 清理函数
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current = {};
    };
  }, [recommendations]);

  // 处理播放/暂停
  const handlePlayClick = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const audio = audioRefs.current[itemId];
    if (!audio) {
      console.error('音频元素未找到');
      return;
    }
    
    // 如果当前正在播放其他音频，先停止
    if (currentPlayingId && currentPlayingId !== itemId) {
      const previousAudio = audioRefs.current[currentPlayingId];
      if (previousAudio) {
        previousAudio.pause();
        previousAudio.currentTime = 0;
      }
    }
    
    // 如果点击的是当前播放的音频，则暂停
    if (currentPlayingId === itemId) {
      audio.pause();
      setCurrentPlayingId(null);
    } else {
      // 播放新音频
      audio.play().then(() => {
        setCurrentPlayingId(itemId);
      }).catch(error => {
        console.error('播放失败:', error);
        // 如果播放失败，尝试重新加载音频
        audio.load();
        audio.play().then(() => {
          setCurrentPlayingId(itemId);
        }).catch(err => {
          console.error('重新加载后播放仍然失败:', err);
          // 提示用户，但不阻塞界面
          if (window.confirm('音频加载失败。这可能是因为音频文件不可用或网络连接问题。\n\n您可以：\n1. 检查网络连接\n2. 联系管理员配置音频文件\n\n点击"确定"查看控制台错误详情，点击"取消"继续使用。')) {
            console.error('音频播放错误详情:', error, err);
          }
        });
      });
    }
  };

  const handleGlobalSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = (e.target as HTMLInputElement).value.trim();
      if (searchTerm) {
        console.log('搜索:', searchTerm);
        navigate(`/history?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  const handleNotificationClick = () => {
    console.log('查看通知');
  };

  const handleUserAvatarClick = () => {
    navigate('/settings');
  };

  const handleStartHealingClick = () => {
    navigate('/emotion-select');
  };

  const handleEmotionSelectClick = () => {
    navigate('/emotion-select');
  };

  const handleCollectionShortcutClick = () => {
    navigate('/collection');
  };

  const handleHistoryShortcutClick = () => {
    navigate('/history');
  };

  const handleSettingsShortcutClick = () => {
    navigate('/settings');
  };

  const handleRecommendationCardClick = () => {
    navigate('/result');
  };

  const emotionTags = ['焦虑', '紧张', '疲惫', '平静'];
  
  // 推荐内容数据（移到组件外部会导致音频初始化问题，保持在这里）

  return (
    <div className={styles.pageWrapper}>
      {/* 导航栏组件 - 多巴胺配色 */}
      <Navigation
        isSidebarCollapsed={isSidebarCollapsed}
        onSidebarToggle={handleSidebarToggle}
        onNotificationClick={handleNotificationClick}
        onUserAvatarClick={handleUserAvatarClick}
        onGlobalSearch={handleGlobalSearch}
        globalSearchKeyword={globalSearchKeyword}
        onSearchChange={setGlobalSearchKeyword}
      />

      {/* 主内容区 - Headspace风格居中布局 */}
      <main className={`${isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded} pt-24 min-h-screen ${styles.transitionAllSmooth}`}>
        <div className="px-6 py-16 max-w-[800px] mx-auto">
          {/* 页面头部 - Headspace极简风格 */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-semibold text-text-primary mb-4 leading-tight tracking-tight">
                欢迎回来，<span className="text-primary">小雨</span>
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">让我们一起开启今天的疗愈之旅，让心灵得到放松和安抚</p>
            </div>
            <div className="text-center">
              <div className={`inline-block px-6 py-3 ${styles.glassCard} mb-6`}>
                <div className="text-2xl font-medium text-text-primary mb-1">{currentTime}</div>
                <div className="text-sm text-text-secondary">{greeting}</div>
              </div>
            </div>
          </div>

          {/* 核心功能区 - Headspace毛玻璃风格 */}
          <section className="mb-24">
            <div className="space-y-6">
              {/* 开始疗愈卡片 - 毛玻璃效果 */}
              <div className={`${styles.glassCard} p-8`}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mr-4">
                    <i className="fas fa-spa text-xl text-primary"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-text-primary mb-1">开始疗愈</h2>
                    <p className="text-sm text-text-secondary">释放内心的压力</p>
                  </div>
                </div>
                <p className="text-base text-text-secondary mb-8 leading-relaxed">选择您当前的情绪状态，让我们为您生成专属的疗愈内容，陪伴您度过每一个需要安抚的时刻</p>
                <button 
                  onClick={handleStartHealingClick}
                  className="w-full bg-primary text-white font-medium py-4 px-6 rounded-2xl hover:bg-primary/90 transition-all text-base shadow-sm"
                >
                  <i className="fas fa-play mr-2"></i>
                  立即开始
                </button>
              </div>

              {/* 快速情绪选择 - 毛玻璃效果 */}
              <div className={`${styles.glassCard} p-8`}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mr-4">
                    <i className="fas fa-heart text-xl text-secondary"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-text-primary mb-1">情绪选择</h2>
                    <p className="text-sm text-text-secondary">表达您的感受，让我们更懂您</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mb-8">
                  {emotionTags.map((tag) => (
                    <span 
                      key={tag}
                      onClick={() => handleEmotionTagClick(tag)}
                      className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                        selectedEmotionTags.has(tag) 
                          ? 'bg-primary text-white shadow-md' 
                          : 'bg-white/50 text-text-primary hover:bg-white/70 border border-white/50'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={handleEmotionSelectClick}
                  className="w-full bg-secondary text-white font-medium py-4 px-6 rounded-2xl hover:bg-secondary/90 transition-all text-base shadow-sm"
                >
                  <i className="fas fa-arrow-right mr-2"></i>
                  选择情绪
                </button>
              </div>
            </div>
          </section>

          {/* 快捷入口区 - Headspace毛玻璃风格 */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-text-primary mb-3">快捷访问</h2>
              <p className="text-text-secondary text-lg">快速访问常用功能</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 我的收藏 - 毛玻璃效果 */}
              <div 
                onClick={handleCollectionShortcutClick}
                className={`${styles.glassCard} p-6 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <i className="fas fa-bookmark text-lg text-primary"></i>
                  </div>
                  <i className="fas fa-arrow-right text-sm text-text-tertiary"></i>
                </div>
                <h3 className="font-semibold text-text-primary mb-2 text-lg">我的收藏</h3>
                <p className="text-sm text-text-secondary mb-3 leading-relaxed">查看收藏的疗愈内容</p>
                <div className="text-2xl font-semibold text-primary">12</div>
              </div>

              {/* 历史记录 - 毛玻璃效果 */}
              <div 
                onClick={handleHistoryShortcutClick}
                className={`${styles.glassCard} p-6 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                    <i className="fas fa-history text-lg text-secondary"></i>
                  </div>
                  <i className="fas fa-arrow-right text-sm text-text-tertiary"></i>
                </div>
                <h3 className="font-semibold text-text-primary mb-2 text-lg">历史记录</h3>
                <p className="text-sm text-text-secondary mb-3 leading-relaxed">回顾过往的疗愈历程</p>
                <div className="text-2xl font-semibold text-secondary">28</div>
              </div>

              {/* 今日推荐 - 毛玻璃效果 */}
              <div className={`${styles.glassCard} p-6 cursor-pointer`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center">
                    <i className="fas fa-star text-lg text-tertiary"></i>
                  </div>
                  <i className="fas fa-arrow-right text-sm text-text-tertiary"></i>
                </div>
                <h3 className="font-semibold text-text-primary mb-2 text-lg">今日推荐</h3>
                <p className="text-sm text-text-secondary mb-3 leading-relaxed">为您精选的疗愈内容</p>
                <div className="text-2xl font-semibold text-tertiary">5</div>
              </div>

              {/* 个性化设置 - 毛玻璃效果 */}
              <div 
                onClick={handleSettingsShortcutClick}
                className={`${styles.glassCard} p-6 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <i className="fas fa-cog text-lg text-accent"></i>
                  </div>
                  <i className="fas fa-arrow-right text-sm text-text-tertiary"></i>
                </div>
                <h3 className="font-semibold text-text-primary mb-2 text-lg">个性化设置</h3>
                <p className="text-sm text-text-secondary mb-3 leading-relaxed">定制您的专属体验</p>
                <div className="text-lg font-medium text-accent">设置</div>
              </div>
            </div>
          </section>

          {/* 使用指南 - Headspace毛玻璃风格 */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-text-primary mb-3">使用指南</h2>
              <p className="text-text-secondary text-lg">简单三步，开启您的疗愈之旅</p>
            </div>
            <div className={`${styles.glassCard} p-10`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-semibold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold text-text-primary mb-4 text-lg">选择情绪</h3>
                  <p className="text-base text-text-secondary leading-relaxed">从情绪标签中选择或输入文字描述您当前的感受</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-semibold text-secondary">2</span>
                  </div>
                  <h3 className="font-semibold text-text-primary mb-4 text-lg">生成内容</h3>
                  <p className="text-base text-text-secondary leading-relaxed">系统将为您生成专属的文字、图片和语音疗愈内容</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-tertiary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-semibold text-tertiary">3</span>
                  </div>
                  <h3 className="font-semibold text-text-primary mb-4 text-lg">享受疗愈</h3>
                  <p className="text-base text-text-secondary leading-relaxed">沉浸在温暖的疗愈内容中，让心灵得到放松和安抚</p>
                </div>
              </div>
            </div>
          </section>

          {/* 推荐内容区 - Headspace毛玻璃风格 */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-text-primary mb-3">为您推荐</h2>
              <p className="text-text-secondary text-lg">精选疗愈内容，陪伴您的每一天</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((item) => {
                const isPlaying = currentPlayingId === item.id;
                const imageUrls = [
                  'https://s.coze.cn/image/nZ4Ah7aGp_I/',
                  'https://s.coze.cn/image/tyWQGnDwbnU/',
                  'https://s.coze.cn/image/qutuwdhOz4k/'
                ];
                const gradientClasses = [
                  'from-orange-100 to-amber-100',
                  'from-orange-200 to-yellow-100',
                  'from-amber-100 to-yellow-100'
                ];
                
                return (
                  <div 
                    key={item.id}
                    onClick={handleRecommendationCardClick}
                    className={`${styles.glassCard} p-6 cursor-pointer`}
                  >
                    <div className={`w-full h-40 bg-gradient-to-br ${gradientClasses[parseInt(item.id) - 1]} rounded-2xl mb-5 flex items-center justify-center overflow-hidden`}>
                      <img 
                        src={imageUrls[parseInt(item.id) - 1]} 
                        alt={item.title} 
                        className="w-full h-full object-cover rounded-2xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    <h3 className="font-semibold text-text-primary mb-2 text-lg">{item.title}</h3>
                    <p className="text-base text-text-secondary mb-4 leading-relaxed">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">{item.duration}</span>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={(e) => handleLikeToggle(item.id, e)}
                          className={`p-2 rounded-xl transition-colors ${
                            likedItems.has(item.id) ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                          }`}
                          title={likedItems.has(item.id) ? '取消点赞' : '点赞'}
                        >
                          <i className={likedItems.has(item.id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                        </button>
                        <button 
                          onClick={(e) => handlePlayClick(item.id, e)}
                          className={`p-2 rounded-xl transition-colors ${
                            currentPlayingId === item.id ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                          }`}
                          title={currentPlayingId === item.id ? '暂停播放' : '开始播放'}
                        >
                          <i className={currentPlayingId === item.id ? 'fas fa-pause' : 'fas fa-play'}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

