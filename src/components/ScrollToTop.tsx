import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down past 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
      className="w-11 h-11 rounded-full bg-white hover:bg-zinc-950 text-zinc-700 hover:text-white border border-zinc-200/90 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center backdrop-blur-md"
      title="Cuộn lên đầu trang"
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-300 hover:-translate-y-0.5" />
    </button>
  );
};
