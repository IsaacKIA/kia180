'use client';

import React, { useState } from 'react';
import { Plus, CheckSquare, Lightbulb, Receipt, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function QuickCapture({
  children,
  onTaskCreated,
}: {
  children?: React.ReactNode;
  onTaskCreated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'task' | 'idea' | 'expense' | 'note'>('task');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('money');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    // Persist or emit event
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMsg('Captured into execution pipeline.');
      setTimeout(() => {
        setStatusMsg('');
        setTitle('');
        setOpen(false);
        if (onTaskCreated) onTaskCreated();
      }, 700);
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            size="sm"
            className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Capture</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-[#121217] border-[#2A2A3A]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#F7F5F0]">
            <Sparkles className="h-4 w-4 text-[#C9A84C]" />
            Quick Capture
          </DialogTitle>
        </DialogHeader>

        {/* Tab Selection */}
        <div className="flex rounded-lg bg-[#0A0A0E] p-1 border border-[#222230]">
          <button
            type="button"
            onClick={() => setTab('task')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
              tab === 'task'
                ? 'bg-[#1C1C26] text-[#F7F5F0] border border-[#C9A84C]/40 shadow-sm'
                : 'text-[#8A8882] hover:text-[#F7F5F0]'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" /> Task
          </button>
          <button
            type="button"
            onClick={() => setTab('idea')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
              tab === 'idea'
                ? 'bg-[#1C1C26] text-[#F7F5F0] border border-[#C9A84C]/40 shadow-sm'
                : 'text-[#8A8882] hover:text-[#F7F5F0]'
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" /> Idea
          </button>
          <button
            type="button"
            onClick={() => setTab('expense')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
              tab === 'expense'
                ? 'bg-[#1C1C26] text-[#F7F5F0] border border-[#C9A84C]/40 shadow-sm'
                : 'text-[#8A8882] hover:text-[#F7F5F0]'
            }`}
          >
            <Receipt className="h-3.5 w-3.5" /> Cash
          </button>
        </div>

        <form onSubmit={handleCapture} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-medium text-[#A3A099]">
              {tab === 'task'
                ? 'Action / Deliverable'
                : tab === 'idea'
                ? 'Idea Title'
                : 'Amount & Purpose (e.g. 500 GHS Client Retainer)'}
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                tab === 'task'
                  ? 'e.g. Call founder of AgroTech for retainer quote'
                  : tab === 'idea'
                  ? 'e.g. Startup compliance package bundle'
                  : 'e.g. 3500 GHS Consulting Retainer'
              }
              className="mt-1"
              autoFocus
            />
          </div>

          {tab === 'task' && (
            <div>
              <label className="text-xs font-medium text-[#A3A099]">
                Pillar Tag
              </label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { id: 'money', label: 'Money (Revenue)', color: 'border-amber-500/50 text-amber-300' },
                  { id: 'build', label: 'Build (Ventures)', color: 'border-sky-500/50 text-sky-300' },
                  { id: 'grow', label: 'Grow (Discipline)', color: 'border-emerald-500/50 text-emerald-300' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    className={`text-xs py-2 px-1 rounded-md border text-center transition-all ${
                      category === item.id
                        ? `bg-[#181822] font-semibold ${item.color}`
                        : 'border-[#222230] text-[#73716B] hover:text-[#F7F5F0]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {statusMsg && (
            <p className="text-xs text-emerald-400 text-center font-medium animate-in fade-in">
              ✓ {statusMsg}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !title.trim()}
              className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold"
            >
              {isSubmitting ? 'Saving...' : 'Capture Now'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
