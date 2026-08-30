'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, User, Sparkles, RotateCcw, Copy, Check, 
  Maximize2, Minimize2, AlertCircle, ArrowUpRight, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

interface Message {
  id?: string;
  sender: 'visitor' | 'bot';
  content: string;
  created_at: string;
  isError?: boolean;
}

const QUICK_PROMPTS = [
  "👥 Who are the founders of DRAVEON?",
  "⚡ What services do you offer?",
  "📱 Build a Mobile/Cross-Platform App",
  "🤖 AI Workflows & RAG Systems",
  "💰 How do you price projects?",
];

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      } catch {
        return c.substring(nameEQ.length, c.length);
      }
    }
  }
  return null;
}

function formatMessageContent(text: string) {
  // Simple markdown-style renderer for bold, code, lists, and links
  const lines = text.split('\n');
  return lines.map((line, lIdx) => {
    let formatted: React.ReactNode = line;

    // Bullet points
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
    const lineText = isBullet ? line.trim().substring(2) : line;

    // Replace bold **text** and inline code `code`
    const parts = lineText.split(/(\*\*.*?\*\*|`.*?`)/g);
    const renderedParts = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIdx} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={pIdx} className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-mono text-[11px] border border-indigo-100 dark:border-indigo-800/50">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <div key={lIdx} className="flex items-start gap-1.5 my-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
          <div>{renderedParts}</div>
        </div>
      );
    }

    return (
      <p key={lIdx} className={lIdx > 0 && line.trim() ? "mt-1.5" : ""}>
        {renderedParts}
      </p>
    );
  });
}

