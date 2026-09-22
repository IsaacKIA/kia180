'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Briefcase,
  TrendingUp,
  Users,
  Target,
  ArrowUpRight,
  Plus,
  ChevronRight,
  DollarSign,
} from 'lucide-react';

const BUSINESSES = [
  {
    id: 'kia',
    name: 'KIA-Start Up Consult',
    role: 'cash_engine' as const,
    status: 'active' as const,
    description: 'Primary revenue vehicle — startup advisory, business setup, pitch structuring, funding readiness for founders.',
    revenue_current: 100,
    revenue_target: 25000,
    color: '#38BDF8',
    colorBg: 'border-sky-500/40 bg-sky-500/10',
    colorText: 'text-sky-300',
    phase: 'Client Acquisition Sprint',
    next_action: 'Convert 3 warm prospects to paid retainers this week',
    metrics: [
      { label: 'Active Clients', value: '0', target: '3' },
      { label: 'Pipeline Leads', value: '0', target: '15' },
      { label: 'Proposals Sent', value: '0', target: '3' },
    ],
  },
  {
    id: 'civitas',
    name: 'Civitas',
    role: 'validation' as const,
    status: 'active' as const,
    description: 'Civic advisory & governance consulting — municipal technology, local government capacity building, public service design.',
    revenue_current: 0,
    revenue_target: 15000,
    color: '#10B981',
    colorBg: 'border-emerald-500/40 bg-emerald-500/10',
    colorText: 'text-emerald-300',
    phase: 'Positioning & Validation',
    next_action: 'Define core service package and identify 5 target municipalities',
    metrics: [
      { label: 'Scoped Services', value: '0', target: '3' },
      { label: 'Municipal Contacts', value: '0', target: '5' },
      { label: 'Proposals Drafted', value: '0', target: '2' },
    ],
  },
  {
    id: 'agrivora',
    name: 'Agrivora',
    role: 'growth' as const,
    status: 'active' as const,
    description: 'Agribusiness value-chain optimization — supply aggregation, farm intelligence, processing and sustainable off-take arrangements.',
    revenue_current: 0,
    revenue_target: 10000,
    color: '#F59E0B',
    colorBg: 'border-amber-500/40 bg-amber-500/10',
    colorText: 'text-amber-300',
    phase: 'Market Analysis',
    next_action: 'Map 3 viable crop value-chains with margin potential > 30%',
    metrics: [
      { label: 'Supply Partners', value: '0', target: '5' },
      { label: 'Crop Chains Mapped', value: '0', target: '3' },
      { label: 'Buyer Relationships', value: '0', target: '3' },
    ],
  },
];

const LEAD_STAGES = [
  'lead', 'contacted', 'conversation', 'qualified', 'proposal', 'negotiation', 'won'
];

const initialLeads = [
  { id: 'l1', contact: 'Kofi Boateng', service: 'Startup Formation Package', business: 'kia', value: 2500, stage: 'lead', days: 0 },
  { id: 'l2', contact: 'Ama Mensah', service: 'Growth Audit & Strategy', business: 'kia', value: 5000, stage: 'lead', days: 0 },
];

const roleLabel: Record<string, string> = {
  cash_engine: '🔥 Cash Engine',
  validation: '🔬 Validation',
  growth: '🌱 Growth Engine',
};

