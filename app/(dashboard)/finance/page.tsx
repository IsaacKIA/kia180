'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const trajectoryData = [
  { month: 'Sep', personal: 2000, target: 2000 },
  { month: 'Oct', personal: 2000, target: 4000 },
  { month: 'Nov', personal: 2000, target: 6500 },
  { month: 'Dec', personal: 2000, target: 9000 },
  { month: 'Jan', personal: 2000, target: 11500 },
  { month: 'Feb', personal: 2000, target: 13500 },
  { month: 'Mar', personal: 2000, target: 15000 },
];

const obligations = [
  { creditor: 'Outstanding Debt Pool', amount: 7000, paid: 0, due: '2026-11-30', priority: 'urgent' as const },
];

const incomeHistory = [
  { date: 'Sep 2026', source: 'Employment / Existing', amount: 2000, category: 'personal' },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('overview');

  const totalObligations = obligations.reduce((s, o) => s + (o.amount - o.paid), 0);
  const personalIncome = 2000;
  const targetIncome = 15000;
  const incomePct = Math.round((personalIncome / targetIncome) * 100);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1A24] border border-[#2B2B3C] rounded-lg p-3 text-xs">
          <p className="text-[#8A8882] mb-1 font-semibold">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }}>
              {p.name}: <span className="font-mono font-bold">GHS {p.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1C28] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F5F0]">
            Financial Command
          </h1>
          <p className="text-xs text-[#A3A099] mt-0.5">
            Personal & Business cashflow · Obligations · Trajectory
          </p>
        </div>
        <Button size="sm" className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Log Transaction
        </Button>
      </div>

      {/* Critical Cash Alert */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-red-800/60 bg-red-950/20">
        <ShieldAlert className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-300">⚡ Critical Cash Position</p>
          <p className="text-xs text-red-200/80 mt-0.5 leading-relaxed">
            Liquid cash is <span className="font-mono font-bold">GHS 0</span> with{' '}
            <span className="font-mono font-bold">GHS 7,000</span> in obligations pending.
            Priority: 2 client conversations today → minimum GHS 3,000 retainer within 7 days.
          </p>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Liquid Cash', value: 'GHS 0', sub: 'Immediate runway', icon: Wallet, color: 'text-red-400', trend: 'critical' },
          { label: 'Monthly Income', value: 'GHS 2,000', sub: 'vs GHS 15k target', icon: TrendingUp, color: 'text-amber-400', trend: 'low' },
          { label: 'Outstanding Debt', value: 'GHS 7,000', sub: 'Phase 1 priority', icon: AlertTriangle, color: 'text-amber-400', trend: 'high' },
          { label: 'Income Gap', value: 'GHS 13,000/mo', sub: 'To reach north star', icon: TrendingDown, color: 'text-[#8A8882]', trend: 'watch' },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-[#232330] bg-[#121218]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-[#8A8882] text-xs mb-1">
                <span>{kpi.label}</span>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <p className={`text-base sm:text-lg font-bold font-mono ${kpi.color}`}>{kpi.value}</p>
              <span className="text-[10px] text-[#6E6C66]">{kpi.sub}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Trajectory</TabsTrigger>
          <TabsTrigger value="obligations">Obligations</TabsTrigger>
          <TabsTrigger value="income">Income Log</TabsTrigger>
        </TabsList>

        {/* ── Trajectory Tab ── */}
        <TabsContent value="overview" className="mt-4">
          <Card className="border-[#232330] bg-[#121218]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#F7F5F0]">Personal Income Trajectory (GHS/month)</CardTitle>
              <CardDescription className="text-xs">
                Current baseline vs 180-day required trajectory to GHS 15,000/mo
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-56 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1C1C28" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8A8882' }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#8A8882' }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={8000} stroke="#EF4444" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: 'Min Required', fontSize: 9, fill: '#EF4444', position: 'right' }} />
                    <Area
                      type="monotone"
                      dataKey="target"
                      name="Target Path"
                      stroke="#C9A84C"
                      fill="#C9A84C"
                      fillOpacity={0.12}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="personal"
                      name="Actual Income"
                      stroke="#EF4444"
                      fill="#EF4444"
                      fillOpacity={0.08}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-sm bg-[#C9A84C]" />
                  <span className="text-[#8A8882]">Required trajectory</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-sm bg-red-500" />
                  <span className="text-[#8A8882]">Current income</span>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-[#0E0E14] border border-[#1C1C28] text-xs space-y-1">
                <p className="text-[#8A8882] font-semibold uppercase text-[10px]">Required Monthly Revenue to Hit Target</p>
                <div className="flex justify-between">
                  <span className="text-[#A3A099]">Oct 2026 (Month 2):</span>
                  <span className="font-mono font-bold text-[#DFBF65]">GHS 4,000+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A3A099]">Dec 2026 (Month 4):</span>
                  <span className="font-mono font-bold text-[#DFBF65]">GHS 9,000+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A3A099]">Mar 2027 (Month 7):</span>
                  <span className="font-mono font-bold text-[#DFBF65]">GHS 15,000+</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Obligations Tab ── */}
        <TabsContent value="obligations" className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#F7F5F0]">Outstanding Obligations</h3>
              <p className="text-xs text-[#8A8882]">Total: <span className="font-mono font-bold text-amber-400">GHS {totalObligations.toLocaleString()}</span></p>
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add Obligation
            </Button>
          </div>

          {obligations.map((obl, i) => (
            <Card key={i} className="border-[#2A2A38] bg-[#121218]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="critical" className="text-[10px] py-0 px-1.5">URGENT</Badge>
                      <span className="text-[10px] text-[#8A8882]">Due {obl.due}</span>
                    </div>
                    <h4 className="text-sm font-medium text-[#F7F5F0]">{obl.creditor}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold font-mono text-amber-400">GHS {obl.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-[#6E6C66]">GHS {obl.paid} paid</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={(obl.paid / obl.amount) * 100} className="h-1.5" indicatorClassName="bg-gradient-to-r from-emerald-600 to-emerald-400" />
                  <p className="text-[10px] text-[#6E6C66] mt-1">{Math.round((obl.paid / obl.amount) * 100)}% settled</p>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="border-[#1C1C28] bg-[#0E0E14] border-dashed">
            <CardContent className="p-4 text-center">
              <Button variant="ghost" size="sm" className="text-xs text-[#6E6C66] gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Creditor / Obligation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Income Log Tab ── */}
        <TabsContent value="income" className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#F7F5F0]">Income Records</h3>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="text-xs gap-1.5">
                <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-400" /> Log Income
              </Button>
              <Button variant="secondary" size="sm" className="text-xs gap-1.5">
                <ArrowUpRight className="h-3.5 w-3.5 text-red-400" /> Log Expense
              </Button>
            </div>
          </div>

          {incomeHistory.map((record, i) => (
            <Card key={i} className="border-[#232330] bg-[#121218]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F7F5F0]">{record.source}</p>
                      <p className="text-[10px] text-[#8A8882]">{record.date}</p>
                    </div>
                  </div>
                  <p className="text-base font-bold font-mono text-emerald-400">
                    +GHS {record.amount.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="text-center py-4 text-xs text-[#6E6C66]">
            Log every GHS received. This data powers trajectory forecasting.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
