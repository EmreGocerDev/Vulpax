'use client';

import { useEffect } from 'react';

export default function MouseTracker() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const body = document.body;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      body.style.setProperty('--mouse-x', `${x}%`);
      body.style.setProperty('--mouse-y', `${y}%`);
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null;
}
