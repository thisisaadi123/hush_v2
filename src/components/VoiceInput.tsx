import { useState } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Mic, Square, Upload, Play, Pause } from 'lucide-react';

interface VoiceInputProps {
  onBack: () => void;
}

type RecordingState = 'idle' | 'recording' | 'processing' | 'complete';

export function VoiceInput({ onBack }: VoiceInputProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleStartRecording = () => {
    setRecordingState('recording');
    setRecordingTime(0);
    // Simulate recording timer
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Cleanup would happen on stop
    setTimeout(() => clearInterval(interval), 300000); // Max 5 minutes
  };

  const handleStopRecording = () => {
    setRecordingState('processing');
    // Simulate processing
    setTimeout(() => {
      setRecordingState('complete');
    }, 2000);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#FDFDF8] py-8">
      <div className="max-w-[1440px] mx-auto px-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#7A9A79] hover:text-[#5A5A52] transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </button>

        <div className="max-w-[640px] mx-auto">
          {recordingState === 'idle' && (
            <div className="text-center space-y-8">
              <h2 className="text-[36px] leading-[44px] font-bold text-[#5A5A52]">
                Share Through Voice
              </h2>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleStartRecording}
                  className="h-14 px-8 rounded-[24px] bg-[#A8C5A7] hover:bg-[#7A9A79] text-[#FDFDF8] font-semibold shadow-gentle transition-all duration-200 hover:shadow-floating gap-2"
                >
                  <Mic className="w-5 h-5" />
                  Record Now
                </Button>

                <Button
                  variant="outline"
                  className="h-14 px-8 rounded-[24px] border-2 border-[#A8C5A7] text-[#A8C5A7] hover:bg-[#D4E7D4] font-semibold gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload Audio
                </Button>
              </div>

              <div className="bg-[#FFF4D6] rounded-[16px] p-6 text-left">
                <p className="text-[14px] text-[#8B8B7E] leading-[20px]">
                  🔒 <span className="font-semibold">Your voice stays private.</span> We analyze tone, never store recordings.
                </p>
              </div>
            </div>
          )}

          {recordingState === 'recording' && (
            <div className="text-center space-y-8">
              <h2 className="text-[36px] leading-[44px] font-bold text-[#5A5A52]">
                {isPaused ? 'Recording Paused' : 'Listening...'}
              </h2>

              {/* Large circular record button */}
              <div className="flex flex-col items-center gap-6">
                <div 
                  className={`w-[120px] h-[120px] rounded-full flex items-center justify-center shadow-floating transition-all duration-300 ${
                    isPaused ? 'bg-[#A8C5A7]' : 'bg-[#F9E5A7] animate-pulse'
                  }`}
                >
                  <div className="w-[100px] h-[100px] rounded-full bg-white/30 flex items-center justify-center">
                    <Mic className="w-12 h-12 text-[#7A9A79]" />
                  </div>
                </div>

                {/* Waveform visualization */}
                {!isPaused && (
                  <div className="flex items-center gap-1 h-16">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-[#D4E7D4] rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 60 + 10}px`,
                          animationDelay: `${i * 0.05}s`
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Timer */}
                <div className="text-[24px] font-bold text-[#7A9A79]">
                  {formatTime(recordingTime)}
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    className="h-12 px-6 rounded-[24px] border-2 border-[#A8C5A7] text-[#A8C5A7] hover:bg-[#D4E7D4] font-semibold gap-2"
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>

                  <Button
                    onClick={handleStopRecording}
                    className="h-12 px-6 rounded-[24px] bg-[#A8C5A7] hover:bg-[#7A9A79] text-[#FDFDF8] font-semibold gap-2"
                  >
                    <Square className="w-5 h-5" />
                    Stop
                  </Button>
                </div>
              </div>

              <div className="bg-[#FFF4D6] rounded-[16px] p-6 text-left">
                <p className="text-[14px] text-[#8B8B7E] leading-[20px]">
                  🔒 We're listening to your tone and pace, not your words. Everything stays private.
                </p>
              </div>
            </div>
          )}

          {recordingState === 'processing' && (
            <div className="text-center space-y-8">
              <div className="flex flex-col items-center gap-6">
                {/* Animated leaf spinner */}
                <div className="w-24 h-24 animate-spin">
                  <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                    <path 
                      d="M36 60C36 60 28 48 28 36C28 24 36 16 48 16C60 16 68 24 68 36C68 48 60 60 48 60C42 60 36 60 36 60Z" 
                      fill="#A8C5A7"
                    />
                  </svg>
                </div>

                <h2 className="text-[28px] leading-[36px] font-semibold text-[#5A5A52]">
                  Listening with care...
                </h2>
                <p className="text-[16px] text-[#8B8B7E]">
                  Processing your voice session
                </p>
              </div>
            </div>
          )}

          {recordingState === 'complete' && (
            <div className="text-center space-y-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#A8C5A7] flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-[36px] leading-[44px] font-bold text-[#5A5A52]">
                Voice Session Complete
              </h2>

              <p className="text-[18px] text-[#8B8B7E] max-w-[480px] mx-auto">
                Thank you for sharing. We've noted your emotional tone and will include this in your wellness insights.
              </p>

              <div className="flex gap-4 justify-center pt-4">
                <Button
                  onClick={() => setRecordingState('idle')}
                  variant="outline"
                  className="h-12 px-8 rounded-[24px] border-2 border-[#A8C5A7] text-[#A8C5A7] hover:bg-[#D4E7D4] font-semibold"
                >
                  Record Another
                </Button>

                <Button
                  onClick={onBack}
                  className="h-12 px-8 rounded-[24px] bg-[#A8C5A7] hover:bg-[#7A9A79] text-[#FDFDF8] font-semibold shadow-gentle"
                >
                  Return Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
