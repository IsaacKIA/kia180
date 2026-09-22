'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Task } from '@/types/database';

interface ResistanceModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunch5Min: (task: Task) => void;
}

export function ResistanceModal({
  task,
  isOpen,
  onClose,
  onLaunch5Min,
}: ResistanceModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('overwhelmed');
  const [isDeconstructing, setIsDeconstructing] = useState(false);
  const [deconstructedSteps, setDeconstructedSteps] = useState<string[]>([]);

  if (!task) return null;

  const reasons = [
    { id: 'overwhelmed', label: 'Feels too large & heavy' },
    { id: 'unclear', label: 'Unsure of the immediate first step' },
    { id: 'fear', label: 'Fear of rejection or poor response' },
    { id: 'energy', label: 'Low physical/cognitive energy' },
  ];

  const handleDeconstruct = () => {
    setIsDeconstructing(true);
    // Instant heuristic / AI deconstruction
    setTimeout(() => {
      setIsDeconstructing(false);
      setDeconstructedSteps([
        `Step 1 (2 mins): Open notes app and write down 3 bullet points about ${task.title.slice(0, 30)}...`,
        'Step 2 (5 mins): Draft raw unpolished first paragraph or message template without editing.',
        'Step 3 (3 mins): Review once for clarity and execute transmission.',
      ]);
    }, 500);
  };

  const handleLaunchStep = () => {
    onClose();
    onLaunch5Min(task);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#121217] border-[#2A2A3A] p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="h-4 w-4" />
            Pre-Start Resistance Protocol
          </div>
          <DialogTitle className="text-base font-bold text-[#F7F5F0] text-left mt-1">
            Break Through Resistance
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="p-3 rounded-lg bg-[#0E0E14] border border-[#222230]">
            <p className="text-[10px] text-[#8A8882] uppercase tracking-wide">
              Resisting Task:
            </p>
            <p className="text-xs font-medium text-[#F7F5F0] mt-0.5">
              {task.title}
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-[#A3A099] block mb-1.5">
              Identify the source of resistance:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {reasons.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setSelectedReason(r.id);
                    setDeconstructedSteps([]);
                  }}
                  className={`p-2 rounded-md border text-left text-xs transition-all ${
                    selectedReason === r.id
                      ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#DFBF65] font-medium'
                      : 'border-[#222230] bg-[#14141C] text-[#8A8882] hover:text-[#F7F5F0]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {deconstructedSteps.length === 0 ? (
            <Button
              onClick={handleDeconstruct}
              disabled={isDeconstructing}
              className="w-full bg-[#1A1A26] hover:bg-[#222232] border border-[#C9A84C]/30 text-[#DFBF65] text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#C9A84C]" />
              {isDeconstructing ? 'Deconstructing...' : 'Deconstruct into 3 Tiny Micro-Steps'}
            </Button>
          ) : (
            <div className="space-y-2 p-3 rounded-lg bg-[#14141E] border border-[#C9A84C]/40 animate-in fade-in">
              <p className="text-[11px] font-semibold text-[#DFBF65] uppercase">
                Deconstructed Micro-Steps:
              </p>
              <div className="space-y-1.5 text-xs text-[#E3E1DC]">
                {deconstructedSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleLaunchStep}
                className="w-full mt-3 bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <span>Launch Step 1 (5-Min Sprint)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
