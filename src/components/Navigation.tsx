import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  isSidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  onNotificationClick?: () => void;
  onUserAvatarClick?: () => void;
  onGlobalSearch?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  globalSearchKeyword?: string;
  onSearchChange?: (value: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  isSidebarCollapsed,
  onSidebarToggle,
  onNotificationClick,
  onUserAvatarClick,
  onGlobalSearch,
  globalSearchKeyword = '',
  onSearchChange,
}) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card-bg border-b-2 border-primary/20 z-50 backdrop-blur-lg shadow-md">
        <div className="flex items-center justify-between h-full px-8">
          {/* 左侧：Logo和产品名称 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onSidebarToggle}
              className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all group"
            >
              <i className="fas fa-bars text-primary group-hover:scale-110 transition-transform"></i>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-tertiary rounded-xl flex items-center justify-center shadow-lg border-2 border-white/30">
                <i className="fas fa-moon text-white text-base"></i>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">情绪疗愈哄睡师</h1>
            </div>
          </div>
          
          {/* 中间：搜索框 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="搜索历史记录..." 
                value={globalSearchKeyword}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyPress={onGlobalSearch}
                className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary border-2 border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"></i>
            </div>
          </div>
          
          {/* 右侧：通知和用户头像 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onNotificationClick}
              className="relative p-2 rounded-lg hover:bg-gradient-to-r hover:from-warning/10 hover:to-accent/10 transition-all group"
            >
              <i className="fas fa-bell text-warning group-hover:scale-110 transition-transform"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-danger to-warning rounded-full border border-white"></span>
            </button>
            <div className="relative">
              <button 
                onClick={onUserAvatarClick}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all group border-2 border-transparent hover:border-primary/30"
              >
                <img 
                  src="https://s.coze.cn/image/FFIG_zbIRLw/" 
                  alt="用户头像" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-primary/30 group-hover:border-primary/60 transition-all"
                />
                <span className="hidden md:block text-sm font-semibold text-primary">小雨</span>
                <i className="fas fa-chevron-down text-xs text-primary"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-card-bg border-r-2 border-primary/20 z-40 ${isSidebarCollapsed ? 'w-16' : 'w-56'} transition-all duration-300`}>
        <nav className="p-3 space-y-1">
          <Link 
            to="/home" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-bold shadow-md ${
              isActive('/home') || isActive('/')
                ? 'bg-gradient-to-r from-primary via-secondary to-tertiary text-white border-2 border-white/30'
                : 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-2 border-primary/30 hover:from-primary/30 hover:to-secondary/30 hover:border-primary/50'
            }`}
          >
            <i className="fas fa-home text-base"></i>
            {!isSidebarCollapsed && <span>首页</span>}
          </Link>
          <Link 
            to="/emotion-select" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-bold shadow-md ${
              isActive('/emotion-select')
                ? 'bg-gradient-to-r from-primary via-secondary to-tertiary text-white border-2 border-white/30'
                : 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-2 border-primary/30 hover:from-primary/30 hover:to-secondary/30 hover:border-primary/50 group'
            }`}
          >
            <i className="fas fa-heart text-base group-hover:scale-110 group-hover:rotate-12 transition-all"></i>
            {!isSidebarCollapsed && <span>情绪选择</span>}
          </Link>
          <Link 
            to="/history" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-bold shadow-md ${
              isActive('/history')
                ? 'bg-gradient-to-r from-primary via-secondary to-tertiary text-white border-2 border-white/30'
                : 'bg-gradient-to-r from-secondary/20 to-tertiary/20 text-secondary border-2 border-secondary/30 hover:from-secondary/30 hover:to-tertiary/30 hover:border-secondary/50 group'
            }`}
          >
            <i className="fas fa-history text-base group-hover:scale-110 group-hover:rotate-12 transition-all"></i>
            {!isSidebarCollapsed && <span>历史记录</span>}
          </Link>
          <Link 
            to="/collection" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-bold shadow-md ${
              isActive('/collection')
                ? 'bg-gradient-to-r from-primary via-secondary to-tertiary text-white border-2 border-white/30'
                : 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-2 border-primary/30 hover:from-primary/30 hover:to-secondary/30 hover:border-primary/50 group'
            }`}
          >
            <i className="fas fa-bookmark text-base group-hover:scale-110 group-hover:rotate-12 transition-all"></i>
            {!isSidebarCollapsed && <span>我的收藏</span>}
          </Link>
          <Link 
            to="/settings" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-bold shadow-md ${
              isActive('/settings')
                ? 'bg-gradient-to-r from-primary via-secondary to-tertiary text-white border-2 border-white/30'
                : 'bg-gradient-to-r from-accent/20 to-warning/20 text-accent border-2 border-accent/30 hover:from-accent/30 hover:to-warning/30 hover:border-accent/50 group'
            }`}
          >
            <i className="fas fa-cog text-base group-hover:scale-110 group-hover:rotate-12 transition-all"></i>
            {!isSidebarCollapsed && <span>设置</span>}
          </Link>
          <Link 
            to="/feedback" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-bold shadow-md ${
              isActive('/feedback')
                ? 'bg-gradient-to-r from-warning via-accent to-danger text-white border-2 border-white/30'
                : 'bg-gradient-to-r from-warning/20 to-accent/20 text-warning border-2 border-warning/30 hover:from-warning/30 hover:to-accent/30 hover:border-warning/50 group'
            }`}
          >
            <i className="fas fa-comment-dots text-base group-hover:scale-110 group-hover:rotate-12 transition-all"></i>
            {!isSidebarCollapsed && <span>反馈建议</span>}
          </Link>
          <Link 
            to="/help" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-bold shadow-md ${
              isActive('/help')
                ? 'bg-gradient-to-r from-primary via-secondary to-tertiary text-white border-2 border-white/30'
                : 'bg-gradient-to-r from-tertiary/20 to-accent/20 text-tertiary border-2 border-tertiary/30 hover:from-tertiary/30 hover:to-accent/30 hover:border-tertiary/50 group'
            }`}
          >
            <i className="fas fa-question-circle text-base group-hover:scale-110 group-hover:rotate-12 transition-all"></i>
            {!isSidebarCollapsed && <span>帮助中心</span>}
          </Link>
        </nav>
      </aside>
    </>
  );
};

