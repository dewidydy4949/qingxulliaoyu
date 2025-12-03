

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';
import { HistoryItem, SortOrder, DateRange } from './types';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [globalSearchKeyword, setGlobalSearchKeyword] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: '1',
      contentId: 'content_001',
      title: '深度放松冥想 - 释放工作压力',
      description: '今天工作压力很大，感觉喘不过气来。通过这个冥想内容，我感受到内心逐渐平静下来，呼吸也变得更加深沉...',
      emotion: '焦虑',
      time: '2024-01-15 21:30',
      thumbnail: 'https://s.coze.cn/image/z29Ox-vCFVg/',
      isCollected: false
    },
    {
      id: '2',
      contentId: 'content_002',
      title: '星空助眠故事 - 温柔的夜晚',
      description: '忙碌了一整天，身心都感到非常疲惫。这个星空故事就像妈妈的摇篮曲，让我在温柔的声音中慢慢放松...',
      emotion: '疲惫',
      time: '2024-01-14 22:15',
      thumbnail: 'https://s.coze.cn/image/Ga1SSyFze3Y/',
      isCollected: true
    },
    {
      id: '3',
      contentId: 'content_003',
      title: '森林白噪音 - 纯净的自然之声',
      description: '项目deadline临近，压力真的很大。听着森林里的声音，仿佛置身于大自然中，心情也随之平静下来...',
      emotion: '压力大',
      time: '2024-01-13 20:45',
      thumbnail: 'https://s.coze.cn/image/YE7GSZFVwLM/',
      isCollected: false
    },
    {
      id: '4',
      contentId: 'content_004',
      title: '正念呼吸练习 - 活在当下',
      description: '今天心情比较平静，想做一些正念练习来保持这种状态。引导语很清晰，让我更好地专注于呼吸...',
      emotion: '平静',
      time: '2024-01-12 21:00',
      thumbnail: 'https://s.coze.cn/image/UoMeQlAYqXM/',
      isCollected: false
    },
    {
      id: '5',
      contentId: 'content_005',
      title: '渐进式肌肉放松 - 释放身体紧张',
      description: '明天要进行重要的演讲，现在感到很紧张。通过肌肉放松练习，身体的紧张感逐渐缓解，心情也放松了...',
      emotion: '紧张',
      time: '2024-01-11 22:30',
      thumbnail: 'https://s.coze.cn/image/JahnosbOKnY/',
      isCollected: true
    }
  ]);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '情绪疗愈哄睡师 - 历史记录';
    return () => { document.title = originalTitle; };
  }, []);

  // 从URL参数读取搜索关键词
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchKeyword(searchParam);
      setGlobalSearchKeyword(searchParam);
    }
  }, [searchParams]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleGlobalSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = (e.target as HTMLInputElement).value.trim();
      if (searchTerm) {
        setSearchKeyword(searchTerm);
        navigate(`/history?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  const handleCollectionToggle = (itemId: string) => {
    setHistoryItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, isCollected: !item.isCollected } : item
      )
    );
  };

  const handleDetailView = (contentId: string) => {
    navigate(`/result?contentId=${contentId}`);
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case '焦虑':
        return 'bg-primary bg-opacity-10 text-primary';
      case '疲惫':
        return 'bg-secondary bg-opacity-10 text-secondary';
      case '压力大':
        return 'bg-tertiary bg-opacity-10 text-tertiary';
      case '平静':
        return 'bg-success bg-opacity-10 text-success';
      case '紧张':
        return 'bg-warning bg-opacity-10 text-warning';
      default:
        return 'bg-primary bg-opacity-10 text-primary';
    }
  };

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = searchKeyword === '' || 
      item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.emotion.toLowerCase().includes(searchKeyword.toLowerCase());
    
    const matchesEmotion = selectedEmotion === '' || item.emotion === selectedEmotion;
    
    const matchesDate = () => {
      if (selectedDateRange === '') return true;
      
      const itemTime = new Date(item.time);
      const now = new Date();
      
      switch (selectedDateRange) {
        case 'today':
          return itemTime.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemTime >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return itemTime >= monthAgo;
        case 'quarter':
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          return itemTime >= quarterAgo;
        default:
          return true;
      }
    };

    return matchesSearch && matchesEmotion && matchesDate();
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const timeA = new Date(a.time);
    const timeB = new Date(b.time);
    return sortOrder === 'desc' ? timeB.getTime() - timeA.getTime() : timeA.getTime() - timeB.getTime();
  });

  const totalItems = sortedItems.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = sortedItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
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
                  src="https://s.coze.cn/image/ED1T9mgD8og/" 
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
            className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-primary text-white transition-colors"
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
        <div className="p-8 max-w-7xl mx-auto">
          {/* 页面头部 */}
          <div className="mb-8">
            <nav className="text-sm text-text-secondary mb-4">
              <span>首页</span>
              <i className="fas fa-chevron-right mx-2"></i>
              <span>历史记录</span>
            </nav>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">我的历史记录</h1>
                <p className="text-text-secondary">回顾您的疗愈历程，每一次都是成长的足迹</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">28</div>
                <div className="text-sm text-text-secondary">总记录数</div>
              </div>
            </div>
          </div>

          {/* 搜索筛选区 */}
          <section className="mb-8">
            <div className="bg-card-bg rounded-2xl p-6 shadow-card border border-border-light">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 关键词搜索 */}
                <div className="space-y-2">
                  <label htmlFor="search-input" className="block text-sm font-medium text-text-primary">关键词搜索</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="search-input"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="搜索内容..." 
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
                    <option value="">全部情绪</option>
                    <option value="焦虑">焦虑</option>
                    <option value="紧张">紧张</option>
                    <option value="悲伤">悲伤</option>
                    <option value="压力大">压力大</option>
                    <option value="疲惫">疲惫</option>
                    <option value="平静">平静</option>
                    <option value="愉悦">愉悦</option>
                  </select>
                </div>

                {/* 日期筛选 */}
                <div className="space-y-2">
                  <label htmlFor="date-select" className="block text-sm font-medium text-text-primary">时间范围</label>
                  <select 
                    id="date-select"
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value as DateRange)}
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

              {/* 排序选项 */}
              <div className="mt-6 flex items-center space-x-4">
                <span className="text-sm font-medium text-text-primary">排序：</span>
                <button 
                  onClick={() => setSortOrder('desc')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortOrder === 'desc' ? styles.sortActive : styles.sortInactive
                  }`}
                >
                  <i className="fas fa-clock mr-2"></i>
                  时间降序
                </button>
                <button 
                  onClick={() => setSortOrder('asc')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortOrder === 'asc' ? styles.sortActive : styles.sortInactive
                  }`}
                >
                  <i className="fas fa-clock mr-2"></i>
                  时间升序
                </button>
              </div>
            </div>
          </section>

          {/* 内容列表区 */}
          <section className="mb-8">
            <div className="space-y-4">
              {currentItems.map((item) => (
                <div 
                  key={item.id}
                  className={`bg-card-bg rounded-2xl p-6 shadow-card border border-border-light ${styles.cardHoverEffect} ${styles.transitionAllSmooth}`}
                >
                  <div className="flex items-center space-x-6">
                    {/* 缩略图 */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.thumbnail}
                        alt="内容缩略图" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* 内容信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className={`px-3 py-1 ${getEmotionColor(item.emotion)} rounded-full text-sm font-medium`}>
                          {item.emotion}
                        </span>
                        <span className="text-sm text-text-secondary">{item.time}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-text-secondary line-clamp-2">{item.description}</p>
                    </div>
                    
                    {/* 操作按钮 */}
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <button 
                        onClick={() => handleCollectionToggle(item.id)}
                        className={`p-2 transition-colors ${
                          item.isCollected ? 'text-warning' : 'text-text-secondary hover:text-warning'
                        }`}
                        title={item.isCollected ? '已收藏' : '收藏'}
                      >
                        <i className="fas fa-bookmark"></i>
                      </button>
                      <button 
                        onClick={() => handleDetailView(item.contentId)}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                      >
                        查看详情
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 分页区域 */}
          <section className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              显示第 {startIndex + 1}-{endIndex} 条，共 {totalItems} 条记录
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-border-light rounded-lg text-text-secondary hover:bg-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-chevron-left mr-1"></i>
                上一页
              </button>
              {currentPage > 1 && currentPage > 2 && (
                <>
                  <button 
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-2 text-sm border border-border-light rounded-lg text-text-secondary hover:bg-bg-secondary transition-colors"
                  >
                    1
                  </button>
                  {currentPage > 3 && <span className="px-2 text-text-secondary">...</span>}
                </>
              )}
              {currentPage > 1 && (
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-2 text-sm border border-border-light rounded-lg text-text-secondary hover:bg-bg-secondary transition-colors"
                >
                  {currentPage - 1}
                </button>
              )}
              <button 
                className="px-3 py-2 text-sm bg-primary text-white rounded-lg"
              >
                {currentPage}
              </button>
              {currentPage < totalPages && (
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-2 text-sm border border-border-light rounded-lg text-text-secondary hover:bg-bg-secondary transition-colors"
                >
                  {currentPage + 1}
                </button>
              )}
              {currentPage < totalPages && currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && <span className="px-2 text-text-secondary">...</span>}
                  <button 
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-2 text-sm border border-border-light rounded-lg text-text-secondary hover:bg-bg-secondary transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-border-light rounded-lg text-text-secondary hover:bg-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
                <i className="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">每页显示：</span>
              <select 
                value={pageSize}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                className="px-3 py-1 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;

