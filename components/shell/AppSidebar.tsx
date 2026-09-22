'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
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

export function AppSidebar() {
  const pathname = usePathname();

  // Day 1 of 180 = ~0.55%
  const currentDay = 1;
  const totalDays = 180;
  const progressPercent = (currentDay / totalDays) * 100;

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 bg-[#0E0E13] border-r border-[#1F1F2B] z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1C1C28]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#8C6D23] flex items-center justify-center font-bold text-black text-sm shadow-md shadow-amber-950/40">
              KIA
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-[#F7F5F0]">
                KIA 180
              </h1>
              <p className="text-[10px] text-[#A3A099] font-medium tracking-wide uppercase">
                Execution OS
              </p>
            </div>
          </div>
          <Badge variant="gold" className="text-[10px] py-0 px-2 font-mono">
            D{currentDay}/180
          </Badge>
        </div>

        {/* 180-Day Cycle Widget */}
        <div className="mt-4 p-3 rounded-lg bg-[#14141C] border border-[#222230]">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-[#A3A099] font-medium">Phase 1: Foundation</span>
            <span className="text-[#C9A84C] font-semibold font-mono">
              {progressPercent.toFixed(1)}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
          <p className="text-[10px] text-[#6E6C66] mt-1.5">
            Target: Cash stability & 15k/mo
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
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
                  className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
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
                          : 'text-[#7A7872] group-hover:text-[#F7F5F0]'
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
      <div className="p-3 border-t border-[#1C1C28] bg-[#0A0A0E]">
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
            className="text-[#7A7872] hover:text-red-400 p-1 rounded transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
