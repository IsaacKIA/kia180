'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrainCircuit, Send, Sparkles, User, Loader2, RefreshCw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SYSTEM_STARTERS = [
  'What is the single most important thing I should focus on today to move toward financial stability?',
  'I\'m hesitating to start my outreach. Help me break this into the smallest possible action.',
  'Given my cash position, what is the fastest realistic path to GHS 3,000 in 7 days?',
  'What are the biggest risks to my 180-day plan right now?',
  'How do I structure my advisory pricing to close my first 3 clients this week?',
];

const STUB_RESPONSES: Record<number, string> = {
  0: `**Your single most important lever today:**

Your financial reality is clear: GHS 0 cash, GHS 7,000 in obligations, and a GHS 2,000 baseline income. The gap is GHS 13,000/month.

**The only move that changes this today: make direct contact with 5 warm founder prospects before 18:00.**

Here's why this matters above everything else:
- A single signed retainer at GHS 3,000 gives you 43 days of runway
- Every hour spent on anything other than outreach extends your cash deficit
- The consulting knowledge is already in your head — you just need to activate it commercially

**Your micro-script for WhatsApp:**
> "Hi [Name], I've been thinking about [their business challenge]. I'm now offering structured advisory for early-stage founders. Could we do a 20-minute call this week?"

That's it. Send 5 today. That is your north star action.`,

  1: `**Pre-start resistance protocol activated.**

The resistance you feel is not about laziness — it's a signal that your brain perceives the task as too large or uncertain.

Here are your 3 micro-steps to break through:

**Step 1 (2 minutes):** Open your contacts app. Search for any founder, entrepreneur, or business owner you know personally. Write down 3 names.

**Step 2 (5 minutes):** For each name, write ONE sentence about a challenge you know their business faces.

**Step 3 (3 minutes):** Copy the message template I gave you and personalise it with one line about their specific challenge.

**The rule:** You only need to do Step 1 right now. Once you're doing Step 1, you'll naturally move into Step 2. 

Start with Step 1 in the next 60 seconds.`,

  2: `**Fastest path to GHS 3,000 in 7 days:**

Given your consulting expertise, here is the most direct path:

**Day 1-2:** Identify and contact 15 warm prospects (founders, business owners you know)
**Day 3-4:** Run 3-5 discovery calls — ask what challenge is costing them the most right now
**Day 5-6:** Send 3 tailored proposals at GHS 2,500-3,500 each
**Day 7:** Follow up on all proposals with a specific call-to-action

**The most common mistake to avoid:** Don't build a website, don't create presentations, don't design brochures. Just have conversations first. Revenue comes from conversations, not from preparation.

**Your minimum viable offer:**
"I will spend 4 hours with you, audit your current business structure, and give you a prioritised action plan for the next 90 days. Cost: GHS 2,500, payable upfront."

This is fundable, deliverable, and valuable. Do you want me to help you draft the outreach messages?`,

  3: `**Current risk assessment for your 180-day plan:**

🔴 **CRITICAL — Cash Runway**
Zero liquid cash with GHS 7,000 in obligations. This is the most acute risk. Every day without a client retainer increases pressure. The mitigation is immediate outreach, not strategy.

🟠 **HIGH — Pre-Start Friction**
Your historical pattern of delaying high-leverage tasks is the #1 execution risk. If you continue deferring outreach, the financial position will worsen before it improves.

🟡 **ELEVATED — Revenue Concentration**
All short-term income depends on KIA Consult. Civitas and Agrivora are not generating cashflow yet. This is acceptable for now but creates fragility.

**What the data says:**
At your current baseline trajectory, you'll miss the GHS 15,000/month target by a significant margin unless client acquisition begins within the next 5-7 days.

**The good news:** All risks are within your control to resolve. None of them require external circumstances to change. They just require consistent, deliberate daily action.`,

  4: `**Advisory pricing strategy to close 3 clients this week:**

**The Three-Tier Executive Package:**

🔹 **Tier 1 — Foundation Package (GHS 2,500 flat)**
- 4-hour deep-dive business audit
- 90-day action roadmap
- Legal structure & registration review
- 1 follow-up session in Week 2
*Best for: early-stage founders who need structure*

🔹 **Tier 2 — Growth Audit (GHS 5,000 flat)**
- Everything in Tier 1
- Financial model review and projections
- Investor readiness assessment
- Pitch narrative structure
*Best for: founders preparing for funding or serious growth*

🔹 **Tier 3 — Monthly Retainer (GHS 3,000/month)**
- 2 strategy sessions per month
- Unlimited WhatsApp advisory access
- Monthly CEO brief with priorities
*Best for: founders who need ongoing accountability and strategic direction*

**Conversion advice:** Start the conversation by understanding their biggest business problem. Then position whichever tier solves that problem most directly. Don't lead with price — lead with the outcome.

Shall I help you draft the proposal template for Tier 1 or 3?`,
};

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `**Good. You opened the Coach.**

I'm your KIA AI Executive Coach — connected to your goals, financials, risks, and daily execution data.

Here's your current strategic context:
- **Day 1 of 180** — Phase 1: Foundation & Cash Stability
- **Cash position:** GHS 0 liquid  
- **Outstanding obligations:** GHS 7,000  
- **Personal income target:** GHS 15,000/month  
- **Immediate priority:** Secure first 3 consulting retainer clients

Ask me anything — daily priorities, resistance breakthrough, pricing strategy, risk analysis, or decision support.

What do you need to solve right now?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: Message = { role: 'user', content, timestamp: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Build message thread for the API (exclude initial assistant greeting to save tokens)
      const thread = updatedMessages
        .filter((m) => !(m.role === 'assistant' && updatedMessages.indexOf(m) === 0))
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: thread }),
      });

      let replyContent: string;
      if (response.ok) {
        const data = await response.json();
        replyContent = data.reply ?? 'No response received.';
      } else {
        // Fall back to stubs if API unavailable
        replyContent = STUB_RESPONSES[responseIndex % Object.keys(STUB_RESPONSES).length];
        setResponseIndex((i) => i + 1);
      }

      const assistantMsg: Message = {
        role: 'assistant',
        content: replyContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Network error — use stub
      const stubResponse = STUB_RESPONSES[responseIndex % Object.keys(STUB_RESPONSES).length];
      setResponseIndex((i) => i + 1);
      setMessages((prev) => [...prev, { role: 'assistant', content: stubResponse, timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={i} className="font-bold text-[#F7F5F0] mt-2 first:mt-0">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      if (line.startsWith('🔴') || line.startsWith('🟠') || line.startsWith('🟡') || line.startsWith('🔹')) {
        return (
          <p key={i} className="text-xs mt-2 text-[#E3E1DC]">
            {line}
          </p>
        );
      }
      if (line.startsWith('-') || line.startsWith('*')) {
        return (
          <p key={i} className="text-xs text-[#C5C3BC] pl-3 mt-0.5">
            {line}
          </p>
        );
      }
      if (line.startsWith('>')) {
        return (
          <blockquote key={i} className="border-l-2 border-[#C9A84C] pl-3 my-2 italic text-xs text-[#DFBF65]">
            {line.slice(1).trim()}
          </blockquote>
        );
      }
      if (line === '') return <div key={i} className="h-1.5" />;
      return (
        <p key={i} className="text-xs text-[#C5C3BC] leading-relaxed">
          {line.replace(/\*\*(.*?)\*\*/g, (_, text) => text)}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-14rem)] sm:h-[calc(100vh-10rem)] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1C1C28] shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#8C6D23] flex items-center justify-center">
            <BrainCircuit className="h-5 w-5 text-black" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#F7F5F0]">KIA AI Executive Coach</h1>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-[11px] text-[#8A8882]">Context-aware · Personalised to your 180-day cycle</p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setMessages([{
              role: 'assistant',
              content: 'Starting a new session. What do you need to solve right now?',
              timestamp: new Date(),
            }])
          }
          className="text-[#8A8882] hover:text-[#F7F5F0] gap-1.5 text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" /> New Session
        </Button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Quick start prompts */}
        {messages.length <= 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SYSTEM_STARTERS.slice(0, 4).map((starter, i) => (
              <button
                key={i}
                type="button"
                onClick={() => sendMessage(starter)}
                className="text-left p-3 rounded-xl border border-[#232332] bg-[#0E0E14] hover:border-[#C9A84C]/50 hover:bg-[#141420] text-xs text-[#A3A099] hover:text-[#F7F5F0] transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#C9A84C] mb-1" />
                {starter}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-[#C9A84C] to-[#8C6D23]'
                  : 'bg-[#1C1C28] border border-[#2B2B3C]'
              }`}
            >
              {msg.role === 'assistant' ? (
                <BrainCircuit className="h-4 w-4 text-black" />
              ) : (
                <User className="h-4 w-4 text-[#A3A099]" />
              )}
            </div>

            <div
              className={`flex-1 max-w-[80%] rounded-xl px-4 py-3 ${
                msg.role === 'assistant'
                  ? 'bg-[#141420] border border-[#232336]'
                  : 'bg-[#1C1C28] border border-[#282840] ml-auto'
              }`}
            >
              <div className="space-y-0.5">
                {msg.role === 'assistant'
                  ? renderContent(msg.content)
                  : <p className="text-xs text-[#F7F5F0]">{msg.content}</p>}
              </div>
              <p className="text-[9px] text-[#52514D] mt-2">
                {msg.timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#8C6D23] flex items-center justify-center shrink-0">
              <BrainCircuit className="h-4 w-4 text-black" />
            </div>
            <div className="bg-[#141420] border border-[#232336] rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 text-[#C9A84C] animate-spin" />
                <span className="text-xs text-[#8A8882]">Analysing your context...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-4 mt-4 border-t border-[#1C1C28] shrink-0">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your executive coach anything..."
          className="flex-1 bg-[#0E0E13] border-[#262634] text-[#F7F5F0] placeholder:text-[#52514D]"
          disabled={isTyping}
        />
        <Button
          type="submit"
          disabled={isTyping || !input.trim()}
          className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold shrink-0"
          size="icon"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
