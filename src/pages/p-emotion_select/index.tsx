

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface EmotionData {
  emotion: string;
  icon: string;
}

const EmotionSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [emotionDescription, setEmotionDescription] = useState('');

  const emotionOptions: EmotionData[] = [
    { emotion: '焦虑', icon: 'fas fa-exclamation-triangle' },
    { emotion: '紧张', icon: 'fas fa-bolt' },
    { emotion: '悲伤', icon: 'fas fa-tint' },
    { emotion: '压力大', icon: 'fas fa-weight-hanging' },
    { emotion: '疲惫', icon: 'fas fa-bed' },
    { emotion: '平静', icon: 'fas fa-leaf' },
    { emotion: '愉悦', icon: 'fas fa-smile' },
    { emotion: '其他', icon: 'fas fa-ellipsis-h' }
  ];

  const quickSuggestions = [
    { text: '我感到很焦虑，无法集中注意力', label: '感到焦虑，无法集中' },
    { text: '工作压力很大，想要放松一下', label: '工作压力大，想放松' },
    { text: '晚上总是失眠，希望能好好睡一觉', label: '失眠，想好好睡觉' },
    { text: '心情低落，需要一些温暖的安慰', label: '心情低落，需要安慰' }
  ];

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '情绪疗愈哄睡师 - 情绪选择';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev => {
      if (prev.includes(emotion)) {
        return prev.filter(e => e !== emotion);
      } else {
        return [...prev, emotion];
      }
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setEmotionDescription(value);
    }
  };

  const handleQuickSuggestionClick = (text: string) => {
    setEmotionDescription(text);
  };

  const handleGenerateContent = () => {
    if (isGenerateButtonEnabled) {
      const userInput = {
        selectedEmotions: selectedEmotions,
        description: emotionDescription.trim()
      };
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('userEmotionInput', JSON.stringify(userInput));
      }
      
      navigate('/result');
    }
  };

  const handleClearInput = () => {
    setSelectedEmotions([]);
    setEmotionDescription('');
  };

  const isGenerateButtonEnabled = selectedEmotions.length > 0 || emotionDescription.trim().length > 0;

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className={`fixed top-0 left-0 right-0 h-16 bg-card-bg border-b border-border-light z-50 ${styles.glassEffect}`}>
        <div className="flex items-center justify-between h-full px-6">
          {/* 左侧：Logo和产品名称 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSidebarToggle}
              className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
            >
              <i className="fas fa-bars text-text-secondary"></i>
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
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const searchTerm = (e.target as HTMLInputElement).value.trim();
                    if (searchTerm) {
                      navigate(`/history?search=${encodeURIComponent(searchTerm)}`);
                    }
                  }
                }}
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
              <Link to="/settings" className="flex items-center space-x-2 p-1 rounded-lg hover:bg-bg-secondary transition-colors">
                <img 
                  src="https://s.coze.cn/image/uV220CHunIg/" 
                  alt="用户头像" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:block text-sm font-medium text-text-primary">小雨</span>
                <i className="fas fa-chevron-down text-xs text-text-secondary"></i>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-card-bg border-r border-border-light z-40 ${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded} ${styles.transitionAllSmooth}`}>
        <nav className="p-4 space-y-2">
          <Link to="/home" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors">
            <i className="fas fa-home text-lg"></i>
            {!isSidebarCollapsed && <span>首页</span>}
          </Link>
          <Link to="/emotion-select" className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-primary text-white transition-colors">
            <i className="fas fa-heart text-lg"></i>
            {!isSidebarCollapsed && <span>情绪选择</span>}
          </Link>
          <Link to="/history" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors">
            <i className="fas fa-history text-lg"></i>
            {!isSidebarCollapsed && <span>历史记录</span>}
          </Link>
          <Link to="/collection" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors">
            <i className="fas fa-bookmark text-lg"></i>
            {!isSidebarCollapsed && <span>我的收藏</span>}
          </Link>
          <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors">
            <i className="fas fa-cog text-lg"></i>
            {!isSidebarCollapsed && <span>设置</span>}
          </Link>
          <Link to="/feedback" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors">
            <i className="fas fa-comment-dots text-lg"></i>
            {!isSidebarCollapsed && <span>反馈建议</span>}
          </Link>
          <Link to="/help" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors">
            <i className="fas fa-question-circle text-lg"></i>
            {!isSidebarCollapsed && <span>帮助中心</span>}
          </Link>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className={`${isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded} pt-16 min-h-screen ${styles.transitionAllSmooth}`}>
        <div className="p-8 max-w-7xl mx-auto">
          {/* 页面头部 */}
          <div className="mb-8">
            <nav className="text-sm text-text-secondary mb-4">
              <Link to="/home" className="hover:text-primary transition-colors">首页</Link>
              <span className="mx-2">{'>'}</span>
              <span>情绪选择</span>
            </nav>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">选择您的情绪</h1>
                <p className="text-text-secondary">告诉我们您现在的感受，让我们为您提供最贴心的疗愈</p>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center">
                <i className="fas fa-heart text-3xl text-white"></i>
              </div>
            </div>
          </div>

          {/* 情绪标签选择区 */}
          <section className="mb-12">
            <div className="bg-card-bg rounded-3xl p-8 shadow-card border border-border-light">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                <i className="fas fa-tags text-primary mr-3"></i>
                选择情绪标签
              </h2>
              <p className="text-text-secondary mb-8">
                点击选择最符合您当前状态的情绪标签，可以选择多个
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {emotionOptions.map((item) => (
                  <div
                    key={item.emotion}
                    onClick={() => handleEmotionToggle(item.emotion)}
                    className={`${styles.emotionTag} ${
                      selectedEmotions.includes(item.emotion) 
                        ? `${styles.emotionTagSelected} bg-primary text-white` 
                        : 'bg-bg-secondary text-text-secondary hover:bg-primary hover:text-white'
                    } rounded-2xl p-4 text-center transition-all`}
                  >
                    <i className={`${item.icon} text-2xl mb-2`}></i>
                    <div className="font-medium">{item.emotion}</div>
                  </div>
                ))}
              </div>
              
              {selectedEmotions.length > 0 && (
                <div>
                  <div className="flex items-center mb-2">
                    <i className="fas fa-check-circle text-success mr-2"></i>
                    <span className="text-sm font-medium text-text-primary">已选择情绪：</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmotions.map((emotion) => (
                      <span key={emotion} className="px-3 py-1 bg-primary text-white rounded-full text-sm">
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 文字描述输入区 */}
          <section className="mb-12">
            <div className="bg-card-bg rounded-3xl p-8 shadow-card border border-border-light">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                <i className="fas fa-pen text-tertiary mr-3"></i>
                详细描述您的感受
              </h2>
              <p className="text-text-secondary mb-6">
                用文字更详细地描述您的情绪状态，这将帮助我们为您生成更精准的疗愈内容
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="emotion-description" className="block text-sm font-medium text-text-primary mb-3">
                    请描述您现在的感受或遇到的问题：
                  </label>
                  <textarea 
                    id="emotion-description" 
                    name="emotion-description"
                    rows={6} 
                    placeholder="例如：今天工作压力很大，感觉很焦虑，晚上总是睡不着..."
                    value={emotionDescription}
                    onChange={handleDescriptionChange}
                    className={`w-full px-4 py-3 bg-bg-secondary border border-border-light rounded-xl ${styles.formInputFocus} resize-none transition-all`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-text-secondary">
                      <i className="fas fa-info-circle mr-1"></i>
                      详细的描述能帮助我们更好地理解您的需求
                    </span>
                    <span className={`text-xs ${emotionDescription.length > 500 ? 'text-danger' : 'text-text-secondary'}`}>
                      {emotionDescription.length}/500
                    </span>
                  </div>
                </div>
                
                {/* 快捷输入建议 */}
                <div className="bg-bg-secondary rounded-xl p-4">
                  <div className="text-sm font-medium text-text-primary mb-3">
                    <i className="fas fa-lightbulb text-warning mr-2"></i>
                    快捷输入建议
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.map((suggestion, index) => (
                      <button 
                        key={index}
                        onClick={() => handleQuickSuggestionClick(suggestion.text)}
                        className="px-3 py-1 bg-white text-text-secondary rounded-lg text-sm hover:bg-primary hover:text-white transition-colors"
                      >
                        {suggestion.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 操作按钮区 */}
          <section className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGenerateContent}
                disabled={!isGenerateButtonEnabled}
                className={`bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 px-12 rounded-2xl hover:shadow-lg transition-all transform hover:scale-105 ${
                  !isGenerateButtonEnabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <i className="fas fa-magic mr-3"></i>
                生成专属疗愈内容
              </button>
              <button 
                onClick={handleClearInput}
                className="bg-white text-text-secondary border border-border-light font-semibold py-4 px-12 rounded-2xl hover:bg-bg-secondary transition-all"
              >
                <i className="fas fa-undo mr-3"></i>
                清空输入
              </button>
            </div>
          </section>

          {/* 温馨提示 */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-info to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-heart text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">温馨提示</h3>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>{'• 您的情绪表达将被严格保密，仅用于为您生成疗愈内容'}</li>
                    <li>{'• 选择的情绪标签和文字描述越详细，生成的内容越贴合您的需求'}</li>
                    <li>{'• 如果您暂时无法准确描述，可以先选择情绪标签开始'}</li>
                    <li>{'• 我们理解情绪的复杂性，您可以随时调整和修改您的输入'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EmotionSelectPage;

