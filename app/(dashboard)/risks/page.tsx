'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  Eye,
  CheckCircle2,
  ArrowRight,
  Plus,
  Edit2,
  Check,
} from 'lucide-react';

interface RiskItem {
  id: string;
  title: string;
  category: 'cash' | 'execution' | 'revenue' | 'focus' | 'time' | 'reputation' | 'opportunity';
  level: 'critical' | 'high' | 'elevated' | 'low';
  trend: 'stable' | 'improving' | 'worsening';
  evidence: string;
  cause: string;
  mitigation: string;
  review_date: string;
  daysUntilReview: number;
}

const DEFAULT_RISKS: RiskItem[] = [
  {
    id: 'r1',
    title: 'Cash Runway Deficit',
    category: 'cash',
    level: 'critical',
    trend: 'stable',
    evidence: 'Liquid cash = GHS 0. Monthly expenses and obligations = GHS 7,000+ outstanding. No client retainer income yet.',
    cause: 'Under-monetized consulting services and insufficient outreach to prospective clients.',
    mitigation: '2 founder discovery conversations per day until 3 retainers closed. First retainer target: GHS 3,000 within 7 days.',
    review_date: '2026-09-28',
    daysUntilReview: 7,
  },
  {
    id: 'r2',
    title: 'Pre-Start Friction & Execution Delay',
    category: 'execution',
    level: 'high',
    trend: 'improving',
    evidence: 'Historical pattern of delaying high-leverage business tasks. Committed actions often deferred.',
    cause: 'Cognitive friction — unclear first steps, fear of imperfect output, and low perceived immediate reward.',
    mitigation: 'Apply 5-minute launch rule to every hesitation trigger. Use AI resistance decomposition before deferring any task.',
    review_date: '2026-09-28',
    daysUntilReview: 7,
  },
  {
    id: 'r3',
    title: 'Revenue Concentration Risk',
    category: 'revenue',
    level: 'elevated',
    trend: 'stable',
    evidence: 'All near-term income plan depends on KIA Consult retainers. No Civitas or Agrivora revenue scheduled before November.',
    cause: 'Sequential venture activation strategy — correct but creates dependency on single vehicle.',
    mitigation: 'Execute Civitas positioning in parallel with KIA outreach from Week 3 onwards.',
    review_date: '2026-10-05',
    daysUntilReview: 14,
  },
];

const levelStyles: Record<string, { badge: 'critical' | 'high' | 'medium' | 'default'; glow: string; icon: string }> = {
  critical: { badge: 'critical', glow: 'border-red-800/60 bg-red-950/20', icon: 'text-red-400' },
  high: { badge: 'high', glow: 'border-orange-800/50 bg-orange-950/15', icon: 'text-orange-400' },
  elevated: { badge: 'medium', glow: 'border-amber-800/50 bg-amber-950/15', icon: 'text-amber-400' },
  low: { badge: 'default', glow: 'border-[#232330] bg-[#121218]', icon: 'text-emerald-400' },
};

const categoryColors: Record<string, string> = {
  cash: 'text-red-400',
  execution: 'text-amber-400',
  revenue: 'text-sky-400',
  focus: 'text-purple-400',
  time: 'text-blue-400',
  reputation: 'text-emerald-400',
  opportunity: 'text-teal-400',
};

