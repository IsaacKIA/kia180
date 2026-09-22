'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  Flame,
  Target,
  BarChart3,
  DollarSign,
  Briefcase,
  AlertTriangle,
  BrainCircuit,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  Settings,
  LogOut,
  Compass,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function openMobileDrawer() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toggle-mobile-drawer', { detail: { open: true } }));
  }
}

export function closeMobileDrawer() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toggle-mobile-drawer', { detail: { open: false } }));
  }
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: 'gold' | 'critical' | 'default';
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: 'CORE EXECUTION',
    items: [
      { label: 'Today', href: '/today', icon: Flame },
      { label: '180-Day Plan', href: '/plan', icon: Target },
      { label: 'Progress & Score', href: '/progress', icon: BarChart3 },
    ],
  },
  {
    title: 'MONEY & VENTURES',
    items: [
      { label: 'Finances & Debt', href: '/finance', icon: DollarSign, badge: 'Debt: 7k', badgeVariant: 'critical' },
      { label: 'Ventures (3)', href: '/business', icon: Briefcase },
      { label: 'Sales Pipeline', href: '/business/pipeline', icon: Compass },
    ],
  },
  {
    title: 'STRATEGIC INTEL',
    items: [
      { label: 'Risk Radar', href: '/risks', icon: AlertTriangle, badge: '2 Active', badgeVariant: 'critical' },
      { label: 'Decisions', href: '/decisions', icon: BrainCircuit },
      { label: 'Knowledge OS', href: '/knowledge', icon: BookOpen },
      { label: 'Idea Vault', href: '/ideas', icon: Lightbulb },
    ],
  },
  {
    title: 'GOVERNANCE & AI',
    items: [
      { label: 'Executive Reviews', href: '/reviews', icon: CheckCircle2 },
      { label: 'KIA AI Coach', href: '/coach', icon: BrainCircuit, badge: 'AI', badgeVariant: 'gold' },
      { label: 'System Settings', href: '/settings', icon: Settings },
    ],
  },
];

export function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ open?: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.open === 'boolean') {
        setIsOpen(customEvent.detail.open);
      } else {
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('toggle-mobile-drawer', handleToggle);
    return () => window.removeEventListener('toggle-mobile-drawer', handleToggle);
  }, []);

  // Close drawer automatically on route navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentDay = 1;
  const totalDays = 180;
  const progressPercent = (currentDay / totalDays) * 100;

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out drawer container */}
      <div className="relative w-[82vw] max-w-xs bg-[#0E0E13] border-r border-[#1F1F2B] flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
        {/* Brand Header */}
        <div className="p-4 border-b border-[#1C1C28]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#8C6D23] flex items-center justify-center font-bold text-black text-sm shadow-md shadow-amber-950/40">
                KIA
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-wider text-[#F7F5F0]">
                  KIA 180
                </h2>
                <p className="text-[10px] text-[#A3A099] font-medium tracking-wide uppercase">
                  Execution OS
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-[#8A8882] hover:text-[#F7F5F0] hover:bg-[#1C1C28] transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 180-Day Cycle Widget */}
          <div className="mt-3.5 p-2.5 rounded-lg bg-[#14141C] border border-[#222230]">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-[#A3A099] font-medium">Phase 1: Foundation</span>
              <span className="text-[#C9A84C] font-semibold font-mono">
                {progressPercent.toFixed(1)}%
              </span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
            <div className="flex items-center justify-between text-[10px] text-[#6E6C66] mt-1.5">
              <span>Day {currentDay} of {totalDays}</span>
              <span className="text-[#DFBF65]">Target: 15k/mo</span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-2 text-[10px] font-semibold text-[#666560] tracking-wider uppercase">
                {section.title}
              </p>
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/today' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#1C1C26] text-[#DFBF65] border border-[#C9A84C]/30 shadow-sm'
                        : 'text-[#A3A099] hover:bg-[#14141D] hover:text-[#F7F5F0]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive
                            ? 'text-[#C9A84C]'
                            : 'text-[#7A7872]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge
                        variant={
                          item.badgeVariant === 'critical'
                            ? 'critical'
                            : item.badgeVariant === 'gold'
                            ? 'gold'
                            : 'default'
                        }
                        className="text-[10px] py-0 px-1.5"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-[#1C1C28] bg-[#0A0A0E] mobile-nav-safe">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#14141D] transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-[#20202C] border border-[#C9A84C]/40 flex items-center justify-center font-bold text-xs text-[#DFBF65] shrink-0">
                IK
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#F7F5F0] truncate">
                  Isaac Agya Koomson
                </p>
                <p className="text-[10px] text-[#7A7872] truncate">
                  Lead Strategist
                </p>
              </div>
            </div>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="text-[#7A7872] hover:text-red-400 p-1.5 rounded transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
