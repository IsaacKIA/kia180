'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Lightbulb, Search, PlusCircle, ExternalLink, ArrowRight } from 'lucide-react';

const knowledgeDomains = [
  { name: 'Business Strategy & Advisory', items: 0, priority: 1 },
  { name: 'Fundraising & Venture Capital', items: 0, priority: 2 },
  { name: 'Sales & Client Acquisition', items: 0, priority: 3 },
  { name: 'Personal Executive Performance', items: 0, priority: 4 },
];

const ideas = [
  {
    id: 'i1',
    title: 'Startup Compliance SaaS',
    category: 'Product',
    status: 'captured',
    description: 'A lightweight SaaS platform that automates business registration, regulatory compliance tracking, and statutory filing for early-stage Ghanaian startups.',
    potential: 'GHS 50k+/year ARR potential',
    capital: 'GHS 15,000 development',
    fit: 4,
  },
  {
    id: 'i2',
    title: 'Executive Alumni Network Accra',
    category: 'Network',
    status: 'exploring',
    description: 'Curated peer network for Accra-based founders and senior executives. Quarterly dinners, private deal flow sharing, and accountability cohorts.',
    potential: 'GHS 3,000/member/year, 50 members',
    capital: 'GHS 5,000 launch event',
    fit: 5,
  },
];

const statusColors: Record<string, string> = {
  captured: 'text-[#8A8882] border-[#262634]',
  exploring: 'text-sky-400 border-sky-500/40',
  validating: 'text-amber-400 border-amber-500/40',
  active: 'text-emerald-400 border-emerald-500/40',
};

export default function KnowledgePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1C28] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F5F0]">
            Knowledge OS
          </h1>
          <p className="text-xs text-[#A3A099] mt-0.5">
            Research library · Idea vault · Learning sessions
          </p>
        </div>
        <Button size="sm" className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs gap-1.5 self-start sm:self-auto">
          <PlusCircle className="h-3.5 w-3.5" /> Capture Insight
        </Button>
      </div>

      <Tabs defaultValue="domains">
        <TabsList className="grid grid-cols-2 w-full max-w-xs">
          <TabsTrigger value="domains">Knowledge Domains</TabsTrigger>
          <TabsTrigger value="ideas">Idea Vault</TabsTrigger>
        </TabsList>

        {/* ── Knowledge Domains Tab ── */}
        <TabsContent value="domains" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {knowledgeDomains.map((domain, i) => (
              <Card key={i} className="border-[#232330] bg-[#121218] hover:border-[#38384C] transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-9 w-9 rounded-lg bg-[#1C1C28] border border-[#2B2B3C] flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <Badge variant="outline" className="text-[9px] py-0 px-1.5 shrink-0">
                      P{domain.priority}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-[#F7F5F0] mt-3">{domain.name}</h3>
                  <p className="text-[11px] text-[#6E6C66] mt-1">{domain.items} items captured</p>
                  <Button variant="ghost" size="sm" className="w-full mt-3 text-xs text-[#8A8882] hover:text-[#DFBF65] gap-1.5 justify-start">
                    <PlusCircle className="h-3 w-3" /> Add First Insight
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-[#1C1C28] bg-[#0E0E14] border-dashed">
            <CardContent className="p-6 text-center space-y-2">
              <Search className="h-6 w-6 text-[#52514D] mx-auto" />
              <p className="text-sm text-[#6E6C66]">Your knowledge base is empty.</p>
              <p className="text-xs text-[#52514D]">Every article read, insight captured, or research note stored here compounds into executive authority over 180 days.</p>
              <Button variant="outline" size="sm" className="mt-2 text-xs gap-1.5">
                <PlusCircle className="h-3.5 w-3.5" /> Add First Knowledge Item
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Idea Vault Tab ── */}
        <TabsContent value="ideas" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#F7F5F0]">Captured Ideas</h3>
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              <Lightbulb className="h-3.5 w-3.5" /> Capture Idea
            </Button>
          </div>

          {ideas.map((idea) => (
            <Card key={idea.id} className="border-[#232330] bg-[#121218]">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${statusColors[idea.status]}`}>
                        {idea.status}
                      </span>
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                        {idea.category}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-bold text-[#F7F5F0]">{idea.title}</h3>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full ${i < idea.fit ? 'bg-[#C9A84C]' : 'bg-[#1C1C28]'}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#A3A099] leading-relaxed mb-3">{idea.description}</p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-[#0E0E14] border border-[#1C1C28] text-xs">
                    <p className="text-[10px] text-[#6E6C66]">Revenue potential</p>
                    <p className="text-[#DFBF65] font-medium">{idea.potential}</p>
                  </div>
                  <div className="p-2 rounded bg-[#0E0E14] border border-[#1C1C28] text-xs">
                    <p className="text-[10px] text-[#6E6C66]">Capital required</p>
                    <p className="text-[#F7F5F0] font-medium">{idea.capital}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
