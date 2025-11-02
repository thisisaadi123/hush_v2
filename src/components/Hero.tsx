import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Play, ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <section
      className="relative h-[640px] overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[1200px] h-[500px] organic-blob opacity-40 transition-transform duration-1000 ease-out"
          style={{
            background: 'linear-gradient(135deg, #D4E7D4 0%, #FFF4D6 100%)',
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px) scale(${isVisible ? 1 : 0.8})`,
          }}
        />
        <div
          className="absolute w-[800px] h-[400px] organic-blob opacity-20"
          style={{
            background: 'radial-gradient(circle, #A8C5A7 0%, transparent 70%)',
            transform: `translate(${-mousePosition.x * 30}px, ${-mousePosition.y * 30}px) scale(${isVisible ? 1 : 0.6})`,
            transition: 'transform 1.2s ease-out',
          }}
        />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-8 h-full">
        <div className="h-full flex items-center">
          <div className="w-1/2 space-y-6" style={{
            opacity: isVisible ? 1 : 0,
            transform: `translateY(${isVisible ? 0 : 20}px)`,
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
          }}>
            <h1 className="text-[48px] leading-[56px] font-bold text-[#5A5A52] max-w-[560px]">
              Your Safe Space for Emotional Wellness
            </h1>

            <p className="text-[18px] leading-[28px] text-[#8B8B7E] max-w-[480px]">
              HUSH adapts to you—through journaling, voice, or presence. Experience gentle, privacy-first support that grows with you.
            </p>

            <div className="flex gap-4 pt-2">
              <Button
                onClick={onGetStarted}
                className="h-[48px] px-8 rounded-[24px] bg-[#A8C5A7] hover:bg-[#7A9A79] text-[#FDFDF8] font-semibold shadow-gentle transition-all duration-200 hover:shadow-floating hover:-translate-y-1 hover:scale-[1.05] group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Journaling
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#7A9A79] to-[#A8C5A7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
              <Button
                variant="outline"
                className="h-[48px] px-8 rounded-[24px] bg-transparent border-2 border-[#A8C5A7] text-[#A8C5A7] hover:bg-[#D4E7D4] hover:border-[#7A9A79] font-semibold transition-all duration-200 hover:shadow-gentle hover:-translate-y-0.5"
              >
                Try Demo
              </Button>
            </div>
          </div>

          <div className="w-1/2 flex items-center justify-center" style={{
            opacity: isVisible ? 1 : 0,
            transform: `translateX(${isVisible ? 0 : 20}px)`,
            transition: 'opacity 1s ease-out 0.2s, transform 1s ease-out 0.2s'
          }}>
            <div className="relative w-[560px] h-[360px] rounded-[24px] shadow-floating overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-floating hover:scale-[1.02]">
              <div className="w-full h-full bg-gradient-to-br from-[#D4E7D4] to-[#A8C5A7] flex items-center justify-center">
                <svg width="400" height="300" viewBox="0 0 400 300" className="opacity-20">
                  <path
                    d="M200 250C200 250 160 200 160 150C160 100 200 50 250 50C300 50 340 100 340 150C340 200 300 250 250 250C225 250 200 250 200 250Z"
                    fill="#7A9A79"
                  />
                  <path
                    d="M100 280C100 280 60 230 60 180C60 130 100 80 150 80C200 80 240 130 240 180C240 230 200 280 150 280C125 280 100 280 100 280Z"
                    fill="#7A9A79"
                  />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#A8C5A7] flex items-center justify-center shadow-gentle group-hover:scale-110 group-hover:shadow-floating transition-all duration-200">
                    <Play className="w-8 h-8 text-[#FDFDF8] ml-1" fill="#FDFDF8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
