'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Flame,
  PlusCircle,
  ArrowRight,
  Zap,
  Loader2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const weeklyData = [
  { day: 'Mon', commitment: 0, target: 80 },
  { day: 'Tue', commitment: 0, target: 80 },
  { day: 'Wed', commitment: 0, target: 80 },
  { day: 'Thu', commitment: 0, target: 80 },
  { day: 'Fri', commitment: 0, target: 80 },
  { day: 'Sat', commitment: 0, target: 80 },
  { day: 'Sun', commitment: 0, target: 80 },
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState('daily');
  const [dailyReview, setDailyReview] = useState({
    completed: '',
    avoided: '',
    moneyMoved: '',
    built: '',
    learned: '',
    distracted: '',
    tomorrowOne: '',
    energyStart: 'medium',
    energyEnd: 'medium',
  });
  const [submitted, setSubmitted] = useState(false);
  const [recommendations, setRecommendations] = useState<Array<{
    title: string;
    rationale: string;
    impact: string;
    effortHours: number;
    firstMicroStep: string;
  }>>([
    {
      title: 'Direct Outreach to 5 Warm Founders',
      rationale: 'Fastest path to first GHS 3,000 retainer to cover immediate obligations.',
      impact: 'critical',
      effortHours: 3,
      firstMicroStep: 'Draft a 3-sentence message to the top contact on your list.',
    },
    {
      title: 'Publish 1 Strategic Thought Leadership Post on LinkedIn',
      rationale: 'Build credibility and attract incoming advisory inquiries for KIA Consult.',
      impact: 'high',
      effortHours: 1.5,
      firstMicroStep: 'Write the hook and outline the key takeaway in your notes.',
    },
  ]);
  const [loadingAi, setLoadingAi] = useState(false);

  const fetchAiDirectives = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/recommendations', { method: 'POST' });
      const data = await res.json();
      if (data.recommendations?.length) {
        setRecommendations(data.recommendations);
      }
    } catch {
      // Keep existing recommendations
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSubmitReview = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const commitmentRate = 0; // Day 1 — no data yet

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1C28] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F5F0]">
            Executive Reviews
          </h1>
          <p className="text-xs text-[#A3A099] mt-0.5">
            Daily · Weekly CEO Review · Accountability Loop
          </p>
        </div>
        <Badge variant="gold" className="text-xs px-3 py-1 self-start sm:self-auto font-mono">
          Day 1 / Week 1
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-xs">
          <TabsTrigger value="daily">Daily Review</TabsTrigger>
          <TabsTrigger value="weekly">Weekly CEO</TabsTrigger>
        </TabsList>

        {/* ── Daily Review Tab ── */}
        <TabsContent value="daily" className="mt-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#14141C] border border-[#C9A84C]/30">
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-[#DFBF65] uppercase tracking-wider">
              <Flame className="h-4 w-4 text-[#C9A84C]" />
              End-of-Day Executive Debrief — Day 1
            </div>
            <p className="text-xs text-[#A3A099]">
              Monday, 21 September 2026. This debrief should take 5–10 minutes. Honesty over comfort.
            </p>
          </div>

          {submitted && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4" /> Review logged. See you tomorrow.
            </div>
          )}

          <div className="space-y-4">
            {/* Completed & Avoided */}
            <Card className="border-[#232330] bg-[#121218]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#F7F5F0]">Execution Outcomes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-[#A3A099]">
                    What did you actually complete today?
                  </label>
                  <textarea
                    className="w-full mt-1.5 p-3 rounded-md border border-[#262634] bg-[#0E0E13] text-xs text-[#F7F5F0] placeholder:text-[#52514D] focus:outline-none focus:border-[#C9A84C] resize-none min-h-[80px] transition-colors"
                    placeholder="List the specific actions you completed. Be precise."
                    value={dailyReview.completed}
                    onChange={(e) => setDailyReview({ ...dailyReview, completed: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#A3A099]">
                    What did you avoid or defer? (Be honest — no judgment, just data)
                  </label>
                  <textarea
                    className="w-full mt-1.5 p-3 rounded-md border border-[#262634] bg-[#0E0E13] text-xs text-[#F7F5F0] placeholder:text-[#52514D] focus:outline-none focus:border-[#C9A84C] resize-none min-h-[80px] transition-colors"
                    placeholder="Name the tasks you delayed. This is your learning data."
                    value={dailyReview.avoided}
                    onChange={(e) => setDailyReview({ ...dailyReview, avoided: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Financial & Learning */}
            <Card className="border-[#232330] bg-[#121218]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#F7F5F0]">Money, Build & Learn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-[#A3A099]">
                    How much money did you move today? (GHS)
                  </label>
                  <input
                    type="number"
                    className="w-full mt-1.5 p-2.5 rounded-md border border-[#262634] bg-[#0E0E13] text-sm font-mono text-[#DFBF65] placeholder:text-[#52514D] focus:outline-none focus:border-[#C9A84C] transition-colors"
                    placeholder="0"
                    value={dailyReview.moneyMoved}
                    onChange={(e) => setDailyReview({ ...dailyReview, moneyMoved: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#A3A099]">
                    What did you build or advance in your ventures today?
                  </label>
                  <textarea
                    className="w-full mt-1.5 p-3 rounded-md border border-[#262634] bg-[#0E0E13] text-xs text-[#F7F5F0] placeholder:text-[#52514D] focus:outline-none focus:border-[#C9A84C] resize-none min-h-[60px] transition-colors"
                    placeholder="e.g. Drafted pricing PDF, sent 3 outreach messages..."
                    value={dailyReview.built}
                    onChange={(e) => setDailyReview({ ...dailyReview, built: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#A3A099]">
                    What was the most important thing you learned today?
                  </label>
                  <textarea
                    className="w-full mt-1.5 p-3 rounded-md border border-[#262634] bg-[#0E0E13] text-xs text-[#F7F5F0] placeholder:text-[#52514D] focus:outline-none focus:border-[#C9A84C] resize-none min-h-[60px] transition-colors"
                    placeholder="An insight, pattern, or realisation..."
                    value={dailyReview.learned}
                    onChange={(e) => setDailyReview({ ...dailyReview, learned: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tomorrow's North Star */}
            <Card className="border-[#C9A84C]/30 bg-[#14141C]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#DFBF65] flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#C9A84C]" />
                  Tomorrow's #1 Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full p-3 rounded-md border border-[#C9A84C]/30 bg-[#0E0E14] text-sm text-[#F7F5F0] placeholder:text-[#52514D] focus:outline-none focus:border-[#C9A84C] resize-none min-h-[60px] font-medium transition-colors"
                  placeholder="If I accomplish ONE thing tomorrow that would change everything, it is..."
                  value={dailyReview.tomorrowOne}
                  onChange={(e) => setDailyReview({ ...dailyReview, tomorrowOne: e.target.value })}
                />
              </CardContent>
            </Card>

            <Button
              onClick={handleSubmitReview}
              className="w-full bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold gap-2 h-11"
            >
              <CheckCircle2 className="h-4 w-4" />
              Submit Day 1 Review
            </Button>
          </div>
        </TabsContent>

        {/* ── Weekly CEO Review Tab ── */}
        <TabsContent value="weekly" className="mt-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#0E0E14] border border-[#232330]">
            <p className="text-xs font-semibold text-[#A3A099] uppercase tracking-wide">
              Week 1 of 26 · Due: Sunday 27 September 2026
            </p>
            <p className="text-sm text-[#F7F5F0] mt-1">
              The Weekly CEO Review forces you to look at your execution as a business operator, not just as a person completing tasks.
            </p>
          </div>

          {/* Commitment Rate Widget */}
          <Card className="border-[#232330] bg-[#121218]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-[#F7F5F0]">Commitment Rate</CardTitle>
                <span className={`text-xl font-bold font-mono ${commitmentRate >= 80 ? 'text-emerald-400' : commitmentRate >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                  {commitmentRate}%
                </span>
              </div>
              <CardDescription className="text-xs">
                Daily Threes completed vs committed. Target: 80%+
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1C1C28" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#8A8882' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#8A8882' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ background: '#1A1A24', border: '1px solid #2B2B3C', borderRadius: 8, fontSize: 11 }}
                      labelStyle={{ color: '#F7F5F0' }}
                    />
                    <Bar dataKey="commitment" name="Completion %">
                      {weeklyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.commitment >= 80 ? '#10B981' : entry.commitment >= 60 ? '#F59E0B' : entry.commitment > 0 ? '#EF4444' : '#1C1C28'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-[#6E6C66] mt-2 text-center">
                Complete daily reviews to populate this chart.
              </p>
            </CardContent>
          </Card>

          {/* Weekly Scorecard */}
          <Card className="border-[#232330] bg-[#121218]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#F7F5F0]">Weekly Scorecard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Cash Collected', value: 'GHS 0', target: 'GHS 3,000', color: 'text-red-400' },
                { label: 'Client Conversations', value: '0', target: '5', color: 'text-amber-400' },
                { label: 'Proposals Sent', value: '0', target: '2', color: 'text-amber-400' },
                { label: 'Deep Work Hours', value: '0h', target: '20h', color: 'text-amber-400' },
                { label: 'Learning Sessions', value: '0h', target: '3h', color: 'text-[#8A8882]' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#1C1C26] last:border-0">
                  <span className="text-xs text-[#A3A099]">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-mono font-bold ${item.color}`}>{item.value}</span>
                    <span className="text-[10px] text-[#52514D]">/ {item.target}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Strategic Directives */}
          <Card className="border-[#C9A84C]/40 bg-[#121218]">
            <CardHeader className="pb-3 border-b border-[#1C1C28]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#C9A84C]" />
                  <CardTitle className="text-sm font-semibold text-[#DFBF65]">
                    AI Strategic Directives for Week 1
                  </CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchAiDirectives}
                  disabled={loadingAi}
                  className="text-xs h-7 gap-1.5 border-[#C9A84C]/40 text-[#DFBF65] hover:bg-[#C9A84C]/10"
                >
                  {loadingAi ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Zap className="h-3 w-3" />
                  )}
                  Generate Directives
                </Button>
              </div>
              <CardDescription className="text-xs text-[#8A8882]">
                Tactical focus calibrated against Phase 1 Cash Stability
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-[#0E0E14] border border-[#1C1C28] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-[#F7F5F0]">
                      {rec.title}
                    </h4>
                    <Badge
                      variant={rec.impact === 'critical' ? 'critical' : 'gold'}
                      className="text-[9px] uppercase py-0"
                    >
                      {rec.impact} impact · {rec.effortHours}h
                    </Badge>
                  </div>
                  <p className="text-xs text-[#A3A099]">{rec.rationale}</p>
                  <div className="pt-1.5 flex items-start gap-1.5 text-[11px] text-[#DFBF65]">
                    <span className="font-semibold text-[10px] uppercase tracking-wider text-[#C9A84C]">
                      5-Min First Step:
                    </span>
                    <span>{rec.firstMicroStep}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
