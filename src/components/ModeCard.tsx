import { ReactNode, useState } from 'react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface ModeCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onSelect: () => void;
  iconBg: string;
}

export function ModeCard({ icon, title, description, buttonText, onSelect, iconBg }: ModeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-full h-[480px] rounded-[24px] p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 cursor-pointer group relative overflow-hidden glassmorphism-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#D4E7D4] to-transparent opacity-0 group-hover:opacity-15 transition-opacity duration-300"
      />

      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 relative z-10"
        style={{
          backgroundColor: iconBg,
          boxShadow: isHovered ? '0 8px 24px rgba(122, 154, 121, 0.25)' : 'none'
        }}
      >
        {icon}
      </div>

      <h3 className="text-[24px] leading-[32px] font-semibold text-[#5A5A52] mb-3 relative z-10 transition-colors duration-300 group-hover:text-[#7A9A79]">
        {title}
      </h3>

      <p className="text-[16px] leading-[24px] text-[#8B8B7E] mb-6 flex-grow relative z-10 transition-colors duration-300 group-hover:text-[#5A5A52]">
        {description}
      </p>

      <Button
        onClick={onSelect}
        className="w-full h-12 rounded-[24px] bg-[#A8C5A7] hover:bg-[#7A9A79] text-[#FDFDF8] font-semibold shadow-gentle transition-all duration-200 hover:shadow-floating relative z-10 group/btn overflow-hidden"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {buttonText}
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#7A9A79] to-[#A8C5A7] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
      </Button>
    </div>
  );
}
