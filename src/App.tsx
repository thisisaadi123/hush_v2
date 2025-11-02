import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ModeSelection } from './components/ModeSelection';
import { JournalingInterface } from './components/JournalingInterface';
import { VoiceInput } from './components/VoiceInput';
import { VideoInput } from './components/VideoInput';
import { Dashboard } from './components/Dashboard';

export type AppView = 'home' | 'journaling' | 'voice' | 'video' | 'dashboard';

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
  const [userData, setUserData] = useState<UserData>({
    name: 'Friend',
    currentStreak: 7,
    wellnessScore: 7.8,
    journalEntries: []
  });

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
        onNavigate={setCurrentView}
      />
      
      {currentView === 'home' && (
        <>
          <Hero onGetStarted={() => setCurrentView('journaling')} />
          <ModeSelection onSelectMode={setCurrentView} />
        </>
      )}
      
      {currentView === 'journaling' && (
        <JournalingInterface 
          onSave={handleSaveJournalEntry}
          onBack={() => setCurrentView('home')}
          currentStreak={userData.currentStreak}
          pastEntries={userData.journalEntries}
        />
      )}
      
      {currentView === 'voice' && (
        <VoiceInput onBack={() => setCurrentView('home')} />
      )}
      
      {currentView === 'video' && (
        <VideoInput onBack={() => setCurrentView('home')} />
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard 
          userData={userData}
          onNavigate={setCurrentView}
        />
      )}
    </div>
  );
}
