import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface LoginFormData {
  phone: string;
  password: string;
  rememberMe: boolean;
}

interface ForgotFormData {
  phone: string;
  password: string;
}

interface RegisterFormData {
  phone: string;
  password: string;
  confirmPassword: string;
}

type FormType = 'login' | 'forgot' | 'register';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [currentForm, setCurrentForm] = useState<FormType>('login');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    phone: '',
    password: '',
    rememberMe: false
  });

  const [forgotForm, setForgotForm] = useState<ForgotFormData>({
    phone: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '情绪疗愈哄睡师 - 登录注册';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (currentForm === 'login') {
          handleLoginSubmit(e as any);
        } else if (currentForm === 'forgot') {
          handleForgotSubmit(e as any);
        } else if (currentForm === 'register') {
          handleRegisterSubmit(e as any);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentForm]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
  };

  const hideSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleTabSwitch = (formType: FormType) => {
    setCurrentForm(formType);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.phone || !loginForm.password) {
      alert('请填写完整的登录信息');
      return;
    }
    
    console.log('登录信息:', loginForm);
    showSuccess('登录成功，正在跳转...');
    
    setTimeout(() => {
      navigate('/home');
    }, 1500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotForm.phone || !forgotForm.password) {
      alert('请填写完整的信息');
      return;
    }
    
    if (forgotForm.password.length < 6 || forgotForm.password.length > 20) {
      alert('密码长度应在6-20位之间');
      return;
    }
    
    console.log('找回密码信息:', forgotForm);
    showSuccess('密码重置成功，请重新登录');
    
    setTimeout(() => {
      hideSuccessModal();
      setCurrentForm('login');
    }, 1500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerForm.phone || !registerForm.password || !registerForm.confirmPassword) {
      alert('请填写完整的注册信息');
      return;
    }
    
    if (registerForm.password.length < 6 || registerForm.password.length > 20) {
      alert('密码长度应在6-20位之间');
      return;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    
    console.log('注册信息:', registerForm);
    showSuccess('注册成功，请登录');
    
    setTimeout(() => {
      hideSuccessModal();
      setCurrentForm('login');
      setRegisterForm({ phone: '', password: '', confirmPassword: '' });
    }, 1500);
  };

  const handleModalBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      hideSuccessModal();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* 高科技背景粒子效果 */}
      <div className="particle-container">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* 高科技背景网格 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 10s linear infinite'
        }} />
      </div>

      {/* 光效装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
      </div>

      {/* 主容器 */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Logo和标题区域 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 tech-card flex items-center justify-center group cursor-pointer">
                <i className="fas fa-brain text-white text-3xl group-hover:animate-pulse"></i>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-500"></div>
            </div>
          </div>
          <h1 className="tech-title text-4xl mb-3">AI 情绪疗愈师</h1>
          <p className="text-gray-300 text-lg tracking-wide">开启您的智能心灵疗愈之旅</p>
        </div>

        {/* 登录表单 */}
        {currentForm === 'login' && (
          <div className="tech-card p-8 mb-6 animate-in slide-in-from-bottom duration-500">
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="login-phone" className="block text-sm font-medium text-gray-200 tracking-wide">身份标识</label>
                <div className="relative data-stream">
                  <input 
                    type="text" 
                    id="login-phone" 
                    value={loginForm.phone}
                    onChange={(e) => setLoginForm({...loginForm, phone: e.target.value})}
                    placeholder="输入手机号 / 邮箱地址"
                    className="tech-input"
                    required
                  />
                  <i className="fas fa-user absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400"></i>
                </div>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-200 tracking-wide">安全密钥</label>
                <div className="relative data-stream">
                  <input 
                    type={loginPasswordVisible ? 'text' : 'password'}
                    id="login-password" 
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    placeholder="输入访问密钥"
                    className="tech-input pr-12"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setLoginPasswordVisible(!loginPasswordVisible)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <i className={`fas ${loginPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-gray-600 rounded peer-checked:border-blue-500 peer-checked:bg-blue-500/20 transition-all duration-300">
                      <i className={`fas fa-check text-xs text-blue-400 absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity duration-300`}></i>
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-gray-300 group-hover:text-gray-200 transition-colors">保持会话</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => handleTabSwitch('forgot')}
                  className="text-sm text-blue-400 hover:text-purple-400 transition-all duration-300 hover:scale-105 inline-block"
                >
                  重置访问权限
                </button>
              </div>
              
              <button 
                type="submit" 
                className="tech-button w-full text-base"
              >
                <i className="fas fa-rocket mr-2"></i>
                启动访问
              </button>
              
              <div className="tech-divider"></div>
              
              <div className="text-center">
                <span className="text-gray-400">尚未激活身份？</span>
                <button 
                  type="button"
                  onClick={() => handleTabSwitch('register')}
                  className="text-blue-400 hover:text-purple-400 transition-all duration-300 hover:scale-105 ml-2 inline-block"
                >
                  创建新身份
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 找回密码表单 */}
        {currentForm === 'forgot' && (
          <div className="tech-card p-8 mb-6 animate-in slide-in-from-bottom duration-500">
            <form onSubmit={handleForgotSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="tech-title text-xl mb-2">重置访问权限</h3>
                <p className="text-gray-400">验证身份并重新配置访问密钥</p>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="forgot-phone" className="block text-sm font-medium text-gray-200 tracking-wide">身份验证</label>
                <div className="relative data-stream">
                  <input 
                    type="tel" 
                    id="forgot-phone" 
                    value={forgotForm.phone}
                    onChange={(e) => setForgotForm({...forgotForm, phone: e.target.value})}
                    placeholder="输入注册手机号"
                    className="tech-input"
                    required
                  />
                  <i className="fas fa-shield-halved absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400"></i>
                </div>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="forgot-password" className="block text-sm font-medium text-gray-200 tracking-wide">新访问密钥</label>
                <div className="relative data-stream">
                  <input 
                    type={forgotPasswordVisible ? 'text' : 'password'}
                    id="forgot-password" 
                    value={forgotForm.password}
                    onChange={(e) => setForgotForm({...forgotForm, password: e.target.value})}
                    placeholder="设置新密钥（6-20位）"
                    className="tech-input pr-12"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setForgotPasswordVisible(!forgotPasswordVisible)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <i className={`fas ${forgotPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  type="button" 
                  onClick={() => handleTabSwitch('login')}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:border-gray-500 hover:text-gray-200 transition-all duration-300 hover:scale-105"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  返回
                </button>
                <button 
                  type="submit" 
                  className="flex-1 tech-button"
                >
                  <i className="fas fa-key mr-2"></i>
                  确认重置
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 注册表单 */}
        {currentForm === 'register' && (
          <div className="tech-card p-8 mb-6 animate-in slide-in-from-bottom duration-500">
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="tech-title text-xl mb-2">创建数字身份</h3>
                <p className="text-gray-400">初始化您的智能疗愈档案</p>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="register-phone" className="block text-sm font-medium text-gray-200 tracking-wide">身份标识</label>
                <div className="relative data-stream">
                  <input 
                    type="tel" 
                    id="register-phone" 
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                    placeholder="输入手机号"
                    className="tech-input"
                    required
                  />
                  <i className="fas fa-id-card absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400"></i>
                </div>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-200 tracking-wide">访问密钥</label>
                <div className="relative data-stream">
                  <input 
                    type={registerPasswordVisible ? 'text' : 'password'}
                    id="register-password" 
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    placeholder="设置密钥（6-20位）"
                    className="tech-input pr-12"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setRegisterPasswordVisible(!registerPasswordVisible)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <i className={`fas ${registerPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="register-confirm" className="block text-sm font-medium text-gray-200 tracking-wide">验证密钥</label>
                <div className="relative data-stream">
                  <input 
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    id="register-confirm" 
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                    placeholder="再次输入密钥"
                    className="tech-input pr-12"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <i className={`fas ${confirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  type="button" 
                  onClick={() => handleTabSwitch('login')}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:border-gray-500 hover:text-gray-200 transition-all duration-300 hover:scale-105"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  返回
                </button>
                <button 
                  type="submit" 
                  className="flex-1 tech-button"
                >
                  <i className="fas fa-rocket mr-2"></i>
                  激活身份
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 底部信息 */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <a href="#" className="hover:text-blue-400 transition-all duration-300 hover:scale-110 inline-block">隐私协议</a>
            <a href="#" className="hover:text-blue-400 transition-all duration-300 hover:scale-110 inline-block">服务条款</a>
            <a href="#" className="hover:text-blue-400 transition-all duration-300 hover:scale-110 inline-block">技术支持</a>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <p>© 2024 AI 情绪疗愈师. All rights reserved.</p>
            <p>Powered by Advanced Neural Networks</p>
          </div>
        </div>
      </div>

      {/* 成功提示模态框 */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleModalBackgroundClick}
        >
          <div className="tech-card p-8 mx-4 max-w-md w-full text-center animate-in zoom-in-95 duration-300">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 tech-card rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-3xl text-green-400"></i>
                </div>
              </div>
              <div className="absolute -inset-4 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h3 className="tech-title text-2xl mb-3">系统确认</h3>
            <p className="text-gray-300 mb-8 text-lg">{successMessage}</p>
            <button 
              onClick={hideSuccessModal}
              className="tech-button w-full text-base"
            >
              <i className="fas fa-thumbs-up mr-2"></i>
              确认
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
