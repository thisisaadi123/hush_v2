import { useState, useEffect } from 'react';
import { AppView } from '../App';
import { Button } from './ui/button';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', view: 'home' as AppView },
    { label: 'Journal', view: 'journaling' as AppView },
    { label: 'Dashboard', view: 'dashboard' as AppView }
  ];

  return (
    <nav className={`h-20 sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'glassmorphism-nav' : 'bg-[#FDFDF8] border-b border-[#C8C8BC]'
    }`}>
      <div className="max-w-[1440px] mx-auto px-12 h-full flex items-center justify-between">
        {/* Left: HUSH Logo */}
        <div
          className="cursor-pointer group transition-transform duration-200 hover:scale-105 flex-shrink-0 mr-8"
          onClick={() => onNavigate('home')}
        >
          <span className="text-[#5A5A52] text-[24px] font-bold tracking-tight transition-colors duration-200 group-hover:text-[#7A9A79]">
            HUSH
          </span>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex items-center gap-12 absolute left-1/2 transform -translate-x-1/2">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => onNavigate(link.view)}
              className={`text-[16px] font-semibold pb-1 border-b-[3px] transition-all duration-200 relative group/link ${
                currentView === link.view
                  ? 'text-[#5A5A52] border-[#A8C5A7]'
                  : 'text-[#8B8B7E] border-transparent hover:text-[#7A9A79] hover:border-[#A8C5A7]'
              }`}
            >
              <span className="relative">
                {link.label}
                {currentView === link.view && (
                  <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-[#A8C5A7] rounded-full" />
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex items-center gap-4 flex-shrink-0 ml-8">
          <button className="text-[16px] font-semibold text-[#7A9A79] hover:text-[#5A5A52] transition-colors">
            Sign In
          </button>
          <Button
            className="h-10 px-8 rounded-[24px] bg-[#A8C5A7] hover:bg-[#7A9A79] text-[#FDFDF8] font-semibold shadow-gentle transition-all duration-200 hover:shadow-floating hover:-translate-y-1 hover:scale-105 relative overflow-hidden group"
          >
            <span className="relative z-10">Sign Up</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#7A9A79] to-[#A8C5A7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </div>
      </div>
    </nav>
  );
}