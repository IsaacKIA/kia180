'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Compass,
  Plus,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  User,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Filter,
} from 'lucide-react';

interface Deal {
  id: string;
  contact: string;
  company: string;
  service: string;
  business: 'kia' | 'civitas' | 'agrivora';
  value: number;
  stage: number; // 0 to 8
  daysInStage: number;
  notes: string;
}

const STAGES = [
  { id: 0, name: 'Lead Identified', short: 'Lead', probability: 10 },
  { id: 1, name: 'Initial Contact', short: 'Contact', probability: 20 },
  { id: 2, name: 'Discovery Call', short: 'Discovery', probability: 35 },
  { id: 3, name: 'Qualified', short: 'Qualified', probability: 50 },
  { id: 4, name: 'Solution Proposed', short: 'Proposal', probability: 65 },
  { id: 5, name: 'Negotiation', short: 'Negotiating', probability: 80 },
  { id: 6, name: 'Contract Sent', short: 'Contract', probability: 90 },
  { id: 7, name: 'Closed-Won', short: 'Won', probability: 100 },
  { id: 8, name: 'Closed-Lost', short: 'Lost', probability: 0 },
];

const INITIAL_DEALS: Deal[] = [
  {
    id: 'd-1',
    contact: 'Kofi Boateng',
    company: 'FinTrack Tech Ltd',
    service: 'Startup Advisory & Board Setup',
    business: 'kia',
    value: 3500,
    stage: 2,
    daysInStage: 2,
    notes: 'Needs help structuring investor pitch deck for seed round.',
  },
  {
    id: 'd-2',
    contact: 'Ama Mensah',
    company: 'EcoLogistics Ghana',
    service: 'Growth Audit & Strategy Retainer',
    business: 'kia',
    value: 5000,
    stage: 4,
    daysInStage: 1,
    notes: 'Proposal submitted for 3-month strategic advisory.',
  },
  {
    id: 'd-3',
    contact: 'Director Kwesi Appiah',
    company: 'Ga East Municipal Assembly',
    service: 'Civic Tech Governance Scoping',
    business: 'civitas',
    value: 12000,
    stage: 1,
    daysInStage: 4,
    notes: 'Exploratory outreach on revenue collection digitization.',
  },
];

