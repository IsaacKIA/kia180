'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
  Check,
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

interface Obligation {
  id: string;
  creditor: string;
  amount: number;
  paid: number;
  due: string;
  priority: 'urgent' | 'normal' | 'low';
}

interface Transaction {
  id: string;
  date: string;
  source: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

const trajectoryData = [
  { month: 'Sep', personal: 2000, target: 2000 },
  { month: 'Oct', personal: 2000, target: 4000 },
  { month: 'Nov', personal: 2000, target: 6500 },
  { month: 'Dec', personal: 2000, target: 9000 },
  { month: 'Jan', personal: 2000, target: 11500 },
  { month: 'Feb', personal: 2000, target: 13500 },
  { month: 'Mar', personal: 2000, target: 15000 },
];

const DEFAULT_OBLIGATIONS: Obligation[] = [
  { id: 'obl-1', creditor: 'Outstanding Debt Pool', amount: 7000, paid: 0, due: '2026-11-30', priority: 'urgent' },
];

const DEFAULT_INCOME: Transaction[] = [
  { id: 'tx-1', date: 'Sep 2026', source: 'Employment / Existing', amount: 2000, type: 'income', category: 'personal' },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [obligations, setObligations] = useState<Obligation[]>(DEFAULT_OBLIGATIONS);
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_INCOME);

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isOblModalOpen, setIsOblModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedObligation, setSelectedObligation] = useState<Obligation | null>(null);

  // Transaction form state
  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  const [txSource, setTxSource] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('personal');

  // Obligation form state
  const [oblCreditor, setOblCreditor] = useState('');
  const [oblAmount, setOblAmount] = useState('');
  const [oblDue, setOblDue] = useState('2026-11-30');
  const [oblPriority, setOblPriority] = useState<Obligation['priority']>('urgent');

  // Payment form state
  const [payAmount, setPayAmount] = useState('');

  // Load from localStorage
  useEffect(() => {
    try {
      const savedObl = localStorage.getItem('kia180_obligations');
      if (savedObl) setObligations(JSON.parse(savedObl));
      const savedTx = localStorage.getItem('kia180_transactions');
      if (savedTx) setTransactions(JSON.parse(savedTx));
    } catch {
      // Use defaults
    }
  }, []);

  const saveObligations = (data: Obligation[]) => {
    setObligations(data);
    try {
      localStorage.setItem('kia180_obligations', JSON.stringify(data));
    } catch {}
  };

  const saveTransactions = (data: Transaction[]) => {
    setTransactions(data);
    try {
      localStorage.setItem('kia180_transactions', JSON.stringify(data));
    } catch {}
  };

  const totalObligations = obligations.reduce((s, o) => s + (o.amount - o.paid), 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const liquidCash = Math.max(0, totalIncome - totalExpenses);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txSource.trim() || !txAmount) return;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      source: txSource.trim(),
      amount: parseFloat(txAmount) || 0,
      type: txType,
      category: txCategory,
    };

    saveTransactions([newTx, ...transactions]);
    setTxSource('');
    setTxAmount('');
    setIsTxModalOpen(false);
  };

  const handleAddObligation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oblCreditor.trim() || !oblAmount) return;

    const newObl: Obligation = {
      id: `obl-${Date.now()}`,
      creditor: oblCreditor.trim(),
      amount: parseFloat(oblAmount) || 0,
      paid: 0,
      due: oblDue || '2026-11-30',
      priority: oblPriority,
    };

    saveObligations([...obligations, newObl]);
    setOblCreditor('');
    setOblAmount('');
    setIsOblModalOpen(false);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedObligation || !payAmount) return;

    const amt = parseFloat(payAmount) || 0;
    const updated = obligations.map(o => {
      if (o.id !== selectedObligation.id) return o;
      return {
        ...o,
        paid: Math.min(o.amount, o.paid + amt),
      };
    });

    saveObligations(updated);
    // Also record as transaction
    const payTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      source: `Debt Payment: ${selectedObligation.creditor}`,
      amount: amt,
      type: 'expense',
      category: 'debt_repayment',
    };
    saveTransactions([payTx, ...transactions]);

    setPayAmount('');
    setSelectedObligation(null);
    setIsPayModalOpen(false);
  };

  const openNewTransaction = (type: 'income' | 'expense') => {
    setTxType(type);
    setIsTxModalOpen(true);
  };

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
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => openNewTransaction('income')}
            className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Log Transaction
          </Button>
        </div>
      </div>

      {/* Critical Cash Alert */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-red-800/60 bg-red-950/20">
        <ShieldAlert className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-300">⚡ Critical Cash Position</p>
          <p className="text-xs text-red-200/80 mt-0.5 leading-relaxed">
            Liquid cash is <span className="font-mono font-bold">GHS {liquidCash.toLocaleString()}</span> with{' '}
            <span className="font-mono font-bold">GHS {totalObligations.toLocaleString()}</span> in obligations pending.
            Priority: 2 client conversations today → minimum GHS 3,000 retainer within 7 days.
          </p>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Liquid Cash', value: `GHS ${liquidCash.toLocaleString()}`, sub: 'Immediate runway', icon: Wallet, color: liquidCash > 0 ? 'text-emerald-400' : 'text-red-400' },
          { label: 'Total Inflow', value: `GHS ${totalIncome.toLocaleString()}`, sub: 'vs GHS 15k target', icon: TrendingUp, color: 'text-amber-400' },
          { label: 'Outstanding Debt', value: `GHS ${totalObligations.toLocaleString()}`, sub: 'Phase 1 priority', icon: AlertTriangle, color: 'text-amber-400' },
          { label: 'Income Gap', value: `GHS ${Math.max(0, 15000 - totalIncome).toLocaleString()}/mo`, sub: 'To reach north star', icon: TrendingDown, color: 'text-[#8A8882]' },
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
          <TabsTrigger value="obligations">Obligations ({obligations.length})</TabsTrigger>
          <TabsTrigger value="income">Income Log ({transactions.length})</TabsTrigger>
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
              <p className="text-xs text-[#8A8882]">
                Total Remaining: <span className="font-mono font-bold text-amber-400">GHS {totalObligations.toLocaleString()}</span>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOblModalOpen(true)}
              className="text-xs gap-1.5 border-[#232332] text-[#DFBF65] hover:bg-[#14141D]"
            >
              <Plus className="h-3.5 w-3.5" /> Add Obligation
            </Button>
          </div>

          {obligations.map((obl) => {
            const pct = Math.round((obl.paid / obl.amount) * 100);
            return (
              <Card key={obl.id} className="border-[#2A2A38] bg-[#121218]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={obl.priority === 'urgent' ? 'critical' : 'default'}
                          className="text-[10px] py-0 px-1.5 uppercase"
                        >
                          {obl.priority}
                        </Badge>
                        <span className="text-[10px] text-[#8A8882]">Due {obl.due}</span>
                      </div>
                      <h4 className="text-sm font-medium text-[#F7F5F0]">{obl.creditor}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold font-mono text-amber-400">
                        GHS {(obl.amount - obl.paid).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-[#6E6C66]">GHS {obl.paid.toLocaleString()} paid of {obl.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <Progress
                        value={pct}
                        className="h-1.5"
                        indicatorClassName="bg-gradient-to-r from-emerald-600 to-emerald-400"
                      />
                      <p className="text-[10px] text-[#6E6C66] mt-1">{pct}% settled</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedObligation(obl);
                        setIsPayModalOpen(true);
                      }}
                      className="h-7 text-[11px] border-[#2A2A3A] hover:border-[#C9A84C] text-[#DFBF65]"
                    >
                      Record Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card
            onClick={() => setIsOblModalOpen(true)}
            className="border-[#1C1C28] bg-[#0E0E14] border-dashed hover:border-[#38384C] cursor-pointer transition-colors"
          >
            <CardContent className="p-4 text-center">
              <Button variant="ghost" size="sm" className="text-xs text-[#6E6C66] gap-1.5 pointer-events-none">
                <Plus className="h-3.5 w-3.5" /> Add Creditor / Obligation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Income Log Tab ── */}
        <TabsContent value="income" className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-[#F7F5F0]">Financial Records</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openNewTransaction('income')}
                className="text-xs gap-1.5 hover:text-emerald-300"
              >
                <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-400" /> Log Income
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openNewTransaction('expense')}
                className="text-xs gap-1.5 hover:text-red-300"
              >
                <ArrowUpRight className="h-3.5 w-3.5 text-red-400" /> Log Expense
              </Button>
            </div>
          </div>

          {transactions.map((record) => (
            <Card key={record.id} className="border-[#232330] bg-[#121218]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-full border flex items-center justify-center ${
                        record.type === 'income'
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      {record.type === 'income' ? (
                        <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F7F5F0]">{record.source}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[#8A8882]">{record.date}</span>
                        <span className="text-[10px] text-[#6E6C66] capitalize">· {record.category}</span>
                      </div>
                    </div>
                  </div>
                  <p
                    className={`text-base font-bold font-mono ${
                      record.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {record.type === 'income' ? '+' : '-'}GHS {record.amount.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="text-center py-4 text-xs text-[#6E6C66]">
            Log every GHS received or spent. This data powers trajectory forecasting.
          </div>
        </TabsContent>
      </Tabs>

      {/* Log Transaction Modal */}
      <Dialog open={isTxModalOpen} onOpenChange={setIsTxModalOpen}>
        <DialogContent className="max-w-md bg-[#121217] border-[#2B2B3C]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#F7F5F0]">
              {txType === 'income' ? (
                <>
                  <ArrowDownLeft className="h-4 w-4 text-emerald-400" /> Log Cash Inflow
                </>
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4 text-red-400" /> Log Cash Outflow
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTransaction} className="space-y-3 pt-2">
            <div className="flex rounded-lg bg-[#0A0A0E] p-1 border border-[#222230]">
              <button
                type="button"
                onClick={() => setTxType('income')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  txType === 'income'
                    ? 'bg-[#1C1C26] text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-[#8A8882]'
                }`}
              >
                Income (+)
              </button>
              <button
                type="button"
                onClick={() => setTxType('expense')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  txType === 'expense'
                    ? 'bg-[#1C1C26] text-red-300 border border-red-500/40 shadow-sm'
                    : 'text-[#8A8882]'
                }`}
              >
                Expense (-)
              </button>
            </div>

            <div>
              <label className="text-xs text-[#A3A099] font-medium">Source / Description</label>
              <Input
                value={txSource}
                onChange={(e) => setTxSource(e.target.value)}
                placeholder={txType === 'income' ? 'e.g. Client Consulting Retainer' : 'e.g. Server Hosting & Software'}
                className="mt-1"
                required
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#A3A099] font-medium">Amount (GHS)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  placeholder="0.00"
                  className="mt-1 font-mono font-medium"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-[#A3A099] font-medium">Category</label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full mt-1 p-2 rounded-md border border-[#2B2B3C] bg-[#0E0E14] text-xs text-[#F7F5F0]"
                >
                  <option value="personal">Personal</option>
                  <option value="kia_consult">KIA Consult</option>
                  <option value="civitas">Civitas</option>
                  <option value="agrivora">Agrivora</option>
                  <option value="debt_repayment">Debt Repayment</option>
                  <option value="operations">Operations</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsTxModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold">
                Record Transaction
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Obligation Modal */}
      <Dialog open={isOblModalOpen} onOpenChange={setIsOblModalOpen}>
        <DialogContent className="max-w-md bg-[#121217] border-[#2B2B3C]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#F7F5F0]">
              <AlertTriangle className="h-4 w-4 text-amber-400" /> Add Debt / Obligation
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddObligation} className="space-y-3 pt-2">
            <div>
              <label className="text-xs text-[#A3A099] font-medium">Creditor / Obligation Name</label>
              <Input
                value={oblCreditor}
                onChange={(e) => setOblCreditor(e.target.value)}
                placeholder="e.g. Bank Loan, Individual Lender, Rent Arrears"
                className="mt-1"
                required
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#A3A099] font-medium">Total Amount (GHS)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={oblAmount}
                  onChange={(e) => setOblAmount(e.target.value)}
                  placeholder="7000"
                  className="mt-1 font-mono font-medium"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-[#A3A099] font-medium">Priority</label>
                <select
                  value={oblPriority}
                  onChange={(e) => setOblPriority(e.target.value as Obligation['priority'])}
                  className="w-full mt-1 p-2 rounded-md border border-[#2B2B3C] bg-[#0E0E14] text-xs text-[#F7F5F0]"
                >
                  <option value="urgent">Urgent (Phase 1)</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-[#A3A099] font-medium">Due Date</label>
              <Input
                type="date"
                value={oblDue}
                onChange={(e) => setOblDue(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsOblModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold">
                Save Obligation
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Record Payment Modal */}
      {selectedObligation && (
        <Dialog open={isPayModalOpen} onOpenChange={setIsPayModalOpen}>
          <DialogContent className="max-w-md bg-[#121217] border-[#2B2B3C]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#F7F5F0]">
                <DollarSign className="h-4 w-4 text-emerald-400" /> Record Payment: {selectedObligation.creditor}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRecordPayment} className="space-y-3 pt-2">
              <p className="text-xs text-[#8A8882]">
                Outstanding Balance:{' '}
                <span className="font-mono font-bold text-amber-400">
                  GHS {(selectedObligation.amount - selectedObligation.paid).toLocaleString()}
                </span>
              </p>

              <div>
                <label className="text-xs text-[#A3A099] font-medium">Payment Amount (GHS)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="mt-1 font-mono font-medium"
                  required
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsPayModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold">
                  Confirm Payment
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
