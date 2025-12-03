

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 暖色调多巴胺配色 - 温暖、充满活力、给人欢喜感
        primary: '#FF6B6B',      // 暖珊瑚红（主色）- 温暖粉红色
        secondary: '#FF8E53',    // 暖橙色（辅助色）- 明亮橙色
        tertiary: '#FFD93D',     // 暖黄色 - 明亮黄色
        accent: '#FFB84D',        // 暖金黄色（强调色）- 温暖金色
        success: '#6BCB77',      // 暖绿色 - 柔和绿色
        danger: '#FF6B6B',       // 暖红色 - 珊瑚红
        warning: '#FFA500',      // 暖橙色 - 标准橙色
        info: '#FF8C69',         // 暖鲑鱼色 - 温暖粉橙色
        'text-primary': '#2C1810',    // 深暖棕色（主文字）
        'text-secondary': '#5A4A3A',   // 中暖棕色（次要文字）
        'text-tertiary': '#7A6A5A',   // 浅暖棕色（辅助文字）
        'bg-primary': '#FEF9F3',      // 柔和奶油色（主背景）- Headspace风格
        'bg-secondary': '#FFF8F0',     // 极浅暖白色（次背景）
        'bg-tertiary': '#FFF5E6',     // 浅暖白色
        'glass-bg': 'rgba(255, 255, 255, 0.7)',  // 毛玻璃背景
        'bg-accent': '#FFF8E0',       // 极浅的黄色背景（强调背景）
        'border-light': '#FFD4B3',    // 暖粉色边框
        'border-medium': '#FFB88C',   // 暖橙色边框
        'card-bg': '#FFFFFF',          // 纯白色
        'gradient-start': '#FFD4B3',   // 渐变起始色（暖粉色）
        'gradient-end': '#FFB88C'      // 渐变结束色（暖橙色）
      },
      boxShadow: {
        // 简约的阴影 - 更柔和、更微妙
        'card': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        'minimal': '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'glass': '1.5rem'  // 24px 毛玻璃圆角
      },
      fontFamily: {
        'rounded': ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      backdropBlur: {
        'glass': '20px',
      }
    }
  },
  plugins: [],
}

