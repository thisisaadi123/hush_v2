import { AppView } from '../App';
import { ModeCard } from './ModeCard';
import { Feather, Mic, Video } from 'lucide-react';

interface ModeSelectionProps {
  onSelectMode: (view: AppView) => void;
}

export function ModeSelection({ onSelectMode }: ModeSelectionProps) {
  return (
    <section className="py-16">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-[36px] leading-[44px] font-bold text-[#5A5A52] mb-3">
            Choose How You'd Like to Connect
          </h2>
          <p className="text-[18px] leading-[28px] text-[#8B8B7E]">
            Express yourself in whatever way feels right today
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
          <ModeCard
            icon={<Feather className="w-10 h-10 text-[#7A9A79]" />}
            title="Write & Reflect"
            description="Type freely in a safe space. We understand your rhythm, not just your words."
            buttonText="Start Writing"
            onSelect={() => onSelectMode('journaling')}
            iconBg="#D4E7D4"
          />

          <ModeCard
            icon={<Mic className="w-10 h-10 text-[#7A9A79]" />}
            title="Speak Your Mind"
            description="Share through voice. We listen to tone, pace, and emotion—always privately."
            buttonText="Record Voice"
            onSelect={() => onSelectMode('voice')}
            iconBg="#D4E7D4"
          />

          <ModeCard
            icon={<Video className="w-10 h-10 text-[#7A9A79]" />}
            title="Be Present"
            description="Optional video check-ins. We notice what words can't express, with your permission."
            buttonText="Connect Visually"
            onSelect={() => onSelectMode('video')}
            iconBg="#D4E7D4"
          />
        </div>
      </div>
    </section>
  );
}
