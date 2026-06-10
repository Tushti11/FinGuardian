/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageCircleCode, ArrowRight, User, Shield, HelpCircle, AlertCircle } from 'lucide-react';
import { ChatMessage, Asset, Liability, Nominee, Document } from '../types';

interface AIChatbotProps {
  assets: Asset[];
  liabilities: Liability[];
  nominees: Nominee[];
  documents: Document[];
}

const PRESET_QUERIES = [
  'Where have I invested my money?',
  'Show all active loans.',
  'What is my total net worth?',
  'Summarize my insurance policies.',
];

export default function AIChatbot({ assets, liabilities, nominees, documents }: AIChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello Aditya! I am **FinGuardian AI**, your secure financial legacy assistant. I have mapped your complete asset registry, loan schedules, and encrypted documents in real-time. \n\nHow can I help protect you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chats
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim() || sending) return;

    const userMsgId = `usr_${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          context: { assets, liabilities, documents, nominees },
        }),
      });

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.text || "I apologize, Aditya. We ran into an error connecting to our server-side processors.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const aiErrorMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: "I apologize, Aditya. We ran into an error connecting to our server-side processors.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiErrorMsg]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div id="chatbot-container" className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[580px]">
      {/* Left Chat Window (Takes 3 Cols) */}
      <div className="lg:col-span-3 flex flex-col glass-panel rounded-3xl overflow-hidden border-white/[0.05] h-[640px]">
        {/* Chat Header */}
        <div className="bg-brand-dark/45 px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-accent/15 p-2 rounded-xl text-brand-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">FinGuardian Intelligence Conduit</h4>
              <span className="text-[10px] text-brand-accent font-mono">SECURE AGENT • ACTIVE DIRECTORY</span>
            </div>
          </div>
          <span className="text-slate-550 text-xs font-mono">Model: gemini-3.5-flash</span>
        </div>

        {/* Message Panel Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`p-2 rounded-xl self-start shrink-0 ${
                msg.sender === 'user' ? 'bg-brand-accent text-brand-dark' : 'bg-[#112240] text-brand-accent'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-3xl leading-relaxed text-sm ${
                msg.sender === 'user'
                  ? 'bg-brand-accent/10 border border-brand-accent/20 text-white rounded-tr-none'
                  : 'bg-slate-900/40 border border-white/5 text-slate-200 rounded-tl-none whitespace-pre-line'
              }`}>
                {/* Format markdown bold tags on simple fallback text */}
                {msg.text.split('\n').map((para, i) => {
                  // Replace Markdown headers like ###
                  let formatted = para;
                  if (para.startsWith('###')) {
                    return <h5 key={i} className="text-white font-bold text-base mt-3 mb-1">{para.replace('###', '')}</h5>;
                  }
                  return <p key={i} className="mb-2 last:mb-0 text-sm">{formatted}</p>;
                })}
                <span className="text-[9px] font-mono text-slate-500 block text-right mt-1.5">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {/* AI Loader */}
          {sending && (
            <div className="flex gap-4 max-w-[80%]">
              <div className="p-2 rounded-xl bg-[#112240] text-brand-accent self-start">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 bg-slate-900/40 border border-white/5 text-slate-400 rounded-3xl rounded-tl-none text-xs font-mono">
                Consulting asset folders and formulating secure insights...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Preset query buttons */}
        <div className="px-6 py-2 flex flex-wrap gap-2.5 bg-brand-dark/20 border-t border-white/[0.05]">
          {PRESET_QUERIES.map((queryText) => (
            <button
              key={queryText}
              disabled={sending}
              onClick={() => handleSendMessage(queryText)}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-slate-300 flex items-center gap-1 transition-all cursor-pointer disabled:opacity-40"
            >
              <HelpCircle className="w-3.5 h-3.5 text-brand-accent" />
              <span>{queryText}</span>
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-4 bg-[#070c12] border-t border-white/[0.05]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me: What is my current financial status?"
              disabled={sending}
              className="flex-1 glass-input py-3 px-4.5 rounded-2xl text-xs focus:ring-1 focus:ring-brand-accent"
            />
            <button
              type="submit"
              disabled={sending || !inputValue.trim()}
              className="bg-brand-accent hover:bg-emerald-400 text-brand-dark disabled:opacity-50 p-3 rounded-2xl transition-all cursor-pointer"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Right AI Context & Insights Panel (Takes 1 Col) */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-panel p-6 rounded-3xl border-white/[0.05]">
          <h4 className="font-display font-bold text-sm text-white mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-accent" /> Real-time Sync Directory
          </h4>
          <p className="text-slate-400 text-xs leading-relaxed mb-6">
            The assistant is feeding context directly from your asset ledgers:
          </p>

          <div className="space-y-4 text-xs font-mono">
            <div className="flex justify-between border-b border-white/5 pb-2.5">
              <span className="text-slate-500">LIQUID POOLS</span>
              <span className="text-brand-accent font-bold">
                {assets.filter(a => a.type === 'liquid').length} Active
              </span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2.5">
              <span className="text-slate-500">ILLIQUID PROPERTY</span>
              <span className="text-brand-accent font-bold">
                {assets.filter(a => a.type === 'non-liquid').length} Active
              </span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2.5">
              <span className="text-slate-500">LIABILITY MATRIX</span>
              <span className="text-rose-455 font-bold">{liabilities.length} Contracts</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2.5">
              <span className="text-slate-500">DIGITAL WILL</span>
              <span className="text-emerald-400 font-bold">SIGNED</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2.5">
              <span className="text-slate-500">NOMINEES ALLOC.</span>
              <span className="text-slate-200 font-bold">{nominees.length} Family</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-brand-medium/20 border border-brand-accent/15 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-brand-accent block">GDPR & SECURE AUDIT</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              We encrypt and redact context fields before piping enquiries. Your personal files remain stored locally on AES-encrypted caches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
