'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, User, Bell, Shield, Palette, Link2, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="border-b border-[#1C1C28] pb-5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F5F0]">
          System Settings
        </h1>
        <p className="text-xs text-[#A3A099] mt-0.5">
          Profile · Notifications · AI provider · Data management
        </p>
      </div>

      {/* Profile */}
      <Card className="border-[#232330] bg-[#121218]">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#C9A84C]" />
            <CardTitle className="text-sm text-[#F7F5F0]">Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 p-3 rounded-lg bg-[#0E0E14] border border-[#1C1C28]">
            <div className="h-12 w-12 rounded-full bg-[#1C1C28] border border-[#C9A84C]/40 flex items-center justify-center font-bold text-sm text-[#DFBF65]">
              IK
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F7F5F0]">Isaac Agya Koomson</p>
              <p className="text-xs text-[#8A8882]">isaac@kia180.com</p>
              <Badge variant="gold" className="text-[10px] px-2 py-0 mt-1">Lead Strategist</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#A3A099]">Full Name</label>
              <Input defaultValue="Isaac Agya Koomson" className="mt-1 text-xs" />
            </div>
            <div>
              <label className="text-xs text-[#A3A099]">Currency</label>
              <Input defaultValue="GHS" className="mt-1 text-xs font-mono" />
            </div>
            <div>
              <label className="text-xs text-[#A3A099]">Timezone</label>
              <Input defaultValue="Africa/Accra" className="mt-1 text-xs" />
            </div>
            <div>
              <label className="text-xs text-[#A3A099]">Email</label>
              <Input defaultValue="isaac@kia180.com" type="email" className="mt-1 text-xs" />
            </div>
          </div>
          <Button className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] text-xs font-semibold">
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* 180-Day Cycle */}
      <Card className="border-[#232330] bg-[#121218]">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-[#C9A84C]" />
            <CardTitle className="text-sm text-[#F7F5F0]">Active Cycle</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { label: 'Cycle Name', value: 'KIA 180 — Cycle 1' },
              { label: 'Start Date', value: '21 September 2026' },
              { label: 'End Date', value: '20 March 2027' },
              { label: 'Total Duration', value: '180 days' },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-lg bg-[#0E0E14] border border-[#1C1C28]">
                <p className="text-[10px] text-[#6E6C66] uppercase">{item.label}</p>
                <p className="font-medium text-[#F7F5F0] mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Provider */}
      <Card className="border-[#232330] bg-[#121218]">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-[#C9A84C]" />
            <CardTitle className="text-sm text-[#F7F5F0]">AI Provider</CardTitle>
            <Badge variant="default" className="text-[10px] px-2 py-0">Stub Mode</Badge>
          </div>
          <CardDescription className="text-xs">
            Connect a real AI provider to enable full coaching intelligence. The interface works in stub mode by default.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {['OpenAI (GPT-4o)', 'Google Gemini', 'Anthropic Claude', 'Stub Mode (No Key Required)'].map((provider) => (
              <button
                key={provider}
                type="button"
                className={`text-left p-3 rounded-lg border text-xs transition-colors ${
                  provider === 'Stub Mode (No Key Required)'
                    ? 'border-[#C9A84C]/50 bg-[#C9A84C]/10 text-[#DFBF65]'
                    : 'border-[#1C1C28] bg-[#0E0E14] text-[#8A8882] hover:text-[#F7F5F0] hover:border-[#38384C]'
                }`}
              >
                {provider}
                {provider === 'Stub Mode (No Key Required)' && (
                  <span className="text-[10px] text-[#C9A84C] block mt-0.5">✓ Active</span>
                )}
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs text-[#A3A099]">API Key (when provider selected)</label>
            <Input type="password" placeholder="sk-..." className="mt-1 text-xs font-mono" disabled />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-[#232330] bg-[#121218]">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#C9A84C]" />
            <CardTitle className="text-sm text-[#F7F5F0]">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Daily morning brief (07:00)', enabled: true },
            { label: 'Pre-start task nudge (09:00)', enabled: true },
            { label: 'Missed commitment alert', enabled: true },
            { label: 'Evening review reminder (21:00)', enabled: true },
            { label: 'Cash position weekly alert', enabled: true },
            { label: 'Risk review reminders', enabled: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[#1C1C28] last:border-0">
              <span className="text-xs text-[#A3A099]">{item.label}</span>
              <div
                className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                  item.enabled ? 'bg-[#C9A84C]' : 'bg-[#1C1C28] border border-[#2B2B3C]'
                }`}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                    item.enabled ? 'left-[18px]' : 'left-0.5'
                  }`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-900/40 bg-red-950/10">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-400" />
            <CardTitle className="text-sm text-red-300">Data Management</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-red-200/70">Export or reset your KIA 180 data. These actions are permanent.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs border-[#262634] text-[#A3A099]">
              Export All Data (JSON)
            </Button>
            <Button variant="destructive" size="sm" className="text-xs">
              Reset Cycle Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
