import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai/provider';
import { buildDailyContext } from '@/lib/ai/context';

export async function POST(req: NextRequest) {
  try {
    const ctx = buildDailyContext();

    const systemPrompt = `You are the KIA Planning Engine. Generate a concise daily plan for Isaac on Day ${ctx.user.cycleDay} of his 180-day cycle.

Context:
- Phase: ${ctx.user.phase}
- Cash position: GHS ${ctx.finance.liquidCash} liquid, GHS ${ctx.finance.totalObligations} obligations
- Income: GHS ${ctx.finance.monthlyIncome}/mo vs GHS ${ctx.finance.monthlyTarget}/mo target
- Today's north star: ${ctx.todayFocus}

Output a JSON object with this exact structure:
{
  "northStar": "single most important action for today (1 sentence, action verb)",
  "dailyThree": [
    { "title": "task 1", "pillar": "money|build|grow", "why": "why this matters today", "estimatedMinutes": 60 },
    { "title": "task 2", "pillar": "money|build|grow", "why": "why this matters today", "estimatedMinutes": 45 },
    { "title": "task 3", "pillar": "money|build|grow", "why": "why this matters today", "estimatedMinutes": 30 }
  ],
  "morningBrief": "2-3 sentence briefing on today's strategic context and priorities"
}

Rules:
- At least 2 of the Daily Three must target the money pillar given the cash crisis
- Tasks must be specific and actionable — not "work on clients" but "call Kofi Boateng about startup advisory package"
- Respond with valid JSON only, no markdown wrapping`;

    const provider = getAIProvider();
    const raw = await provider.complete(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate today\'s plan.' },
      ],
      { temperature: 0.6, maxTokens: 512 }
    );

    // Strip potential markdown code fences
    const cleaned = raw.replace(/```json\n?|```\n?/g, '').trim();
    let plan;
    try {
      plan = JSON.parse(cleaned);
    } catch {
      plan = {
        northStar: ctx.todayFocus,
        dailyThree: [
          { title: 'Contact 5 warm founder prospects via WhatsApp', pillar: 'money', why: 'Every day without outreach extends cash deficit', estimatedMinutes: 45 },
          { title: 'Draft 1-page advisory service overview PDF', pillar: 'build', why: 'Needed for every client conversation this week', estimatedMinutes: 60 },
          { title: 'Map GHS 7,000 debt retirement schedule', pillar: 'money', why: 'Clarity on obligation timeline reduces stress', estimatedMinutes: 30 },
        ],
        morningBrief: `Day ${ctx.user.cycleDay} of 180. Cash is GHS ${ctx.finance.liquidCash} with GHS ${ctx.finance.totalObligations} in obligations. Your only metric today is: did you make direct contact with paying prospects?`,
      };
    }

    return NextResponse.json({ plan, cycleDay: ctx.user.cycleDay });
  } catch (error) {
    console.error('[/api/ai/plan] Error:', error);
    return NextResponse.json({ error: 'Planning engine unavailable.' }, { status: 500 });
  }
}
