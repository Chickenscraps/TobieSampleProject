'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatDrawer } from './ChatDrawer';

export function ChatAssistantLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Launch Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-accent text-black hover:bg-accent-dark transition-all duration-300 group ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Open Benefits Assistant"
      >
        <div className="w-14 h-14 flex items-center justify-center">
          <MessageCircle className="h-6 w-6" />
        </div>
        <span className="hidden sm:inline-block pr-5 text-sm font-medium whitespace-nowrap">
          Ask About Your Benefits
        </span>
      </button>

      {/* Chat Drawer */}
      <ChatDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
