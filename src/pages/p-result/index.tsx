

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { getRandomHealingImage } from '../../config/healingImages';

const PResultPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 侧边栏状态
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [globalSearchKeyword, setGlobalSearchKeyword] = useState('');
  
  // 音频播放器状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(330); // 默认5分30秒，单位秒
  const [volume, setVolume] = useState(70);
  const [isBgmEnabled, setIsBgmEnabled] = useState(true);
  const audioIntervalRef = useRef<number | null>(null);
  
  // 交互状态
  const [isLiked, setIsLiked] = useState(false);
  const [isCollected, setIsCollected] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // 生成时间（实时北京时间）
  const [generationTime, setGenerationTime] = useState('');
  
  // 音频元素引用
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // 治愈系图片（每次加载时随机选择）
  const [healingImage, setHealingImage] = useState(() => getRandomHealingImage());

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '情绪疗愈哄睡师 - 疗愈结果';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 初始化生成时间（实时北京时间）
  useEffect(() => {
    const updateGenerationTime = () => {
      const now = new Date();
      // 使用北京时间（UTC+8）
      const beijingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hour = String(now.getHours()).padStart(2, '0');
      const minute = String(now.getMinutes()).padStart(2, '0');
      setGenerationTime(`${year}年${month}月${day}日 ${hour}:${minute}`);
    };
    
    updateGenerationTime();
    // 每分钟更新一次时间
    const timeInterval = setInterval(updateGenerationTime, 60000);
    
    return () => clearInterval(timeInterval);
  }, []);

  // 初始化音频元素
  useEffect(() => {
    // 创建音频元素
    const audio = new Audio('/audio/piano-meditation-1.mp3');
    audio.volume = volume / 100;
    audio.preload = 'metadata';
    
    // 监听音频加载
    audio.addEventListener('loadedmetadata', () => {
      // 音频加载成功后，更新总时长
      const duration = Math.floor(audio.duration);
      if (duration > 0 && !isNaN(duration)) {
        setTotalTime(duration);
      }
    });
    
    // 监听音频播放结束
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });
    
    // 监听音频时间更新
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(Math.floor(audio.currentTime));
    });
    
    // 监听音频错误
    audio.addEventListener('error', (e) => {
      console.error('音频加载失败:', e);
      // 如果本地文件不存在，尝试使用备用URL
      if (audio.src.includes('/audio/piano-meditation-1.mp3')) {
        audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        audio.load();
      }
    });
    
    audioRef.current = audio;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // 同步音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // 音频播放控制（使用实际音频元素）
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error('播放失败:', error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.target) {
        e.preventDefault();
        handlePlayPause();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]);

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算进度百分比
  const getProgressPercentage = (): number => {
    return (currentTime / totalTime) * 100;
  };

  // 处理侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // 处理全局搜索
  const handleGlobalSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = (e.target as HTMLInputElement).value.trim();
      if (searchTerm) {
        navigate(`/history?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  // 处理播放/暂停
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (currentTime >= totalTime || currentTime === 0) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  // 处理音量调节
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  // 处理背景音乐开关
  const handleBgmToggle = () => {
    setIsBgmEnabled(!isBgmEnabled);
  };

  // 处理图片点击
  const handleImageClick = () => {
    setShowImageModal(true);
  };

  // 关闭图片模态框
  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  // 处理点赞
  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  // 处理收藏
  const handleCollect = () => {
    setIsCollected(!isCollected);
  };

  // 处理不喜欢
  const handleDislike = () => {
    if (confirm('您确定不喜欢这个内容吗？我们会为您重新生成。')) {
      navigate('/emotion-select');
    }
  };

  // 处理分享
  const handleShare = () => {
    setShowShareModal(true);
  };

  // 关闭分享模态框
  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  // 复制分享链接
  const handleCopyLink = async () => {
    try {
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      alert('分享链接已复制到剪贴板');
      setShowShareModal(false);
    } catch (error) {
      alert('复制失败，请手动复制链接');
    }
  };

  // 分享到微信
  const handleShareWechat = () => {
    alert('即将跳转到微信分享');
  };

  // 分享到微博
  const handleShareWeibo = () => {
    const shareText = '我在情绪疗愈哄睡师找到了很棒的疗愈内容，推荐给你！';
    const shareUrl = window.location.href;
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
    window.open(weiboUrl, '_blank', 'width=600,height=400');
  };

  // 重新生成
  const handleRegenerate = () => {
    if (confirm('确定要重新生成内容吗？当前内容将会被新内容替换。')) {
      navigate('/emotion-select');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className={`fixed top-0 left-0 right-0 h-16 bg-card-bg border-b border-border-light z-50 ${styles.glassEffect}`}>
        <div className="flex items-center justify-between h-full px-8">
          {/* 左侧：Logo和产品名称 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSidebarToggle}
              className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all group"
            >
              <i className="fas fa-bars text-primary group-hover:scale-110 transition-transform"></i>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-moon text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-text-primary">情绪疗愈哄睡师</h1>
            </div>
          </div>
          
          {/* 中间：搜索框 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="搜索历史记录..." 
                value={globalSearchKeyword}
                onChange={(e) => setGlobalSearchKeyword(e.target.value)}
                onKeyPress={handleGlobalSearch}
                className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            </div>
          </div>
          
          {/* 右侧：通知和用户头像 */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-lg hover:bg-bg-secondary transition-colors">
              <i className="fas fa-bell text-text-secondary"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            <div className="relative">
              <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-bg-secondary transition-colors">
                <img 
                  src="https://s.coze.cn/image/LZkV0iNo8SA/" 
                  alt="用户头像" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:block text-sm font-medium text-text-primary">小雨</span>
                <i className="fas fa-chevron-down text-xs text-text-secondary"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-card-bg border-r border-border-light z-40 ${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded} ${styles.transitionAllSmooth}`}>
        <nav className="p-4 space-y-2">
          <Link 
            to="/home" 
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
          >
            <i className="fas fa-home text-lg"></i>
            {!isSidebarCollapsed && <span>首页</span>}
          </Link>
          <Link 
            to="/emotion-select" 
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
          >
            <i className="fas fa-heart text-lg"></i>
            {!isSidebarCollapsed && <span>情绪选择</span>}
          </Link>
          <Link 
            to="/history" 
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
          >
            <i className="fas fa-history text-lg"></i>
            {!isSidebarCollapsed && <span>历史记录</span>}
          </Link>
          <Link 
            to="/collection" 
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
          >
            <i className="fas fa-bookmark text-lg"></i>
            {!isSidebarCollapsed && <span>我的收藏</span>}
          </Link>
          <Link 
            to="/settings" 
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
          >
            <i className="fas fa-cog text-lg"></i>
            {!isSidebarCollapsed && <span>设置</span>}
          </Link>
          <Link 
            to="/feedback" 
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
          >
            <i className="fas fa-comment-dots text-lg"></i>
            {!isSidebarCollapsed && <span>反馈建议</span>}
          </Link>
          <Link 
            to="/help" 
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
          >
            <i className="fas fa-question-circle text-lg"></i>
            {!isSidebarCollapsed && <span>帮助中心</span>}
          </Link>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className={`${isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded} pt-16 min-h-screen ${styles.transitionAllSmooth}`}>
        <div className="p-10 max-w-7xl mx-auto">
          {/* 页面头部 */}
          <div className="mb-8">
            <nav className="text-sm text-text-secondary mb-4">
              <Link to="/home" className="hover:text-primary transition-colors">首页</Link>
              <span className="mx-2">{'>'}</span>
              <Link to="/emotion-select" className="hover:text-primary transition-colors">情绪选择</Link>
              <span className="mx-2">{'>'}</span>
              <span>疗愈结果</span>
            </nav>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">您的专属疗愈</h1>
                <p className="text-text-secondary">为您精心定制的疗愈内容</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-text-secondary">生成时间</div>
                <div className="text-lg font-semibold text-primary">{generationTime || '加载中...'}</div>
              </div>
            </div>
          </div>

          {/* 文字内容区 */}
          <section className="mb-8">
            <div className="bg-card-bg rounded-xl p-8 border border-border-light">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mr-4">
                  <i className="fas fa-quote-left text-xl text-white"></i>
                </div>
                <h2 className="text-xl font-bold text-text-primary">温暖治愈文字</h2>
              </div>
              <div className="text-lg leading-relaxed text-text-primary space-y-4">
                <p>亲爱的小雨，我知道此刻的你可能感到有些焦虑和疲惫。生活中的压力有时会像乌云一样笼罩着我们，但请相信，每一片乌云背后都有阳光在等待着。</p>
                <p>深呼吸，感受空气缓缓进入你的身体，再慢慢呼出。想象自己站在一片宁静的森林中，听着鸟儿的歌唱，感受微风轻抚你的脸颊。</p>
                <p>你已经很努力了，不要对自己太苛刻。给自己一些时间和空间，允许自己感受这些情绪，然后轻轻地放下它们。</p>
                <p>今晚，让我们一起放松身心，让疲惫的心灵得到充分的休息。明天又是崭新的一天，充满了无限的可能。</p>
              </div>
            </div>
          </section>

          {/* 图片展示区 */}
          <section className="mb-8">
            <div className="bg-card-bg rounded-xl p-8 border border-border-light">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-tertiary to-info rounded-xl flex items-center justify-center mr-4">
                  <i className="fas fa-image text-xl text-white"></i>
                </div>
                <h2 className="text-xl font-bold text-text-primary">治愈系图片</h2>
              </div>
              <div className="flex justify-center">
                <img 
                  src={healingImage.url} 
                  alt={healingImage.alt} 
                  className={`w-full max-w-4xl rounded-2xl shadow-soft ${styles.imageZoom}`}
                  onClick={handleImageClick}
                  onError={(e) => {
                    // 如果图片加载失败，尝试使用备用图片
                    const target = e.target as HTMLImageElement;
                    if (target.src !== 'https://s.coze.cn/image/PqtMLUDbr6U/') {
                      target.src = 'https://s.coze.cn/image/PqtMLUDbr6U/';
                      target.alt = '宁静的森林风景，阳光透过树叶洒下温暖的光芒';
                    }
                  }}
                />
              </div>
              <p className="text-center text-sm text-text-secondary mt-4">点击图片可放大查看</p>
            </div>
          </section>

          {/* 音频播放区 */}
          <section className="mb-8">
            <div className="bg-card-bg rounded-xl p-8 border border-border-light">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-warning rounded-xl flex items-center justify-center mr-4">
                  <i className="fas fa-headphones text-xl text-white"></i>
                </div>
                <h2 className="text-xl font-bold text-text-primary">舒缓语音</h2>
              </div>
              
              {/* 音频播放器 */}
              <div className="bg-bg-secondary rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={handlePlayPause}
                      className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-lg`}></i>
                    </button>
                    <div>
                      <div className="font-semibold text-text-primary">温柔哄睡语音</div>
                      <div className="text-sm text-text-secondary">{formatTime(totalTime)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={handleBgmToggle}
                      className={`p-2 transition-colors ${isBgmEnabled ? 'text-primary' : 'text-text-secondary'}`}
                    >
                      <i className="fas fa-music text-lg"></i>
                    </button>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-volume-up text-text-secondary"></i>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-2 bg-border-light rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                
                {/* 进度条 */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-text-secondary">{formatTime(currentTime)}</span>
                  <div className="flex-1 h-2 bg-border-light rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${styles.audioProgress} rounded-full transition-all duration-300`}
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-text-secondary">{formatTime(totalTime)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 操作按钮区 */}
          <section className="mb-8">
            <div className="bg-card-bg rounded-xl p-8 border border-border-light">
              <h2 className="text-xl font-bold text-text-primary mb-6">您的反馈</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {/* 点赞按钮 */}
                <button 
                  onClick={handleLike}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                    isLiked ? 'bg-primary text-white' : 'bg-bg-secondary hover:bg-primary hover:text-white'
                  }`}
                >
                  <i className="fas fa-thumbs-up text-2xl mb-2"></i>
                  <span className="text-sm font-medium">喜欢</span>
                </button>
                
                {/* 收藏按钮 */}
                <button 
                  onClick={handleCollect}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                    isCollected ? 'bg-warning text-white' : 'bg-bg-secondary hover:bg-warning hover:text-white'
                  }`}
                >
                  <i className="fas fa-bookmark text-2xl mb-2"></i>
                  <span className="text-sm font-medium">收藏</span>
                </button>
                
                {/* 不喜欢按钮 */}
                <button 
                  onClick={handleDislike}
                  className="flex flex-col items-center p-4 bg-bg-secondary rounded-xl hover:bg-danger hover:text-white transition-all"
                >
                  <i className="fas fa-thumbs-down text-2xl mb-2"></i>
                  <span className="text-sm font-medium">不喜欢</span>
                </button>
                
                {/* 分享按钮 */}
                <button 
                  onClick={handleShare}
                  className="flex flex-col items-center p-4 bg-bg-secondary rounded-xl hover:bg-tertiary hover:text-white transition-all"
                >
                  <i className="fas fa-share-alt text-2xl mb-2"></i>
                  <span className="text-sm font-medium">分享</span>
                </button>
                
                {/* 重新生成按钮 */}
                <button 
                  onClick={handleRegenerate}
                  className="flex flex-col items-center p-4 bg-bg-secondary rounded-xl hover:bg-secondary hover:text-white transition-all"
                >
                  <i className="fas fa-redo text-2xl mb-2"></i>
                  <span className="text-sm font-medium">重新生成</span>
                </button>
              </div>
              
              {/* 反馈说明 */}
              <div className="text-center">
                <p className="text-sm text-text-secondary">您的反馈将帮助我们为您提供更好的疗愈内容</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 图片放大模态框 */}
      {showImageModal && (
        <div className={`fixed inset-0 z-50 ${styles.modalBackdrop}`} onClick={handleCloseImageModal}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative">
              <button 
                onClick={handleCloseImageModal}
                className="absolute -top-4 -right-4 w-10 h-10 bg-danger text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors z-10"
              >
                <i className="fas fa-times"></i>
              </button>
              <img 
                src={healingImage.url} 
                alt={healingImage.alt} 
                className="max-w-full max-h-full rounded-2xl shadow-soft"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  // 如果图片加载失败，尝试使用备用图片
                  const target = e.target as HTMLImageElement;
                  if (target.src !== 'https://s.coze.cn/image/PqtMLUDbr6U/') {
                    target.src = 'https://s.coze.cn/image/PqtMLUDbr6U/';
                    target.alt = '宁静的森林风景，阳光透过树叶洒下温暖的光芒';
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 分享模态框 */}
      {showShareModal && (
        <div className={`fixed inset-0 z-50 ${styles.modalBackdrop}`} onClick={handleCloseShareModal}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-card-bg rounded-2xl p-8 max-w-md w-full shadow-soft" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-text-primary">分享内容</h3>
                <button 
                  onClick={handleCloseShareModal}
                  className="w-8 h-8 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center space-x-3 p-4 bg-primary text-white rounded-xl hover:bg-secondary transition-all"
                >
                  <i className="fas fa-link"></i>
                  <span>复制分享链接</span>
                </button>
                <button 
                  onClick={handleShareWechat}
                  className="w-full flex items-center justify-center space-x-3 p-4 bg-success text-white rounded-xl hover:bg-opacity-90 transition-all"
                >
                  <i className="fab fa-weixin"></i>
                  <span>分享到微信</span>
                </button>
                <button 
                  onClick={handleShareWeibo}
                  className="w-full flex items-center justify-center space-x-3 p-4 bg-danger text-white rounded-xl hover:bg-opacity-90 transition-all"
                >
                  <i className="fab fa-weibo"></i>
                  <span>分享到微博</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PResultPage;

