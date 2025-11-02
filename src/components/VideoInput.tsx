import { useState } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Video, Upload, Camera } from 'lucide-react';

interface VideoInputProps {
  onBack: () => void;
}

type VideoState = 'idle' | 'camera-active' | 'countdown' | 'capturing' | 'processing' | 'complete';

export function VideoInput({ onBack }: VideoInputProps) {
  const [videoState, setVideoState] = useState<VideoState>('idle');
  const [countdown, setCountdown] = useState(3);

  const handleStartCamera = () => {
    setVideoState('camera-active');
  };

  const handleCapture = () => {
    setVideoState('countdown');
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setVideoState('capturing');
          
          // Simulate capture duration
          setTimeout(() => {
            setVideoState('processing');
            setTimeout(() => {
              setVideoState('complete');
            }, 2000);
          }, 3000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSkip = () => {
    onBack();
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
          {videoState === 'idle' && (
            <div className="text-center space-y-8">
              <h2 className="text-[36px] leading-[44px] font-bold text-[#5A5A52]">
                Connect Visually
              </h2>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleStartCamera}
                  className="h-14 px-8 rounded-[24px] bg-[#A8C5A7] hover:bg-[#7A9A79] text-[#FDFDF8] font-semibold shadow-gentle transition-all duration-200 hover:shadow-floating gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Start Camera
                </Button>

                <Button
                  variant="outline"
                  className="h-14 px-8 rounded-[24px] border-2 border-[#A8C5A7] text-[#A8C5A7] hover:bg-[#D4E7D4] font-semibold gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload Video
                </Button>
              </div>

              <div className="bg-[#FFF4D6] rounded-[16px] p-6 text-left space-y-3">
                <p className="text-[14px] text-[#8B8B7E] leading-[20px]">
                  🔒 <span className="font-semibold">We notice expressions, never record faces.</span> Your privacy matters.
                </p>
                <p className="text-[14px] text-[#8B8B7E] leading-[20px]">
                  Optional video check-ins help us understand what words can't express—but only with your permission.
                </p>
              </div>

              <Button
                onClick={handleSkip}
                variant="ghost"
                className="text-[#7A9A79] hover:text-[#5A5A52] font-semibold underline"
              >
                Skip video analysis entirely
              </Button>
            </div>
          )}

          {videoState === 'camera-active' && (
            <div className="space-y-6">
              <h2 className="text-[28px] leading-[36px] font-semibold text-[#5A5A52] text-center">
                Camera Preview
              </h2>

              {/* Camera preview frame */}
              <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#D4E7D4] to-[#A8C5A7] rounded-[24px] border-2 border-[#C8C8BC] overflow-hidden">
                {/* Simulated camera view */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-[#7A9A79]">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Camera feed would appear here</p>
                  </div>
                </div>

                {/* Privacy indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 px-3 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-[#5A5A52]">Private Session</span>
                </div>
              </div>

              {/* Capture button */}
              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={handleCapture}
                  className="w-20 h-20 rounded-full bg-[#A8C5A7] hover:bg-[#7A9A79] shadow-floating transition-all duration-200 hover:scale-110"
                >
                  <div className="w-16 h-16 rounded-full border-4 border-white" />
                </Button>

                <p className="text-sm text-[#8B8B7E]">
                  Click to capture a brief moment
                </p>
              </div>

              <div className="bg-[#FFF4D6] rounded-[16px] p-4 text-center">
                <p className="text-[12px] text-[#8B8B7E] leading-[18px]">
                  We analyze momentary expressions only. Nothing is stored or recorded.
                </p>
              </div>
            </div>
          )}

          {videoState === 'countdown' && (
            <div className="text-center space-y-8">
              <div className="flex flex-col items-center gap-6">
                <div className="w-40 h-40 rounded-full bg-[#F9E5A7] flex items-center justify-center shadow-floating animate-pulse">
                  <span className="text-[72px] font-bold text-[#7A9A79]">
                    {countdown}
                  </span>
                </div>

                <h2 className="text-[28px] leading-[36px] font-semibold text-[#5A5A52]">
                  Get ready...
                </h2>
              </div>
            </div>
          )}

          {videoState === 'capturing' && (
            <div className="text-center space-y-8">
              <div className="flex flex-col items-center gap-6">
                <div className="w-32 h-32 rounded-full bg-[#A8C5A7] flex items-center justify-center shadow-floating relative">
                  <div className="absolute inset-0 rounded-full border-4 border-[#F9E5A7] animate-ping" />
                  <Camera className="w-12 h-12 text-white relative z-10" />
                </div>

                <h2 className="text-[28px] leading-[36px] font-semibold text-[#5A5A52]">
                  Capturing...
                </h2>
                <p className="text-[16px] text-[#8B8B7E]">
                  Stay natural, just be present
                </p>
              </div>
            </div>
          )}

          {videoState === 'processing' && (
            <div className="text-center space-y-8">
              <div className="flex flex-col items-center gap-6">
                <div className="w-24 h-24 animate-spin">
                  <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                    <path 
                      d="M36 60C36 60 28 48 28 36C28 24 36 16 48 16C60 16 68 24 68 36C68 48 60 60 48 60C42 60 36 60 36 60Z" 
                      fill="#A8C5A7"
                    />
                  </svg>
                </div>

                <h2 className="text-[28px] leading-[36px] font-semibold text-[#5A5A52]">
                  Analyzing expressions...
                </h2>
                <p className="text-[16px] text-[#8B8B7E]">
                  Understanding your emotional presence
                </p>
              </div>
            </div>
          )}

          {videoState === 'complete' && (
            <div className="text-center space-y-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#A8C5A7] flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-[36px] leading-[44px] font-bold text-[#5A5A52]">
                Check-in Complete
              </h2>

              <p className="text-[18px] text-[#8B8B7E] max-w-[480px] mx-auto">
                Thank you for being present. We've captured your emotional state and will include this in your wellness journey.
              </p>

              <div className="bg-[#D4E7D4] rounded-[16px] p-6 text-left">
                <h4 className="font-semibold text-[#5A5A52] mb-2">What we noticed:</h4>
                <ul className="space-y-2 text-[14px] text-[#8B8B7E]">
                  <li>• Calm and present demeanor</li>
                  <li>• Gentle expression indicating reflection</li>
                  <li>• Comfortable body language</li>
                </ul>
                <p className="text-[12px] text-[#8B8B7E] mt-4 italic">
                  These are gentle observations, not diagnoses. We're here to support, not judge.
                </p>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Button
                  onClick={() => setVideoState('idle')}
                  variant="outline"
                  className="h-12 px-8 rounded-[24px] border-2 border-[#A8C5A7] text-[#A8C5A7] hover:bg-[#D4E7D4] font-semibold"
                >
                  Another Check-in
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
