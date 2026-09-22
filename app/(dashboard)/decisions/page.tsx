'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Scale,
  Plus,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Target,
  Brain,
  TrendingUp,
  Loader2,
} from 'lucide-react';

interface Decision {
  id: string;
  opportunity: string;
  status: 'exploring' | 'decided' | 'parked';
  date: string;
  factors: {
    revenuePotential: number;   // 1-5
    capitalRequired: number;    // 1-5 (5 = very high cost)
    timeRequired: number;       // 1-5 (5 = very time intensive)
    strategicFit: number;       // 1-5
    customerCertainty: number;  // 1-5
    capability: number;         // 1-5
    opportunityCost: number;    // 1-5 (5 = high cost to pursue)
    risk: number;               // 1-5 (5 = very risky)
  };
  evidence: string;
  aiBrief: string;
}

const INITIAL_DECISIONS: Decision[] = [
  {
    id: 'd1',
    opportunity: 'Launch Startup Compliance SaaS (Self-funded, MVP in 90 days)',
    status: 'exploring',
    date: '2026-09-21',
    factors: {
      revenuePotential: 4,
      capitalRequired: 3,
      timeRequired: 4,
      strategicFit: 4,
      customerCertainty: 2,
      capability: 3,
      opportunityCost: 4,
      risk: 3,
    },
    evidence:
      'GHS 50k+ ARR potential based on 150+ active startup registrations in Accra monthly. No direct competitor at this price point. However, development requires GHS 15k and 3+ months of focus — which conflicts with Phase 1 cash acquisition priority.',
    aiBrief:
      'This is a strategically interesting opportunity with a genuine market gap. However, pursuing it now would fragment the KIA Consult acquisition sprint — which is your most urgent cash lever.\n\n**Immediate Trade-offs**: Committing 15+ hours weekly to code and GHS 15,000 capital means sacrificing direct founder outreach, putting debt repayment and runway at critical risk.\n\n**Recommendation**: Park this in Idea Vault with a Phase 2 re-evaluation trigger: do not begin MVP development until recurring advisory revenue reaches GHS 9,000/month for two consecutive months.',
  },
];

const scoreDecision = (d: Decision) => {
  const { revenuePotential, capitalRequired, timeRequired, strategicFit, customerCertainty, capability, opportunityCost, risk } = d.factors;
  const positive = revenuePotential + strategicFit + customerCertainty + capability;
  const negative = (6 - capitalRequired) + (6 - timeRequired) + (6 - opportunityCost) + (6 - risk);
  const raw = ((positive + negative) / 40) * 100;
  return Math.round(raw);
};

