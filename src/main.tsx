// @ts-nocheck

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App';
import './index.css';

window.onerror = function(message, source, lineno, colno, error) {
  console.log('全局 onerror 捕获到错误:', {
    message, // 错误信息 (string)
    source,  // 发生错误的脚本 URL (string)
    lineno,  // 发生错误的行号 (number)
    colno,   // 发生错误的列号 (number)
    error    // 错误对象 (Error)
  });
  return true; 
};

window.addEventListener('unhandledrejection', function(event) {
  // event.reason 通常是导致拒绝的错误对象或值
  console.log('全局 unhandledrejection 捕获到 Promise 错误:', event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
