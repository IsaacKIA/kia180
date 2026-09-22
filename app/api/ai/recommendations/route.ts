import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai/provider';
import { buildDailyContext } from '@/lib/ai/context';

export async function POST(req: NextRequest) {
  try {
    const ctx = buildDailyContext();
    const provider = getAIProvider();

    const prompt = `You are the KIA Strategy Engine.
Given Isaac's current position:
- Cycle Day: ${ctx.user.cycleDay} / 180 (${ctx.user.phase})
- Liquid Cash: ${ctx.finance.currency} ${ctx.finance.liquidCash}
- Monthly Income: ${ctx.finance.currency} ${ctx.finance.monthlyIncome} (Target: ${ctx.finance.monthlyTarget})
- Outstanding Debt: ${ctx.finance.currency} ${ctx.finance.totalObligations}
- Active Goals: ${ctx.activeGoals.map(g => `${g.title}: ${g.current}/${g.target} ${g.unit}`).join(', ')}
- Top Risks: ${ctx.topRisks.map(r => `[${r.level}] ${r.title}`).join('; ')}

Generate 3 high-impact tactical recommendations for this week.
Format your output as a JSON array with objects containing:
- "title": Short action title
- "rationale": Why this matters now
- "impact": "critical" | "high" | "medium"
- "effortHours": estimated hours
- "firstMicroStep": a 5-minute initial action to break inertia

Return ONLY valid JSON.`;

    const response = await provider.complete(
      [
        {
          role: 'system',
          content: 'You are the KIA Strategy Engine. Output ONLY valid JSON arrays without markdown wrappers or commentary.',
        },
        { role: 'user', content: prompt },
      ],
      { temperature: 0.4, maxTokens: 800 }
    );

    let recommendations;
    try {
      const clean = response.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      recommendations = JSON.parse(clean);
    } catch {
      recommendations = [
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
        {
          title: 'Define Minimum Viable Advisory Agreement Template',
          rationale: 'Avoid contract drafting delays once a prospect says yes.',
          impact: 'medium',
          effortHours: 1,
          firstMicroStep: 'Open existing consulting template and update deliverables section.',
        },
      ];
    }

    return NextResponse.json({ recommendations });
  } catch (err: unknown) {
    console.error('Recommendations AI error:', err);
    return NextResponse.json(
      {
        recommendations: [
          {
            title: 'Direct Outreach to 5 Warm Founders',
            rationale: 'Fastest path to cash retainer.',
            impact: 'critical',
            effortHours: 3,
            firstMicroStep: 'Draft message to top contact.',
          },
        ],
      },
      { status: 200 }
    );
  }
}