export default function RisksPage() {
  const [risks, setRisks] = useState<RiskItem[]>(DEFAULT_RISKS);
  const [expandedId, setExpandedId] = useState<string | null>('r1');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<RiskItem | null>(null);

  // New risk form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<RiskItem['category']>('cash');
  const [newLevel, setNewLevel] = useState<RiskItem['level']>('high');
  const [newEvidence, setNewEvidence] = useState('');
  const [newCause, setNewCause] = useState('');
  const [newMitigation, setNewMitigation] = useState('');

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kia180_risks');
      if (saved) {
        setRisks(JSON.parse(saved));
      }
    } catch {
      // Use defaults
    }
  }, []);

  const saveRisks = (updated: RiskItem[]) => {
    setRisks(updated);
    try {
      localStorage.setItem('kia180_risks', JSON.stringify(updated));
    } catch {
      // Storage error ignored
    }
  };

  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: RiskItem = {
      id: `r-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      level: newLevel,
      trend: 'stable',
      evidence: newEvidence.trim() || 'Identified during strategic review session.',
      cause: newCause.trim() || 'Early-stage systemic condition.',
      mitigation: newMitigation.trim() || 'Daily execution review and strategic mitigation plan.',
      review_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      daysUntilReview: 7,
    };

    saveRisks([item, ...risks]);
    setNewTitle('');
    setNewEvidence('');
    setNewCause('');
    setNewMitigation('');
    setIsAddOpen(false);
    setExpandedId(item.id);
  };

  const handleUpdateRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRisk) return;

    const updated = risks.map((r) => (r.id === editingRisk.id ? editingRisk : r));
    saveRisks(updated);
    setEditingRisk(null);
  };

  const criticalCount = risks.filter((r) => r.level === 'critical').length;
  const highCount = risks.filter((r) => r.level === 'high').length;
  const elevatedCount = risks.filter((r) => r.level === 'elevated').length;
  const lowCount = risks.filter((r) => r.level === 'low').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1C28] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="h-5 w-5 text-red-400" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F5F0]">
              Risk Radar
            </h1>
          </div>
          <p className="text-xs text-[#A3A099] mt-0.5">
            Strategic threat map · Mitigation actions · Review schedule
          </p>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <Badge variant="critical" className="text-xs px-3 py-1">
              {criticalCount} Critical
            </Badge>
          )}
          {highCount > 0 && (
            <Badge variant="high" className="text-xs px-3 py-1">
              {highCount} High
            </Badge>
          )}
          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs gap-1.5 ml-2"
          >
            <Plus className="h-3.5 w-3.5" /> Log New Risk
          </Button>
        </div>
      </div>

      {/* Overall Risk Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Critical', count: criticalCount, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
          { label: 'High', count: highCount, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
          { label: 'Elevated', count: elevatedCount, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
          { label: 'Low / Watch', count: lowCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
        ].map((item) => (
          <div key={item.label} className={`p-3 rounded-xl border ${item.bg} text-center`}>
            <p className={`text-2xl font-bold font-mono ${item.color}`}>{item.count}</p>
            <p className="text-[11px] text-[#8A8882] font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Risk Cards */}
      <div className="space-y-3">
        {risks.map((risk) => {
          const style = levelStyles[risk.level] || levelStyles.low;
          const isExpanded = expandedId === risk.id;
          const TrendIcon = risk.trend === 'improving' ? TrendingDown : risk.trend === 'worsening' ? TrendingUp : Minus;
          const trendColor = risk.trend === 'improving' ? 'text-emerald-400' : risk.trend === 'worsening' ? 'text-red-400' : 'text-amber-400';

          return (
            <Card key={risk.id} className={`border ${style.glow} transition-all`}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 shrink-0 ${style.icon}`} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge variant={style.badge} className="text-[10px] py-0 px-2 uppercase font-bold">
                          {risk.level}
                        </Badge>
                        <span className={`text-[11px] font-semibold uppercase ${categoryColors[risk.category] || 'text-[#8A8882]'}`}>
                          {risk.category}
                        </span>
                        <div className={`flex items-center gap-1 text-[11px] ${trendColor}`}>
                          <TrendIcon className="h-3 w-3" />
                          <span className="capitalize">{risk.trend}</span>
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-[#F7F5F0]">{risk.title}</h3>
                    </div>
                  </div>
                  <div className="text-right shrink-0 text-[10px] text-[#6E6C66]">
                    Review in {risk.daysUntilReview}d
                  </div>
                </div>

                <p className="text-xs text-[#A3A099] leading-relaxed mb-3">{risk.evidence}</p>

                {isExpanded && (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="p-3 rounded-lg bg-[#0E0E14] border border-[#1C1C28]">
                      <p className="text-[10px] font-semibold text-[#8A8882] uppercase mb-1">Root Cause</p>
                      <p className="text-xs text-[#C5C3BC]">{risk.cause}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#0A1A12] border border-emerald-900/50">
                      <p className="text-[10px] font-semibold text-emerald-400 uppercase mb-1 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Active Mitigation
                      </p>
                      <p className="text-xs text-emerald-100/80">{risk.mitigation}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#1C1C26]">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : risk.id)}
                    className="text-[11px] text-[#8A8882] hover:text-[#C9A84C] flex items-center gap-1 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    {isExpanded ? 'Collapse' : 'View Cause & Mitigation'}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingRisk(risk)}
                    className="h-6 text-[11px] text-[#7A7872] hover:text-[#DFBF65] gap-1 px-2"
                  >
                    <Edit2 className="h-3 w-3" /> Update Risk <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddOpen(true)}
          className="text-xs gap-1.5 border-[#232332] text-[#DFBF65] hover:bg-[#14141D]"
        >
          <Plus className="h-3.5 w-3.5" /> Log New Risk
        </Button>
      </div>

      {/* Log New Risk Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md bg-[#121217] border-[#2B2B3C]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#F7F5F0]">
              <ShieldAlert className="h-4 w-4 text-red-400" /> Log New Strategic Risk
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddRisk} className="space-y-3 pt-2">
            <div>
              <label className="text-xs text-[#A3A099] font-medium">Risk Title</label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Municipal Budget Delay on Civitas"
                className="mt-1"
                required
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#A3A099] font-medium">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as RiskItem['category'])}
                  className="w-full mt-1 p-2 rounded-md border border-[#2B2B3C] bg-[#0E0E14] text-xs text-[#F7F5F0]"
                >
                  <option value="cash">Cash</option>
                  <option value="execution">Execution</option>
                  <option value="revenue">Revenue</option>
                  <option value="focus">Focus</option>
                  <option value="time">Time</option>
                  <option value="reputation">Reputation</option>
                  <option value="opportunity">Opportunity</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#A3A099] font-medium">Severity Level</label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value as RiskItem['level'])}
                  className="w-full mt-1 p-2 rounded-md border border-[#2B2B3C] bg-[#0E0E14] text-xs text-[#F7F5F0]"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="elevated">Elevated</option>
                  <option value="low">Low / Watch</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-[#A3A099] font-medium">Evidence & Symptoms</label>
              <textarea
                value={newEvidence}
                onChange={(e) => setNewEvidence(e.target.value)}
                placeholder="What data or observations indicate this is a threat?"
                className="w-full mt-1 p-2.5 rounded-md border border-[#2B2B3C] bg-[#0E0E14] text-xs text-[#F7F5F0] min-h-[60px] resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-[#A3A099] font-medium">Root Cause</label>
              <textarea
                value={newCause}
                onChange={(e) => setNewCause(e.target.value)}
                placeholder="Underlying structural driver of this risk..."
                className="w-full mt-1 p-2.5 rounded-md border border-[#2B2B3C] bg-[#0E0E14] text-xs text-[#F7F5F0] min-h-[50px] resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-[#A3A099] font-medium">Active Mitigation Plan</label>
              <textarea
                value={newMitigation}
                onChange={(e) => setNewMitigation(e.target.value)}
                placeholder="Specific action taken to neutralize or limit exposure..."
                className="w-full mt-1 p-2.5 rounded-md border border-[#2B2B3C] bg-[#0E0E14] text-xs text-[#F7F5F0] min-h-[50px] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold">
                Save to Radar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Risk Modal */}
      {editingRisk && (
        <Dialog open={!!editingRisk} onOpenChange={() => setEditingRisk(null)}>
          <DialogContent className="max-w-md bg-[#121217] border-[#2B2B3C]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#F7F5F0]">
                <Edit2 className="h-4 w-4 text-[#DFBF65]" /> Update Risk: {editingRisk.title}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateRisk} className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#A3A099] font-medium">Severity Level</label>
                  <select
                    value={editingRisk.level}
                    onChange={(e) => setEditingRisk({ ...editingRisk, level: e.target.value as RiskItem['level'] })}
                    className="w-full mt-1 p-2 rounded-md border border-[#2B2B3C] bg-[#0E0E14] text-xs text-[#F7F5F0]"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="elevated">Elevated</option>
                    <option value="low">Low / Watch</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#A3A099] font-medium">Trend</label>
                  <select
                    value={editingRisk.trend}
                    onChange={(e) => setEditingRisk({ ...editingRisk, trend: e.target.value as RiskItem['trend'] })}
                    className="w-full mt-1 p-2 rounded-md border border-[#2B2B3C] bg-[#0E0E14] text-xs text-[#F7F5F0]"
                  >
                    <option value="improving">Improving</option>
                    <option value="stable">Stable</option>
                    <option value="worsening">Worsening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#A3A099] font-medium">Active Mitigation Plan</label>
                <textarea
                  value={editingRisk.mitigation}
                  onChange={(e) => setEditingRisk({ ...editingRisk, mitigation: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-md border border-[#2B2B3C] bg-[#0E0E14] text-xs text-[#F7F5F0] min-h-[70px] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingRisk(null)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold">
                  Update Risk
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
