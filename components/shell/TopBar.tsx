'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { QuickCapture } from './QuickCapture';
import { NotificationBell } from './NotificationBell';
import { Button } from '@/components/ui/button';

export function TopBar() {
  return (
    <header className="h-14 border-b border-[#1F1F2B] bg-[#0E0E13]/90 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Cycle & Phase status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-semibold text-[#F7F5F0]">
            Day 1 of 180
          </span>
        </div>
        <span className="hidden md:inline text-xs text-[#52514D]">|</span>
        <span className="hidden md:inline text-xs text-[#A3A099]">
          Phase 1: Foundation & Cash Stability
        </span>
      </div>

      {/* Center / Stats (desktop) */}
      <div className="hidden lg:flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#14141C] border border-[#222230]">
          <span className="text-[#8A8882]">Cash:</span>
          <span className="font-mono font-medium text-red-400">GHS 0</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#14141C] border border-[#222230]">
          <span className="text-[#8A8882]">Debt:</span>
          <span className="font-mono font-medium text-amber-400">GHS 7,000</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#14141C] border border-[#222230]">
          <span className="text-[#8A8882]">Goal:</span>
          <span className="font-mono font-medium text-[#DFBF65]">GHS 15k/mo</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Link href="/coach">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5 border-[#C9A84C]/40 text-[#DFBF65] hover:bg-[#C9A84C]/10"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#C9A84C]" />
            <span className="hidden sm:inline">Ask Coach</span>
          </Button>
        </Link>
        <QuickCapture />
        <NotificationBell />
      </div>
    </header>
  );
}
