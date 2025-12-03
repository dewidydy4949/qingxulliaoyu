

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface SettingState {
  accountSecurity: boolean;
  notification: boolean;
  privacy: boolean;
  contentPreference: boolean;
}

interface FormData {
  emailNotification: boolean;
  browserNotification: boolean;
  dataCollection: boolean;
  historySave: boolean;
  selectedStyle: string;
  voiceSpeed: number;
  backgroundMusic: boolean;
}

const SettingsPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [settingStates, setSettingStates] = useState<SettingState>({
    accountSecurity: true,
    notification: true,
    privacy: true,
    contentPreference: true
  });
  const [formData, setFormData] = useState<FormData>({
    emailNotification: true,
    browserNotification: false,
    dataCollection: true,
    historySave: true,
    selectedStyle: 'style-3d-cartoon',
    voiceSpeed: 1,
    backgroundMusic: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '情绪疗愈哄睡师 - 设置';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSettingToggle = (section: keyof SettingState) => {
    setSettingStates(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleStyleSelect = (styleId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedStyle: styleId
    }));
  };

  const handleVoiceSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      voiceSpeed: parseInt(event.target.value)
    }));
  };

  const handleSwitchChange = (field: keyof FormData, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('保存设置:', formData);
    
    setIsSaving(false);
  };

  const handleChangePassword = () => {
    alert('修改密码功能正在开发中');
  };

  const handleChangePhone = () => {
    alert('更换手机号功能正在开发中');
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
                placeholder="搜索历史记录..." 
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const searchTerm = (e.target as HTMLInputElement).value.trim();
                    if (searchTerm) {
                      window.location.href = `/history?search=${encodeURIComponent(searchTerm)}`;
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
              <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-bg-secondary transition-colors">
                <img 
                  src="https://s.coze.cn/image/H_KQfUGBxFQ/" 
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
            className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-primary text-white transition-colors"
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
        <div className="p-8 max-w-7xl mx-auto">
          {/* 页面头部 */}
          <div className="mb-8">
            <nav className="text-sm text-text-secondary mb-4">
              <span>首页</span>
              <i className="fas fa-chevron-right mx-2"></i>
              <span>设置</span>
            </nav>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">设置</h1>
                <p className="text-text-secondary">个性化您的使用体验</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                <i className="fas fa-cog text-2xl text-white"></i>
              </div>
            </div>
          </div>

          {/* 设置内容 */}
          <div className="space-y-6">
            {/* 账号安全设置 */}
            <div className={`${styles.settingSection} ${settingStates.accountSecurity ? 'expanded' : 'collapsed'} bg-card-bg rounded-2xl shadow-card border border-border-light`}>
              <div 
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => handleSettingToggle('accountSecurity')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-danger to-warning rounded-xl flex items-center justify-center">
                    <i className="fas fa-shield-alt text-xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">账号安全</h3>
                    <p className="text-sm text-text-secondary">管理您的账号安全设置</p>
                  </div>
                </div>
                <i className={`fas fa-chevron-down text-text-secondary ${styles.toggleIcon}`}></i>
              </div>
              <div className={`${styles.settingContent} px-6 pb-6 transition-all duration-300`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border-light">
                    <div>
                      <label className="block text-sm font-medium text-text-primary">修改密码</label>
                      <p className="text-xs text-text-secondary">定期更换密码以保护账号安全</p>
                    </div>
                    <button 
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all"
                    >
                      修改
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <label className="block text-sm font-medium text-text-primary">绑定手机</label>
                      <p className="text-xs text-text-secondary">138****8888</p>
                    </div>
                    <button 
                      onClick={handleChangePhone}
                      className="px-4 py-2 bg-bg-secondary text-text-primary rounded-lg hover:bg-border-light transition-all"
                    >
                      更换
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 通知设置 */}
            <div className={`${styles.settingSection} ${settingStates.notification ? 'expanded' : 'collapsed'} bg-card-bg rounded-2xl shadow-card border border-border-light`}>
              <div 
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => handleSettingToggle('notification')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-info to-tertiary rounded-xl flex items-center justify-center">
                    <i className="fas fa-bell text-xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">通知设置</h3>
                    <p className="text-sm text-text-secondary">管理您接收的通知类型</p>
                  </div>
                </div>
                <i className={`fas fa-chevron-down text-text-secondary ${styles.toggleIcon}`}></i>
              </div>
              <div className={`${styles.settingContent} px-6 pb-6 transition-all duration-300`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <label className="block text-sm font-medium text-text-primary">邮件通知</label>
                      <p className="text-xs text-text-secondary">接收重要更新和提醒</p>
                    </div>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={formData.emailNotification}
                        onChange={(e) => handleSwitchChange('emailNotification', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <label className="block text-sm font-medium text-text-primary">浏览器通知</label>
                      <p className="text-xs text-text-secondary">允许浏览器推送通知</p>
                    </div>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={formData.browserNotification}
                        onChange={(e) => handleSwitchChange('browserNotification', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 隐私设置 */}
            <div className={`${styles.settingSection} ${settingStates.privacy ? 'expanded' : 'collapsed'} bg-card-bg rounded-2xl shadow-card border border-border-light`}>
              <div 
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => handleSettingToggle('privacy')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center">
                    <i className="fas fa-user-shield text-xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">隐私设置</h3>
                    <p className="text-sm text-text-secondary">管理您的数据授权和隐私选项</p>
                  </div>
                </div>
                <i className={`fas fa-chevron-down text-text-secondary ${styles.toggleIcon}`}></i>
              </div>
              <div className={`${styles.settingContent} px-6 pb-6 transition-all duration-300`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <label className="block text-sm font-medium text-text-primary">数据收集</label>
                      <p className="text-xs text-text-secondary">允许收集使用数据以改善服务</p>
                    </div>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={formData.dataCollection}
                        onChange={(e) => handleSwitchChange('dataCollection', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <label className="block text-sm font-medium text-text-primary">历史记录保存</label>
                      <p className="text-xs text-text-secondary">保存您的疗愈历史记录</p>
                    </div>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={formData.historySave}
                        onChange={(e) => handleSwitchChange('historySave', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 内容偏好设置 */}
            <div className={`${styles.settingSection} ${settingStates.contentPreference ? 'expanded' : 'collapsed'} bg-card-bg rounded-2xl shadow-card border border-border-light`}>
              <div 
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => handleSettingToggle('contentPreference')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-success to-tertiary rounded-xl flex items-center justify-center">
                    <i className="fas fa-palette text-xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">内容偏好设置</h3>
                    <p className="text-sm text-text-secondary">定制您的专属疗愈内容体验</p>
                  </div>
                </div>
                <i className={`fas fa-chevron-down text-text-secondary ${styles.toggleIcon}`}></i>
              </div>
              <div className={`${styles.settingContent} px-6 pb-6 transition-all duration-300`}>
                <div className="space-y-6">
                  {/* 图片风格选择 */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-3">图片风格</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        className={`${styles.styleOption} p-4 border-2 border-border-light rounded-xl ${formData.selectedStyle === 'style-3d-cartoon' ? styles.selected : ''}`}
                        onClick={() => handleStyleSelect('style-3d-cartoon')}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-cube text-purple-600"></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-text-primary">3D卡通</h4>
                            <p className="text-xs text-text-secondary">可爱温馨的3D卡通风格</p>
                          </div>
                        </div>
                      </div>
                      <div 
                        className={`${styles.styleOption} p-4 border-2 border-border-light rounded-xl ${formData.selectedStyle === 'style-anime' ? styles.selected : ''}`}
                        onClick={() => handleStyleSelect('style-anime')}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-paint-brush text-blue-600"></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-text-primary">日式动漫</h4>
                            <p className="text-xs text-text-secondary">清新唯美的日式动漫风格</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 语音语速调节 */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-3">语音语速</label>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-text-secondary">慢</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="2" 
                        value={formData.voiceSpeed}
                        onChange={handleVoiceSpeedChange}
                        className="flex-1"
                      />
                      <span className="text-sm text-text-secondary">快</span>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-text-secondary">
                      <span>舒缓</span>
                      <span>适中</span>
                      <span>活泼</span>
                    </div>
                  </div>

                  {/* 背景音乐开关 */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <label className="block text-sm font-medium text-text-primary">背景音乐</label>
                      <p className="text-xs text-text-secondary">为语音内容添加轻柔的背景音乐</p>
                    </div>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={formData.backgroundMusic}
                        onChange={(e) => handleSwitchChange('backgroundMusic', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 保存设置按钮 */}
          <div className="mt-8 text-center">
            <button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className={`px-8 py-3 font-semibold rounded-xl transition-all shadow-lg ${
                isSaving 
                  ? 'bg-success text-white' 
                  : 'bg-primary text-white hover:bg-opacity-90'
              }`}
            >
              <i className={`${isSaving ? 'fas fa-check' : 'fas fa-save'} mr-2`}></i>
              {isSaving ? '保存成功' : '保存设置'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;

