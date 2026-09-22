import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai/provider';
import { buildDailyContext } from '@/lib/ai/context';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskTitle, taskDescription, deferralCount = 0 } = body as {
      taskTitle: string;
      taskDescription?: string;
      deferralCount?: number;
    };

    const ctx = buildDailyContext();

    const systemPrompt = `You are the KIA Resistance Engine — a specialist in breaking through pre-start friction.

The user has ${deferralCount > 0 ? `deferred this task ${deferralCount} time(s)` : 'just hesitated before starting'}.

Context:
- Day ${ctx.user.cycleDay} of 180
- Cash: GHS ${ctx.finance.liquidCash} liquid, GHS ${ctx.finance.totalObligations} obligations
- The consequence of continued deferral: worse cash position, extending the deficit

Your response must:
1. Name the resistance pattern (cognitive or emotional friction type)
2. Provide the SINGLE smallest possible first action (< 2 minutes)
3. Give the "consequence if completed" (positive motivation)
4. Give the "consequence if delayed again" (honest, not catastrophising)
5. Offer a 5-minute launch option if appropriate

Format as JSON:
{
  "pattern": "name of the resistance pattern",
  "microAction": "the single smallest step to start right now",
  "microActionDuration": "< 2 minutes",
  "ifCompleted": "what happens if you do this now",
  "ifDelayed": "what happens if you defer again",
  "fiveMinuteLaunch": "optional: the minimum viable version that takes only 5 minutes"
}`;

    const provider = getAIProvider();
    const raw = await provider.complete(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Task: ${taskTitle}\n${taskDescription ? `Description: ${taskDescription}` : ''}` },
      ],
      { temperature: 0.65, maxTokens: 400 }
    );

    const cleaned = raw.replace(/```json\n?|```\n?/g, '').trim();
    let analysis;
    try {
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = {
        pattern: 'Ambiguity friction — the task feels too large or unclear',
        microAction: `Open a blank document and write the title "${taskTitle}" at the top`,
        microActionDuration: '< 1 minute',
        ifCompleted: 'You break the inertia and the next step becomes obvious',
        ifDelayed: 'The task stays on tomorrow\'s list, compounding your backlog and cash deficit',
        fiveMinuteLaunch: 'Do the absolute minimum version — write 3 bullet points on what this task involves',
      };
    }

    return NextResponse.json({ analysis, taskTitle });
  } catch (error) {
    console.error('[/api/ai/resistance] Error:', error);
    return NextResponse.json({ error: 'Resistance engine unavailable.' }, { status: 500 });
  }
}
