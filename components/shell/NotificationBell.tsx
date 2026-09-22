'use client';

import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AlertItem {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info';
  time: string;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: '1',
      title: 'Cash Runway Critical',
      message: 'Liquid cash is GHS 0 with GHS 7,000 in obligations pending. Priority is founder outreach.',
      type: 'critical',
      time: '10m ago',
    },
    {
      id: '2',
      title: 'Daily Three Incomplete',
      message: '3 primary leverage tasks committed for today require execution.',
      type: 'warning',
      time: '1h ago',
    },
  ]);

  const unreadCount = alerts.length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-[#A3A099] hover:text-[#F7F5F0] hover:bg-[#181820]"
        aria-label="View notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#2B2B3C] bg-[#121217] shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#232330]">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-[#F7F5F0]">Executive Radar</h4>
                <Badge variant="gold" className="text-[10px] px-1.5 py-0">
                  {unreadCount} Active
                </Badge>
              </div>
              <button
                onClick={() => setAlerts([])}
                className="text-xs text-[#8A8882] hover:text-[#DFBF65] transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="divide-y divide-[#1D1D27] max-h-72 overflow-y-auto mt-2">
              {alerts.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#8A8882]">
                  No active risk or execution alerts.
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="py-3 flex gap-3 text-left">
                    <div className="mt-0.5 shrink-0">
                      {alert.type === 'critical' ? (
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      ) : alert.type === 'warning' ? (
                        <Clock className="h-4 w-4 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-[#F7F5F0]">
                          {alert.title}
                        </p>
                        <span className="text-[10px] text-[#6E6C66]">{alert.time}</span>
                      </div>
                      <p className="text-[11px] text-[#A3A099] leading-relaxed">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
