'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Target,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Briefcase,
  Layers,
  PlusCircle,
  ArrowUpRight,
  Flame,
} from 'lucide-react';

// Static data based on Isaac's baseline
const goals = [
  {
    id: 'g1',
    level: '180day' as const,
    pillar: 'money',
    title: 'Personal Monthly Income: GHS 15,000',
    current: 2000,
    target: 15000,
    unit: 'GHS/mo',
    status: 'in_progress',
    end_date: '2027-03-20',
    children: [
      {
        id: 'g1a',
        level: 'monthly' as const,
        title: 'Month 1: Secure 3 retainer clients (GHS 9,000)',
        current: 0,
        target: 9000,
        unit: 'GHS',
        status: 'in_progress',
      },
    ],
  },
  {
    id: 'g2',
    level: '180day' as const,
    pillar: 'money',
    title: 'Settle GHS 7,000 Obligations',
    current: 0,
    target: 7000,
    unit: 'GHS',
    status: 'in_progress',
    end_date: '2026-11-30',
    children: [],
  },
  {
    id: 'g3',
    level: '180day' as const,
    pillar: 'build',
    title: 'KIA Consult: GHS 25,000/mo Revenue Run-Rate',
    current: 100,
    target: 25000,
    unit: 'GHS/mo',
    status: 'in_progress',
    end_date: '2027-03-20',
    children: [],
  },
  {
    id: 'g4',
    level: '180day' as const,
    pillar: 'grow',
    title: 'Zero Pre-Start Resistance: 90%+ Daily Commitment Rate',
    current: 0,
    target: 90,
    unit: '%',
    status: 'not_started',
    end_date: '2027-03-20',
    children: [],
  },
];

const projects = [
  {
    id: 'p1',
    title: 'KIA Consult: Immediate Client Acquisition Sprint',
    business: 'KIA-Start Up Consult',
    status: 'active',
    target_date: '2026-10-15',
    progress: 5,
    objective: 'Secure 3 paid consulting clients at GHS 3,000+ retainer',
    success_condition: '3 signed agreements + GHS 9,000 initial payments received',
    pillar: 'money',
  },
  {
    id: 'p2',
    title: 'Consulting Service Package Design',
    business: 'KIA-Start Up Consult',
    status: 'active',
    target_date: '2026-09-25',
    progress: 20,
    objective: 'Formalize 3 service tiers with clear deliverables and pricing',
    success_condition: 'Priced PDF package ready to share during client conversations',
    pillar: 'build',
  },
  {
    id: 'p3',
    title: 'Civitas: Municipal Advisory Positioning',
    business: 'Civitas',
    status: 'planned',
    target_date: '2026-10-31',
    progress: 0,
    objective: 'Define Civitas service scope and target municipal clients',
    success_condition: '2 scoped proposals sent to local government or NGO entities',
    pillar: 'build',
  },
];

const pillarColors: Record<string, string> = {
  money: 'text-amber-400',
  build: 'text-sky-400',
  grow: 'text-emerald-400',
};
const pillarBg: Record<string, string> = {
  money: 'border-amber-500/40 bg-amber-500/10',
  build: 'border-sky-500/40 bg-sky-500/10',
  grow: 'border-emerald-500/40 bg-emerald-500/10',
};
const statusBadge: Record<string, 'gold' | 'high' | 'medium' | 'default'> = {
  active: 'gold',
  planned: 'medium',
  in_progress: 'high',
  not_started: 'default',
};