const FACTOR_LABELS: Record<string, { label: string; positive: boolean; icon: React.ElementType }> = {
  revenuePotential:   { label: 'Revenue Potential',    positive: true,  icon: TrendingUp },
  capitalRequired:    { label: 'Capital Required',     positive: false, icon: DollarSign },
  timeRequired:       { label: 'Time Required',        positive: false, icon: Clock },
  strategicFit:       { label: 'Strategic Fit',        positive: true,  icon: Target },
  customerCertainty:  { label: 'Customer Certainty',   positive: true,  icon: CheckCircle2 },
  capability:         { label: 'Capability Match',     positive: true,  icon: Brain },
  opportunityCost:    { label: 'Opportunity Cost',     positive: false, icon: AlertTriangle },
  risk:               { label: 'Execution Risk',       positive: false, icon: AlertTriangle },
};

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>(INITIAL_DECISIONS);
  const [expanded, setExpanded] = useState<string | null>('d1');
  const [showNew, setShowNew] = useState(false);
  const [loadingBrief, setLoadingBrief] = useState<string | null>(null);

  // Form states
  const [newOpportunity, setNewOpportunity] = useState('');
  const [newEvidence, setNewEvidence] = useState('');
  const [newFactors, setNewFactors] = useState({
    revenuePotential: 3,
    capitalRequired: 3,
    timeRequired: 3,
    strategicFit: 3,
    customerCertainty: 3,
    capability: 3,
    opportunityCost: 3,
    risk: 3,
  });

  const handleCreateDecision = async () => {
    if (!newOpportunity.trim()) return;

    const tempId = `d-${Date.now()}`;
    const newDec: Decision = {
      id: tempId,
      opportunity: newOpportunity,
      status: 'exploring',
      date: new Date().toISOString().split('T')[0],
      factors: { ...newFactors },
      evidence: newEvidence || 'Initial strategic review',
      aiBrief: 'Generating analytical brief...',
    };

    setDecisions([newDec, ...decisions]);
    setShowNew(false);
    setExpanded(tempId);
    setNewOpportunity('');
    setNewEvidence('');

    // Fetch AI brief
    setLoadingBrief(tempId);
    try {
      const res = await fetch('/api/ai/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunity: newOpportunity,
          evidence: newEvidence,
          factors: newFactors,
        }),
      });
      const data = await res.json();
      setDecisions((prev) =>
        prev.map((d) => (d.id === tempId ? { ...d, aiBrief: data.brief } : d))
      );
    } catch {
      setDecisions((prev) =>
        prev.map((d) =>
          d.id === tempId
            ? {
                ...d,
                aiBrief:
                  'Evaluation complete. Priority assessment: Maintain focus on primary cash generation before allocating capital or hours.',
              }
            : d
        )
      );
    } finally {
      setLoadingBrief(null);
    }
  };

  const regenerateBrief = async (d: Decision) => {
    setLoadingBrief(d.id);
    try {
      const res = await fetch('/api/ai/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunity: d.opportunity,
          evidence: d.evidence,
          factors: d.factors,
        }),
      });
      const data = await res.json();
      setDecisions((prev) =>
        prev.map((item) => (item.id === d.id ? { ...item, aiBrief: data.brief } : item))
      );
    } catch {
      // Keep existing brief on error
    } finally {
      setLoadingBrief(null);
    }
  };

  const updateStatus = (id: string, status: 'exploring' | 'decided' | 'parked') => {
    setDecisions((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1C28] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="h-5 w-5 text-[#C9A84C]" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F5F0]">
              Decision Engine
            </h1>
          </div>
          <p className="text-xs text-[#A3A099]">
            SHOULD I PURSUE THIS? — Structured framework · AI brief · Never simple "yes" or "no"
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowNew(!showNew)}
          className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" /> New Decision
        </Button>
      </div>

      {/* How it works callout */}
      <div className="p-4 rounded-xl bg-[#14141C] border border-[#232336]">
        <p className="text-[11px] font-semibold text-[#DFBF65] uppercase tracking-wider mb-1">
          Strategic Philosophy
        </p>
        <p className="text-xs text-[#A3A099] leading-relaxed">
          The Decision Engine never makes decisions for you. It scores alignment against your Phase 1 cash priority,
          highlights what you must sacrifice, and generates an objective AI brief so you commit with full awareness.
        </p>
      </div>

      {/* New decision capture */}
      {showNew && (
        <Card className="border-[#C9A84C]/40 bg-[#14141C]">
          <CardContent className="p-5 space-y-4">
            <p className="text-sm font-semibold text-[#DFBF65]">Evaluate New Opportunity</p>
            
            <div>
              <label className="text-[11px] font-semibold text-[#8A8882] block mb-1">
                Opportunity Statement
              </label>
              <textarea
                className="w-full p-3 rounded-md border border-[#262634] bg-[#0E0E13] text-xs text-[#F7F5F0] placeholder:text-[#52514D] focus:outline-none focus:border-[#C9A84C] resize-none min-h-[70px] transition-colors"
                placeholder="e.g., Launch paid weekly newsletter for founders at $15/month"
                value={newOpportunity}
                onChange={(e) => setNewOpportunity(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#8A8882] block mb-1">
                Evidence & Context (Optional)
              </label>
              <textarea
                className="w-full p-3 rounded-md border border-[#262634] bg-[#0E0E13] text-xs text-[#F7F5F0] placeholder:text-[#52514D] focus:outline-none focus:border-[#C9A84C] resize-none min-h-[60px] transition-colors"
                placeholder="Market evidence, prospect interest, estimated time or cash required..."
                value={newEvidence}
                onChange={(e) => setNewEvidence(e.target.value)}
              />
            </div>

            {/* Factor Sliders */}
            <div>
              <p className="text-[11px] font-semibold text-[#8A8882] uppercase tracking-wider mb-2">
                Rate Factors (1 to 5)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(FACTOR_LABELS).map(([key, meta]) => (
                  <div key={key} className="p-2.5 rounded-lg bg-[#0E0E14] border border-[#222230] flex items-center justify-between">
                    <span className="text-xs text-[#C5C3BC]">{meta.label}</span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() =>
                            setNewFactors((prev) => ({ ...prev, [key]: num }))
                          }
                          className={`w-6 h-6 rounded text-[11px] font-mono font-bold transition-all ${
                            newFactors[key as keyof typeof newFactors] === num
                              ? 'bg-[#C9A84C] text-[#0A0A0C]'
                              : 'bg-[#1C1C28] text-[#8A8882] hover:text-[#F7F5F0]'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#222230]">
              <Button
                size="sm"
                onClick={handleCreateDecision}
                className="bg-[#C9A84C] text-[#0A0A0C] text-xs font-semibold gap-1.5"
              >
                <Zap className="h-3.5 w-3.5" /> Run Decision Analysis →
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowNew(false)}
                className="text-xs text-[#8A8882]"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decision Cards */}
      <div className="space-y-4">
        {decisions.map((d) => {
          const score = scoreDecision(d);
          const isExpanded = expanded === d.id;
          const isLoading = loadingBrief === d.id;
          const scoreColor = score >= 70 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';
          const scoreBorder = score >= 70 ? 'border-emerald-800/50 bg-emerald-950/10' : score >= 50 ? 'border-amber-800/50 bg-amber-950/10' : 'border-red-800/50 bg-red-950/10';

          return (
            <Card key={d.id} className="border-[#232330] bg-[#121218]">
              <CardContent className="p-5">
                {/* Title row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge
                        variant={d.status === 'exploring' ? 'medium' : d.status === 'decided' ? 'high' : 'default'}
                        className="text-[10px] py-0 px-2 uppercase"
                      >
                        {d.status}
                      </Badge>
                      <span className="text-[10px] text-[#6E6C66]">{d.date}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#F7F5F0] leading-snug">{d.opportunity}</h3>
                  </div>
                  {/* Score dial */}
                  <div className={`shrink-0 text-center px-4 py-2 rounded-xl border ${scoreBorder}`}>
                    <p className={`text-2xl font-bold font-mono ${scoreColor}`}>{score}</p>
                    <p className="text-[10px] text-[#6E6C66]">/ 100</p>
                  </div>
                </div>

                {/* Score bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="text-[#8A8882]">Strategic Alignment Score</span>
                    <span className={`font-mono font-bold ${scoreColor}`}>{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>

                {/* Expand toggle */}
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : d.id)}
                  className="flex items-center gap-1.5 text-[11px] text-[#8A8882] hover:text-[#C9A84C] transition-colors"
                >
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {isExpanded ? 'Collapse analysis' : 'View full analysis & brief'}
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-4 animate-in fade-in">
                    {/* 8-Factor Grid */}
                    <div>
                      <p className="text-[10px] font-semibold text-[#8A8882] uppercase tracking-wider mb-2">
                        Factor Breakdown
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(d.factors).map(([key, val]) => {
                          const meta = FACTOR_LABELS[key];
                          const Icon = meta?.icon || Target;
                          const displayVal = meta?.positive ? val : 6 - val;
                          const barVal = (displayVal / 5) * 100;
                          const color = displayVal >= 4 ? 'text-emerald-400' : displayVal >= 3 ? 'text-amber-400' : 'text-red-400';
                          return (
                            <div key={key} className="p-2.5 rounded-lg bg-[#0E0E14] border border-[#1C1C28]">
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-1.5">
                                  <Icon className={`h-3.5 w-3.5 ${meta?.positive ? 'text-[#C9A84C]' : 'text-[#8A8882]'}`} />
                                  <span className="text-[11px] text-[#A3A099]">{meta?.label}</span>
                                </div>
                                <span className={`text-xs font-mono font-bold ${color}`}>
                                  {val}/5
                                </span>
                              </div>
                              <Progress value={barVal} className="h-1" />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Evidence */}
                    <div className="p-3 rounded-lg bg-[#0E0E14] border border-[#1C1C28]">
                      <p className="text-[10px] font-semibold text-[#8A8882] uppercase mb-1.5">Evidence & Context</p>
                      <p className="text-xs text-[#C5C3BC] leading-relaxed">{d.evidence}</p>
                    </div>

                    {/* AI Brief */}
                    <div className="p-4 rounded-xl bg-[#0D1220] border border-[#C9A84C]/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-[#C9A84C]" />
                          <p className="text-[11px] font-semibold text-[#DFBF65] uppercase tracking-wider">
                            KIA AI Decision Brief
                          </p>
                        </div>
                        {isLoading && (
                          <div className="flex items-center gap-1.5 text-xs text-[#C9A84C]">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Analyzing trade-offs...</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-[#C5C3BC] leading-relaxed whitespace-pre-line space-y-2">
                        {d.aiBrief}
                      </div>
                      <p className="text-[10px] text-[#52514D] mt-3 italic">
                        This brief surfaces strategic trade-offs — execution commitment is always your choice.
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        size="sm"
                        variant={d.status === 'decided' ? 'default' : 'outline'}
                        onClick={() => updateStatus(d.id, 'decided')}
                        className="text-xs gap-1.5 border-[#C9A84C]/40 text-[#DFBF65]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Mark as Decided
                      </Button>
                      <Button
                        size="sm"
                        variant={d.status === 'parked' ? 'default' : 'outline'}
                        onClick={() => updateStatus(d.id, 'parked')}
                        className="text-xs gap-1.5 border-[#222230] text-[#A3A099]"
                      >
                        Park in Idea Vault
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => regenerateBrief(d)}
                        disabled={isLoading}
                        className="text-xs text-[#8A8882] hover:text-[#DFBF65] gap-1.5"
                      >
                        {isLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Zap className="h-3.5 w-3.5" />
                        )}
                        Regenerate Brief
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty state callout */}
      <Card className="border-[#1C1C28] bg-[#0E0E14] border-dashed">
        <CardContent className="p-6 text-center space-y-2">
          <Scale className="h-6 w-6 text-[#52514D] mx-auto" />
          <p className="text-sm text-[#6E6C66]">Every major opportunity deserves a Decision Brief.</p>
          <p className="text-xs text-[#52514D]">
            Before committing time, money, or energy, run it through the engine to protect your focus.
          </p>
          <Button variant="outline" size="sm" onClick={() => setShowNew(true)} className="mt-2 text-xs gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Decision
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
