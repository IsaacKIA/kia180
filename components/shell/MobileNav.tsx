'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Target, BrainCircuit, Menu } from 'lucide-react';
import { QuickCapture } from './QuickCapture';
import { openMobileDrawer } from './MobileDrawer';

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-[#0C0C10]/95 backdrop-blur-lg border-t border-[#1F1F2B] z-40 px-2 py-1.5 mobile-nav-safe">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {/* Today */}
        <Link
          href="/today"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
            pathname === '/today'
              ? 'text-[#DFBF65]'
              : 'text-[#8A8882] hover:text-[#F7F5F0]'
          }`}
        >
          <Flame
            className={`h-5 w-5 ${
              pathname === '/today' ? 'text-[#C9A84C]' : 'text-[#73716B]'
            }`}
          />
          <span>Today</span>
        </Link>

        {/* Plan */}
        <Link
          href="/plan"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
            pathname === '/plan'
              ? 'text-[#DFBF65]'
              : 'text-[#8A8882] hover:text-[#F7F5F0]'
          }`}
        >
          <Target
            className={`h-5 w-5 ${
              pathname === '/plan' ? 'text-[#C9A84C]' : 'text-[#73716B]'
            }`}
          />
          <span>Plan</span>
        </Link>

        {/* Center Quick Capture Button */}
        <div className="-mt-5">
          <QuickCapture>
            <button
              className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#C9A84C] to-[#E5C978] text-[#0A0A0C] flex items-center justify-center shadow-lg shadow-amber-950/50 border-2 border-[#0A0A0C] active:scale-95 transition-transform"
              aria-label="Quick Action"
            >
              <span className="text-xl font-bold leading-none">+</span>
            </button>
          </QuickCapture>
        </div>

        {/* Coach */}
        <Link
          href="/coach"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
            pathname === '/coach'
              ? 'text-[#DFBF65]'
              : 'text-[#8A8882] hover:text-[#F7F5F0]'
          }`}
        >
          <BrainCircuit
            className={`h-5 w-5 ${
              pathname === '/coach' ? 'text-[#C9A84C]' : 'text-[#73716B]'
            }`}
          />
          <span>Coach</span>
        </Link>

        {/* Menu (More) */}
        <button
          type="button"
          onClick={() => openMobileDrawer()}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium text-[#8A8882] hover:text-[#F7F5F0] transition-colors"
          aria-label="Open full menu"
        >
          <Menu className="h-5 w-5 text-[#73716B]" />
          <span>Menu</span>
        </button>
      </div>
    </nav>
  );
}