function formatTime(isoString: string) {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      content: "Hello! Welcome to **DRAVEON**. I am **Draveon-Agent**.\n\nHow can I help you build, automate, or scale your software today?",
      created_at: new Date().toISOString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping, isOpen]);

  // Initialize session & restore history on mount or opening
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
        const res = await fetch(`${apiBase}/v1/chatbot/init`, { credentials: 'same-origin' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.history && data.history.length > 0) {
            setMessages(data.history.map((item: any) => ({
              id: item.id,
              sender: item.sender,
              content: item.content,
              created_at: item.created_at
            })));
          }
        }
      } catch (err) {
        console.error("Failed to initialize chatbot session", err);
      }
    }

    initSession();
    return () => { isMounted = false; };
  }, []);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend || isTyping) return;

    if (!queryText) setInput('');

    const userMsg: Message = {
      sender: 'visitor',
      content: textToSend,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
      const csrf = getCookie('draveon_chat_csrf');
      
      const res = await fetch(`${apiBase}/v1/chatbot/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ query: textToSend }),
      });

      if (!res.ok) {
        if (res.status === 403) {
          // Retry once after fetching fresh init session
          const initRes = await fetch(`${apiBase}/v1/chatbot/init`, { credentials: 'same-origin' });
          if (initRes.ok) {
            const retryCsrf = getCookie('draveon_chat_csrf');
            const retryRes = await fetch(`${apiBase}/v1/chatbot/query`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(retryCsrf ? { 'X-CSRF-Token': retryCsrf } : {}),
              },
              credentials: 'same-origin',
              body: JSON.stringify({ query: textToSend }),
            });
            if (retryRes.ok) {
              const data = await retryRes.json();
              const botMsg: Message = {
                sender: 'bot',
                content: data.reply,
                created_at: new Date().toISOString()
              };
              setMessages(prev => [...prev, botMsg]);
              if (!isOpen) setUnreadCount(c => c + 1);
              return;
            }
          }
        }
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const botMsg: Message = {
        sender: 'bot',
        content: data.reply,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMsg]);
      if (!isOpen) setUnreadCount(c => c + 1);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        sender: 'bot',
        content: "I apologize, but I encountered a temporary connection issue. Please try sending your message again or submit an enquiry using our form below.",
        created_at: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        sender: 'bot',
        content: "Session refreshed! How can I assist you with your project today?",
        created_at: new Date().toISOString()
      }
    ]);
  };

  const scrollToEnquiryForm = () => {
    const el = document.getElementById('enquiry-form') || document.getElementById('enquiry') || document.querySelector('form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="group relative btn-gradient w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300"
            aria-label="Open AI Chat Assistant"
          >
            {/* Glowing outer aura ring */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 opacity-40 blur-sm group-hover:opacity-75 transition duration-300 animate-pulse" />
            
            <div className="relative flex items-center justify-center">
              <Logo className="w-7 h-7 text-white" />
            </div>

            {/* Online Indicator Badge */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </span>

            {/* Unread Message Counter */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
                {unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-300 ${
              isExpanded 
                ? 'w-[calc(100vw-32px)] sm:w-[500px] h-[640px] max-h-[85vh]' 
                : 'w-[calc(100vw-32px)] sm:w-[380px] h-[520px] max-h-[80vh]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 text-white flex items-center justify-between shadow-md relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center p-1.5 shadow-inner">
                  <Logo className="w-full h-full text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-['Outfit'] font-bold text-sm leading-none text-white tracking-wide">
                      Draveon-Agent
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-slate-300 font-medium tracking-wider uppercase">
                      24/7 AI Engine
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 relative z-10">
                <button
                  onClick={handleClearHistory}
                  title="Refresh conversation"
                  className="hover:bg-white/10 p-2 rounded-xl text-slate-300 hover:text-white transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Collapse" : "Expand window"}
                  className="hover:bg-white/10 p-2 rounded-xl text-slate-300 hover:text-white transition hidden sm:flex"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="hover:bg-white/10 p-2 rounded-xl text-slate-300 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef} 
              className="flex-1 p-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 space-y-4 scroll-smooth"
            >
              {messages.map((msg, idx) => {
                const isVisitor = msg.sender === 'visitor';
                const isCopied = copiedId === idx;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`flex gap-2.5 group ${isVisitor ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div 
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-1 shadow-sm ${
                        isVisitor 
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' 
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-cyan-500'
                      }`}
                    >
                      {isVisitor ? <User className="w-4 h-4" /> : <Logo className="w-4 h-4" />}
                    </div>

                    {/* Bubble Container */}
                    <div className={`flex flex-col max-w-[82%] ${isVisitor ? 'items-end' : 'items-start'}`}>
                      <div 
                        className={`relative p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm transition-all ${
                          isVisitor 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none font-medium' 
                            : msg.isError
                              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900/60 rounded-tl-none'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                        }`}
                      >
                        {msg.isError && (
                          <div className="flex items-center gap-1.5 mb-1 text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Connection Notice</span>
                          </div>
                        )}

                        {formatMessageContent(msg.content)}

                        {/* Bot Action pill inside message if relevant */}
                        {!isVisitor && (msg.content.toLowerCase().includes('enquiry') || msg.content.toLowerCase().includes('form')) && (
                          <button
                            onClick={scrollToEnquiryForm}
                            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 font-semibold text-[11px] hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition"
                          >
                            <span>Go to Enquiry Form</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Timestamp & Copy Action */}
                      <div className="flex items-center gap-2 mt-1 px-1 opacity-70 group-hover:opacity-100 transition text-[10px] text-slate-400">
                        <span>{formatTime(msg.created_at)}</span>
                        {!isVisitor && (
                          <button
                            onClick={() => copyToClipboard(msg.content, idx)}
                            className="hover:text-indigo-500 transition"
                            title="Copy message"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 items-center"
                >
                  <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center shrink-0">
                    <Logo className="w-4 h-4 text-cyan-500" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] text-slate-400 font-medium ml-1">AI Thinking...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Prompts Bar (Shown when short message list) */}
            {messages.length <= 3 && !isTyping && (
              <div className="px-3 py-2 bg-slate-100/70 dark:bg-slate-800/40 border-t border-slate-200/50 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
                {QUICK_PROMPTS.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSend(prompt)}
                    className="shrink-0 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-[11px] text-slate-600 dark:text-slate-300 font-medium shadow-2xs hover:scale-102 active:scale-98 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Form Input */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
              className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Draveon-Agent anything..."
                disabled={isTyping}
                className="flex-1 px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-white placeholder:text-slate-400 transition"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="btn-gradient w-9 h-9 rounded-full flex items-center justify-center shadow-md shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
