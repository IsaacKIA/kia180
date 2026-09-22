import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai/provider';
import { buildDailyContext } from '@/lib/ai/context';

interface DecisionRequest {
  opportunity: string;
  evidence?: string;
  factors?: {
    revenuePotential: number;
    capitalRequired: number;
    timeRequired: number;
    strategicFit: number;
    customerCertainty: number;
    capability: number;
    opportunityCost: number;
    risk: number;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: DecisionRequest = await req.json();
    const { opportunity, evidence, factors } = body;

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity is required' }, { status: 400 });
    }

    const ctx = buildDailyContext();
    const provider = getAIProvider();

    const prompt = `You are the KIA Decision Intelligence Engine.
Analyze this opportunity using Isaac's current strategic context:
- Cycle Day: ${ctx.user.cycleDay} of 180 (${ctx.user.phase})
- Current Liquid Cash: ${ctx.finance.currency} ${ctx.finance.liquidCash}
- Monthly Income: ${ctx.finance.currency} ${ctx.finance.monthlyIncome} (Target: ${ctx.finance.monthlyTarget})
- Outstanding Obligations: ${ctx.finance.currency} ${ctx.finance.totalObligations}
- Top Risk: ${ctx.topRisks[0]?.title ?? 'Cash Runway'} (${ctx.topRisks[0]?.mitigation ?? ''})
- North Star: ${ctx.northStar}

OPPORTUNITY TO EVALUATE:
"${opportunity}"

ADDITIONAL EVIDENCE / CONTEXT:
"${evidence || 'None provided'}"

${factors ? `USER'S FACTOR SCORES (1-5):
- Revenue Potential: ${factors.revenuePotential}/5
- Capital Required: ${factors.capitalRequired}/5
- Time Required: ${factors.timeRequired}/5
- Strategic Fit: ${factors.strategicFit}/5
- Customer Certainty: ${factors.customerCertainty}/5
- Capability Match: ${factors.capability}/5
- Opportunity Cost: ${factors.opportunityCost}/5
- Execution Risk: ${factors.risk}/5` : ''}

CRITICAL RULES:
1. Never answer with a simple "Yes" or "No".
2. Highlight the trade-offs, opportunity costs, and strategic timing considerations.
3. Test against Phase 1 Cash Stability: Does this generate cash within 14-30 days, or does it consume bandwidth needed for immediate survival?
4. Provide an objective recommendation on whether to PURSUE NOW, PURSUE WITH CONDITIONS, PARK IN IDEA VAULT, or DECLINE.
5. Keep your response structured:
   - **Executive Assessment**: 2-3 sentences summarizing strategic alignment.
   - **Immediate Trade-offs**: What gets sacrificed if this is pursued now?
   - **Recommendation & Triggers**: What milestone or condition would justify acting on this?

Return clean markdown.`;

    const response = await provider.complete(
      [
        {
          role: 'system',
          content: 'You are the KIA Decision Intelligence Engine. Be analytical, rigorous, and unsentimental about focus and opportunity cost.',
        },
        { role: 'user', content: prompt },
      ],
      { temperature: 0.5, maxTokens: 800 }
    );

    return NextResponse.json({ brief: response });
  } catch (err: unknown) {
    console.error('Decision AI error:', err);
    return NextResponse.json(
      {
        brief:
          'Based on Phase 1 priorities, any initiative requiring upfront capital or significant development time conflicts with your immediate cash stability goal. Recommendation: Park this opportunity until your monthly retainer baseline exceeds GHS 9,000/month.',
      },
      { status: 200 }
    );
  }
}
