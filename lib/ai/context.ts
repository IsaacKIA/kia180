// lib/ai/context.ts
// Builds structured context snapshots passed to every AI route.
// Currently uses Isaac's baseline seed data — will be replaced with Supabase queries
// when live DB is connected.

export interface DailyContext {
  user: {
    name: string;
    cycleDay: number;
    cycleName: string;
    phase: string;
  };
  finance: {
    liquidCash: number;
    monthlyIncome: number;
    monthlyTarget: number;
    totalObligations: number;
    currency: string;
  };
  execution: {
    commitmentRate: number;  // 0-100
    deepWorkHoursThisWeek: number;
    tasksCompletedToday: number;
    tasksDeferredToday: number;
  };
  topRisks: Array<{
    title: string;
    level: 'critical' | 'high' | 'elevated' | 'low';
    mitigation: string;
  }>;
  activeGoals: Array<{
    title: string;
    current: number;
    target: number;
    unit: string;
    level: string;
  }>;
  todayFocus: string;
  northStar: string;
}

/**
 * Builds the daily context for AI prompts.
 * TODO: Replace with real Supabase data fetching once auth is wired.
 */
export function buildDailyContext(): DailyContext {
  const cycleStart = new Date('2026-09-21');
  const today = new Date();
  const cycleDay = Math.max(1, Math.floor((today.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  return {
    user: {
      name: 'Isaac',
      cycleDay,
      cycleName: 'KIA 180 — Cycle 1',
      phase: 'Phase 1: Foundation & Cash Stability',
    },
    finance: {
      liquidCash: 0,
      monthlyIncome: 2000,
      monthlyTarget: 15000,
      totalObligations: 7000,
      currency: 'GHS',
    },
    execution: {
      commitmentRate: 0,
      deepWorkHoursThisWeek: 0,
      tasksCompletedToday: 0,
      tasksDeferredToday: 0,
    },
    topRisks: [
      {
        title: 'Cash Runway Deficit',
        level: 'critical',
        mitigation: '2 founder conversations daily → first GHS 3,000 retainer within 7 days.',
      },
      {
        title: 'Pre-Start Friction',
        level: 'high',
        mitigation: 'Apply 5-minute launch rule. Use resistance decomposition before deferring.',
      },
    ],
    activeGoals: [
      { title: 'Personal Income', current: 2000, target: 15000, unit: 'GHS/mo', level: '180day' },
      { title: 'Settle Obligations', current: 0, target: 7000, unit: 'GHS', level: '180day' },
      { title: 'KIA Consult Revenue', current: 100, target: 25000, unit: 'GHS/mo', level: '180day' },
    ],
    todayFocus: 'Secure first consulting retainer — reach out to minimum 5 warm prospects.',
    northStar: 'Convert 3 founders to paid retainer clients at GHS 3,000+/month each.',
  };
}

/**
 * Formats the context into a system prompt string for the coach.
 */
export function buildCoachSystemPrompt(ctx: DailyContext): string {
  const { user, finance, execution, topRisks, activeGoals, todayFocus, northStar } = ctx;

  return `You are the KIA AI Executive Coach — a direct, analytical, and action-oriented advisor embedded in Isaac's personal growth operating system.

You have real-time access to Isaac's 180-day plan data. Never speak in generalities — always reference the specific numbers, goals, and context below.

=== CURRENT CONTEXT ===
User: ${user.name}
Cycle: ${user.cycleName} | Day ${user.cycleDay} of 180 | ${user.phase}

FINANCIAL POSITION:
- Liquid cash: ${finance.currency} ${finance.liquidCash.toLocaleString()}
- Monthly income: ${finance.currency} ${finance.monthlyIncome.toLocaleString()} (target: ${finance.currency} ${finance.monthlyTarget.toLocaleString()})
- Outstanding obligations: ${finance.currency} ${finance.totalObligations.toLocaleString()}
- Income gap: ${finance.currency} ${(finance.monthlyTarget - finance.monthlyIncome).toLocaleString()}/month

EXECUTION:
- Commitment rate: ${execution.commitmentRate}%
- Deep work hours this week: ${execution.deepWorkHoursThisWeek}h
- Tasks completed today: ${execution.tasksCompletedToday}
- Tasks deferred today: ${execution.tasksDeferredToday}

ACTIVE GOALS:
${activeGoals.map(g => `- ${g.title}: ${g.current.toLocaleString()} / ${g.target.toLocaleString()} ${g.unit} (${g.level})`).join('\n')}

TOP RISKS:
${topRisks.map(r => `- [${r.level.toUpperCase()}] ${r.title}: ${r.mitigation}`).join('\n')}

TODAY'S NORTH STAR: ${todayFocus}
180-DAY NORTH STAR: ${northStar}

=== COACHING RULES ===
1. Be direct. No fluff, no affirmations, no "that's a great question."
2. Always root your advice in the specific numbers above.
3. Break resistance by making the first action impossibly small.
4. Cash before complexity — always prioritize income-generating actions first.
5. Never make decisions for Isaac — provide analysis, then ask him to decide.
6. If asked about a task, always provide a concrete first micro-step.
7. Keep responses under 300 words unless the complexity demands more.
8. Use markdown formatting: **bold** for key points, bullet lists for actions.`;
}
