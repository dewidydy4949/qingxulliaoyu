

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface LoginFormData {
  phone: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterFormData {
  phone: string;
  code: string;
  password: string;
  confirm: string;
  agreement: boolean;
}

interface ForgotFormData {
  phone: string;
  code: string;
  password: string;
}

type FormType = 'login' | 'register' | 'forgot';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 页面状态
  const [currentForm, setCurrentForm] = useState<FormType>('login');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // 表单数据
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    phone: '',
    password: '',
    rememberMe: false
  });
  
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    phone: '',
    code: '',
    password: '',
    confirm: '',
    agreement: false
  });
  
  const [forgotForm, setForgotForm] = useState<ForgotFormData>({
    phone: '',
    code: '',
    password: ''
  });
  
  // 密码可见性状态
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false);
  const [registerConfirmVisible, setRegisterConfirmVisible] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  
  // 验证码倒计时状态
  const [registerCodeCountdown, setRegisterCodeCountdown] = useState(0);
  const [forgotCodeCountdown, setForgotCodeCountdown] = useState(0);
  
  // 存储生成的验证码（用于验证）
  const [registerCode, setRegisterCode] = useState<string>('');
  const [forgotCode, setForgotCode] = useState<string>('');
  
  // 显示验证码提示框
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeModalMessage, setCodeModalMessage] = useState('');

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '情绪疗愈哄睡师 - 登录注册';
    return () => { document.title = originalTitle; };
  }, []);

  // 验证码倒计时效果
  useEffect(() => {
    let timer: number | null = null;
    if (registerCodeCountdown > 0) {
      timer = window.setTimeout(() => {
        setRegisterCodeCountdown(registerCodeCountdown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [registerCodeCountdown]);

  useEffect(() => {
    let timer: number | null = null;
    if (forgotCodeCountdown > 0) {
      timer = window.setTimeout(() => {
        setForgotCodeCountdown(forgotCodeCountdown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [forgotCodeCountdown]);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (currentForm === 'login') {
          handleLoginSubmit(e as any);
        } else if (currentForm === 'register') {
          handleRegisterSubmit(e as any);
        } else if (currentForm === 'forgot') {
          handleForgotSubmit(e as any);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentForm, loginForm, registerForm, forgotForm]);

  // 显示成功模态框
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
  };

  // 隐藏成功模态框
  const hideSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // 标签页切换
  const handleTabSwitch = (formType: FormType) => {
    setCurrentForm(formType);
  };

  // 登录表单提交
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

  // 注册表单提交
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerForm.phone || !registerForm.code || !registerForm.password || !registerForm.confirm) {
      alert('请填写完整的注册信息');
      return;
    }
    
    // 验证验证码
    if (registerForm.code !== registerCode) {
      alert('验证码错误，请重新获取');
      return;
    }
    
    if (registerForm.password !== registerForm.confirm) {
      alert('两次输入的密码不一致');
      return;
    }
    
    if (registerForm.password.length < 6 || registerForm.password.length > 20) {
      alert('密码长度应在6-20位之间');
      return;
    }
    
    if (!registerForm.agreement) {
      alert('请阅读并同意用户协议和隐私政策');
      return;
    }
    
    console.log('注册信息:', registerForm);
    showSuccess('注册成功，正在跳转...');
    
    // 清空验证码
    setRegisterCode('');
    
    setTimeout(() => {
      navigate('/home');
    }, 1500);
  };

  // 找回密码表单提交
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotForm.phone || !forgotForm.code || !forgotForm.password) {
      alert('请填写完整的信息');
      return;
    }
    
    // 验证验证码
    if (forgotForm.code !== forgotCode) {
      alert('验证码错误，请重新获取');
      return;
    }
    
    if (forgotForm.password.length < 6 || forgotForm.password.length > 20) {
      alert('密码长度应在6-20位之间');
      return;
    }
    
    console.log('找回密码信息:', forgotForm);
    showSuccess('密码重置成功，请重新登录');
    
    // 清空验证码
    setForgotCode('');
    
    setTimeout(() => {
      hideSuccessModal();
      setCurrentForm('login');
    }, 1500);
  };

  // 生成6位随机验证码
  const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // 发送验证码
  const handleSendRegisterCode = () => {
    if (registerCodeCountdown > 0) return;
    if (!registerForm.phone) {
      alert('请先输入手机号');
      return;
    }
    
    // 验证手机号格式（简单验证：11位数字）
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(registerForm.phone)) {
      alert('请输入正确的手机号格式（11位数字）');
      return;
    }
    
    // 生成验证码
    const code = generateVerificationCode();
    setRegisterCode(code);
    setRegisterCodeCountdown(60);
    
    // 显示验证码提示（实际项目中应该通过短信发送）
    setCodeModalMessage(`验证码已发送到 ${registerForm.phone}\n\n验证码：${code}\n\n（提示：这是演示模式，实际项目中会通过短信发送）`);
    setShowCodeModal(true);
    
    console.log('注册验证码:', code);
  };

  const handleSendForgotCode = () => {
    if (forgotCodeCountdown > 0) return;
    if (!forgotForm.phone) {
      alert('请先输入手机号');
      return;
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(forgotForm.phone)) {
      alert('请输入正确的手机号格式（11位数字）');
      return;
    }
    
    // 生成验证码
    const code = generateVerificationCode();
    setForgotCode(code);
    setForgotCodeCountdown(60);
    
    // 显示验证码提示
    setCodeModalMessage(`验证码已发送到 ${forgotForm.phone}\n\n验证码：${code}\n\n（提示：这是演示模式，实际项目中会通过短信发送）`);
    setShowCodeModal(true);
    
    console.log('找回密码验证码:', code);
  };

  // 模态框背景点击关闭
  const handleModalBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      hideSuccessModal();
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 背景装饰元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-32 h-32 bg-primary bg-opacity-10 rounded-full ${styles.floatingAnimation}`}></div>
        <div className={`absolute top-40 right-20 w-24 h-24 bg-secondary bg-opacity-10 rounded-full ${styles.floatingAnimation}`} style={{animationDelay: '-2s'}}></div>
        <div className={`absolute bottom-40 left-1/4 w-20 h-20 bg-tertiary bg-opacity-10 rounded-full ${styles.floatingAnimation}`} style={{animationDelay: '-4s'}}></div>
        <div className={`absolute bottom-20 right-1/3 w-16 h-16 bg-warning bg-opacity-10 rounded-full ${styles.floatingAnimation}`} style={{animationDelay: '-1s'}}></div>
      </div>

      {/* 主容器 */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* 登录注册卡片 */}
        <div className="w-full max-w-md">
          {/* Logo和标题区域 */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-soft">
                <i className="fas fa-moon text-white text-2xl"></i>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">情绪疗愈哄睡师</h1>
            <p className="text-text-secondary">让心灵得到温柔的呵护</p>
          </div>

          {/* 标签页切换 */}
          <div className="mb-6">
            <div className="flex bg-bg-secondary rounded-xl p-1">
              <button 
                onClick={() => handleTabSwitch('login')}
                className={`flex-1 py-3 px-4 text-center rounded-lg font-medium transition-all ${
                  currentForm === 'login' ? styles.tabActive : styles.tabInactive
                }`}
              >
                登录
              </button>
              <button 
                onClick={() => handleTabSwitch('register')}
                className={`flex-1 py-3 px-4 text-center rounded-lg font-medium transition-all ${
                  currentForm === 'register' ? styles.tabActive : styles.tabInactive
                }`}
              >
                注册
              </button>
            </div>
          </div>

          {/* 登录表单 */}
          {currentForm === 'login' && (
            <div className={`${styles.glassEffect} rounded-2xl p-6 shadow-soft ${styles.slideIn}`}>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="login-phone" className="block text-sm font-medium text-text-primary">手机号/邮箱</label>
                  <input 
                    type="text" 
                    id="login-phone" 
                    value={loginForm.phone}
                    onChange={(e) => setLoginForm({...loginForm, phone: e.target.value})}
                    placeholder="请输入手机号或邮箱"
                    className={`w-full px-4 py-3 border border-border-light rounded-xl ${styles.formInputFocus} transition-all`}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="login-password" className="block text-sm font-medium text-text-primary">密码</label>
                  <div className="relative">
                    <input 
                      type={loginPasswordVisible ? 'text' : 'password'}
                      id="login-password" 
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      placeholder="请输入密码"
                      className={`w-full px-4 py-3 pr-12 border border-border-light rounded-xl ${styles.formInputFocus} transition-all`}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setLoginPasswordVisible(!loginPasswordVisible)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <i className={`fas ${loginPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                      className="w-4 h-4 text-primary border-border-light rounded focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-text-secondary">记住密码</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => handleTabSwitch('forgot')}
                    className="text-sm text-primary hover:text-secondary transition-colors"
                  >
                    忘记密码？
                  </button>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  登录
                </button>
              </form>
            </div>
          )}

          {/* 注册表单 */}
          {currentForm === 'register' && (
            <div className={`${styles.glassEffect} rounded-2xl p-6 shadow-soft ${styles.slideIn}`}>
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="register-phone" className="block text-sm font-medium text-text-primary">手机号</label>
                  <input 
                    type="tel" 
                    id="register-phone" 
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                    placeholder="请输入手机号"
                    className={`w-full px-4 py-3 border border-border-light rounded-xl ${styles.formInputFocus} transition-all`}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="register-code" className="block text-sm font-medium text-text-primary">验证码</label>
                  <div className="flex space-x-3">
                    <input 
                      type="text" 
                      id="register-code" 
                      value={registerForm.code}
                      onChange={(e) => setRegisterForm({...registerForm, code: e.target.value})}
                      placeholder="请输入验证码"
                      className={`flex-1 px-4 py-3 border border-border-light rounded-xl ${styles.formInputFocus} transition-all`}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={handleSendRegisterCode}
                      disabled={registerCodeCountdown > 0}
                      className={`px-4 py-3 bg-bg-secondary text-text-primary rounded-xl hover:bg-primary hover:text-white transition-all whitespace-nowrap ${
                        registerCodeCountdown > 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {registerCodeCountdown > 0 ? `${registerCodeCountdown}秒后重发` : '获取验证码'}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="register-password" className="block text-sm font-medium text-text-primary">密码</label>
                  <div className="relative">
                    <input 
                      type={registerPasswordVisible ? 'text' : 'password'}
                      id="register-password" 
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                      placeholder="请设置密码（6-20位）"
                      className={`w-full px-4 py-3 pr-12 border border-border-light rounded-xl ${styles.formInputFocus} transition-all`}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setRegisterPasswordVisible(!registerPasswordVisible)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <i className={`fas ${registerPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="register-confirm" className="block text-sm font-medium text-text-primary">确认密码</label>
                  <div className="relative">
                    <input 
                      type={registerConfirmVisible ? 'text' : 'password'}
                      id="register-confirm" 
                      value={registerForm.confirm}
                      onChange={(e) => setRegisterForm({...registerForm, confirm: e.target.value})}
                      placeholder="请再次输入密码"
                      className={`w-full px-4 py-3 pr-12 border border-border-light rounded-xl ${styles.formInputFocus} transition-all`}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setRegisterConfirmVisible(!registerConfirmVisible)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <i className={`fas ${registerConfirmVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="agreement-checkbox" 
                    checked={registerForm.agreement}
                    onChange={(e) => setRegisterForm({...registerForm, agreement: e.target.checked})}
                    className="w-4 h-4 text-primary border-border-light rounded focus:ring-primary mt-1" 
                    required
                  />
                  <label htmlFor="agreement-checkbox" className="text-sm text-text-secondary">
                    我已阅读并同意
                    <button type="button" className="text-primary hover:text-secondary transition-colors">《用户协议》</button>
                    和
                    <button type="button" className="text-primary hover:text-secondary transition-colors">《隐私政策》</button>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <i className="fas fa-user-plus mr-2"></i>
                  注册
                </button>
              </form>
            </div>
          )}

          {/* 找回密码表单 */}
          {currentForm === 'forgot' && (
            <div className={`${styles.glassEffect} rounded-2xl p-6 shadow-soft ${styles.slideIn}`}>
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">找回密码</h3>
                  <p className="text-sm text-text-secondary">请输入您的手机号，我们将发送验证码帮助您重置密码</p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="forgot-phone" className="block text-sm font-medium text-text-primary">手机号</label>
                  <input 
                    type="tel" 
                    id="forgot-phone" 
                    value={forgotForm.phone}
                    onChange={(e) => setForgotForm({...forgotForm, phone: e.target.value})}
                    placeholder="请输入手机号"
                    className={`w-full px-4 py-3 border border-border-light rounded-xl ${styles.formInputFocus} transition-all`}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="forgot-code" className="block text-sm font-medium text-text-primary">验证码</label>
                  <div className="flex space-x-3">
                    <input 
                      type="text" 
                      id="forgot-code" 
                      value={forgotForm.code}
                      onChange={(e) => setForgotForm({...forgotForm, code: e.target.value})}
                      placeholder="请输入验证码"
                      className={`flex-1 px-4 py-3 border border-border-light rounded-xl ${styles.formInputFocus} transition-all`}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={handleSendForgotCode}
                      disabled={forgotCodeCountdown > 0}
                      className={`px-4 py-3 bg-bg-secondary text-text-primary rounded-xl hover:bg-primary hover:text-white transition-all whitespace-nowrap ${
                        forgotCodeCountdown > 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {forgotCodeCountdown > 0 ? `${forgotCodeCountdown}秒后重发` : '获取验证码'}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="forgot-password" className="block text-sm font-medium text-text-primary">新密码</label>
                  <div className="relative">
                    <input 
                      type={forgotPasswordVisible ? 'text' : 'password'}
                      id="forgot-password" 
                      value={forgotForm.password}
                      onChange={(e) => setForgotForm({...forgotForm, password: e.target.value})}
                      placeholder="请设置新密码（6-20位）"
                      className={`w-full px-4 py-3 pr-12 border border-border-light rounded-xl ${styles.formInputFocus} transition-all`}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setForgotPasswordVisible(!forgotPasswordVisible)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <i className={`fas ${forgotPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    type="button" 
                    onClick={() => handleTabSwitch('login')}
                    className="flex-1 py-3 px-4 border border-border-light text-text-primary rounded-xl hover:bg-bg-secondary transition-all"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    返回登录
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
                  >
                    <i className="fas fa-key mr-2"></i>
                    重置密码
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 底部链接 */}
          <div className="text-center mt-8 space-y-2">
            <div className="flex justify-center space-x-6 text-sm text-text-secondary">
              <a href="#" className="hover:text-primary transition-colors">隐私政策</a>
              <a href="#" className="hover:text-primary transition-colors">用户协议</a>
              <a href="#" className="hover:text-primary transition-colors">联系我们</a>
            </div>
            <p className="text-xs text-text-secondary">© 2024 情绪疗愈哄睡师. 保留所有权利.</p>
          </div>
        </div>
      </div>

      {/* 成功提示模态框 */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleModalBackgroundClick}
        >
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-2xl text-success"></i>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">操作成功</h3>
            <p className="text-text-secondary mb-6">{successMessage}</p>
            <button 
              onClick={hideSuccessModal}
              className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-opacity-90 transition-all"
            >
              确定
            </button>
          </div>
        </div>
      )}

      {/* 验证码提示模态框 */}
      {showCodeModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowCodeModal(false)}
        >
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-sms text-2xl text-primary"></i>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">验证码已发送</h3>
            <div className="text-text-secondary mb-6 whitespace-pre-line text-sm">
              {codeModalMessage}
            </div>
            <button 
              onClick={() => setShowCodeModal(false)}
              className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-opacity-90 transition-all"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

