import React, { useEffect, useState } from 'react';
import styles from './DynamicBackground.module.css';

interface DynamicBackgroundProps {
  emotion?: string;
  className?: string;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ 
  emotion = 'calm', 
  className = '' 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getBackgroundStyle = () => {
    const backgrounds = {
      calm: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      happy: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      peaceful: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      energetic: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      romantic: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      focused: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      creative: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      nostalgic: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    };
    
    return backgrounds[emotion as keyof typeof backgrounds] || backgrounds.calm;
  };

  if (!mounted) {
    return <div className={`${styles.background} ${className}`} />;
  }

  return (
    <div 
      className={`${styles.background} ${className}`}
      style={{ background: getBackgroundStyle() }}
    >
      <div className={styles.overlay}>
        <div className={styles.particles}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicBackground;