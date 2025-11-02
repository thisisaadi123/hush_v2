import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ModeSelection } from './components/ModeSelection';
import { JournalingInterface } from './components/JournalingInterface';
import { VoiceInput } from './components/VoiceInput';
import { VideoInput } from './components/VideoInput';
import { Dashboard } from './components/Dashboard';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';

export type AppView = 'home' | 'journaling' | 'voice' | 'video' | 'dashboard' | 'signin' | 'signup';

export interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  prompt: string;
  mood?: string;
}

export interface UserData {
  name: string;
  currentStreak: number;
  wellnessScore: number;
  journalEntries: JournalEntry[];
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: 'Friend',
    currentStreak: 7,
    wellnessScore: 7.8,
    journalEntries: []
  });

  // Protected routes that require authentication
  const protectedRoutes: AppView[] = ['journaling', 'voice', 'video', 'dashboard'];

  // Check if trying to access protected route without being authenticated
  const handleNavigate = (view: AppView) => {
    if (protectedRoutes.includes(view) && !isAuthenticated) {
      setCurrentView('signin');
      return;
    }
    setCurrentView(view);
  };

  // Protect routes - redirect to sign in if accessing protected route while not authenticated
  useEffect(() => {
    const protectedRoutes: AppView[] = ['journaling', 'voice', 'video', 'dashboard'];
    if (protectedRoutes.includes(currentView) && !isAuthenticated) {
      setCurrentView('signin');
    }
  }, [currentView, isAuthenticated]);

  const handleSaveJournalEntry = (entry: JournalEntry) => {
    setUserData(prev => {
      // Check if there's already an entry for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const existingTodayEntry = prev.journalEntries.find(e => {
        const entryDate = new Date(e.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      });

      // If editing today's entry, don't increase streak
      if (existingTodayEntry) {
        return {
          ...prev,
          journalEntries: prev.journalEntries.map(e => 
            e.id === existingTodayEntry.id ? entry : e
          )
        };
      }

      // If new entry on a different day, increase streak
      return {
        ...prev,
        journalEntries: [entry, ...prev.journalEntries],
        currentStreak: prev.currentStreak + 1
      };
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation 
        currentView={currentView} 
        onNavigate={handleNavigate}
        isAuthenticated={isAuthenticated}
        onLogout={() => {
          setIsAuthenticated(false);
          setCurrentView('home');
        }}
      />
      
      {currentView === 'home' && (
        <>
          <Hero onGetStarted={() => handleNavigate('journaling')} />
          <ModeSelection onSelectMode={handleNavigate} />
        </>
      )}
      
      {currentView === 'journaling' && isAuthenticated && (
        <JournalingInterface 
          onSave={handleSaveJournalEntry}
          onBack={() => setCurrentView('home')}
          currentStreak={userData.currentStreak}
          pastEntries={userData.journalEntries}
        />
      )}
      
      {currentView === 'voice' && isAuthenticated && (
        <VoiceInput onBack={() => setCurrentView('home')} />
      )}
      
      {currentView === 'video' && isAuthenticated && (
        <VideoInput onBack={() => setCurrentView('home')} />
      )}
      
      {currentView === 'dashboard' && isAuthenticated && (
        <Dashboard 
          userData={userData}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'signin' && (
        <SignIn
          onSignIn={() => {
            setIsAuthenticated(true);
            setCurrentView('home');
          }}
          onNavigate={handleNavigate}
          onSwitchToSignUp={() => setCurrentView('signup')}
        />
      )}

      {currentView === 'signup' && (
        <SignUp
          onSignUp={() => {
            setIsAuthenticated(true);
            setCurrentView('home');
          }}
          onNavigate={handleNavigate}
          onSwitchToSignIn={() => setCurrentView('signin')}
        />
      )}
    </div>
  );
}