export default function BusinessPage() {
  const [activeTab, setActiveTab] = useState('ventures');
  const [leads, setLeads] = useState(initialLeads);

  const advanceLead = (id: string) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const stageIdx = LEAD_STAGES.indexOf(l.stage);
        if (stageIdx < LEAD_STAGES.length - 1) {
          return { ...l, stage: LEAD_STAGES[stageIdx + 1] };
        }
        return l;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1C28] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F5F0]">
            Venture Command
          </h1>
          <p className="text-xs text-[#A3A099] mt-0.5">
            KIA-Start Up Consult · Civitas · Agrivora
          </p>
        </div>
        <Badge variant="gold" className="text-xs px-3 py-1 self-start sm:self-auto">
          Combined Target: GHS 50,000/mo
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-xs">
          <TabsTrigger value="ventures">Ventures (3)</TabsTrigger>
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
        </TabsList>

        {/* ── Ventures Tab ── */}
        <TabsContent value="ventures" className="space-y-4 mt-4">
          {BUSINESSES.map((biz) => {
            const pct = Math.min(100, Math.round((biz.revenue_current / biz.revenue_target) * 100));
            return (
              <Card key={biz.id} className={`border bg-[#121218] ${biz.colorBg}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 text-black"
                        style={{ backgroundColor: biz.color }}
                      >
                        {biz.name.split(' ').map((w) => w[0]).join('').slice(0, 3)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#F7F5F0]">{biz.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-[#8A8882]">{roleLabel[biz.role]}</span>
                          <Badge variant="default" className="text-[10px] py-0 px-1.5">Active</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-lg font-bold font-mono ${biz.colorText}`}>
                        GHS {biz.revenue_current.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-[#8A8882]">of GHS {biz.revenue_target.toLocaleString()}/mo</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#A3A099] leading-relaxed mb-3">{biz.description}</p>

                  {/* Revenue progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-[#8A8882]">Revenue Runway</span>
                      <span className={`font-mono font-bold ${biz.colorText}`}>{pct}%</span>
                    </div>
                    <Progress
                      value={Math.max(0.3, pct)}
                      className="h-2"
                      indicatorClassName={`bg-[${biz.color}]`}
                    />
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {biz.metrics.map((metric) => (
                      <div key={metric.label} className="p-2 rounded-lg bg-[#0E0E14] border border-[#1C1C28] text-center">
                        <p className="text-base font-bold font-mono text-[#F7F5F0]">{metric.value}</p>
                        <p className="text-[10px] text-[#6E6C66]">{metric.label}</p>
                        <p className="text-[9px] text-[#8A8882]">Target: {metric.target}</p>
                      </div>
                    ))}
                  </div>

                  {/* Active Phase */}
                  <div className="p-3 rounded-lg bg-[#0E0E14] border border-[#1C1C28] space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#DFBF65] uppercase tracking-wide">
                      <Target className="h-3.5 w-3.5 text-[#C9A84C]" />
                      Current Phase: {biz.phase}
                    </div>
                    <div className="flex items-start gap-1.5 text-xs text-[#C5C3BC]">
                      <ChevronRight className="h-3.5 w-3.5 text-[#C9A84C] shrink-0 mt-0.5" />
                      <span>{biz.next_action}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link href={`/business/${biz.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 gap-1 border-[#C9A84C]/40 text-[#DFBF65] hover:bg-[#C9A84C]/10"
                      >
                        Venture Workspace <ChevronRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* ── Sales Pipeline Tab ── */}
        <TabsContent value="pipeline" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#F7F5F0]">Sales Pipeline — KIA Consult</h3>
                <p className="text-xs text-[#8A8882]">9-stage conversion funnel</p>
              </div>
              <Button size="sm" className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Lead
              </Button>
            </div>

            {/* Stage Labels */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 text-[9px] text-center text-[#6E6C66] uppercase tracking-wider">
              {LEAD_STAGES.map((stage) => (
                <div key={stage} className="p-1 rounded bg-[#14141C] border border-[#1C1C28]">
                  {stage}
                </div>
              ))}
            </div>

            {/* Lead Cards */}
            <div className="space-y-3">
              {leads.map((lead) => {
                const stageIdx = LEAD_STAGES.indexOf(lead.stage);
                const stagePct = ((stageIdx + 1) / LEAD_STAGES.length) * 100;
                return (
                  <Card key={lead.id} className="border-[#232330] bg-[#121218]">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="gold" className="text-[10px] py-0 px-2 capitalize">
                              {lead.stage}
                            </Badge>
                            <span className="text-[10px] text-[#8A8882]">KIA Consult</span>
                          </div>
                          <h4 className="text-sm font-semibold text-[#F7F5F0]">{lead.contact}</h4>
                          <p className="text-xs text-[#A3A099]">{lead.service}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base font-bold font-mono text-[#DFBF65]">
                            GHS {lead.value.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-[#6E6C66]">Est. value</p>
                        </div>
                      </div>

                      <div className="space-y-1 mb-3">
                        <Progress value={stagePct} className="h-1.5" />
                        <p className="text-[10px] text-[#6E6C66]">
                          Stage {stageIdx + 1} of {LEAD_STAGES.length}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#8A8882]">Day {lead.days} in pipeline</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => advanceLead(lead.id)}
                          className="h-7 text-[11px] gap-1.5 border-[#C9A84C]/40 text-[#DFBF65] hover:bg-[#C9A84C]/10"
                        >
                          Advance Stage <ArrowUpRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {leads.length === 0 && (
                <div className="text-center py-10 text-[#6E6C66] text-xs">
                  No active leads. Start your 15-prospect outreach to fill this pipeline.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