export default function SalesPipelinePage() {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [selectedBusiness, setSelectedBusiness] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newService, setNewService] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newBusiness, setNewBusiness] = useState<'kia' | 'civitas' | 'agrivora'>('kia');

  const filteredDeals = deals.filter(
    (d) => selectedBusiness === 'all' || d.business === selectedBusiness
  );

  const totalPipelineValue = filteredDeals
    .filter((d) => d.stage !== 8)
    .reduce((sum, d) => sum + d.value, 0);

  const weightedPipelineValue = filteredDeals
    .filter((d) => d.stage !== 8)
    .reduce((sum, d) => sum + (d.value * STAGES[d.stage].probability) / 100, 0);

  const moveDeal = (id: string, delta: number) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const newStage = Math.max(0, Math.min(STAGES.length - 1, d.stage + delta));
        return { ...d, stage: newStage, daysInStage: 0 };
      })
    );
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact || !newValue) return;

    const deal: Deal = {
      id: `d-${Date.now()}`,
      contact: newContact,
      company: newCompany || 'Independent',
      service: newService || 'Strategic Advisory',
      business: newBusiness,
      value: parseFloat(newValue) || 0,
      stage: 0,
      daysInStage: 0,
      notes: 'Newly created lead',
    };

    setDeals([deal, ...deals]);
    setShowAddModal(false);
    setNewContact('');
    setNewCompany('');
    setNewService('');
    setNewValue('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1C28] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="h-5 w-5 text-[#C9A84C]" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F5F0]">
              Sales Pipeline
            </h1>
          </div>
          <p className="text-xs text-[#A3A099]">
            9-Stage Conversion Engine · KIA Consult · Civitas · Agrivora
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Add Deal
          </Button>
        </div>
      </div>

      {/* KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-[#232330] bg-[#121218]">
          <CardContent className="p-4">
            <p className="text-[11px] font-semibold text-[#8A8882] uppercase tracking-wider">
              Total Active Pipeline
            </p>
            <p className="text-2xl font-bold font-mono text-[#F7F5F0] mt-1">
              GHS {totalPipelineValue.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#A3A099] mt-0.5">
              {filteredDeals.filter((d) => d.stage < 7).length} opportunities in flight
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#232330] bg-[#121218]">
          <CardContent className="p-4">
            <p className="text-[11px] font-semibold text-[#8A8882] uppercase tracking-wider">
              Weighted Expected Cash
            </p>
            <p className="text-2xl font-bold font-mono text-[#DFBF65] mt-1">
              GHS {Math.round(weightedPipelineValue).toLocaleString()}
            </p>
            <p className="text-[10px] text-[#A3A099] mt-0.5">
              Adjusted by stage probability
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#232330] bg-[#121218]">
          <CardContent className="p-4">
            <p className="text-[11px] font-semibold text-[#8A8882] uppercase tracking-wider">
              Target Conversion Metric
            </p>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              3 Retainers
            </p>
            <p className="text-[10px] text-[#A3A099] mt-0.5">
              Phase 1 Milestone (GHS 9,000/mo min)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1C1C28] pb-3 overflow-x-auto">
        <span className="text-xs text-[#8A8882] flex items-center gap-1 shrink-0">
          <Filter className="h-3.5 w-3.5" /> Venture:
        </span>
        {(['all', 'kia', 'civitas', 'agrivora'] as const).map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBusiness(b)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              selectedBusiness === b
                ? 'bg-[#C9A84C]/20 text-[#DFBF65] border border-[#C9A84C]/40'
                : 'text-[#8A8882] hover:text-[#F7F5F0]'
            }`}
          >
            {b === 'all' ? 'All Ventures' : b.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 9-Stage Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-3 min-w-[1200px] w-full">
          {STAGES.map((stage) => {
            const stageDeals = filteredDeals.filter((d) => d.stage === stage.id);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div
                key={stage.id}
                className="w-72 flex-shrink-0 bg-[#0E0E14] border border-[#1C1C28] rounded-xl flex flex-col max-h-[750px]"
              >
                {/* Stage Header */}
                <div className="p-3 border-b border-[#1C1C28] bg-[#121218] rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F7F5F0] truncate">
                      {stage.name}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono py-0 px-1.5">
                      {stage.probability}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#8A8882] mt-1">
                    <span>{stageDeals.length} deals</span>
                    <span className="font-mono text-[#DFBF65]">
                      GHS {stageTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Deal Cards Container */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                  {stageDeals.map((deal) => (
                    <Card
                      key={deal.id}
                      className="border-[#232332] bg-[#14141C] hover:border-[#C9A84C]/40 transition-all shadow-sm"
                    >
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-1">
                          <Badge
                            variant="gold"
                            className="text-[9px] py-0 px-1 font-mono uppercase"
                          >
                            {deal.business}
                          </Badge>
                          <span className="text-[10px] text-[#8A8882] flex items-center gap-0.5">
                            <Calendar className="h-3 w-3" /> {deal.daysInStage}d
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-[#F7F5F0] leading-tight">
                            {deal.contact}
                          </h4>
                          <p className="text-[10px] text-[#8A8882] flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3" /> {deal.company}
                          </p>
                        </div>

                        <p className="text-[10px] text-[#A3A099] line-clamp-2">
                          {deal.service}
                        </p>

                        <div className="pt-2 border-t border-[#1F1F2B] flex items-center justify-between">
                          <span className="text-xs font-bold font-mono text-[#DFBF65]">
                            GHS {deal.value.toLocaleString()}
                          </span>

                          <div className="flex items-center gap-1">
                            {deal.stage > 0 && (
                              <button
                                onClick={() => moveDeal(deal.id, -1)}
                                className="p-1 rounded hover:bg-[#20202E] text-[#8A8882] hover:text-[#F7F5F0] transition-colors"
                                title="Move back"
                              >
                                <ArrowLeft className="h-3 w-3" />
                              </button>
                            )}
                            {deal.stage < STAGES.length - 1 && (
                              <button
                                onClick={() => moveDeal(deal.id, 1)}
                                className="p-1 rounded hover:bg-[#20202E] text-[#C9A84C] hover:text-[#DFBF65] transition-colors"
                                title="Advance stage"
                              >
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="h-24 flex items-center justify-center border border-dashed border-[#1C1C28] rounded-lg text-[11px] text-[#52514D]">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-[#C9A84C]/40 bg-[#121218]">
            <CardHeader className="border-b border-[#1C1C28] pb-4">
              <CardTitle className="text-base font-bold text-[#F7F5F0]">
                Add Opportunity to Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleAddDeal} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#8A8882] block mb-1">
                    Contact Name
                  </label>
                  <Input
                    required
                    placeholder="e.g. Samuel Adjei"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="bg-[#0E0E14] border-[#222230] text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#8A8882] block mb-1">
                    Company / Organization
                  </label>
                  <Input
                    placeholder="e.g. Apex FinTech Ltd"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="bg-[#0E0E14] border-[#222230] text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#8A8882] block mb-1">
                    Service / Offer
                  </label>
                  <Input
                    placeholder="e.g. Monthly Advisory Retainer"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="bg-[#0E0E14] border-[#222230] text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#8A8882] block mb-1">
                      Value (GHS)
                    </label>
                    <Input
                      required
                      type="number"
                      placeholder="3500"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className="bg-[#0E0E14] border-[#222230] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#8A8882] block mb-1">
                      Venture
                    </label>
                    <select
                      value={newBusiness}
                      onChange={(e) =>
                        setNewBusiness(e.target.value as 'kia' | 'civitas' | 'agrivora')
                      }
                      className="w-full h-9 rounded-md border border-[#222230] bg-[#0E0E14] px-3 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C9A84C]"
                    >
                      <option value="kia">KIA Consult</option>
                      <option value="civitas">Civitas</option>
                      <option value="agrivora">Agrivora</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#1C1C28]">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                    className="text-xs text-[#8A8882]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs"
                  >
                    Add to Pipeline
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
