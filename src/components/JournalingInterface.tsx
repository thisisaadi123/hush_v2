import { useState, useEffect, useRef } from 'react';
import { getTextScore } from '../utils/ai/textSentiment';
import { TypingBiomarker } from '../utils/ai/typingBiomarker';
import { analyzeVoice, recordVoiceSample } from '../utils/ai/voiceAnalysis';
import { JournalEntry } from '../App';
import { Button } from './ui/button';
import { PlantVisualization } from './PlantVisualization';
import { EditJournalDialog } from './ui/edit-journal-dialog';
import { ArrowLeft, Check, RotateCw, Pencil } from 'lucide-react';
import { modelApi } from '../utils/api';

interface JournalingInterfaceProps {
  onSave: (entry: JournalEntry) => void;
  onBack: () => void;
  currentStreak: number;
  pastEntries: JournalEntry[];
}

const journalPrompts = [
  "What's present for you right now?",
  "How are you feeling in this moment?",
  "What would kindness to yourself look like today?",
  "What's one thing you're grateful for right now?",
  "What do you need to hear today?",
  "What emotions are you holding right now?"
];

export function JournalingInterface({ onSave, onBack, currentStreak, pastEntries }: JournalingInterfaceProps) {
  // State for edit dialog
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // Check if there's an entry for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEntry = pastEntries.find(e => {
    const entryDate = new Date(e.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });

  const [content, setContent] = useState(todayEntry?.content || '');
  const [currentPrompt, setCurrentPrompt] = useState(todayEntry?.prompt || journalPrompts[0]);
  const [isSaved, setIsSaved] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    if (content.trim()) {
      setAutoSaveStatus('saving');
      autoSaveTimeoutRef.current = setTimeout(() => {
        setAutoSaveStatus('saved');
      }, 1000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [content]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt(prev => {
        const currentIndex = journalPrompts.indexOf(prev);
        const nextIndex = (currentIndex + 1) % journalPrompts.length;
        return journalPrompts[nextIndex];
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsTyping(true);
    const timeout = setTimeout(() => setIsTyping(false), 1000);
    return () => clearTimeout(timeout);
  }, [content]);

  // Start typing biomarker listening on mount, cleanup on unmount
  useEffect(() => {
    // Reset and start fresh
    TypingBiomarker.stopListening();
    TypingBiomarker.startListening('journal-input');
    
    // Expose for interactive testing in DevTools
    try {
      (window as any).TypingBiomarker = TypingBiomarker;
    } catch (e) {
      // noop in non-browser
    }

    // Clean up listener when component unmounts
    return () => {
      TypingBiomarker.stopListening();
    };
  }, []);

  async function runAIDiagnostics() {
    try {
      const text = content || '';
      const textScore = getTextScore(text);
      const typingResult = TypingBiomarker.analyze();

      let voiceScore: number | null = null;
      const doVoice = window.confirm('Run voice diagnostics? This will record ~3 seconds from your microphone.');
      if (doVoice) {
        try {
          await recordVoiceSample(3000);
          voiceScore = await analyzeVoice();
        } catch (err) {
          console.warn('Voice diagnostics failed', err);
          voiceScore = null;
        }
      }

      const msg = `AI Diagnostics:\n- textScore: ${textScore.toFixed(3)}\n- typingScore: ${typingResult.finalTypingScore.toFixed(3)}${voiceScore !== null ? `\n- voiceScore: ${voiceScore.toFixed(3)}` : ''}`;
      console.log(msg);
      alert(msg);
    } catch (err) {
      console.error('Diagnostics failed', err);
      alert('Diagnostics failed — see console');
    }
  }

  const handleSave = () => {
    // keep for backward compatibility; prefer handleSubmit which includes AI attributions
    handleSubmit();
  };

  async function handleSubmit() {
    if (!content.trim()) return;

    // 1) Local save
    const entry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date: new Date(),
      content: content,
      prompt: currentPrompt
    };
    onSave(entry);

    // 2) Get AI scores
    const textScore = getTextScore(content);
    // Typing biomarker
    const typingResult = TypingBiomarker.analyze();

    // Voice: attempt to record a short sample if user grants permission (non-blocking)
    let voiceScore = 0;
    try {
      // optional: record voice sample for 3s; comment out if you don't want auto-record
      // await recordVoiceSample(3000);
      // voiceScore = await analyzeVoice();
    } catch (err) {
      console.warn('voice sample failed', err);
    }

    // 3) Prepare payload and send to backend
    const payload = {
      feature_attributions: {
        text: textScore,
        typing: typingResult.finalTypingScore,
        voice: voiceScore
      }
    };

    try {
      await modelApi.submitUpdate(payload);
      console.log('Logged attributions to backend');
    } catch (err) {
      console.error('Backend logging error:', err);
    }

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setContent('');
    }, 2000);
  }

  const handleNewPrompt = () => {
    const currentIndex = journalPrompts.indexOf(currentPrompt);
    const nextIndex = (currentIndex + 1) % journalPrompts.length;
    setCurrentPrompt(journalPrompts[nextIndex]);
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen">
      <div className="h-[72px] bg-[#F5F5ED] border-b border-[#C8C8BC]">
        <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#7A9A79] hover:text-[#5A5A52] transition-all duration-200 hover:-translate-x-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Journals</span>
          </button>

          <div className="text-[16px] text-[#8B8B7E]">
            {currentDate}
          </div>

          <Button
            onClick={handleSave}
            disabled={!content.trim()}
            className="h-10 px-6 rounded-[24px] bg-[#A8C5A7] hover:bg-[#7A9A79] text-[#FDFDF8] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-1"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved
              </>
            ) : (
              'Save Entry'
            )}
          </Button>
          <Button
            onClick={runAIDiagnostics}
            className="ml-3 h-10 px-4 rounded-[24px] bg-white border border-[#D4E7D4] text-[#5A5A52] font-semibold hover:bg-[#F5F5ED] transition-all duration-150"
          >
            AI Diagnostics
          </Button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 space-y-6">
            <div
              className="rounded-t-[16px] p-6 transition-all duration-500 group relative glassmorphism-gradient-warm"
            >
              <p className="font-crimson italic text-[20px] leading-[32px] text-[#7A9A79] transition-colors duration-300 group-hover:text-[#5A5A52]">
                {currentPrompt}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[12px] text-[#8B8B7E]">
                  <span className="w-2 h-2 rounded-full bg-[#A8C5A7] animate-pulse" />
                  Prompt refreshes every 10 seconds
                </div>
                <button
                  onClick={handleNewPrompt}
                  className="flex items-center gap-1 text-[12px] font-semibold text-[#7A9A79] hover:text-[#5A5A52] transition-colors group/btn"
                >
                  <RotateCw className="w-3 h-3 transition-transform group-hover/btn:rotate-180 duration-300" />
                  New prompt
                </button>
              </div>
            </div>

            <div className="relative">
              {todayEntry ? (
                <div className="w-full min-h-[400px] bg-[#FDFDF8] border-2 border-[#D4E7D4] rounded-[16px] p-6 flex flex-col items-center justify-center text-center">
                  <div className="mb-6 relative">
                    <div className="w-20 h-20 rounded-full bg-[#D4E7D4] flex items-center justify-center mb-2 mx-auto animate-pulse">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-10 h-10 text-[#7A9A79]"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-[24px] font-semibold text-[#5A5A52] mb-3">
                    Journal Entry Complete
                  </h3>
                  <p className="text-[16px] leading-[24px] text-[#8B8B7E] max-w-[400px] mb-6">
                    You've already captured your thoughts for today. Taking time to reflect daily helps your inner garden grow. Come back tomorrow for a fresh entry.
                  </p>
                  <button
                    onClick={() => setSelectedEntry(todayEntry)}
                    className="flex items-center gap-2 text-[#7A9A79] hover:text-[#5A5A52] transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Edit today's entry</span>
                  </button>
                </div>
              ) : (
                <div>
                  <textarea
                    id="journal-input"
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Begin writing..."
                    className="w-full min-h-[400px] bg-[#FDFDF8] border-2 border-[#D4E7D4] rounded-[16px] p-6 text-[18px] leading-[28px] text-[#5A5A52] placeholder:font-crimson placeholder:italic placeholder:text-[#C8C8BC] focus:outline-none focus:border-[#A8C5A7] focus:shadow-soft-inner resize-none transition-all duration-200 hover:border-[#A8C5A7]/50"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-3">
                    {autoSaveStatus === 'saving' && (
                      <div className="flex items-center gap-2 text-[12px] text-[#8B8B7E]">
                        <div className="w-2 h-2 bg-[#F9E5A7] rounded-full animate-pulse" />
                        Saving...
                      </div>
                    )}
                    {autoSaveStatus === 'saved' && (
                      <div className="flex items-center gap-2 text-[12px] text-[#A8C5A7]">
                        <div className="w-2 h-2 bg-[#A8C5A7] rounded-full" />
                        Saved
                      </div>
                    )}
                  </div>
                </div>

              )}
              {content.length > 0 && !todayEntry && (
                <div className="mt-2 flex justify-between text-sm text-[#8B8B7E]">
                  <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
                  <span>{content.length} characters</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-[380px] space-y-6">
            <div className="bg-[#F5F5ED] rounded-[16px] p-6 shadow-whisper hover:shadow-gentle transition-all duration-300">
              <h4 className="text-[20px] font-semibold text-[#5A5A52] mb-4">
                Your Growth Journey
              </h4>
              <PlantVisualization streak={currentStreak} />
              <p className="text-center text-[14px] text-[#8B8B7E] mt-4">
                {currentStreak} {currentStreak === 1 ? 'day' : 'days'} of self-care
              </p>
            </div>

            <div className="bg-[#F5F5ED] rounded-[16px] p-6 shadow-whisper hover:shadow-gentle transition-all duration-300">
              <h4 className="text-[20px] font-semibold text-[#5A5A52] mb-4">
                Past Entries
              </h4>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {pastEntries.length === 0 ? (
                  <p className="text-[14px] text-[#8B8B7E] italic">
                    Your journey begins here
                  </p>
                ) : (
                  pastEntries.slice(0, 10).map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-[#FDFDF8] rounded-[12px] p-3 hover:shadow-gentle transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:bg-white group relative"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[12px] text-[#8B8B7E]">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                        {/* Add edit button with hover effect */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEntry(entry);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-[#F5F5ED] rounded-full"
                        >
                          <Pencil className="w-4 h-4 text-[#7A9A79] hover:text-[#5A5A52] transition-colors" />
                        </button>
                      </div>
                      <p className="text-[14px] text-[#5A5A52] line-clamp-2 group-hover:text-[#7A9A79] transition-colors">
                        {entry.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Dialog */}
      {selectedEntry && (
        <EditJournalDialog
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onSave={(updatedEntry) => {
            onSave(updatedEntry);
            setSelectedEntry(null);
          }}
        />
      )}
    </div>
  );
}
