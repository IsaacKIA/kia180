'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Bell, Shield, Link2, Database, Check } from 'lucide-react';

interface NotificationSetting {
  id: string;
  label: string;
  enabled: boolean;
}

const defaultNotifications: NotificationSetting[] = [
  { id: 'morning_brief', label: 'Daily morning brief (07:00)', enabled: true },
  { id: 'pre_start_nudge', label: 'Pre-start task nudge (09:00)', enabled: true },
  { id: 'missed_commitment', label: 'Missed commitment alert', enabled: true },
  { id: 'evening_review', label: 'Evening review reminder (21:00)', enabled: true },
  { id: 'cash_alert', label: 'Cash position weekly alert', enabled: true },
  { id: 'risk_reminder', label: 'Risk review reminders', enabled: true },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>(defaultNotifications);
  const [savedProfile, setSavedProfile] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('Google Gemini');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kia180_notification_settings');
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const toggleNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      );
      try {
        localStorage.setItem('kia180_notification_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleSaveProfile = () => {
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2500);
  };

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
          <Button
            onClick={handleSaveProfile}
            className="bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] text-xs font-semibold flex items-center gap-1.5"
          >
            {savedProfile ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Profile Saved
              </>
            ) : (
              'Save Profile'
            )}
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
            <Badge variant="gold" className="text-[10px] px-2 py-0">Google Gemini Live</Badge>
          </div>
          <CardDescription className="text-xs">
            Powered by Google Gemini 3.6 Flash for high-speed executive coaching, resistance analysis, and strategic decisions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {['Google Gemini', 'OpenAI (GPT-4o)', 'Anthropic Claude', 'Stub Mode (Offline)'].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => setSelectedProvider(provider)}
                className={`text-left p-3 rounded-lg border text-xs transition-colors cursor-pointer ${
                  selectedProvider === provider
                    ? 'border-[#C9A84C]/50 bg-[#C9A84C]/10 text-[#DFBF65]'
                    : 'border-[#1C1C28] bg-[#0E0E14] text-[#8A8882] hover:text-[#F7F5F0] hover:border-[#38384C]'
                }`}
              >
                {provider}
                {selectedProvider === provider && (
                  <span className="text-[10px] text-[#C9A84C] block mt-0.5">✓ Active Provider</span>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-[#232330] bg-[#121218]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#C9A84C]" />
              <CardTitle className="text-sm text-[#F7F5F0]">Notifications</CardTitle>
            </div>
            <span className="text-[11px] text-[#8A8882]">Saved automatically</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-[#1C1C28] last:border-0">
              <span className="text-xs text-[#A3A099]">{item.label}</span>
              <button
                type="button"
                role="switch"
                aria-checked={item.enabled}
                onClick={() => toggleNotification(item.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#C9A84C] ${
                  item.enabled ? 'bg-[#C9A84C]' : 'bg-[#1C1C28] border border-[#2B2B3C]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                    item.enabled ? 'translate-x-4' : 'translate-x-0.5'
                  } mt-0.5`}
                />
              </button>
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
