'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowRight, Target, DollarSign, ShieldAlert } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [personalIncomeTarget, setPersonalIncomeTarget] = useState('15000');
  const [businessRevenueTarget, setBusinessRevenueTarget] = useState('50000');
  const [obligationsTotal, setObligationsTotal] = useState('7000');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      router.push('/today');
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <Badge variant="gold" className="px-3 py-1 font-mono text-xs">
          Cycle 1 Baseline Initialization
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight text-[#F7F5F0]">
          180-Day Transformation Baseline
        </h1>
        <p className="text-xs text-[#8A8882] max-w-xl mx-auto">
          21 September 2026 → 20 March 2027. Grounded in your actual numbers, clear milestones, and ruthless daily execution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#232330] bg-[#121217]">
          <CardHeader className="pb-2">
            <CardDescription className="text-[11px]">Current Baseline</CardDescription>
            <CardTitle className="text-sm text-red-400 font-mono">
              Fragile / Negative
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#1C1C26]">
              <span className="text-[#8A8882]">Personal Income:</span>
              <span className="font-mono text-[#F7F5F0]">GHS 2,000/mo</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1C1C26]">
              <span className="text-[#8A8882]">Business Cashflow:</span>
              <span className="font-mono text-[#F7F5F0]">GHS 100/mo</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1C1C26]">
              <span className="text-[#8A8882]">Liquid Cash:</span>
              <span className="font-mono text-red-400">GHS 0</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#8A8882]">Debt Obligations:</span>
              <span className="font-mono text-amber-400">GHS 7,000</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#C9A84C]/40 bg-[#14141C] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A84C]/10 rounded-bl-full pointer-events-none" />
          <CardHeader className="pb-2">
            <CardDescription className="text-[11px] text-[#DFBF65]">180-Day North Star</CardDescription>
            <CardTitle className="text-sm text-[#DFBF65] font-mono">
              Thriving / Scaled
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#1C1C26]">
              <span className="text-[#8A8882]">Personal Target:</span>
              <span className="font-mono text-[#DFBF65] font-semibold">GHS 15,000/mo</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1C1C26]">
              <span className="text-[#8A8882]">Ventures Cashflow:</span>
              <span className="font-mono text-[#DFBF65] font-semibold">GHS 50,000/mo</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1C1C26]">
              <span className="text-[#8A8882]">Debt Status:</span>
              <span className="font-mono text-emerald-400 font-semibold">100% Settled</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#8A8882]">Execution Posture:</span>
              <span className="text-[#F7F5F0]">Decisive</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#232330] bg-[#121217]">
          <CardHeader className="pb-2">
            <CardDescription className="text-[11px]">Three Ventures</CardDescription>
            <CardTitle className="text-sm text-sky-400 font-mono">
              Vehicle Alignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="p-2 rounded bg-[#181822] border border-[#232330]">
              <p className="font-semibold text-sky-300">1. KIA-Start Up Consult</p>
              <p className="text-[10px] text-[#8A8882]">Role: Immediate Cash Engine</p>
            </div>
            <div className="p-2 rounded bg-[#181822] border border-[#232330]">
              <p className="font-semibold text-emerald-300">2. Civitas</p>
              <p className="text-[10px] text-[#8A8882]">Role: Validation & Civic Advisory</p>
            </div>
            <div className="p-2 rounded bg-[#181822] border border-[#232330]">
              <p className="font-semibold text-amber-300">3. Agrivora</p>
              <p className="text-[10px] text-[#8A8882]">Role: Long-term Agri Growth Engine</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#232330] bg-[#121217]">
        <CardHeader>
          <CardTitle className="text-sm text-[#F7F5F0]">Confirm Targets & Financial Reality</CardTitle>
          <CardDescription className="text-xs">
            Tune target metrics for this 180-day cycle before loading Day 1 execution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-[#A3A099]">Personal Target (GHS/mo)</label>
              <Input
                value={personalIncomeTarget}
                onChange={(e) => setPersonalIncomeTarget(e.target.value)}
                className="mt-1 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-[#A3A099]">Venture Cashflow (GHS/mo)</label>
              <Input
                value={businessRevenueTarget}
                onChange={(e) => setBusinessRevenueTarget(e.target.value)}
                className="mt-1 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-[#A3A099]">Total Outstanding Obligations (GHS)</label>
              <Input
                value={obligationsTotal}
                onChange={(e) => setObligationsTotal(e.target.value)}
                className="mt-1 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              onClick={handleConfirm}
              className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold flex items-center gap-2"
            >
              {confirmed ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Baseline Confirmed
                </>
              ) : (
                <>
                  Launch Day 1 Command Centre <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
