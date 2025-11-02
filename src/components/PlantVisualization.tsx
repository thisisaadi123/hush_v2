import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface PlantVisualizationProps {
  streak: number;
}

export function PlantVisualization({ streak }: PlantVisualizationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevStreak, setPrevStreak] = useState(streak);

  useEffect(() => {
    if (streak > prevStreak) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
    setPrevStreak(streak);
  }, [streak, prevStreak]);

  const getGrowthStage = (days: number) => {
    if (days < 3) return 1;
    if (days < 7) return 2;
    if (days < 14) return 3;
    if (days < 30) return 4;
    return 5;
  };

  const stage = getGrowthStage(streak);
  const progress = ((streak % 7) / 7) * 100;

  return (
    <div className="w-full h-[240px] rounded-[16px] bg-gradient-to-t from-[#FFF4D6] to-transparent flex flex-col items-center justify-end pb-6 relative overflow-hidden group">
      {isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute text-[#F9E5A7] animate-ping"
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + (i % 2) * 30}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#7A9A79] rounded-full blur-sm" />
      </div>

      <div className="absolute bottom-2 left-0 right-0 mx-6">
        <div className="bg-[#D4E7D4] rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#A8C5A7] to-[#F9E5A7] transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="relative z-10 transition-transform duration-500" style={{
        transform: isAnimating ? 'scale(1.1)' : 'scale(1)'
      }}>
        <svg width="200" height="180" viewBox="0 0 200 180" fill="none" className="filter drop-shadow-lg">
          {stage >= 1 && (
            <>
              <ellipse cx="100" cy="160" rx="30" ry="8" fill="#7A9A79" opacity="0.3" />
              <circle cx="100" cy="155" r="8" fill="#7A9A79" />
            </>
          )}

          {stage >= 2 && (
            <>
              <path
                d="M100 155 Q105 140 105 130"
                stroke="#7A9A79"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <ellipse cx="102" cy="130" rx="8" ry="12" fill="#A8C5A7" />
              <ellipse cx="108" cy="132" rx="7" ry="10" fill="#A8C5A7" />
            </>
          )}

          {stage >= 3 && (
            <>
              <path
                d="M105 130 Q107 110 108 90"
                stroke="#7A9A79"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <ellipse cx="105" cy="95" rx="12" ry="16" fill="#A8C5A7" />
              <ellipse cx="111" cy="98" rx="11" ry="15" fill="#A8C5A7" />
              <ellipse cx="100" cy="110" rx="10" ry="14" fill="#A8C5A7" />
              <ellipse cx="115" cy="112" rx="9" ry="13" fill="#D4E7D4" />
            </>
          )}

          {stage >= 4 && (
            <>
              <path
                d="M108 90 Q110 70 110 50"
                stroke="#7A9A79"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <ellipse cx="107" cy="55" rx="15" ry="20" fill="#A8C5A7" />
              <ellipse cx="113" cy="60" rx="14" ry="19" fill="#A8C5A7" />
              <ellipse cx="120" cy="65" rx="13" ry="18" fill="#D4E7D4" />
              <ellipse cx="100" cy="70" rx="13" ry="18" fill="#A8C5A7" />
              <ellipse cx="93" cy="75" rx="12" ry="17" fill="#D4E7D4" />
              <ellipse cx="125" cy="80" rx="11" ry="16" fill="#A8C5A7" />

              <circle cx="110" cy="45" r="5" fill="#F9E5A7" opacity="0.8" />
              <circle cx="105" cy="50" r="4" fill="#F9E5A7" opacity="0.7" />
            </>
          )}

          {stage >= 5 && (
            <>
              <path
                d="M110 50 Q112 30 112 15"
                stroke="#7A9A79"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />

              <ellipse cx="109" cy="25" rx="16" ry="22" fill="#A8C5A7" />
              <ellipse cx="115" cy="30" rx="15" ry="21" fill="#A8C5A7" />
              <ellipse cx="102" cy="32" rx="14" ry="20" fill="#D4E7D4" />
              <ellipse cx="122" cy="38" rx="13" ry="19" fill="#A8C5A7" />
              <ellipse cx="96" cy="40" rx="13" ry="19" fill="#D4E7D4" />

              <g transform="translate(110, 15)">
                <circle r="3" fill="#EDD084" />
                <circle cx="5" cy="0" r="3" fill="#F9E5A7" />
                <circle cx="-5" cy="0" r="3" fill="#F9E5A7" />
                <circle cx="0" cy="5" r="3" fill="#F9E5A7" />
                <circle cx="0" cy="-5" r="3" fill="#F9E5A7" />
                <circle r="4" fill="#EDD084" />
              </g>

              <g transform="translate(105, 22)">
                <circle r="2.5" fill="#EDD084" />
                <circle cx="4" cy="0" r="2.5" fill="#F9E5A7" />
                <circle cx="-4" cy="0" r="2.5" fill="#F9E5A7" />
                <circle cx="0" cy="4" r="2.5" fill="#F9E5A7" />
                <circle cx="0" cy="-4" r="2.5" fill="#F9E5A7" />
              </g>

              <g transform="translate(116, 20)">
                <circle r="2.5" fill="#EDD084" />
                <circle cx="4" cy="0" r="2.5" fill="#F9E5A7" />
                <circle cx="-4" cy="0" r="2.5" fill="#F9E5A7" />
                <circle cx="0" cy="4" r="2.5" fill="#F9E5A7" />
                <circle cx="0" cy="-4" r="2.5" fill="#F9E5A7" />
              </g>

              <circle cx="110" cy="15" r="25" fill="#F9E5A7" opacity="0.1" />
              <circle cx="110" cy="15" r="35" fill="#F9E5A7" opacity="0.05" />
            </>
          )}
        </svg>
      </div>

      <div className="text-center mt-2 transition-transform duration-300 group-hover:scale-110">
        <div className="text-[36px] font-bold text-[#7A9A79] transition-colors duration-300 group-hover:text-[#5A5A52]">
          {streak}
        </div>
        <p className="text-[12px] text-[#8B8B7E] font-medium">
          {streak === 1 ? 'day' : 'days'} strong
        </p>
      </div>
    </div>
  );
}
