'use client';

import { useState } from 'react';
import { ChatDrawer } from './ChatDrawer';

export function ChatAssistantLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop: Always-open persistent panel */}
      <div className="hidden lg:block fixed top-0 right-0 h-screen w-[400px] z-40">
        <ChatDrawer isOpen={true} onClose={() => {}} persistent />
      </div>

      {/* Mobile: Floating Launch Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-tobie-600 dark:bg-tobie-500 text-white hover:bg-tobie-700 dark:hover:bg-tobie-600 shadow-lg shadow-tobie-600/25 dark:shadow-none transition-all duration-300 group ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Open Benefits Assistant"
      >
        <div className="w-14 h-14 flex items-center justify-center">
          <img src="/images/chatbot-icon.svg" alt="Chatbot" className="h-7 w-7 brightness-0 invert" />
        </div>
        <span className="hidden sm:inline-block lg:hidden pr-5 text-sm font-medium whitespace-nowrap">
          Ask About Your Benefits
        </span>
      </button>

      {/* Mobile: Chat Drawer (slide-in) */}
      <div className="lg:hidden">
        <ChatDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </>
  );
}