export default function PlanPage() {
  const [activeTab, setActiveTab] = useState('goals');

  const cycleStart = new Date('2026-09-21');
  const cycleEnd = new Date('2027-03-20');
  const today = new Date();
  const daysPassed = Math.floor((today.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.floor((cycleEnd.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
  const progressPct = Math.max(0, Math.min(100, (daysPassed / totalDays) * 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1C28] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" className="font-mono text-[10px] px-2 py-0.5">CYCLE 1</Badge>
            <span className="text-xs text-[#8A8882]">Sep 21, 2026 → Mar 20, 2027</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F5F0]">
            180-Day Execution Plan
          </h1>
          <p className="text-xs text-[#A3A099] mt-0.5">Goals → Projects → Tasks → Daily Leverage</p>
        </div>
        <Button size="sm" className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs gap-1.5">
          <PlusCircle className="h-3.5 w-3.5" /> Add Goal
        </Button>
      </div>

      {/* Cycle Progress Widget */}
      <Card className="border-[#C9A84C]/30 bg-gradient-to-r from-[#14141C] to-[#181822]">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#DFBF65] uppercase tracking-wider">
                <Flame className="h-4 w-4 text-[#C9A84C]" />
                KIA 180 — Phase 1: Foundation & Cash Stability
              </div>
              <p className="text-sm text-[#C5C3BC]">
                Day <span className="font-bold text-[#F7F5F0] font-mono">{Math.max(1, daysPassed)}</span> of{' '}
                <span className="font-bold text-[#F7F5F0] font-mono">{totalDays}</span> —{' '}
                <span className="text-[#DFBF65]">{progressPct.toFixed(1)}% complete</span>
              </p>
            </div>
            <div className="w-full sm:w-48 space-y-1">
              <Progress value={Math.max(0.5, progressPct)} className="h-2" />
              <p className="text-[10px] text-[#6E6C66] text-right">
                {Math.max(0, totalDays - daysPassed)} days remaining
              </p>
            </div>
          </div>

          {/* Phase Timeline */}
          <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-2">
            {[
              { name: 'Phase 1', range: 'Sep–Nov', focus: 'Foundation & Cash', active: true },
              { name: 'Phase 2', range: 'Nov–Jan', focus: 'Systems & Scale', active: false },
              { name: 'Phase 3', range: 'Jan–Mar', focus: 'Authority & Expansion', active: false },
            ].map((phase) => (
              <div
                key={phase.name}
                className={`p-2 sm:p-2.5 rounded-lg border text-center ${
                  phase.active
                    ? 'border-[#C9A84C]/50 bg-[#C9A84C]/10'
                    : 'border-[#232330] bg-[#0E0E14]'
                }`}
              >
                <div className={`text-[10px] font-bold ${phase.active ? 'text-[#DFBF65]' : 'text-[#8A8882]'}`}>
                  {phase.name}
                </div>
                <div className="text-[9px] sm:text-[10px] text-[#6E6C66]">{phase.range}</div>
                <div className={`text-[9px] sm:text-[10px] font-medium mt-0.5 leading-tight ${phase.active ? 'text-[#F7F5F0]' : 'text-[#6E6C66]'}`}>
                  {phase.focus}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs: Goals | Projects | Tasks */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="goals">Goals (4)</TabsTrigger>
          <TabsTrigger value="projects">Projects (3)</TabsTrigger>
          <TabsTrigger value="tasks">Task Backlog</TabsTrigger>
        </TabsList>

        {/* ── Goals Tab ── */}
        <TabsContent value="goals" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            {goals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
              return (
                <Card key={goal.id} className="border-[#232330] bg-[#121218]">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${pillarBg[goal.pillar]} ${pillarColors[goal.pillar]}`}
                        >
                          {goal.pillar}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-[#F7F5F0] leading-snug">
                            {goal.title}
                          </h3>
                          <p className="text-[10px] text-[#8A8882] mt-0.5 font-mono uppercase">
                            {goal.level} goal · ends {goal.end_date}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={goal.status === 'in_progress' ? 'high' : 'default'}
                        className="shrink-0 text-[10px] py-0 px-2"
                      >
                        {goal.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8A8882]">
                          {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                        </span>
                        <span className="font-mono font-bold text-[#DFBF65]">{pct}%</span>
                      </div>
                      <Progress
                        value={pct}
                        className="h-2"
                        indicatorClassName={
                          pct < 20
                            ? 'bg-gradient-to-r from-red-600 to-red-400'
                            : pct < 60
                            ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                            : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                        }
                      />
                    </div>

                    {/* Child goals if any */}
                    {goal.children.length > 0 && (
                      <div className="mt-3 space-y-1.5 pl-3 border-l-2 border-[#232330]">
                        {goal.children.map((child) => {
                          const childPct = Math.min(100, Math.round((child.current / child.target) * 100));
                          return (
                            <div key={child.id} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <ChevronRight className="h-3 w-3 text-[#C9A84C]" />
                                <span className="text-[#C5C3BC]">{child.title}</span>
                              </div>
                              <span className="font-mono text-[#8A8882]">
                                {child.current} / {child.target} {child.unit}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ── Projects Tab ── */}
        <TabsContent value="projects" className="space-y-4 mt-4">
          {projects.map((proj) => (
            <Card key={proj.id} className="border-[#232330] bg-[#121218]">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge
                        variant={statusBadge[proj.status] || 'default'}
                        className="text-[10px] py-0 px-2 uppercase"
                      >
                        {proj.status}
                      </Badge>
                      <span className={`text-[10px] font-semibold ${pillarColors[proj.pillar]}`}>
                        {proj.business}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#F7F5F0]">{proj.title}</h3>
                    <p className="text-[11px] text-[#8A8882] mt-1">{proj.objective}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-[10px] text-[#8A8882]">
                      <Clock className="h-3 w-3" />
                      Due {proj.target_date}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#8A8882]">
                    <span>Progress</span>
                    <span className="font-mono font-bold text-[#DFBF65]">{proj.progress}%</span>
                  </div>
                  <Progress value={proj.progress} className="h-1.5" />
                </div>

                <div className="mt-3 p-2.5 rounded bg-[#0E0E14] border border-[#1C1C28] text-[11px] text-[#A3A099]">
                  <span className="text-[#6E6C66]">Success when: </span>
                  {proj.success_condition}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ── Tasks Backlog Tab ── */}
        <TabsContent value="tasks" className="mt-4">
          <Card className="border-[#232330] bg-[#121218]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#F7F5F0]">Task Backlog</CardTitle>
              <CardDescription className="text-xs">
                All captured tasks across projects — prioritised by pillar and urgency.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { title: 'Build 15-founder prospect list', priority: 'critical', pillar: 'money', status: 'todo', est: '60m' },
                { title: 'Draft advisory package pricing PDF', priority: 'high', pillar: 'build', status: 'todo', est: '45m' },
                { title: 'Map GHS 7,000 debt retirement schedule', priority: 'critical', pillar: 'money', status: 'todo', est: '30m' },
                { title: 'Send first 5 LinkedIn outreach DMs', priority: 'high', pillar: 'money', status: 'todo', est: '30m' },
                { title: 'Define Civitas municipal advisory scope', priority: 'medium', pillar: 'build', status: 'todo', est: '90m' },
                { title: 'Create 1-page Agrivora value proposition brief', priority: 'low', pillar: 'build', status: 'todo', est: '60m' },
              ].map((task, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[#0E0E14] border border-[#1C1C28] hover:border-[#38384C] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        task.priority === 'critical'
                          ? 'bg-red-500'
                          : task.priority === 'high'
                          ? 'bg-amber-400'
                          : 'bg-sky-400'
                      }`}
                    />
                    <span className="text-xs text-[#E3E1DC]">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <Badge
                      variant={task.pillar === 'money' ? 'money' : task.pillar === 'build' ? 'build' : 'grow'}
                      className="text-[10px] py-0 px-1.5"
                    >
                      {task.pillar}
                    </Badge>
                    <span className="text-[10px] text-[#7A7872] font-mono">{task.est}</span>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link href="/today">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    View Today's Active Tasks
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
