'use client';

import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { X, Send, Bot, User, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { collectAnalyticsMetadata, initAnalytics, type AnalyticsMetadata } from '@/lib/analytics';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sourcesUsed?: string[];
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  persistent?: boolean;
}

// ─── Suggested Quick Chips ───────────────────────────────────────────────────
const SUGGESTED_CHIPS = [
  'What medical plans are available?',
  'How do I enroll in benefits?',
  'What is the HSA contribution?',
  'Tell me about dental coverage',
];

// ─── Character Limit ─────────────────────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 500;

// ─── Source Badge Colors ─────────────────────────────────────────────────────
const SOURCE_COLORS: Record<string, string> = {
  'Medical': 'bg-tobie-50 text-tobie-600 dark:bg-tobie-900/30 dark:text-tobie-400',
  'Dental': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Vision': 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Pharmacy': 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'FSA/HSA': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Life & AD&D': 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'Disability': 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Retirement': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Voluntary Benefits': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Well-being': 'bg-lime-50 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
  'Work-Life': 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'Enrollment': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Eligibility': 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  'General': 'bg-gray-50 text-gray-500 dark:bg-slate-700 dark:text-gray-400',
};

// ─── Markdown-lite Renderer ──────────────────────────────────────────────────
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listKey = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="list-disc list-inside space-y-1 my-1.5 text-gray-700 dark:text-gray-300">
          {listItems.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Bullet points: *, -, •
    if (/^[\*\-•]\s+/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[\*\-•]\s+/, ''));
      continue;
    }

    // Flush any pending list
    flushList();

    // Empty lines
    if (trimmed === '') {
      elements.push(<div key={`br-${i}`} className="h-2" />);
      continue;
    }

    // Regular text
    elements.push(
      <p key={`p-${i}`} className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {renderInlineFormatting(trimmed)}
      </p>
    );
  }

  flushList();
  return elements;
}

