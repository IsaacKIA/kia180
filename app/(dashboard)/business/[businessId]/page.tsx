'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Briefcase,
  Target,
  DollarSign,
  TrendingUp,
  FileText,
  Users,
  CheckCircle2,
  Calendar,
  ExternalLink,
} from 'lucide-react';

const VENTURES_DATA: Record<
  string,
  {
    name: string;
    role: string;
    status: string;
    description: string;
    revenueCurrent: number;
    revenueTarget: number;
    color: string;
    phase: string;
    mandate: string;
    deliverables: string[];
    priorityMilestones: { title: string; due: string; status: 'completed' | 'in_progress' | 'pending' }[];
  }
> = {
  kia: {
    name: 'KIA-Start Up Consult',
    role: 'Primary Cash Engine',
    status: 'Active Sprint',
    description:
      'Primary cash-generating vehicle. Startup advisory, business setup, pitch structuring, and funding readiness for African founders.',
    revenueCurrent: 100,
    revenueTarget: 25000,
    color: '#38BDF8',
    phase: 'Client Acquisition Sprint',
    mandate:
      'Generate immediate cash flow. Reach GHS 15,000/mo within 60 days via 3-5 high-value advisory retainers.',
    deliverables: [
      'Founders Board Advisory (Monthly Retainer: GHS 3,000 – 5,000)',
      'Startup Pitch & Deck Packaging (Project: GHS 2,500 – 4,000)',
      'Investment Readiness Audit (Sprint: GHS 3,500)',
    ],
    priorityMilestones: [
      { title: 'Outreach to 15 warm founder contacts', due: 'Week 1', status: 'in_progress' },
      { title: 'Sign first paid advisory client (min GHS 3k)', due: 'Week 2', status: 'pending' },
      { title: 'Establish standard advisory agreement template', due: 'Week 2', status: 'in_progress' },
      { title: 'Reach 3 active retainer clients (GHS 9k MRR)', due: 'Month 1', status: 'pending' },
    ],
  },
  civitas: {
    name: 'Civitas',
    role: 'Validation & Institutional',
    status: 'Market Testing',
    description:
      'Civic advisory & governance consulting — municipal technology, public service capacity building, and policy intelligence.',
    revenueCurrent: 0,
    revenueTarget: 15000,
    color: '#10B981',
    phase: 'Positioning & Validation',
    mandate:
      'Develop long-term institutional revenue without consuming daily execution bandwidth required for Phase 1 cash.',
    deliverables: [
      'Municipal Revenue Mobilization Blueprint',
      'Civic Tech Digitalization Feasibility Scoping',
      'Public Sector Strategic Workshop Facilitation',
    ],
    priorityMilestones: [
      { title: 'Identify 5 municipal decision-makers', due: 'Month 2', status: 'pending' },
      { title: 'Draft municipal service concept paper', due: 'Month 2', status: 'pending' },
      { title: 'Conduct discovery interviews with 2 local assemblies', due: 'Month 3', status: 'pending' },
    ],
  },
  agrivora: {
    name: 'Agrivora',
    role: 'Long-Term Growth Engine',
    status: 'Market Analysis',
    description:
      'Agribusiness value-chain optimization — supply aggregation, farm intelligence, and sustainable off-take arrangements.',
    revenueCurrent: 0,
    revenueTarget: 10000,
    color: '#F59E0B',
    phase: 'Value-Chain Mapping',
    mandate:
      'Map high-margin commodity flows. Build supply and buyer partnerships for scale in Phase 2 & 3.',
    deliverables: [
      'Commodity Off-Take Brokering & Aggregation',
      'Smallholder Traceability & Aggregation Systems',
      'Agri-Processing Margin Optimization Advisory',
    ],
    priorityMilestones: [
      { title: 'Map 3 viable commodity supply chains with >30% margin', due: 'Month 3', status: 'pending' },
      { title: 'Secure initial buyer letters of intent', due: 'Month 4', status: 'pending' },
    ],
  },
};

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = (params?.businessId as string)?.toLowerCase() || 'kia';

  const data = VENTURES_DATA[businessId] || VENTURES_DATA['kia'];
  const progressPct = Math.min(100, Math.round((data.revenueCurrent / data.revenueTarget) * 100));

  return (
    <div className="space-y-6">
      {/* Top navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/business')}
          className="text-xs gap-1.5 border-[#222230] text-[#A3A099] hover:text-[#F7F5F0]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Ventures
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C1C28] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F5F0]">
              {data.name}
            </h1>
            <Badge variant="gold" className="text-[10px] uppercase">
              {data.status}
            </Badge>
          </div>
          <p className="text-xs text-[#A3A099] max-w-2xl">{data.description}</p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-[#8A8882]">Monthly Revenue Goal</p>
          <p className="text-2xl font-bold font-mono text-[#DFBF65]">
            GHS {data.revenueTarget.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Revenue progress */}
      <Card className="border-[#232330] bg-[#121218]">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8A8882]">Revenue Progress</span>
            <span className="font-mono font-bold text-[#F7F5F0]">
              GHS {data.revenueCurrent.toLocaleString()} / GHS {data.revenueTarget.toLocaleString()} ({progressPct}%)
            </span>
          </div>
          <Progress value={Math.max(1, progressPct)} className="h-2" />
        </CardContent>
      </Card>

      {/* Mandate & Phase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-[#232330] bg-[#121218]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-[#C9A84C] tracking-wider flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" /> Core Mandate
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[#C5C3BC] leading-relaxed">
            {data.mandate}
          </CardContent>
        </Card>

        <Card className="border-[#232330] bg-[#121218]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-[#C9A84C] tracking-wider flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" /> Key Deliverables & Packages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.deliverables.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#C5C3BC]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#C9A84C] shrink-0 mt-0.5" />
                <span>{d}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Milestones */}
      <Card className="border-[#232330] bg-[#121218]">
        <CardHeader className="pb-3 border-b border-[#1C1C28]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-[#F7F5F0]">
              Execution Milestones
            </CardTitle>
            <Link href="/business/pipeline">
              <Button size="sm" variant="outline" className="text-xs gap-1 border-[#C9A84C]/40 text-[#DFBF65]">
                View Pipeline <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {data.priorityMilestones.map((m, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-[#0E0E14] border border-[#1C1C28]"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    m.status === 'completed'
                      ? 'bg-emerald-400'
                      : m.status === 'in_progress'
                      ? 'bg-amber-400'
                      : 'bg-zinc-600'
                  }`}
                />
                <span className="text-xs font-medium text-[#F7F5F0]">{m.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#8A8882] flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {m.due}
                </span>
                <Badge
                  variant={
                    m.status === 'completed'
                      ? 'high'
                      : m.status === 'in_progress'
                      ? 'medium'
                      : 'default'
                  }
                  className="text-[9px] uppercase py-0"
                >
                  {m.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
