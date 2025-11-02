import { useState, useEffect } from 'react';
import { UserData, AppView } from '../App';
import { Button } from './ui/button';
import { PlantVisualization } from './PlantVisualization';
import { ExplainabilityPanel } from './ExplainabilityPanel';
import { Sparkles, Headphones, Leaf, ChevronRight, HelpCircle, TrendingUp } from 'lucide-react';

interface DashboardProps {
  userData: UserData;
  onNavigate: (view: AppView) => void;
}

export function Dashboard({ userData, onNavigate }: DashboardProps) {
  const [showExplainability, setShowExplainability] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = userData.wellnessScore / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= userData.wellnessScore) {
        setAnimatedScore(userData.wellnessScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [userData.wellnessScore]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const microInterventions = [
    {
      title: '5-Minute Breathing',
      description: 'Gentle breath work to center yourself',
      icon: <Sparkles className="w-5 h-5" />,
      color: '#F9E5A7'
    },
    {
      title: 'Gratitude Prompt',
      description: 'Reflect on three things you appreciate today',
      icon: <Sparkles className="w-5 h-5" />,
      color: '#A8C5A7'
    },
    {
      title: 'Nature Sounds',
      description: 'Calming ambient sounds for relaxation',
      icon: <Headphones className="w-5 h-5" />,
      color: '#D4E7D4'
    }
  ];

  const resources = [
    {
      title: 'Understanding Anxiety',
      type: 'Article',
      readTime: '5 min read'
    },
    {
      title: 'Sleep Better Tonight',
      type: 'Guide',
      readTime: '8 min read'
    },
    {
      title: 'Mindful Movement',
      type: 'Practice',
      readTime: '10 min'
    },
    {
      title: 'Building Resilience',
      type: 'Article',
      readTime: '6 min read'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="mb-12">
          <h1 className="text-[36px] leading-[44px] font-bold text-[#5A5A52] mb-2">
            {getGreeting()}, {userData.name}
          </h1>
          <p className="text-[16px] text-[#8B8B7E] mb-4">
            {currentDate}
          </p>
          <p className="text-[14px] text-[#8B8B7E] italic">
            "You're building a practice of self-care, one moment at a time"
          </p>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => onNavigate('journaling')}
              className="h-12 px-6 rounded-[24px] bg-[#A8C5A7] hover:bg-[#7A9A79] text-[#FDFDF8] font-semibold shadow-gentle transition-all duration-200 hover:shadow-floating hover:-translate-y-1"
            >
              New Journal
            </Button>
            <Button
              onClick={() => onNavigate('voice')}
              variant="outline"
              className="h-12 px-6 rounded-[24px] border-2 border-[#A8C5A7] text-[#A8C5A7] hover:bg-[#D4E7D4] font-semibold transition-all duration-200 hover:-translate-y-0.5"
            >
              Voice Check-In
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <div className="rounded-[16px] p-6 h-full glassmorphism-card">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-[20px] font-semibold text-[#5A5A52]">
                  Current Wellness Score
                </h4>
                <TrendingUp className="w-5 h-5 text-[#A8C5A7]" />
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48 group">
                  <svg className="w-full h-full transform -rotate-90 filter drop-shadow-lg">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#D4E7D4"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(animatedScore / 10) * 553} 553`}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#A8C5A7" />
                        <stop offset="50%" stopColor="#7A9A79" />
                        <stop offset="100%" stopColor="#F9E5A7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center transition-transform duration-300 group-hover:scale-110">
                      <div className="text-[48px] font-bold text-[#5A5A52] transition-colors duration-300 group-hover:text-[#7A9A79]">
                        {animatedScore.toFixed(1)}
                      </div>
                      <div className="text-[14px] text-[#8B8B7E]">
                        out of 10
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#A8C5A7]/10 to-[#F9E5A7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              <p className="text-[14px] text-[#8B8B7E] text-center mb-4">
                Based on your recent journals and check-ins
              </p>

              <button
                onClick={() => setShowExplainability(true)}
                className="w-full flex items-center justify-center gap-2 text-[14px] font-semibold text-[#7A9A79] hover:text-[#5A5A52] transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                How we determined this →
              </button>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="rounded-[16px] p-6 h-full glassmorphism-card">
              <h4 className="text-[20px] font-semibold text-[#5A5A52] mb-4">
                Your Growth Journey
              </h4>

              <PlantVisualization streak={userData.currentStreak} />

              <div className="text-center mt-4">
                <p className="text-[14px] text-[#8B8B7E] mb-4">
                  Keep growing your practice
                </p>
                <Button
                  onClick={() => onNavigate('journaling')}
                  className="h-10 px-6 rounded-[24px] bg-[#A8C5A7] hover:bg-[#7A9A79] text-[#FDFDF8] font-semibold transition-all duration-200 hover:scale-105"
                >
                  Journal Today
                </Button>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="rounded-[16px] p-6 glassmorphism-card">
              <h4 className="text-[20px] font-semibold text-[#5A5A52] mb-6">
                For You Today
              </h4>

              <div className="space-y-3">
                {microInterventions.map((intervention, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-[#F5F5ED] rounded-[16px] hover:shadow-gentle transition-all duration-200 cursor-pointer group hover:-translate-y-1 hover:bg-white"
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: intervention.color }}
                    >
                      {intervention.icon}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-[#5A5A52] mb-1 transition-colors duration-200 group-hover:text-[#7A9A79]">
                        {intervention.title}
                      </h5>
                      <p className="text-[14px] text-[#8B8B7E]">
                        {intervention.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#A8C5A7] hover:bg-[#7A9A79] text-white rounded-full w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    >
                      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="rounded-[16px] p-6 glassmorphism-card">
              <h4 className="text-[20px] font-semibold text-[#5A5A52] mb-4">
                Recent Activity
              </h4>

              <div className="space-y-2">
                {userData.journalEntries.length === 0 ? (
                  <p className="text-[14px] text-[#8B8B7E] italic">
                    Start your journey by writing your first journal entry
                  </p>
                ) : (
                  userData.journalEntries.slice(0, 5).map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 bg-[#F5F5ED] rounded-[12px] hover:shadow-gentle transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:bg-white"
                    >
                      <div className="text-[12px] text-[#8B8B7E] mb-1">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                      <p className="text-[14px] text-[#5A5A52] line-clamp-2">
                        {entry.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {userData.journalEntries.length > 5 && (
                <button className="w-full mt-4 text-[14px] font-semibold text-[#7A9A79] hover:text-[#5A5A52] transition-colors">
                  View all entries →
                </button>
              )}
            </div>
          </div>

          <div className="col-span-12">
            <div className="rounded-[16px] p-6 glassmorphism-card">
              <h4 className="text-[20px] font-semibold text-[#5A5A52] mb-6">
                Supportive Resources
              </h4>

              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {resources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[280px] h-[200px] bg-gradient-to-br from-[#D4E7D4] to-[#A8C5A7] rounded-[16px] p-6 shadow-gentle hover:shadow-floating transition-all duration-200 cursor-pointer hover:-translate-y-2 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="inline-block px-3 py-1 bg-white/40 rounded-full text-[12px] font-semibold text-[#5A5A52] mb-3 group-hover:bg-white/60 transition-colors">
                        {resource.type}
                      </div>
                      <h5 className="font-semibold text-[#5A5A52] mb-2 group-hover:text-[#7A9A79] transition-colors">
                        {resource.title}
                      </h5>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-[#7A9A79]">
                        {resource.readTime}
                      </span>
                      <Leaf className="w-5 h-5 text-[#7A9A79] transition-transform group-hover:rotate-12" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showExplainability && (
        <ExplainabilityPanel onClose={() => setShowExplainability(false)} />
      )}
    </div>
  );
}
