import { useState } from 'react';
import { Button } from './button';
import * as React from 'react';
import { X } from 'lucide-react';
import { JournalEntry } from '../../App';

interface EditJournalDialogProps {
  entry: JournalEntry;
  onClose: () => void;
  onSave: (updatedEntry: JournalEntry) => void;
}

export function EditJournalDialog({ entry, onClose, onSave }: EditJournalDialogProps) {
  const [content, setContent] = useState(entry.content);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (content.trim()) {
      const updatedEntry: JournalEntry = {
        ...entry,
        content: content.trim()
      };
      setIsEditing(true);
      onSave(updatedEntry);
      setTimeout(() => {
        setIsEditing(false);
        onClose();
      }, 500);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 glassmorphism-overlay z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Edit Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[480px] glassmorphism-floating z-50 glassmorphism-slide-in-right">
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
              Edit Journal Entry
            </h2>
            <p className="text-[16px] text-[#8B8B7E] leading-[24px]">
              {new Date(entry.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Prompt */}
          <div className="mb-6 p-4 bg-[#FFF4D6] rounded-[12px]">
            <p className="font-crimson italic text-[18px] leading-[28px] text-[#7A9A79]">
              {entry.prompt}
            </p>
          </div>

          {/* Edit Area */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[300px] bg-[#FDFDF8] border-2 border-[#D4E7D4] rounded-[16px] p-6 text-[18px] leading-[28px] text-[#5A5A52] focus:outline-none focus:border-[#A8C5A7] focus:shadow-soft-inner resize-none transition-all duration-200 hover:border-[#A8C5A7]/50"
            />
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-4">
            <Button
              onClick={onClose}
              className="h-10 px-6 rounded-[24px] bg-[#F5F5ED] hover:bg-[#D4E7D4] text-[#5A5A52] font-semibold transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!content.trim() || content === entry.content || isEditing}
              className="h-10 px-6 rounded-[24px] bg-[#A8C5A7] hover:bg-[#7A9A79] text-[#FDFDF8] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isEditing ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          {/* Bottom Note */}
          <div className="mt-8 p-4 bg-[#F5F5ED] rounded-[12px]">
            <p className="text-[14px] text-[#8B8B7E] leading-[20px]">
              Your edited entry will maintain its original date while storing your latest changes.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}