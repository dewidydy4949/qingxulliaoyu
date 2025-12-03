

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface FeedbackFormData {
  feedbackType: string;
  relatedContent: string;
  feedbackContent: string;
  contactInfo: string;
}

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 侧边栏状态
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // 表单状态
  const [feedbackFormData, setFeedbackFormData] = useState<FeedbackFormData>({
    feedbackType: '',
    relatedContent: '',
    feedbackContent: '',
    contactInfo: ''
  });
  
  // 其他状态
  const [isShowingSuccessMessage, setIsShowingSuccessMessage] = useState(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
  const [feedbackContentCharCount, setFeedbackContentCharCount] = useState(0);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '情绪疗愈哄睡师 - 反馈与建议';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 检查表单有效性
  useEffect(() => {
    const isTypeValid = feedbackFormData.feedbackType !== '';
    const isContentValid = feedbackFormData.feedbackContent.trim().length > 0 && feedbackFormData.feedbackContent.length <= 500;
    setIsSubmitButtonDisabled(!(isTypeValid && isContentValid));
  }, [feedbackFormData.feedbackType, feedbackFormData.feedbackContent]);

  // 处理侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // 处理反馈类型选择
  const handleFeedbackTypeSelect = (type: string) => {
    setFeedbackFormData(prev => ({
      ...prev,
      feedbackType: type,
      relatedContent: type === '内容反馈' ? prev.relatedContent : ''
    }));
  };

  // 处理反馈内容输入
  const handleFeedbackContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let content = e.target.value;
    if (content.length > 500) {
      content = content.substring(0, 500);
    }
    setFeedbackFormData(prev => ({ ...prev, feedbackContent: content }));
    setFeedbackContentCharCount(content.length);
  };

  // 处理关联内容选择
  const handleRelatedContentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFeedbackFormData(prev => ({ ...prev, relatedContent: e.target.value }));
  };

  // 处理联系方式输入
  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedbackFormData(prev => ({ ...prev, contactInfo: e.target.value }));
  };

  // 处理表单提交
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitButtonDisabled) {
      return;
    }
    
    // 显示成功消息
    setIsShowingSuccessMessage(true);
    
    // 重置表单
    setFeedbackFormData({
      feedbackType: '',
      relatedContent: '',
      feedbackContent: '',
      contactInfo: ''
    });
    setFeedbackContentCharCount(0);
    setIsSubmitButtonDisabled(true);
    
    // 3秒后隐藏成功消息
    setTimeout(() => {
      setIsShowingSuccessMessage(false);
    }, 5000);
  };

  // 处理通知按钮点击
  const handleNotificationClick = () => {
    console.log('通知功能待实现');
  };

  // 处理全局搜索
  const handleGlobalSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('搜索功能待实现');
    }
  };

  // 反馈类型选项配置
  const feedbackTypeOptions = [
    {
      id: 'suggestion',
      type: '功能建议',
      icon: 'fas fa-lightbulb',
      iconColor: 'text-warning',
      title: '功能建议',
      description: '建议新功能或改进现有功能'
    },
    {
      id: 'bug',
      type: 'Bug报告',
      icon: 'fas fa-bug',
      iconColor: 'text-danger',
      title: 'Bug报告',
      description: '报告应用中的错误或问题'
    },
    {
      id: 'content',
      type: '内容反馈',
      icon: 'fas fa-heart',
      iconColor: 'text-primary',
      title: '内容反馈',
      description: '对生成内容的意见和建议'
    },
    {
      id: 'other',
      type: '其他',
      icon: 'fas fa-ellipsis-h',
      iconColor: 'text-text-secondary',
      title: '其他',
      description: '其他类型的反馈'
    }
  ];

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
                onKeyPress={handleGlobalSearchKeyPress}
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
              <Link 
                to="/settings"
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-bg-secondary transition-colors"
              >
                <img 
                  src="https://s.coze.cn/image/joCoLkTuZWY/" 
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
            className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-primary text-white transition-colors"
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
        <div className="p-8 max-w-4xl mx-auto">
          {/* 页面头部 */}
          <div className="mb-8">
            <nav className="text-sm text-text-secondary mb-4">
              <Link to="/home" className="hover:text-primary transition-colors">首页</Link>
              <span className="mx-2">{'>'}</span>
              <span>反馈与建议</span>
            </nav>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">反馈与建议</h1>
                <p className="text-text-secondary">您的意见对我们很重要，帮助我们做得更好</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-info to-secondary rounded-2xl flex items-center justify-center">
                <i className="fas fa-comment-dots text-2xl text-white"></i>
              </div>
            </div>
          </div>

          {/* 反馈表单区 */}
          <section className="mb-8">
            <div className="bg-card-bg rounded-2xl p-8 shadow-card border border-border-light">
              {/* 成功提示消息 */}
              {isShowingSuccessMessage && (
                <div className={`mb-6 p-4 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-xl ${styles.successMessage}`}>
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-success mr-3"></i>
                    <span className="text-success font-medium">感谢您的反馈！我们会认真考虑您的建议。</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* 反馈类型选择 */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-text-primary">
                    反馈类型 <span className="text-danger">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {feedbackTypeOptions.map((option) => (
                      <button 
                        key={option.id}
                        type="button" 
                        onClick={() => handleFeedbackTypeSelect(option.type)}
                        className={`${styles.feedbackTypeOption} px-4 py-3 border border-border-light rounded-xl text-left hover:border-primary transition-all ${
                          feedbackFormData.feedbackType === option.type ? styles.selected : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <i className={`${option.icon} ${option.iconColor} mr-3`}></i>
                          <div>
                            <div className="font-medium">{option.title}</div>
                            <div className="text-sm text-text-secondary">{option.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 关联内容选择 */}
                {feedbackFormData.feedbackType === '内容反馈' && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-text-primary">
                      关联内容 <span className="text-text-secondary text-xs">(可选)</span>
                    </label>
                    <select 
                      value={feedbackFormData.relatedContent}
                      onChange={handleRelatedContentChange}
                      className={`w-full px-4 py-3 border border-border-light rounded-xl ${styles.formInputFocus} transition-all`}
                    >
                      <option value="">请选择相关内容...</option>
                      <option value="content-1">2024-01-15 21:30 - 深度放松冥想</option>
                      <option value="content-2">2024-01-14 22:15 - 星空助眠故事</option>
                      <option value="content-3">2024-01-13 20:45 - 森林白噪音</option>
                      <option value="content-4">2024-01-12 21:20 - 海洋冥想引导</option>
                      <option value="content-5">2024-01-11 23:00 - 雨夜声音</option>
                    </select>
                    <p className="text-xs text-text-secondary">如果是内容反馈，请选择相关的历史内容</p>
                  </div>
                )}

                {/* 反馈内容输入 */}
                <div className="space-y-4">
                  <label htmlFor="feedback-content" className="block text-sm font-medium text-text-primary">
                    反馈内容 <span className="text-danger">*</span>
                  </label>
                  <textarea 
                    id="feedback-content" 
                    rows={6} 
                    placeholder="请详细描述您的意见或建议，我们会认真对待每一条反馈..."
                    value={feedbackFormData.feedbackContent}
                    onChange={handleFeedbackContentChange}
                    className={`w-full px-4 py-3 border border-border-light rounded-xl ${styles.formInputFocus} transition-all resize-none`}
                    required
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-text-secondary">请提供尽可能详细的信息，以便我们更好地理解和处理</p>
                    <span className={`text-xs ${feedbackContentCharCount > 500 ? 'text-danger' : 'text-text-secondary'}`}>
                      {feedbackContentCharCount}/500
                    </span>
                  </div>
                </div>

                {/* 联系方式 */}
                <div className="space-y-4">
                  <label htmlFor="contact-info" className="block text-sm font-medium text-text-primary">
                    联系方式 <span className="text-text-secondary text-xs">(可选)</span>
                  </label>
                  <input 
                    type="text" 
                    id="contact-info" 
                    placeholder="邮箱或手机号，便于我们回复您"
                    value={feedbackFormData.contactInfo}
                    onChange={handleContactInfoChange}
                    className={`w-full px-4 py-3 border border-border-light rounded-xl ${styles.formInputFocus} transition-all`}
                  />
                  <p className="text-xs text-text-secondary">
                    <i className="fas fa-shield-alt mr-1"></i>
                    您的联系方式仅用于回复反馈，我们会严格保护您的隐私
                  </p>
                </div>

                {/* 提交按钮 */}
                <div className="pt-6">
                  <button 
                    type="submit" 
                    className="w-full bg-primary text-white font-semibold py-4 px-6 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitButtonDisabled}
                  >
                    <i className="fas fa-paper-plane mr-2"></i>
                    提交反馈
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* 反馈说明 */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-heart text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">我们重视您的反馈</h3>
                  <p className="text-sm opacity-90 mb-4">
                    每一条反馈都是我们改进产品的重要依据。我们会在24小时内处理您的反馈，并在必要时与您取得联系。
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <i className="fas fa-clock mr-2"></i>
                      <span>24小时内回复</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-lock mr-2"></i>
                      <span>隐私严格保护</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-star mr-2"></i>
                      <span>认真对待每一条</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FeedbackPage;

