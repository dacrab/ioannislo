'use client';

import React, { useState } from 'react';
import { registerGSAPPlugins, useGSAP } from '@/utils/gsapUtils';
import { isMobileDevice, prefersReducedMotion } from '@/utils/deviceUtils';

interface ClientLayoutProps {
  children: React.ReactNode;
  spaceMono: string;
  anton: string;
}

export default function ClientLayout({ children, spaceMono, anton }: ClientLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  useGSAP(() => {
    registerGSAPPlugins();
  }, { revertOnUpdate: false });
  
  useGSAP(() => {
    const mobile = isMobileDevice();
    
    setIsMobile(mobile);
    
    document.body.dataset.mobile = mobile.toString();
    if (prefersReducedMotion()) {
      document.body.dataset.reducedMotion = 'true';
    }
    
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVH();
    
    const debounce = (func: (...args: unknown[]) => void, wait: number) => {
      let timeout: NodeJS.Timeout | null = null;
      return (...args: unknown[]) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    };
    
    const handleResize = debounce(() => {
      setVH();
      const newMobileState = isMobileDevice();
      if (newMobileState !== isMobile) {
        setIsMobile(newMobileState);
        document.body.dataset.mobile = newMobileState.toString();
      }
    }, 100);
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);
  
  return (
    <body className={`${spaceMono} ${anton} noise-bg`} suppressHydrationWarning>
      {children}
    </body>
  );
} 