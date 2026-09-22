'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Lightbulb,
  Plus,
  Star,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowRight,
  CheckCircle2,
  Archive,
  Sparkles,
  Filter,
} from 'lucide-react';

type IdeaStatus = 'captured' | 'exploring' | 'validating' | 'active' | 'parked' | 'rejected' | 'completed';

interface Idea {
  id: string;
  title: string;
  category: string;
  status: IdeaStatus;
  description: string;
  potential: string;
  capital: string;
  timeRequired: string;
  strategicFit: number; // 1-5
  capturedDate: string;
}

const IDEAS: Idea[] = [
  {
    id: 'i1',
    title: 'Startup Compliance SaaS',
    category: 'Product',
    status: 'exploring',
    description:
      'A lightweight SaaS platform that automates business registration, regulatory compliance tracking, and statutory filing for early-stage Ghanaian startups. Potential for regional expansion across West Africa.',
    potential: 'GHS 50,000+/year ARR',
    capital: 'GHS 15,000',
    timeRequired: '90 days MVP',
    strategicFit: 4,
    capturedDate: '2026-09-21',
  },
  {
    id: 'i2',
    title: 'Executive Alumni Network Accra',
    category: 'Network',
    status: 'captured',
    description:
      'Curated peer network for Accra-based founders and senior executives. Quarterly strategy dinners, private deal flow sharing, and accountability cohorts. Membership-based recurring revenue model.',
    potential: 'GHS 3,000/member/year, 50 members',
    capital: 'GHS 5,000 launch event',
    timeRequired: '60 days to launch',
    strategicFit: 5,
    capturedDate: '2026-09-21',
  },
  {
    id: 'i3',
    title: 'Agrivora Supply-Side Aggregation Platform',
    category: 'Agriculture',
    status: 'captured',
    description:
      'Digital platform connecting smallholder farmers directly to institutional buyers, eliminating middlemen. Revenue from transaction commission (5-8%) on verified off-take volumes.',
    potential: 'GHS 120,000+/year on 10% market share',
    capital: 'GHS 25,000',
    timeRequired: '6 months',
    strategicFit: 3,
    capturedDate: '2026-09-21',
  },
];

const STATUS_CONFIG: Record<IdeaStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  captured:   { label: 'Captured',   color: 'text-[#8A8882]',   bg: 'border-[#232334] bg-[#121218]',          icon: Lightbulb },
  exploring:  { label: 'Exploring',  color: 'text-sky-400',     bg: 'border-sky-500/30 bg-sky-950/10',        icon: Sparkles },
  validating: { label: 'Validating', color: 'text-amber-400',   bg: 'border-amber-500/30 bg-amber-950/10',   icon: CheckCircle2 },
  active:     { label: 'Active',     color: 'text-emerald-400', bg: 'border-emerald-500/30 bg-emerald-950/10', icon: TrendingUp },
  parked:     { label: 'Parked',     color: 'text-[#6E6C66]',   bg: 'border-[#1C1C28] bg-[#0E0E14]',          icon: Archive },
  rejected:   { label: 'Rejected',   color: 'text-red-400',     bg: 'border-red-900/40 bg-red-950/10',        icon: Archive },
  completed:  { label: 'Completed',  color: 'text-emerald-400', bg: 'border-emerald-900/40 bg-emerald-950/10', icon: CheckCircle2 },
};

const LIFECYCLE_STEPS: IdeaStatus[] = ['captured', 'exploring', 'validating', 'active', 'completed'];

const CRITICAL_RULE = `An idea NEVER auto-promotes to an active project. It must pass through exploring and validating phases first. 
No new major project without completing, cancelling, or parking another.`;

