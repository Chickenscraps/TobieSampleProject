'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { X, Send, MessageCircle, Bot, User, Sparkles } from 'lucide-react';

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
  'Medical': 'bg-blue-100 text-blue-700',
  'Dental': 'bg-cyan-100 text-cyan-700',
  'Vision': 'bg-purple-100 text-purple-700',
  'Pharmacy': 'bg-green-100 text-green-700',
  'FSA/HSA': 'bg-emerald-100 text-emerald-700',
  'Life & AD&D': 'bg-rose-100 text-rose-700',
  'Disability': 'bg-orange-100 text-orange-700',
  'Retirement': 'bg-indigo-100 text-indigo-700',
  'Voluntary Benefits': 'bg-amber-100 text-amber-700',
  'Well-being': 'bg-lime-100 text-lime-700',
  'Work-Life': 'bg-teal-100 text-teal-700',
  'Enrollment': 'bg-yellow-100 text-yellow-700',
  'Eligibility': 'bg-sky-100 text-sky-700',
  'General': 'bg-gray-100 text-gray-600',
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
        <ul key={`list-${listKey++}`} className="list-disc list-inside space-y-1 my-1.5">
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
      <p key={`p-${i}`} className="text-sm leading-relaxed">
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
      parts.push(<strong key={key++} className="font-semibold">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index! + boldMatch[0].length);
    } else if (phoneMatch) {
      const before = remaining.slice(0, phoneMatch.index!);
      if (before) parts.push(<span key={key++}>{before}</span>);
      parts.push(
        <a key={key++} href={`tel:${phoneMatch[1].replace(/-/g, '')}`} className="font-medium text-tobie-600 underline">
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
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          sessionId,
          history: getConversationHistory(),
        }),
      });

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
            ? 'h-full w-full bg-white flex flex-col border-l border-gray-200'
            : `fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 flex flex-col ${
                isOpen ? 'chat-drawer-enter' : 'chat-drawer-exit pointer-events-none'
              }`
        }`}
        role={persistent ? 'complementary' : 'dialog'}
        aria-label="Benefits Assistant Chat"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-tobie-600 text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <MessageCircle className="h-5 w-5" />
            <div>
              <h2 className="text-base font-semibold leading-tight">Benefits Assistant</h2>
              <p className="text-[10px] text-tobie-200 leading-tight">Powered by AI</p>
            </div>
          </div>
          {!persistent && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <div className="px-4 py-2 bg-tobie-50 border-b border-tobie-100 flex-shrink-0">
          <p className="text-[11px] text-tobie-700 leading-relaxed">
            AI answers from the official 2026 benefits guide only. For personalized advice, contact HR at{' '}
            <a href="tel:8008905420" className="font-semibold underline">
              800-890-5420
            </a>
            .
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Bot avatar */}
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-7 h-7 bg-tobie-100 flex items-center justify-center mt-0.5">
                  <Bot className="w-4 h-4 text-tobie-600" />
                </div>
              )}

              <div className={`max-w-[82%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-3.5 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-tobie-500 text-white'
                      : 'bg-gray-100 text-gray-800'
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
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className={`text-[10px] ${msg.role === 'user' ? 'text-gray-400' : 'text-gray-400'}`}>
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
                <div className="flex-shrink-0 w-7 h-7 bg-tobie-500 flex items-center justify-center mt-0.5">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Suggested Quick Chips */}
          {showChips && !isLoading && messages.length <= 1 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Sparkles className="w-3 h-3" />
                <span>Try asking:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-tobie-50 hover:border-tobie-300 hover:text-tobie-700 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="flex-shrink-0 w-7 h-7 bg-tobie-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-tobie-600" />
              </div>
              <div className="bg-gray-100 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col border-t border-gray-200 bg-white flex-shrink-0"
        >
          <div className="flex items-center gap-2 px-4 py-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.slice(0, MAX_MESSAGE_LENGTH + 50))}
              placeholder="Ask about your benefits..."
              className="flex-1 px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-tobie-500 focus:border-transparent focus:bg-white transition-all placeholder:text-gray-400"
              disabled={isLoading}
              maxLength={MAX_MESSAGE_LENGTH + 50}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading || isOverLimit}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-tobie-500 text-white hover:bg-tobie-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          {/* Character counter — shows when approaching limit */}
          {inputValue.length > MAX_MESSAGE_LENGTH * 0.7 && (
            <div className={`px-4 pb-2 text-[10px] text-right ${isOverLimit ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
              {charsRemaining} characters remaining
            </div>
          )}
        </form>
      </div>
    </>
  );
}
