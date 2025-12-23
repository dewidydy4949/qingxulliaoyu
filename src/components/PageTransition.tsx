import React, { useEffect, useState } from 'react';
import styles from './PageTransition.module.css';

interface PageTransitionProps {
  children: React.ReactNode;
  isEntering?: boolean;
  duration?: number;
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  isEntering = true,
  duration = 600 
}) => {
  const [mounted, setMounted] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setMounted(true);
    
    if (isEntering) {
      setAnimationClass(styles.enter);
      const timer = setTimeout(() => {
        setAnimationClass(styles.enterActive);
      }, 50);
      
      return () => clearTimeout(timer);
    } else {
      setAnimationClass(styles.exit);
      const timer = setTimeout(() => {
        setAnimationClass(styles.exitActive);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [isEntering]);

  if (!mounted) {
    return <div className={styles.container} style={{ opacity: 0 }} />;
  }

  return (
    <div 
      className={`${styles.container} ${animationClass}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

export default PageTransition;