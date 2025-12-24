import React, { useEffect, useState, useRef } from 'react';
import styles from './DynamicBackground.module.css';

interface DynamicBackgroundProps {
  emotion?: string;
  className?: string;
  interactive?: boolean;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ 
  emotion = 'calm', 
  className = '',
  interactive = true 
}) => {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    // 将 emotion 作为依赖使用，避免构建时的未使用变量错误
    // 后续如果需要根据情绪调整背景效果，可以在这里扩展逻辑
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [emotion]);

  useEffect(() => {
    if (interactive && canvasRef.current) {
      initCanvas();
    }
  }, [interactive, mounted]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      baseX: number;
      baseY: number;
    }

    const particles: Particle[] = [];
    const particleCount = 120;
    const connectionDistance = 120;
    const mouseInteractionRadius = 150;

    // 创建星空粒子
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        baseX: Math.random() * canvas.width,
        baseY: Math.random() * canvas.height,
      });
    }

    // 鼠标位置追踪
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制深色背景渐变（梦境感深色背景）
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      gradient.addColorStop(0, '#0a0a1a');
      gradient.addColorStop(0.3, '#050510');
      gradient.addColorStop(0.6, '#020208');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制缓慢移动的星云/极光效果
      const time = Date.now() * 0.0003; // 极慢的移动速度
      
      // 星云层1 - 紫色星云
      const nebula1X = canvas.width / 2 + Math.sin(time) * canvas.width * 0.2;
      const nebula1Y = canvas.height / 2 + Math.cos(time * 0.7) * canvas.height * 0.15;
      const nebula1Gradient = ctx.createRadialGradient(nebula1X, nebula1Y, 0, nebula1X, nebula1Y, canvas.width * 0.6);
      nebula1Gradient.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
      nebula1Gradient.addColorStop(0.3, 'rgba(99, 102, 241, 0.08)');
      nebula1Gradient.addColorStop(0.6, 'rgba(59, 130, 246, 0.04)');
      nebula1Gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula1Gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 星云层2 - 蓝色极光
      const nebula2X = canvas.width * 0.3 + Math.cos(time * 0.5) * canvas.width * 0.15;
      const nebula2Y = canvas.height * 0.7 + Math.sin(time * 0.8) * canvas.height * 0.2;
      const nebula2Gradient = ctx.createRadialGradient(nebula2X, nebula2Y, 0, nebula2X, nebula2Y, canvas.width * 0.5);
      nebula2Gradient.addColorStop(0, 'rgba(59, 130, 246, 0.12)');
      nebula2Gradient.addColorStop(0.4, 'rgba(37, 99, 235, 0.06)');
      nebula2Gradient.addColorStop(0.8, 'rgba(29, 78, 216, 0.02)');
      nebula2Gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula2Gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 星云层3 - 粉色光晕（呼吸感）
      const breathScale = 1 + Math.sin(time * 1.2) * 0.15; // 呼吸效果
      const nebula3X = canvas.width * 0.7 + Math.sin(time * 0.6) * canvas.width * 0.1;
      const nebula3Y = canvas.height * 0.3 + Math.cos(time * 0.9) * canvas.height * 0.12;
      const nebula3Gradient = ctx.createRadialGradient(nebula3X, nebula3Y, 0, nebula3X, nebula3Y, canvas.width * 0.4 * breathScale);
      nebula3Gradient.addColorStop(0, 'rgba(236, 72, 153, 0.1)');
      nebula3Gradient.addColorStop(0.5, 'rgba(219, 39, 119, 0.05)');
      nebula3Gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula3Gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制粒子
      particles.forEach((particle, index) => {
        // 鼠标互动 - 粒子避让效果
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInteractionRadius) {
          const force = (mouseInteractionRadius - distance) / mouseInteractionRadius;
          const angle = Math.atan2(dy, dx);
          particle.x -= Math.cos(angle) * force * 2;
          particle.y -= Math.sin(angle) * force * 2;
        }

        // 缓慢回到原始轨迹
        particle.vx += (particle.vx - 0) * 0.01;
        particle.vy += (particle.vy - 0) * 0.01;

        particle.x += particle.vx;
        particle.y += particle.vy;

        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // 绘制白色星空粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();

        // 粒子发光效果
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.3})`;
        ctx.fill();

        // 连接临近粒子 - 星座连线效果
        particles.forEach((otherParticle, otherIndex) => {
          if (index <= otherIndex) return;

          const pdx = particle.x - otherParticle.x;
          const pdy = particle.y - otherParticle.y;
          const pDistance = Math.sqrt(pdx * pdx + pdy * pdy);

          if (pDistance < connectionDistance) {
            const opacity = (1 - pDistance / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // 随机闪烁的星星
      if (Math.random() < 0.02) {
        const randomParticle = particles[Math.floor(Math.random() * particles.length)];
        randomParticle.opacity = Math.random() * 0.8 + 0.4;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  };

  if (!mounted) {
    return (
      <div 
        className={`${styles.background} ${className}`}
        style={{ background: '#000000' }}
      />
    );
  }

  return (
    <div className={`${styles.background} ${className}`}>
      {/* 星空科技感画布 */}
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default DynamicBackground;