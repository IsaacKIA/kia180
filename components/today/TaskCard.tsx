'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Zap,
  Play,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { Task } from '@/types/database';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onStartNow: (task: Task) => void;
  onOpenResistance: (task: Task) => void;
}

export function TaskCard({
  task,
  onToggleComplete,
  onStartNow,
  onOpenResistance,
}: TaskCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const isDone = task.status === 'completed';

  return (
    <Card
      className={`transition-all duration-200 border-[#232332] bg-[#121218] ${
        isDone
          ? 'opacity-60 bg-[#0E0E14] border-[#1C1C26]'
          : 'hover:border-[#38384C] shadow-md'
      }`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          {/* Completion Checkbox */}
          <button
            type="button"
            onClick={() => onToggleComplete(task.id)}
            className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
              isDone
                ? 'bg-[#C9A84C] border-[#C9A84C] text-[#0A0A0C]'
                : 'border-[#38384C] hover:border-[#C9A84C] bg-[#181822]'
            }`}
            aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </button>

          {/* Main Task Body */}
          <div className="flex-1 min-w-0">
            {/* Header badges */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge
                variant={
                  task.pillar_tag === 'money'
                    ? 'money'
                    : task.pillar_tag === 'build'
                    ? 'build'
                    : 'grow'
                }
                className="text-[10px] py-0 px-2 uppercase font-medium"
              >
                {task.pillar_tag}
              </Badge>

              <Badge
                variant={
                  task.priority === 'critical'
                    ? 'critical'
                    : task.priority === 'high'
                    ? 'high'
                    : 'medium'
                }
                className="text-[10px] py-0 px-2 uppercase"
              >
                {task.priority}
              </Badge>

              {task.estimated_duration && (
                <span className="text-[11px] text-[#7A7872] flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3" />
                  {task.estimated_duration}m
                </span>
              )}

              <span className="text-[11px] text-[#7A7872] flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-400" />
                {task.energy_required} energy
              </span>
            </div>

            {/* Task Title */}
            <h4
              className={`text-sm font-medium leading-snug transition-colors ${
                isDone
                  ? 'line-through text-[#666560]'
                  : 'text-[#F7F5F0]'
              }`}
            >
              {task.title}
            </h4>

            {/* Subtext description if exists */}
            {task.description && (
              <p className="text-xs text-[#8A8882] mt-1 leading-relaxed line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Direct Next Action Pill */}
            {task.next_action && !isDone && (
              <div className="mt-2.5 inline-flex flex-wrap max-w-full break-words items-center gap-1.5 px-2.5 py-1 rounded bg-[#181824] border border-[#262638] text-[11px] text-[#DFBF65]">
                <span className="text-[#8A8882]">Immediate action:</span>
                <span className="font-medium">{task.next_action}</span>
              </div>
            )}

            {/* Collapsed Intelligence Accordion */}
            {showDetails && (
              <div className="mt-3 pt-3 border-t border-[#1F1F2C] space-y-2.5 text-xs animate-in fade-in">
                {task.why_it_matters && (
                  <div className="p-2.5 rounded bg-[#161622] border border-[#242436]">
                    <span className="text-[10px] font-semibold text-[#DFBF65] uppercase block mb-0.5">
                      Strategic Importance
                    </span>
                    <p className="text-[#C5C3BC] leading-relaxed">
                      {task.why_it_matters}
                    </p>
                  </div>
                )}

                {task.consequence_of_delay && (
                  <div className="p-2.5 rounded bg-red-950/20 border border-red-900/40">
                    <span className="text-[10px] font-semibold text-red-400 uppercase flex items-center gap-1 mb-0.5">
                      <AlertTriangle className="h-3 w-3" /> Consequence of Delay
                    </span>
                    <p className="text-red-200/80 leading-relaxed">
                      {task.consequence_of_delay}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Controls */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1C1C28]">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-[11px] text-[#7A7872] hover:text-[#C9A84C] flex items-center gap-1 transition-colors"
              >
                {showDetails ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" /> Hide Context
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" /> View Context & Consequence
                  </>
                )}
              </button>

              {!isDone && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenResistance(task)}
                    className="h-7 text-[11px] text-[#8A8882] hover:text-amber-400 hover:bg-[#1C1C28] px-2 gap-1"
                  >
                    <ShieldAlert className="h-3 w-3" />
                    <span>Hesitating?</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => onStartNow(task)}
                    className="h-7 text-[11px] bg-[#C9A84C] hover:bg-[#DFBF65] text-[#0A0A0C] font-semibold px-2.5 gap-1 shadow-sm"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Start Now</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
