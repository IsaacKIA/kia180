'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TaskCard } from '@/components/today/TaskCard';
import { StartNowModal } from '@/components/today/StartNowModal';
import { ResistanceModal } from '@/components/today/ResistanceModal';
import { QuickCapture } from '@/components/shell/QuickCapture';
import { Task } from '@/types/database';
import {
  Flame,
  Target,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

const initialTasks: Task[] = [
  {
    id: 'task-1',
    user_id: 'user-isaac',
    title: 'Compile list of 15 target founders for KIA Start-Up Consult',
    description:
      'Identify warm contacts and active ventures in Accra needing business registration, pitch structuring, or financial projections.',
    priority: 'critical',
    status: 'todo',
    pillar_tag: 'money',
    estimated_duration: 60,
    deadline: '2026-09-21T18:00:00Z',
    why_it_matters:
      'Without targeted outreach, zero consulting cashflow enters the business this week. This directly funds the first debt tranche.',
    next_action:
      'Open WhatsApp & LinkedIn contacts; paste first 5 founder names and phone numbers into pipeline.',
    consequence_of_delay:
      'Another 24 hours in cash deficit with zero client deals advancing.',
    deferral_count: 0,
    energy_required: 'high',
    is_daily_three: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-2',
    user_id: 'user-isaac',
    title: 'Draft 1-page executive advisory package & pricing sheet',
    description:
      'Formalize 3 clear consulting packages (Startup Formation: GHS 2,500; Growth Audit: GHS 5,000; Monthly Retainer: GHS 3,000/mo).',
    priority: 'high',
    status: 'todo',
    pillar_tag: 'build',
    estimated_duration: 45,
    deadline: '2026-09-21T19:00:00Z',
    why_it_matters:
      'Prevents under-quoting and gives immediate clarity when prospective clients ask for pricing during calls.',
    next_action:
      'Write 3 package bullet deliverables in simple text document.',
    consequence_of_delay:
      'Hesitation during client calls leading to missed retainer signups.',
    deferral_count: 0,
    energy_required: 'medium',
    is_daily_three: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-3',
    user_id: 'user-isaac',
    title: 'Map GHS 7,000 obligations into priority settlement calendar',
    description:
      'Categorize all debt obligations by urgency, creditor contact, and link each payment to upcoming client cashflow milestones.',
    priority: 'critical',
    status: 'todo',
    pillar_tag: 'money',
    estimated_duration: 30,
    deadline: '2026-09-21T20:00:00Z',
    why_it_matters:
      'Eliminating cognitive ambiguity over debt removes unconscious resistance and restores executive focus.',
    next_action:
      'List creditors, amounts owed, and target repayment tranches.',
    consequence_of_delay:
      'Continued underlying financial anxiety diverting energy from revenue generation.',
    deferral_count: 0,
    energy_required: 'medium',
    is_daily_three: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function TodayPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [resistanceTask, setResistanceTask] = useState<Task | null>(null);

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length;
  const commitmentRate = Math.round((completedCount / (totalCount || 1)) * 100);

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === 'completed' ? 'todo' : 'completed',
              completed_at: t.status === 'completed' ? null : new Date().toISOString(),
            }
          : t
      )
    );
  };

  const handleStartNow = (task: Task) => {
    setActiveFocusTask(task);
  };

  const handleOpenResistance = (task: Task) => {
    setResistanceTask(task);
  };

  const handleFocusComplete = (taskId: string) => {
    handleToggleComplete(taskId);
  };

  return (
    <div className="space-y-6">
      {/* 1. Executive Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1C1C28] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="gold" className="font-mono text-xs px-2.5 py-0.5 font-bold">
              DAY 1 / 180
            </Badge>
            <span className="text-xs text-[#8A8882]">Monday, 21 September 2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F5F0] mt-1.5">
            Executive Command Centre
          </h1>
          <p className="text-xs text-[#A3A099] mt-0.5">
            Phase 1: Foundation & Cash Stability (Days 1–45)
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-3 py-2 rounded-lg bg-[#121218] border border-[#232332] text-left">
            <p className="text-[10px] text-[#7A7872] uppercase font-semibold">
              Daily Commitment
            </p>
            <p className="text-sm font-bold font-mono text-[#DFBF65]">
              {completedCount} / {totalCount} Done ({commitmentRate}%)
            </p>
          </div>

          <QuickCapture onTaskCreated={() => {}}>
            <Button
              size="sm"
              className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs h-10 px-4"
            >
              + Quick Action
            </Button>
          </QuickCapture>
        </div>
      </div>

      {/* 2. Today's North Star Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#14141C] via-[#1A1A26] to-[#14141C] border border-[#C9A84C]/30 relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#DFBF65] uppercase tracking-wider">
              <Target className="h-4 w-4 text-[#C9A84C]" />
              Today's Single North Star
            </div>
            <p className="text-sm sm:text-base font-semibold text-[#F7F5F0] leading-snug">
              Secure 2 client discovery conversations and establish absolute clarity on the debt retirement schedule.
            </p>
            <p className="text-xs text-[#A3A099]">
              If you accomplish nothing else today, this single outcome guarantees forward momentum.
            </p>
          </div>
          <Link href="/coach">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-1.5 text-xs border-[#C9A84C]/40 text-[#DFBF65] hover:bg-[#C9A84C]/10"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Strategy
            </Button>
          </Link>
        </div>
      </div>

      {/* 3. Executive Metrics Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-[#232330] bg-[#121217]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-[#8A8882] text-xs">
              <span>Liquid Cash</span>
              <DollarSign className="h-4 w-4 text-red-400" />
            </div>
            <p className="text-lg sm:text-xl font-bold font-mono text-red-400 mt-1">
              GHS 0
            </p>
            <span className="text-[10px] text-[#6E6C66]">Critical cash runway</span>
          </CardContent>
        </Card>

        <Card className="border-[#232330] bg-[#121217]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-[#8A8882] text-xs">
              <span>Obligations</span>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-lg sm:text-xl font-bold font-mono text-amber-400 mt-1">
              GHS 7,000
            </p>
            <span className="text-[10px] text-[#6E6C66]">Phase 1 priority settlement</span>
          </CardContent>
        </Card>

        <Card className="border-[#232330] bg-[#121217]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-[#8A8882] text-xs">
              <span>6-Mo Target</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-1">
              GHS 15k/mo
            </p>
            <span className="text-[10px] text-[#6E6C66]">Personal income run-rate</span>
          </CardContent>
        </Card>

        <Card className="border-[#232330] bg-[#121217]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-[#8A8882] text-xs">
              <span>Cycle Progress</span>
              <Flame className="h-4 w-4 text-[#C9A84C]" />
            </div>
            <p className="text-lg sm:text-xl font-bold font-mono text-[#DFBF65] mt-1">
              Day 1 of 180
            </p>
            <div className="mt-2">
              <Progress value={0.55} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. The Daily Three Execution Core */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#F7F5F0]">
              The Daily Three
            </h2>
            <Badge variant="gold" className="text-[10px] py-0 px-2 uppercase font-mono">
              High Leverage Only
            </Badge>
          </div>
          <span className="text-xs text-[#8A8882]">
            {completedCount} of {totalCount} completed
          </span>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onStartNow={handleStartNow}
              onOpenResistance={handleOpenResistance}
            />
          ))}
        </div>
      </div>

      {/* 5. Bottom Quick Review / Intelligence Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Risk Radar Alert */}
        <Card className="border-[#2A2A38] bg-[#121218]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-[#F7F5F0] flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                Active Risk Radar
              </CardTitle>
              <Link
                href="/risks"
                className="text-[11px] text-[#C9A84C] hover:underline flex items-center gap-0.5"
              >
                View Radar <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-red-950/20 border border-red-900/40">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-red-300">Cash Runway Deficit</span>
                <Badge variant="critical" className="text-[10px] py-0 px-1.5">Critical</Badge>
              </div>
              <p className="text-[11px] text-red-200/80 mt-1">
                Zero liquid cash with GHS 7,000 in upcoming commitments. 2 founder calls required today.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Evening Review Callout */}
        <Card className="border-[#2A2A38] bg-[#121218]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-[#F7F5F0] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Evening Accountability Loop
              </CardTitle>
              <Link
                href="/reviews"
                className="text-[11px] text-[#C9A84C] hover:underline flex items-center gap-0.5"
              >
                Open Review <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-[#A3A099]">
            <p className="leading-relaxed">
              Every evening at 21:00, log your completed actions, avoided tasks, and tomorrow's #1 priority.
            </p>
            <div className="pt-1">
              <Link href="/reviews">
                <Button variant="secondary" size="sm" className="w-full text-xs h-8">
                  Prepare Today's Review
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Focus Timer Modal */}
      <StartNowModal
        task={activeFocusTask}
        isOpen={!!activeFocusTask}
        onClose={() => setActiveFocusTask(null)}
        onComplete={handleFocusComplete}
      />

      {/* Pre-Start Resistance Modal */}
      <ResistanceModal
        task={resistanceTask}
        isOpen={!!resistanceTask}
        onClose={() => setResistanceTask(null)}
        onLaunch5Min={(task) => {
          setResistanceTask(null);
          setActiveFocusTask(task);
        }}
      />
    </div>
  );
}