function renderInlineFormatting(text: string): React.ReactNode[] {
  // Process **bold**, phone numbers as links, and URLs
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Phone: 800-890-5420 or 866-XXX-XXXX pattern
    const phoneMatch = remaining.match(/(\d{3}-\d{3}-\d{4})/);

    if (boldMatch && (!phoneMatch || boldMatch.index! <= phoneMatch.index!)) {
      const before = remaining.slice(0, boldMatch.index!);
      if (before) parts.push(<span key={key++}>{before}</span>);
      parts.push(<strong key={key++} className="font-semibold text-gray-900 dark:text-gray-100">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index! + boldMatch[0].length);
    } else if (phoneMatch) {
      const before = remaining.slice(0, phoneMatch.index!);
      if (before) parts.push(<span key={key++}>{before}</span>);
      parts.push(
        <a key={key++} href={`tel:${phoneMatch[1].replace(/-/g, '')}`} className="font-medium text-tobie-500 dark:text-tobie-400 underline decoration-tobie-300 dark:decoration-tobie-600 underline-offset-2 hover:text-tobie-700 dark:hover:text-tobie-300">
          {phoneMatch[1]}
        </a>
      );
      remaining = remaining.slice(phoneMatch.index! + phoneMatch[0].length);
    } else {
      parts.push(<span key={key++}>{remaining}</span>);
      remaining = '';
    }
  }

  return parts;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function ChatDrawer({ isOpen, onClose, persistent = false }: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I can help answer questions about your Tobie benefits. What would you like to know?',
      timestamp: new Date(),
      sourcesUsed: ['General'],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
    // Cryptographic fallback using getRandomValues
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      const bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
      return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
    }
    // Last resort (very old browsers)
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const analyticsRef = useRef<AnalyticsMetadata | null>(null);
  const messageIndexRef = useRef(0);

  // Initialize analytics (generates visitor ID async on first render)
  useEffect(() => {
    initAnalytics().then(() => {
      analyticsRef.current = collectAnalyticsMetadata();
    });
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Build conversation history for API (exclude welcome message)
  const getConversationHistory = () => {
    return messages
      .filter((msg) => msg.id !== 'welcome')
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setShowChips(false);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Measure client-side response time
      const fetchStart = performance.now();
      const currentMessageIndex = messageIndexRef.current++;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          sessionId,
          history: getConversationHistory(),
          analytics: {
            ...analyticsRef.current,
            message_index: currentMessageIndex,
          },
        }),
      });

      const responseTimeMs = Math.round(performance.now() - fetchStart);

      if (response.status === 429) {
        const data = await response.json();
        const assistantMessage: ChatMessage = {
          id: `rate-limit-${Date.now()}`,
          role: 'assistant',
          content: data.answer || "You're asking questions too quickly. Please wait a moment and try again.",
          timestamp: new Date(),
          sourcesUsed: ['General'],
        };
        setMessages((prev) => [...prev, assistantMessage]);
        return;
      }

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'I apologize, but I was unable to process that request. Please try again.',
        timestamp: new Date(),
        sourcesUsed: data.sourcesUsed || ['General'],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content:
          'I apologize, but I encountered an error. Please try again or contact Benefits Support at 800-890-5420.',
        timestamp: new Date(),
        sourcesUsed: ['General'],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await sendMessage(inputValue);
  };

  const handleChipClick = (text: string) => {
    sendMessage(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const charsRemaining = MAX_MESSAGE_LENGTH - inputValue.length;
  const isOverLimit = charsRemaining < 0;

  return (
    <>
      {/* Backdrop — only for non-persistent (mobile) mode */}
      {!persistent && isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 sm:bg-transparent"
          onClick={onClose}
        />
      )}

      {/* Drawer / Panel */}
      <div
        className={`${
          persistent
            ? 'h-full w-full bg-brand-surface dark:bg-slate-900 flex flex-col border-l border-gray-200 dark:border-slate-700'
            : `fixed top-0 right-0 h-full w-full sm:w-[400px] bg-brand-surface dark:bg-slate-900 z-50 flex flex-col ${
                isOpen ? 'chat-drawer-enter' : 'chat-drawer-exit pointer-events-none'
              }`
        }`}
        role={persistent ? 'complementary' : 'dialog'}
        aria-label="Benefits Assistant Chat"
      >
        {/* Header — clean, matches site nav */}
        <div className="flex items-center justify-between px-5 py-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-tobie-50 dark:bg-tobie-900/30 flex items-center justify-center">
              <img src="/images/chatbot-icon.svg" alt="" className="w-5 h-5 dark:brightness-200" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-tobie-700 dark:text-tobie-300 leading-tight">Benefits Assistant</h2>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">Powered by AI</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 1 && (
              <button
                onClick={() => {
                  setMessages([{
                    id: 'welcome',
                    role: 'assistant',
                    content: 'Hello! I can help answer questions about your Tobie benefits. What would you like to know?',
                    timestamp: new Date(),
                    sourcesUsed: ['General'],
                  }]);
                  setShowChips(true);
                  setInputValue('');
                  messageIndexRef.current = 0;
                }}
                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="New conversation"
                title="New conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            {!persistent && (
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Disclaimer — subtle, integrated */}
        <div className="px-5 py-2.5 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 flex-shrink-0">
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
            AI answers from the official 2026 benefits guide only. For personalized advice, contact HR at{' '}
            <a href="tel:8008905420" className="font-medium text-tobie-500 dark:text-tobie-400 hover:text-tobie-700 dark:hover:text-tobie-300 underline decoration-tobie-200 dark:decoration-tobie-700 underline-offset-2">
              800-890-5420
            </a>
            .
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Bot avatar */}
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-7 h-7 bg-tobie-50 dark:bg-tobie-900/30 flex items-center justify-center mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-tobie-500 dark:text-tobie-400" />
                </div>
              )}

              <div className={`max-w-[82%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-3.5 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-tobie-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-700'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="space-y-0.5">{renderMarkdown(msg.content)}</div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  )}
                </div>

                {/* Metadata row: time + source badges */}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {formatTime(msg.timestamp)}
                  </span>
                  {msg.role === 'assistant' && msg.sourcesUsed && msg.sourcesUsed[0] !== 'General' && (
                    <>
                      {msg.sourcesUsed.map((source) => (
                        <span
                          key={source}
                          className={`text-[9px] font-medium px-1.5 py-0.5 ${
                            SOURCE_COLORS[source] || SOURCE_COLORS['General']
                          }`}
                        >
                          {source}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* User avatar */}
              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-7 h-7 bg-tobie-600 flex items-center justify-center mt-0.5">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Suggested Quick Chips */}
          {showChips && !isLoading && messages.length <= 1 && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                <Sparkles className="w-3 h-3" />
                <span>Try asking:</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {SUGGESTED_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    className="group flex items-center justify-between text-left text-sm px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-tobie-50 dark:hover:bg-tobie-900/30 hover:border-tobie-200 dark:hover:border-tobie-700 hover:text-tobie-700 dark:hover:text-tobie-300 transition-all"
                  >
                    <span>{chip}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-tobie-500 dark:group-hover:text-tobie-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="flex-shrink-0 w-7 h-7 bg-tobie-50 dark:bg-tobie-900/30 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-tobie-500 dark:text-tobie-400" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-tobie-400 rounded-full typing-dot" />
                  <span className="w-1.5 h-1.5 bg-tobie-400 rounded-full typing-dot" />
                  <span className="w-1.5 h-1.5 bg-tobie-400 rounded-full typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area — clean bottom bar */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0"
        >
          <div className="flex items-center gap-2 px-4 py-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
              placeholder="Ask about your benefits..."
              className="flex-1 px-3.5 py-2.5 text-sm border border-gray-200 dark:border-slate-600 bg-brand-surface dark:bg-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-tobie-400 focus:border-transparent focus:bg-white dark:focus:bg-slate-600 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              disabled={isLoading}
              maxLength={MAX_MESSAGE_LENGTH}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading || isOverLimit}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-tobie-600 dark:bg-tobie-500 text-white hover:bg-tobie-700 dark:hover:bg-tobie-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          {/* Character counter — shows when approaching limit */}
          {inputValue.length > MAX_MESSAGE_LENGTH * 0.7 && (
            <div className={`px-4 pb-2 text-[10px] text-right ${isOverLimit ? 'text-red-500 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
              {charsRemaining} characters remaining
            </div>
          )}
        </form>
      </div>
    </>
  );
}
