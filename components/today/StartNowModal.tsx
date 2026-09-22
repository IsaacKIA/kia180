'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, CheckCircle2, Flame, ShieldAlert } from 'lucide-react';
import { Task } from '@/types/database';

interface StartNowModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (taskId: string) => void;
}

export function StartNowModal({
  task,
  isOpen,
  onClose,
  onComplete,
}: StartNowModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(300);
      setIsActive(true);
      setIsDone(false);
    }
  }, [isOpen, task]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((sec) => sec - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  if (!task) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleFinish = () => {
    setIsDone(true);
    setTimeout(() => {
      onComplete(task.id);
      onClose();
    }, 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#0D0D12] border-[#2A2A3A] p-6 text-center">
        <DialogHeader>
          <div className="mx-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Flame className="h-3.5 w-3.5" />
            5-Minute Resistance Breakthrough
          </div>
          <DialogTitle className="text-base font-bold text-[#F7F5F0] mt-3">
            {task.title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-4">
          {/* Circular Countdown Display */}
          <div className="relative inline-flex items-center justify-center">
            <div className="h-32 w-32 rounded-full border-4 border-[#222230] border-t-[#C9A84C] flex items-center justify-center font-mono text-3xl font-bold text-[#F7F5F0] shadow-inner shadow-black">
              {timeFormatted}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#14141C] border border-[#232332] text-left space-y-1.5">
            <p className="text-[11px] font-semibold text-[#DFBF65] uppercase tracking-wide">
              The Only Rule Right Now:
            </p>
            <p className="text-xs text-[#E3E1DC]">
              You only have to work for 5 minutes. No perfection, no finishing. Just start.
            </p>
            {task.next_action && (
              <div className="pt-1 border-t border-[#1F1F2C] mt-2">
                <span className="text-[10px] text-[#8A8882] block">First physical step:</span>
                <span className="text-xs text-sky-300 font-medium">{task.next_action}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsActive(!isActive)}
            className="border-[#2B2B3C] text-xs gap-1.5"
          >
            {isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isActive ? 'Pause' : 'Resume'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSecondsRemaining(300)}
            className="border-[#2B2B3C] text-xs gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>

          <Button
            size="sm"
            onClick={handleFinish}
            className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isDone ? 'Marking Complete...' : 'Complete Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
