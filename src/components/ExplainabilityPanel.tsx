import { useState } from 'react';
import { X, ChevronDown, ChevronUp, TrendingUp, Mic, Smile } from 'lucide-react';
import { Button } from './ui/button';

interface ExplainabilityPanelProps {
  onClose: () => void;
}

export function ExplainabilityPanel({ onClose }: ExplainabilityPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('typing');

  const sections = [
    {
      id: 'typing',
      icon: <TrendingUp className="w-5 h-5 text-[#7A9A79]" />,
      title: 'Typing Patterns',
      content: (
        <div className="space-y-3">
          <p className="text-[14px] text-[#8B8B7E] leading-[20px]">
            We noticed slower typing today—this might mean you're processing deeply. Your rhythm suggests thoughtful reflection rather than stress.
          </p>
          <div className="bg-[#F5F5ED] rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-[#8B8B7E]">Average pause between words</span>
              <span className="text-[14px] font-semibold text-[#5A5A52]">2.3s</span>
            </div>
            <div className="h-2 bg-[#D4E7D4] rounded-full overflow-hidden">
              <div className="h-full bg-[#A8C5A7] rounded-full" style={{ width: '65%' }} />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'voice',
      icon: <Mic className="w-5 h-5 text-[#7A9A79]" />,
      title: 'Voice Tone Analysis',
      content: (
        <div className="space-y-3">
          <p className="text-[14px] text-[#8B8B7E] leading-[20px]">
            Your voice had a gentler tone—you might be feeling calm or reflective. We noticed steady pacing, which suggests emotional balance.
          </p>
          <div className="bg-[#F5F5ED] rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#8B8B7E]">Tone stability</span>
              <span className="text-[14px] font-semibold text-[#5A5A52]">High</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#8B8B7E]">Speaking pace</span>
              <span className="text-[14px] font-semibold text-[#5A5A52]">Steady</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'facial',
      icon: <Smile className="w-5 h-5 text-[#7A9A79]" />,
      title: 'Expression Insights',
      content: (
        <div className="space-y-3">
          <p className="text-[14px] text-[#8B8B7E] leading-[20px]">
            We observed relaxed facial expressions during your check-in. Your body language suggested openness and presence in the moment.
          </p>
          <div className="bg-[#F5F5ED] rounded-lg p-3">
            <ul className="space-y-1 text-[12px] text-[#8B8B7E]">
              <li>• Relaxed brow and jaw</li>
              <li>• Gentle eye movement</li>
              <li>• Natural, comfortable posture</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 glassmorphism-overlay z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[480px] glassmorphism-floating z-50 glassmorphism-slide-in-right overflow-y-auto">
        <div className="p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-[#8B8B7E] hover:text-[#5A5A52] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[28px] leading-[36px] font-bold text-[#5A5A52] mb-3">
              Understanding Your Wellness Score
            </h2>
            <p className="text-[16px] text-[#8B8B7E] leading-[24px]">
              We use gentle observations from your interactions to understand your emotional wellness. Here's how we determine your score.
            </p>
          </div>

          {/* Sections - Collapsible Accordions */}
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className="border border-[#C8C8BC] rounded-[16px] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setExpandedSection(
                    expandedSection === section.id ? null : section.id
                  )}
                  className="w-full flex items-center justify-between p-4 bg-[#F5F5ED] hover:bg-[#D4E7D4] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4E7D4] flex items-center justify-center">
                      {section.icon}
                    </div>
                    <span className="font-semibold text-[#5A5A52]">
                      {section.title}
                    </span>
                  </div>
                  {expandedSection === section.id ? (
                    <ChevronUp className="w-5 h-5 text-[#7A9A79]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#7A9A79]" />
                  )}
                </button>

                {expandedSection === section.id && (
                  <div className="p-4 bg-white animate-in slide-in-from-top duration-200">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Reassurance Section */}
          <div className="mt-8 p-6 bg-[#FFF4D6] rounded-[16px]">
            <h4 className="font-semibold text-[#5A5A52] mb-2">
              A Gentle Reminder
            </h4>
            <p className="text-[14px] text-[#8B8B7E] leading-[20px] mb-4">
              We're here to support, not diagnose. These are gentle observations meant to help you understand your emotional patterns. Your wellness score is a tool for reflection, not judgment.
            </p>
            <p className="text-[14px] text-[#8B8B7E] leading-[20px]">
              Everything you share is private and encrypted. We never share your data with anyone.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#C8C8BC]">
            <p className="text-center">
              <button className="text-[14px] font-semibold text-[#7A9A79] hover:text-[#5A5A52] transition-colors">
                Questions? Talk to us →
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
