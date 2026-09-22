'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  Flame,
  Target,
  CheckCircle2,
  DollarSign,
  Clock,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
import Link from 'next/link';

const commitmentHistory = [
  { week: 'W1', rate: 0 },
  { week: 'W2', rate: 0 },
];

const pillarProgress = [
  { name: 'Money', progress: 13, target: 100, color: '#C9A84C', fill: '#C9A84C' },
  { name: 'Build', progress: 5, target: 100, color: '#38BDF8', fill: '#38BDF8' },
  { name: 'Grow', progress: 2, target: 100, color: '#10B981', fill: '#10B981' },
];

const radialData = [
  { name: 'Commitment', value: 0, fill: '#C9A84C' },
];

export default function ProgressPage() {
  const cycleDay = 1;
  const cycleDays = 180;
  const cyclePct = (cycleDay / cycleDays) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1C28] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F5F0]">
            Progress & Score
          </h1>
          <p className="text-xs text-[#A3A099] mt-0.5">
            Cycle analytics · Commitment rate · Pillar balance
          </p>
        </div>
        <Badge variant="gold" className="font-mono text-xs px-3 py-1 self-start sm:self-auto">
          Day {cycleDay} / {cycleDays}
        </Badge>
      </div>

      {/* Cycle Overview */}
      <Card className="border-[#C9A84C]/30 bg-gradient-to-br from-[#14141C] to-[#181828]">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-[11px] font-semibold text-[#DFBF65] uppercase tracking-wider mb-1">
                  KIA 180 — Cycle 1 Progress
                </p>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold font-mono text-[#F7F5F0]">{cyclePct.toFixed(1)}</span>
                  <span className="text-xl text-[#C9A84C] font-bold mb-1">%</span>
                </div>
                <p className="text-xs text-[#8A8882]">Day {cycleDay} of {cycleDays} · Phase 1: Foundation</p>
              </div>
              <Progress value={Math.max(0.3, cyclePct)} className="h-3" />
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-2 rounded-lg bg-[#0E0E14] border border-[#1C1C28]">
                  <p className="font-mono font-bold text-[#F7F5F0]">{cycleDay}</p>
                  <p className="text-[10px] text-[#8A8882]">Days done</p>
                </div>
                <div className="p-2 rounded-lg bg-[#0E0E14] border border-[#1C1C28]">
                  <p className="font-mono font-bold text-[#F7F5F0]">{cycleDays - cycleDay}</p>
                  <p className="text-[10px] text-[#8A8882]">Days left</p>
                </div>
                <div className="p-2 rounded-lg bg-[#0E0E14] border border-[#1C1C28]">
                  <p className="font-mono font-bold text-[#DFBF65]">3</p>
                  <p className="text-[10px] text-[#8A8882]">Phases total</p>
                </div>
              </div>
            </div>

            {/* Radial Commitment Score */}
            <div className="text-center shrink-0 w-40">
              <p className="text-[11px] font-semibold text-[#8A8882] uppercase tracking-wide mb-2">
                Commitment Rate
              </p>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="85%"
                    data={[{ value: 0, fill: '#C9A84C' }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: '#1C1C28' }} dataKey="value" cornerRadius={5} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-2xl font-bold font-mono text-[#F7F5F0] -mt-8">0%</p>
              <p className="text-[10px] text-[#6E6C66] mt-6">No data yet — Day 1</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pillar Progress */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[#F7F5F0]">Pillar Balance</h2>
        <div className="grid grid-cols-1 gap-3">
          {pillarProgress.map((pillar) => (
            <Card key={pillar.name} className="border-[#232330] bg-[#121218]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: pillar.color }}
                    />
                    <span className="text-sm font-semibold text-[#F7F5F0]">{pillar.name}</span>
                  </div>
                  <span className="text-sm font-mono font-bold" style={{ color: pillar.color }}>
                    {pillar.progress}%
                  </span>
                </div>
                <Progress
                  value={pillar.progress}
                  className="h-2"
                  indicatorClassName={`bg-[${pillar.color}]`}
                />
                <p className="text-[10px] text-[#6E6C66] mt-1">
                  Target by Day {cycleDays}: 100%
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Goal Progress Snapshot */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[#F7F5F0]">Goal Progress Snapshot</h2>
        {[
          { title: 'Personal Income: GHS 15,000/mo', current: 2000, target: 15000, unit: 'GHS', pct: 13, color: 'text-amber-400' },
          { title: 'Settle GHS 7,000 Obligations', current: 0, target: 7000, unit: 'GHS', pct: 0, color: 'text-red-400' },
          { title: 'KIA Consult: GHS 25,000/mo Revenue', current: 100, target: 25000, unit: 'GHS', pct: 0.4, color: 'text-sky-400' },
        ].map((goal, i) => (
          <Card key={i} className="border-[#232330] bg-[#121218]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-[#F7F5F0]">{goal.title}</p>
                <span className={`text-xs font-mono font-bold ${goal.color}`}>
                  {goal.pct.toFixed(1)}%
                </span>
              </div>
              <Progress value={Math.max(0.2, goal.pct)} className="h-1.5" />
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-[#6E6C66] font-mono">
                  {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                </span>
                <span className="text-[10px] text-[#6E6C66]">
                  Δ {(goal.target - goal.current).toLocaleString()} {goal.unit} remaining
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Link href="/reviews">
          <Button variant="secondary" className="w-full text-xs gap-1.5 h-10">
            <CheckCircle2 className="h-4 w-4" /> Open Daily Review
          </Button>
        </Link>
        <Link href="/coach">
          <Button variant="outline" className="w-full text-xs gap-1.5 h-10 border-[#C9A84C]/40 text-[#DFBF65]">
            <Zap className="h-4 w-4" /> AI Score Analysis
          </Button>
        </Link>
      </div>
    </div>
  );
}
