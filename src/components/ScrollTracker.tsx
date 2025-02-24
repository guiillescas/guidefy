'use client';

import { useEffect } from 'react';

import { event } from '@/lib/gtag';

export default function ScrollTracker() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      event({
        action: 'scroll',
        category: 'engagement',
        label: 'Page Scroll',
        value: scrollTop
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
}
