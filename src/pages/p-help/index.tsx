

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface FAQItem {
  id: number;
  icon: string;
  iconColor: string;
  question: string;
  answer: string;
}

const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [globalSearchValue, setGlobalSearchValue] = useState('');

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '情绪疗愈哄睡师 - 帮助中心';
    return () => { document.title = originalTitle; };
  }, []);

  // FAQ数据
  const faqItems: FAQItem[] = [
    {
      id: 1,
      icon: 'fas fa-question',
      iconColor: 'primary',
      question: '如何开始我的第一次情绪疗愈？',
      answer: '您可以通过以下步骤开始：\n1. 在首页点击"开始疗愈"按钮或"情绪选择"入口\n2. 选择最符合您当前状态的情绪标签\n3. （可选）输入文字描述您的感受\n4. 点击"生成疗愈内容"按钮\n5. 系统将为您生成专属的文字、图片和语音内容'
    },
    {
      id: 2,
      icon: 'fas fa-clock',
      iconColor: 'secondary',
      question: '疗愈内容生成需要多长时间？',
      answer: '通常情况下，疗愈内容的生成过程只需要3-5秒。生成时间可能会根据网络状况和内容复杂度略有变化，但我们会确保在最短时间内为您提供优质的疗愈内容。'
    },
    {
      id: 3,
      icon: 'fas fa-volume-up',
      iconColor: 'tertiary',
      question: '如何调整语音播放的音量和语速？',
      answer: '在内容生成结果页面，您可以：\n1. 使用音量滑块调节播放音量\n2. 点击播放控制按钮暂停/继续播放\n3. 在设置页面中，您可以：\n   - 选择语音语速（慢、中、快）\n   - 开启/关闭背景音乐\n   - 选择图片风格偏好'
    },
    {
      id: 4,
      icon: 'fas fa-heart',
      iconColor: 'success',
      question: '我可以收藏喜欢的疗愈内容吗？',
      answer: '当然可以！在内容生成结果页面，您可以：\n1. 点击"收藏"按钮将当前内容添加到收藏夹\n2. 点击"点赞"按钮表达对内容的喜爱\n3. 在"我的收藏"页面查看所有收藏的内容\n4. 随时取消收藏不再需要的内容'
    },
    {
      id: 5,
      icon: 'fas fa-shield-alt',
      iconColor: 'warning',
      question: '我的个人信息和情绪数据安全吗？',
      answer: '我们非常重视您的隐私和数据安全：\n1. 所有数据传输都采用HTTPS加密\n2. 您的情绪数据仅用于为您生成个性化内容\n3. 我们不会与第三方分享您的个人信息\n4. 您可以随时删除历史记录和个人数据\n5. 详细的隐私政策请查看设置页面'
    },
    {
      id: 6,
      icon: 'fas fa-headphones',
      iconColor: 'danger',
      question: '可以在离线状态下使用吗？',
      answer: '目前情绪疗愈哄睡师需要网络连接才能生成新的疗愈内容。不过，您收藏的历史内容可以在离线状态下查看和播放。我们正在开发离线模式功能，敬请期待。'
    }
  ];

  // 处理侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // 处理FAQ展开/收起
  const handleFAQToggle = (faqId: number) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  // 处理在线客服按钮点击
  const handleOnlineChatClick = () => {
    console.log('需要调用第三方接口实现在线客服功能');
    alert('在线客服功能即将开启，敬请期待！');
  };

  // 处理全局搜索
  const handleGlobalSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = globalSearchValue.trim();
      if (searchTerm) {
        navigate(`/history?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  // 处理用户头像点击
  const handleUserAvatarClick = () => {
    navigate('/settings');
  };

  // 处理通知按钮点击
  const handleNotificationClick = () => {
    console.log('显示通知列表');
    // 这里可以添加通知面板的显示逻辑
  };

  // 键盘导航支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const activeElement = document.activeElement;
        if (activeElement?.classList.contains(styles.faqQuestion)) {
          e.preventDefault();
          const faqId = parseInt(activeElement.getAttribute('data-faq-id') || '0');
          handleFAQToggle(faqId);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 获取情绪颜色类名
  const getEmotionColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      primary: 'text-primary bg-primary bg-opacity-10',
      secondary: 'text-secondary bg-secondary bg-opacity-10',
      tertiary: 'text-tertiary bg-tertiary bg-opacity-10',
      success: 'text-success bg-success bg-opacity-10',
      warning: 'text-warning bg-warning bg-opacity-10',
      danger: 'text-danger bg-danger bg-opacity-10'
    };
    return colorMap[color] || 'text-primary bg-primary bg-opacity-10';
  };

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
                value={globalSearchValue}
                onChange={(e) => setGlobalSearchValue(e.target.value)}
                onKeyPress={handleGlobalSearchKeyPress}
                placeholder="搜索历史记录..." 
                className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            </div>
          </div>
          
          {/* 右侧：通知和用户头像 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 rounded-lg hover:bg-bg-secondary transition-colors"
            >
              <i className="fas fa-bell text-text-secondary"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            <div className="relative">
              <button 
                onClick={handleUserAvatarClick}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-bg-secondary transition-colors"
              >
                <img 
                  src="https://s.coze.cn/image/nD4tvhDZedg/" 
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
            className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-primary text-white transition-colors"
          >
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
              <span>首页</span>
              <i className="fas fa-chevron-right mx-2"></i>
              <span>帮助中心</span>
            </nav>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">帮助中心</h1>
                <p className="text-text-secondary">为您解答使用过程中的疑问</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-info to-primary rounded-2xl flex items-center justify-center">
                <i className="fas fa-question-circle text-2xl text-white"></i>
              </div>
            </div>
          </div>

          {/* 常见问题区 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">常见问题</h2>
            <div className="bg-card-bg rounded-2xl shadow-card border border-border-light overflow-hidden">
              {faqItems.map((item) => (
                <div key={item.id} className={styles.faqItem}>
                  <div 
                    className={`${styles.faqQuestion} flex items-center justify-between p-6`}
                    onClick={() => handleFAQToggle(item.id)}
                    data-faq-id={item.id}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleFAQToggle(item.id);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 ${getEmotionColorClass(item.iconColor)} rounded-lg flex items-center justify-center`}>
                        <i className={`${item.icon} text-sm`}></i>
                      </div>
                      <h3 className="font-semibold text-text-primary">{item.question}</h3>
                    </div>
                    <i className={`fas fa-chevron-down text-text-secondary ${styles.faqIcon} ${expandedFAQ === item.id ? styles.faqIconRotated : ''}`}></i>
                  </div>
                  <div className={`${styles.faqAnswer} ${expandedFAQ === item.id ? styles.faqAnswerExpanded : ''} px-6 pb-6`}>
                    <div className="pl-12">
                      <p className="text-text-secondary leading-relaxed">
                        {item.answer.split('\n').map((line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            {index < item.answer.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 使用指南区 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">使用指南</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 功能介绍 */}
              <div className="bg-card-bg rounded-2xl p-8 shadow-card border border-border-light">
                <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                  <i className="fas fa-star text-primary mr-3"></i>
                  核心功能介绍
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">情绪识别</h4>
                      <p className="text-sm text-text-secondary">通过情绪标签选择和文字描述，准确捕捉您当前的情绪状态</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-tertiary to-info rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">多模态内容生成</h4>
                      <p className="text-sm text-text-secondary">生成温暖的文字、治愈的图片和舒缓的语音，全方位疗愈体验</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-success to-warning rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">个性化推荐</h4>
                      <p className="text-sm text-text-secondary">根据您的偏好和历史记录，推荐最适合的疗愈内容</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary to-danger rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">内容管理</h4>
                      <p className="text-sm text-text-secondary">收藏喜爱的内容，回顾历史记录，管理您的疗愈历程</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作步骤 */}
              <div className="bg-card-bg rounded-2xl p-8 shadow-card border border-border-light">
                <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                  <i className="fas fa-list-ol text-primary mr-3"></i>
                  详细操作步骤
                </h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-text-primary mb-2">第一步：表达情绪</h4>
                    <p className="text-sm text-text-secondary">选择情绪标签或输入文字描述，让系统了解您的感受</p>
                  </div>
                  <div className="border-l-4 border-secondary pl-4">
                    <h4 className="font-semibold text-text-primary mb-2">第二步：生成内容</h4>
                    <p className="text-sm text-text-secondary">点击生成按钮，等待系统为您创建专属疗愈内容</p>
                  </div>
                  <div className="border-l-4 border-tertiary pl-4">
                    <h4 className="font-semibold text-text-primary mb-2">第三步：享受疗愈</h4>
                    <p className="text-sm text-text-secondary">阅读文字，欣赏图片，聆听语音，让心灵得到放松</p>
                  </div>
                  <div className="border-l-4 border-success pl-4">
                    <h4 className="font-semibold text-text-primary mb-2">第四步：反馈与收藏</h4>
                    <p className="text-sm text-text-secondary">对内容进行评价，收藏喜欢的作品，帮助我们改进</p>
                  </div>
                  <div className="border-l-4 border-warning pl-4">
                    <h4 className="font-semibold text-text-primary mb-2">第五步：个性化设置</h4>
                    <p className="text-sm text-text-secondary">调整语音、图片、音乐等偏好设置，打造专属体验</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 联系客服信息 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">联系我们</h2>
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-envelope text-2xl"></i>
                  </div>
                  <h3 className="font-semibold mb-2">邮箱客服</h3>
                  <p className="text-sm opacity-90 mb-4">工作日 9:00-18:00</p>
                  <a href="mailto:support@healing-app.com" className="text-white hover:text-opacity-80 transition-colors">
                    support@healing-app.com
                  </a>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-comments text-2xl"></i>
                  </div>
                  <h3 className="font-semibold mb-2">在线客服</h3>
                  <p className="text-sm opacity-90 mb-4">24小时在线</p>
                  <button 
                    onClick={handleOnlineChatClick}
                    className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                  >
                    立即咨询
                  </button>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-phone text-2xl"></i>
                  </div>
                  <h3 className="font-semibold mb-2">电话客服</h3>
                  <p className="text-sm opacity-90 mb-4">工作日 9:00-18:00</p>
                  <p className="text-lg font-bold">400-888-9999</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HelpPage;

