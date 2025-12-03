

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface CollectionItem {
  id: string;
  contentId: string;
  collectionTime: string;
  collectionHour: string;
  emotionTag: string;
  emotionType: 'anxiety' | 'stress' | 'tired' | 'calm' | 'peaceful' | 'happy';
  contentTitle: string;
  contentSummary: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
}

const PCollection: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [globalSearchKeyword, setGlobalSearchKeyword] = useState('');
  const [contentSearchKeyword, setContentSearchKeyword] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([
    {
      id: 'collection-item-1',
      contentId: 'content_001',
      collectionTime: '2024-01-15',
      collectionHour: '21:30',
      emotionTag: '焦虑',
      emotionType: 'anxiety',
      contentTitle: '工作压力大，感到焦虑不安',
      contentSummary: '深呼吸，放松身心。想象自己置身于宁静的森林中，感受大自然的美好...',
      thumbnailUrl: 'https://s.coze.cn/image/GFwgE9MDsHU/',
      thumbnailAlt: '宁静的森林风景'
    },
    {
      id: 'collection-item-2',
      contentId: 'content_002',
      collectionTime: '2024-01-14',
      collectionHour: '22:15',
      emotionTag: '压力大',
      emotionType: 'stress',
      contentTitle: '生活节奏太快，身心俱疲',
      contentSummary: '让我们放慢脚步，享受此刻的宁静。每一个深呼吸都是对自己的温柔...',
      thumbnailUrl: 'https://s.coze.cn/image/nW4CECdOdkA/',
      thumbnailAlt: '星空夜景'
    },
    {
      id: 'collection-item-3',
      contentId: 'content_003',
      collectionTime: '2024-01-13',
      collectionHour: '20:45',
      emotionTag: '疲惫',
      emotionType: 'tired',
      contentTitle: '长时间工作后感到非常疲惫',
      contentSummary: '是时候给自己一些温柔的呵护了。闭上眼睛，让身心都得到充分的休息...',
      thumbnailUrl: 'https://s.coze.cn/image/X6i47FxUwx0/',
      thumbnailAlt: '森林小径'
    },
    {
      id: 'collection-item-4',
      contentId: 'content_004',
      collectionTime: '2024-01-12',
      collectionHour: '23:00',
      emotionTag: '平静',
      emotionType: 'calm',
      contentTitle: '心情平静，想要保持这种状态',
      contentSummary: '享受这份内心的宁静，让美好的感觉在心中慢慢流淌...',
      thumbnailUrl: 'https://s.coze.cn/image/xcduTyIdZj0/',
      thumbnailAlt: '平静的湖面'
    },
    {
      id: 'collection-item-5',
      contentId: 'content_005',
      collectionTime: '2024-01-11',
      collectionHour: '21:20',
      emotionTag: '愉悦',
      emotionType: 'happy',
      contentTitle: '今天心情很好，想要记录这份美好',
      contentSummary: '让我们一起庆祝这份喜悦，将美好的时光珍藏在心中...',
      thumbnailUrl: 'https://s.coze.cn/image/-c9c8slW1OA/',
      thumbnailAlt: '彩虹风景'
    }
  ]);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '情绪疗愈哄睡师 - 我的收藏';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleGlobalSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('全局搜索:', globalSearchKeyword);
    }
  };

  const handleContentSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApplyFilter();
    }
  };

  const handleApplyFilter = () => {
    console.log('应用筛选:', { 
      keyword: contentSearchKeyword, 
      emotion: selectedEmotion, 
      time: selectedTime 
    });
    alert('筛选已应用');
  };

  const handleResetFilter = () => {
    setContentSearchKeyword('');
    setSelectedEmotion('');
    setSelectedTime('');
    console.log('重置筛选');
    alert('筛选已重置');
  };

  const handleViewDetail = (contentId: string) => {
    navigate(`/result?contentId=${contentId}`);
  };

  const handleUncollect = (contentId: string) => {
    if (confirm('确定要取消收藏这条内容吗？')) {
      setCollectionItems(prevItems => prevItems.filter(item => item.contentId !== contentId));
      alert('已取消收藏');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log('跳转到第', page, '页');
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    handlePageChange(currentPage + 1);
  };

  const getEmotionTagClassName = (emotionType: string) => {
    return `${styles.emotionTag} ${styles[emotionType] || ''}`;
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
                value={globalSearchKeyword}
                onChange={(e) => setGlobalSearchKeyword(e.target.value)}
                onKeyPress={handleGlobalSearchKeyPress}
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
                  src="https://s.coze.cn/image/_XxRdNm2xa4/" 
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
            className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-primary text-white transition-colors"
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
        <div className="p-8 max-w-7xl mx-auto">
          {/* 页面头部 */}
          <div className="mb-8">
            <nav className="text-sm text-text-secondary mb-4">
              <span>首页</span>
              <i className="fas fa-chevron-right mx-2"></i>
              <span className="text-text-primary">我的收藏</span>
            </nav>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">我的收藏</h1>
                <p className="text-text-secondary">珍藏那些温暖心灵的美好时光</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{collectionItems.length}</div>
                <div className="text-sm text-text-secondary">条收藏内容</div>
              </div>
            </div>
          </div>

          {/* 搜索筛选区 */}
          <section className="mb-8">
            <div className="bg-card-bg rounded-2xl p-6 shadow-card border border-border-light">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 关键词搜索 */}
                <div className="space-y-2">
                  <label htmlFor="content-search" className="block text-sm font-medium text-text-primary">关键词搜索</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="content-search"
                      placeholder="搜索收藏内容..." 
                      value={contentSearchKeyword}
                      onChange={(e) => setContentSearchKeyword(e.target.value)}
                      onKeyPress={handleContentSearchKeyPress}
                      className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                  </div>
                </div>

                {/* 情绪标签筛选 */}
                <div className="space-y-2">
                  <label htmlFor="emotion-select" className="block text-sm font-medium text-text-primary">情绪标签</label>
                  <select 
                    id="emotion-select"
                    value={selectedEmotion}
                    onChange={(e) => setSelectedEmotion(e.target.value)}
                    className="w-full px-4 py-2 bg-bg-secondary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">全部标签</option>
                    <option value="焦虑">焦虑</option>
                    <option value="紧张">紧张</option>
                    <option value="压力大">压力大</option>
                    <option value="疲惫">疲惫</option>
                    <option value="平静">平静</option>
                    <option value="愉悦">愉悦</option>
                  </select>
                </div>

                {/* 时间筛选 */}
                <div className="space-y-2">
                  <label htmlFor="time-select" className="block text-sm font-medium text-text-primary">收藏时间</label>
                  <select 
                    id="time-select"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-2 bg-bg-secondary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">全部时间</option>
                    <option value="today">今天</option>
                    <option value="week">最近一周</option>
                    <option value="month">最近一月</option>
                    <option value="quarter">最近三月</option>
                  </select>
                </div>
              </div>
              
              {/* 筛选操作按钮 */}
              <div className="flex items-center justify-end space-x-4 mt-6">
                <button 
                  onClick={handleResetFilter}
                  className="px-6 py-2 text-text-secondary border border-border-light rounded-xl hover:bg-bg-secondary transition-colors"
                >
                  重置筛选
                </button>
                <button 
                  onClick={handleApplyFilter}
                  className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-opacity-90 transition-colors"
                >
                  应用筛选
                </button>
              </div>
            </div>
          </section>

          {/* 内容列表区 */}
          <section className="mb-8">
            <div className="bg-card-bg rounded-2xl shadow-card border border-border-light overflow-hidden">
              {/* 表格头部 */}
              <div className="bg-bg-secondary px-6 py-4 border-b border-border-light">
                <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-text-secondary">
                  <div className="col-span-2">收藏时间</div>
                  <div className="col-span-2">情绪标签</div>
                  <div className="col-span-4">内容摘要</div>
                  <div className="col-span-2">缩略图</div>
                  <div className="col-span-2">操作</div>
                </div>
              </div>

              {/* 表格内容 */}
              <div className="divide-y divide-border-light">
                {collectionItems.map((item) => (
                  <div 
                    key={item.id}
                    className={`${styles.tableRowHover} px-6 py-4 transition-colors`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-2">
                        <div className="text-sm font-medium text-text-primary">{item.collectionTime}</div>
                        <div className="text-xs text-text-secondary">{item.collectionHour}</div>
                      </div>
                      <div className="col-span-2">
                        <span className={getEmotionTagClassName(item.emotionType)}>{item.emotionTag}</span>
                      </div>
                      <div className="col-span-4">
                        <div className="text-sm font-medium text-text-primary mb-1">{item.contentTitle}</div>
                        <div className="text-xs text-text-secondary line-clamp-2">{item.contentSummary}</div>
                      </div>
                      <div className="col-span-2">
                        <img 
                          src={item.thumbnailUrl}
                          alt={item.thumbnailAlt}
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                      </div>
                      <div className="col-span-2 flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetail(item.contentId)}
                          className="px-3 py-1 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                        >
                          查看详情
                        </button>
                        <button 
                          onClick={() => handleUncollect(item.contentId)}
                          className="p-1 text-danger hover:bg-danger hover:text-white rounded-lg transition-colors"
                        >
                          <i className="fas fa-bookmark"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 分页区域 */}
          <section className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              显示第 <span className="font-medium text-text-primary">1</span> - <span className="font-medium text-text-primary">{collectionItems.length}</span> 条，共 <span className="font-medium text-text-primary">{collectionItems.length}</span> 条记录
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-text-secondary border border-border-light rounded-lg hover:bg-bg-secondary transition-colors disabled:opacity-50"
              >
                <i className="fas fa-chevron-left mr-1"></i>
                上一页
              </button>
              
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => handlePageChange(1)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    currentPage === 1 
                      ? 'bg-primary text-white' 
                      : 'text-text-secondary border border-border-light hover:bg-bg-secondary'
                  }`}
                >
                  1
                </button>
                <button 
                  onClick={() => handlePageChange(2)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    currentPage === 2 
                      ? 'bg-primary text-white' 
                      : 'text-text-secondary border border-border-light hover:bg-bg-secondary'
                  }`}
                >
                  2
                </button>
                <button 
                  onClick={() => handlePageChange(3)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    currentPage === 3 
                      ? 'bg-primary text-white' 
                      : 'text-text-secondary border border-border-light hover:bg-bg-secondary'
                  }`}
                >
                  3
                </button>
              </div>
              
              <button 
                onClick={handleNextPage}
                className="px-3 py-1 text-sm text-text-secondary border border-border-light rounded-lg hover:bg-bg-secondary transition-colors"
              >
                下一页
                <i className="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PCollection;

