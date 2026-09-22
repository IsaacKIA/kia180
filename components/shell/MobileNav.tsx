'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Target, Briefcase, BrainCircuit } from 'lucide-react';
import { QuickCapture } from './QuickCapture';

export function MobileNav() {
  const pathname = usePathname();

  const links = [
    { label: 'Today', href: '/today', icon: Flame },
    { label: 'Plan', href: '/plan', icon: Target },
    { label: 'Ventures', href: '/business', icon: Briefcase },
    { label: 'Coach', href: '/coach', icon: BrainCircuit },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-[#0C0C10]/95 backdrop-blur-lg border-t border-[#1F1F2B] z-40 px-3 py-2">
      <div className="flex items-center justify-around">
        {links.slice(0, 2).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-[#DFBF65]'
                  : 'text-[#8A8882] hover:text-[#F7F5F0]'
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? 'text-[#C9A84C]' : 'text-[#73716B]'
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}

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

        {links.slice(2).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-[#DFBF65]'
                  : 'text-[#8A8882] hover:text-[#F7F5F0]'
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? 'text-[#C9A84C]' : 'text-[#73716B]'
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
