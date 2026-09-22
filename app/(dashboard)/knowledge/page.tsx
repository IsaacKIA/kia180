'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  Lightbulb,
  Search,
  PlusCircle,
  ExternalLink,
  Plus,
  Sparkles,
  FileText,
  Tag,
  Trash2,
} from 'lucide-react';

interface KnowledgeItem {
  id: string;
  domain: string;
  title: string;
  takeaway: string;
  source: string;
  notes: string;
  date: string;
}

interface IdeaItem {
  id: string;
  title: string;
  category: string;
  status: 'captured' | 'exploring' | 'validating' | 'active';
  description: string;
  potential: string;
  capital: string;
  fit: number;
}

const DOMAINS = [
  'Business Strategy & Advisory',
  'Fundraising & Venture Capital',
  'Sales & Client Acquisition',
  'Personal Executive Performance',
];

const DEFAULT_IDEAS: IdeaItem[] = [
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
  const [activeTab, setActiveTab] = useState('domains');
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [ideas, setIdeas] = useState<IdeaItem[]>(DEFAULT_IDEAS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  // Modals state
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);

  // Insight form state
  const [insightDomain, setInsightDomain] = useState(DOMAINS[0]);
  const [insightTitle, setInsightTitle] = useState('');
  const [insightTakeaway, setInsightTakeaway] = useState('');
  const [insightSource, setInsightSource] = useState('');
  const [insightNotes, setInsightNotes] = useState('');

  // Idea form state
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaCategory, setIdeaCategory] = useState('Product');
  const [ideaDesc, setIdeaDesc] = useState('');
  const [ideaPotential, setIdeaPotential] = useState('');
  const [ideaCapital, setIdeaCapital] = useState('');

  // Load from localStorage
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('kia180_knowledge_items');
      if (savedItems) setItems(JSON.parse(savedItems));
      const savedIdeas = localStorage.getItem('kia180_ideas');
      if (savedIdeas) setIdeas(JSON.parse(savedIdeas));
    } catch {
      // Use defaults
    }
  }, []);

  const saveItems = (data: KnowledgeItem[]) => {
    setItems(data);
    try {
      localStorage.setItem('kia180_knowledge_items', JSON.stringify(data));
    } catch {}
  };

  const saveIdeas = (data: IdeaItem[]) => {
    setIdeas(data);
    try {
      localStorage.setItem('kia180_ideas', JSON.stringify(data));
    } catch {}
  };

  const handleAddInsight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insightTitle.trim()) return;

    const newItem: KnowledgeItem = {
      id: `k-${Date.now()}`,
      domain: insightDomain,
      title: insightTitle.trim(),
      takeaway: insightTakeaway.trim(),
      source: insightSource.trim() || 'Executive Reflection',
      notes: insightNotes.trim(),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    saveItems([newItem, ...items]);
    setInsightTitle('');
    setInsightTakeaway('');
    setInsightSource('');
    setInsightNotes('');
    setIsInsightModalOpen(false);
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim()) return;

    const newIdea: IdeaItem = {
      id: `i-${Date.now()}`,
      title: ideaTitle.trim(),
      category: ideaCategory,
      status: 'captured',
      description: ideaDesc.trim() || 'Captured idea awaiting exploratory review.',
      potential: ideaPotential.trim() || 'Under evaluation',
      capital: ideaCapital.trim() || 'Minimal',
      fit: 4,
    };

    saveIdeas([newIdea, ...ideas]);
    setIdeaTitle('');
    setIdeaDesc('');
    setIdeaPotential('');
    setIdeaCapital('');
    setIsIdeaModalOpen(false);
  };

  const openInsightForDomain = (domain: string) => {
    setInsightDomain(domain);
    setIsInsightModalOpen(true);
  };

  const filteredItems = items.filter((item) => {
    const matchesDomain = !selectedDomain || item.domain === selectedDomain;
    const matchesQuery =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.takeaway.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesQuery;
  });

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
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsInsightModalOpen(true)}
            className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs gap-1.5"
          >
            <PlusCircle className="h-3.5 w-3.5" /> Capture Insight
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-xs">
          <TabsTrigger value="domains">Knowledge Base ({items.length})</TabsTrigger>
          <TabsTrigger value="ideas">Idea Vault ({ideas.length})</TabsTrigger>
        </TabsList>

        {/* ── Knowledge Domains Tab ── */}
        <TabsContent value="domains" className="mt-4 space-y-5">
          {/* Domain Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DOMAINS.map((domain, i) => {
              const count = items.filter((it) => it.domain === domain).length;
              const isSelected = selectedDomain === domain;
              return (
                <Card
                  key={domain}
                  onClick={() => setSelectedDomain(isSelected ? null : domain)}
                  className={`border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#C9A84C] bg-[#1A1A24]'
                      : 'border-[#232330] bg-[#121218] hover:border-[#38384C]'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="h-8 w-8 rounded-lg bg-[#1C1C28] border border-[#2B2B3C] flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-[#C9A84C]" />
                      </div>
                      <Badge variant="outline" className="text-[9px] py-0 px-1.5">
                        {count} {count === 1 ? 'item' : 'items'}
                      </Badge>
                    </div>
                    <h3 className="text-xs font-semibold text-[#F7F5F0] mt-2.5 leading-snug line-clamp-2">
                      {domain}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openInsightForDomain(domain);
                      }}
                      className="w-full mt-3 text-[11px] text-[#8A8882] hover:text-[#DFBF65] hover:bg-[#1C1C26] gap-1 justify-start px-1.5 h-7"
                    >
                      <PlusCircle className="h-3 w-3" /> Add Insight
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Search bar & filter pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-3.5 w-3.5 text-[#6E6C66] absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search captured insights, notes, or tags..."
                className="pl-8 text-xs bg-[#0E0E14] border-[#222230]"
              />
            </div>
            {selectedDomain && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8A8882]">Filtered by:</span>
                <Badge variant="gold" className="text-xs gap-1 py-0.5">
                  {selectedDomain}
                  <button onClick={() => setSelectedDomain(null)} className="ml-1 hover:text-white">
                    ×
                  </button>
                </Badge>
              </div>
            )}
          </div>

          {/* Captured Items List or Empty State */}
          {filteredItems.length === 0 ? (
            <Card className="border-[#1C1C28] bg-[#0E0E14] border-dashed">
              <CardContent className="p-8 text-center space-y-3">
                <Search className="h-7 w-7 text-[#52514D] mx-auto" />
                <p className="text-sm font-medium text-[#F7F5F0]">
                  {items.length === 0 ? 'Your knowledge base is empty.' : 'No insights match your search filter.'}
                </p>
                <p className="text-xs text-[#7A7872] max-w-md mx-auto">
                  Every book chapter read, advisory conversation insight, or market observation captured here compounds into high-leverage authority.
                </p>
                <Button
                  size="sm"
                  onClick={() => setIsInsightModalOpen(true)}
                  className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold text-xs gap-1.5"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> Add First Knowledge Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className="border-[#232330] bg-[#121218]">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <Badge variant="outline" className="text-[10px] py-0 px-2 text-[#C9A84C] border-[#C9A84C]/30">
                        {item.domain}
                      </Badge>
                      <span className="text-[10px] text-[#6E6C66]">{item.date}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-[#F7F5F0] leading-snug">{item.title}</h4>

                    {item.takeaway && (
                      <div className="p-2.5 rounded bg-[#161622] border border-[#242436] text-xs text-[#DFBF65]">
                        <span className="text-[10px] font-semibold uppercase block mb-0.5 text-[#A3A099]">
                          Core Takeaway
                        </span>
                        {item.takeaway}
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-xs text-[#A3A099] leading-relaxed line-clamp-3">{item.notes}</p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#1C1C28] text-[10px] text-[#6E6C66]">
                      <span>Source: {item.source}</span>
                      <button
                        onClick={() => saveItems(items.filter((it) => it.id !== item.id))}
                        className="text-[#6E6C66] hover:text-red-400 p-1"
                        title="Delete insight"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Idea Vault Tab ── */}
        <TabsContent value="ideas" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#F7F5F0]">Captured Ideas</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsIdeaModalOpen(true)}
              className="text-xs gap-1.5 border-[#232332] text-[#DFBF65] hover:bg-[#14141D]"
            >
              <Lightbulb className="h-3.5 w-3.5" /> Capture Idea
            </Button>
          </div>

          <div className="space-y-3">
            {ideas.map((idea) => (
              <Card key={idea.id} className="border-[#232330] bg-[#121218]">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                            statusColors[idea.status] || 'text-[#8A8882]'
                          }`}
                        >
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
          </div>
        </TabsContent>
      </Tabs>

      {/* Capture Insight Modal */}
      <Dialog open={isInsightModalOpen} onOpenChange={setIsInsightModalOpen}>
        <DialogContent className="max-w-md bg-[#121217] border-[#2B2B3C]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#F7F5F0]">
              <Sparkles className="h-4 w-4 text-[#C9A84C]" /> Capture Strategic Insight
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddInsight} className="space-y-3 pt-2">
            <div>
              <label className="text-xs text-[#A3A099] font-medium">Domain</label>
              <select
                value={insightDomain}
                onChange={(e) => setInsightDomain(e.target.value)}
                className="w-full mt-1 p-2 rounded-md border border-[#2B2B3C] bg-[#0E0E14] text-xs text-[#F7F5F0]"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-[#A3A099] font-medium">Insight Title</label>
              <Input
                value={insightTitle}
                onChange={(e) => setInsightTitle(e.target.value)}
                placeholder="e.g. Founder Retainer Pricing Anchor Principle"
                className="mt-1"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs text-[#A3A099] font-medium">Core Takeaway</label>
              <Input
                value={insightTakeaway}
                onChange={(e) => setInsightTakeaway(e.target.value)}
                placeholder="e.g. Always quote outcomes, never hours or day-rates."
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <label className="text-xs text-[#A3A099] font-medium">Source</label>
              <Input
                value={insightSource}
                onChange={(e) => setInsightSource(e.target.value)}
                placeholder="e.g. Client Call, Peter Thiel Zero to One, AI Session"
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <label className="text-xs text-[#A3A099] font-medium">Detailed Notes / Application</label>
              <textarea
                value={insightNotes}
                onChange={(e) => setInsightNotes(e.target.value)}
                placeholder="How will you apply this to KIA Consult, Civitas, or personal execution?"
                className="w-full mt-1 p-2.5 rounded-md border border-[#2B2B3C] bg-[#0E0E14] text-xs text-[#F7F5F0] min-h-[70px] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsInsightModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold">
                Save Insight
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Capture Idea Modal */}
      <Dialog open={isIdeaModalOpen} onOpenChange={setIsIdeaModalOpen}>
        <DialogContent className="max-w-md bg-[#121217] border-[#2B2B3C]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#F7F5F0]">
              <Lightbulb className="h-4 w-4 text-[#DFBF65]" /> Capture Idea to Vault
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddIdea} className="space-y-3 pt-2">
            <div>
              <label className="text-xs text-[#A3A099] font-medium">Idea Name</label>
              <Input
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                placeholder="e.g. Fractional COO for West African Startups"
                className="mt-1"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs text-[#A3A099] font-medium">Category</label>
              <Input
                value={ideaCategory}
                onChange={(e) => setIdeaCategory(e.target.value)}
                placeholder="e.g. Service, SaaS, Marketplace, Media"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-[#A3A099] font-medium">Description & Opportunity</label>
              <textarea
                value={ideaDesc}
                onChange={(e) => setIdeaDesc(e.target.value)}
                placeholder="What problem does it solve? What is the execution model?"
                className="w-full mt-1 p-2.5 rounded-md border border-[#2B2B3C] bg-[#0E0E14] text-xs text-[#F7F5F0] min-h-[60px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#A3A099] font-medium">Revenue Potential</label>
                <Input
                  value={ideaPotential}
                  onChange={(e) => setIdeaPotential(e.target.value)}
                  placeholder="e.g. GHS 30k/mo"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-[#A3A099] font-medium">Capital Required</label>
                <Input
                  value={ideaCapital}
                  onChange={(e) => setIdeaCapital(e.target.value)}
                  placeholder="e.g. GHS 2,000"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsIdeaModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold">
                Store in Vault
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