export default function IdeasPage() {
  const [activeTab, setActiveTab] = useState('vault');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>(IDEAS);
  const [showCapture, setShowCapture] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const activeCount = ideas.filter(i => i.status === 'active').length;
  const exploringCount = ideas.filter(i => i.status === 'exploring').length;

  const advanceStatus = (id: string) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== id) return idea;
      const idx = LIFECYCLE_STEPS.indexOf(idea.status as IdeaStatus);
      if (idx < LIFECYCLE_STEPS.length - 1) {
        return { ...idea, status: LIFECYCLE_STEPS[idx + 1] };
      }
      return idea;
    }));
  };

  const parkIdea = (id: string) => {
    setIdeas(prev => prev.map(idea => idea.id === id ? { ...idea, status: 'parked' } : idea));
  };

  const captureIdea = () => {
    if (!newTitle.trim()) return;
    const newIdea: Idea = {
      id: `i${Date.now()}`,
      title: newTitle,
      category: 'Uncategorized',
      status: 'captured',
      description: newDesc,
      potential: 'Unknown',
      capital: 'Unknown',
      timeRequired: 'Unknown',
      strategicFit: 3,
      capturedDate: new Date().toISOString().slice(0, 10),
    };
    setIdeas(prev => [newIdea, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setShowCapture(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1C28] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="h-5 w-5 text-[#C9A84C]" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F5F0]">
              Idea Vault
            </h1>
          </div>
          <p className="text-xs text-[#A3A099]">
            Capture everything · Promote nothing prematurely · Ideas earn activation
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowCapture(!showCapture)}
          className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" /> Capture Idea
        </Button>
      </div>

      {/* Critical Rule banner */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#14141C] border border-[#C9A84C]/20">
        <Sparkles className="h-4 w-4 text-[#C9A84C] shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-semibold text-[#DFBF65] uppercase tracking-wide mb-0.5">The Idea Vault Rule</p>
          <p className="text-xs text-[#A3A099] leading-relaxed">{CRITICAL_RULE}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Ideas', value: ideas.length, color: 'text-[#F7F5F0]' },
          { label: 'Exploring', value: exploringCount, color: 'text-sky-400' },
          { label: 'Active Projects', value: activeCount, color: activeCount >= 3 ? 'text-red-400' : 'text-emerald-400' },
        ].map(stat => (
          <Card key={stat.label} className="border-[#232330] bg-[#121218]">
            <CardContent className="p-3 text-center">
              <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-[#6E6C66] mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick capture form */}
      {showCapture && (
        <Card className="border-[#C9A84C]/40 bg-[#14141C]">
          <CardContent className="p-4 space-y-3">
            <p className="text-sm font-semibold text-[#DFBF65] flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[#C9A84C]" />
              Capture Before You Forget
            </p>
            <input
              className="w-full p-2.5 rounded-md border border-[#262634] bg-[#0E0E13] text-sm font-medium text-[#F7F5F0] placeholder:text-[#52514D] focus:outline-none focus:border-[#C9A84C] transition-colors"
              placeholder="Idea title (be specific)"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <textarea
              className="w-full p-3 rounded-md border border-[#262634] bg-[#0E0E13] text-xs text-[#F7F5F0] placeholder:text-[#52514D] focus:outline-none focus:border-[#C9A84C] resize-none min-h-[70px] transition-colors"
              placeholder="Brief description — what problem does it solve? What's the opportunity?"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={captureIdea} className="bg-[#C9A84C] text-[#0A0A0C] text-xs font-semibold">
                Save to Vault
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowCapture(false)} className="text-xs text-[#8A8882]">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Idea Cards */}
      <div className="space-y-3">
        {ideas.map(idea => {
          const config = STATUS_CONFIG[idea.status];
          const StatusIcon = config.icon;
          const isExpanded = expandedId === idea.id;
          const lifecycleIdx = LIFECYCLE_STEPS.indexOf(idea.status as IdeaStatus);
          const canAdvance = lifecycleIdx >= 0 && lifecycleIdx < LIFECYCLE_STEPS.length - 1 && idea.status !== 'parked';

          return (
            <Card key={idea.id} className={`border ${config.bg} transition-all`}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${config.color} ${config.bg}`}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5">{idea.category}</Badge>
                      <span className="text-[10px] text-[#6E6C66]">{idea.capturedDate}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#F7F5F0]">{idea.title}</h3>
                  </div>
                  {/* Strategic fit dots */}
                  <div className="flex items-center gap-1 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${i < idea.strategicFit ? 'bg-[#C9A84C]' : 'bg-[#1C1C28]'}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#A3A099] leading-relaxed mb-3">{idea.description}</p>

                {/* Metrics row */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { icon: TrendingUp, label: 'Potential', value: idea.potential, color: 'text-[#DFBF65]' },
                    { icon: DollarSign, label: 'Capital', value: idea.capital, color: 'text-[#F7F5F0]' },
                    { icon: Clock, label: 'Time', value: idea.timeRequired, color: 'text-[#F7F5F0]' },
                  ].map(m => (
                    <div key={m.label} className="p-2 rounded bg-[#0E0E14] border border-[#1C1C28]">
                      <m.icon className="h-3 w-3 text-[#6E6C66] mb-1" />
                      <p className={`text-xs font-medium ${m.color} leading-tight`}>{m.value}</p>
                      <p className="text-[10px] text-[#6E6C66]">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Lifecycle progress */}
                {lifecycleIdx >= 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1">
                      {LIFECYCLE_STEPS.map((step, i) => (
                        <React.Fragment key={step}>
                          <div
                            className={`h-1.5 rounded-full flex-1 ${
                              i <= lifecycleIdx ? 'bg-[#C9A84C]' : 'bg-[#1C1C28]'
                            }`}
                          />
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="flex justify-between text-[9px] text-[#52514D] mt-1">
                      {LIFECYCLE_STEPS.map(step => (
                        <span key={step} className="capitalize">{step}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {canAdvance && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => advanceStatus(idea.id)}
                      className="h-7 text-[11px] gap-1.5 border-[#C9A84C]/40 text-[#DFBF65] hover:bg-[#C9A84C]/10"
                    >
                      Advance to {LIFECYCLE_STEPS[lifecycleIdx + 1]} <ArrowRight className="h-3 w-3" />
                    </Button>
                  )}
                  {idea.status !== 'parked' && idea.status !== 'rejected' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => parkIdea(idea.id)}
                      className="h-7 text-[11px] text-[#6E6C66] hover:text-[#8A8882]"
                    >
                      <Archive className="h-3 w-3 mr-1" /> Park
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
