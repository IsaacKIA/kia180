import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai/provider';
import { buildDailyContext, buildCoachSystemPrompt } from '@/lib/ai/context';
import type { Message } from '@/lib/ai/provider';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body as { messages: Array<{ role: 'user' | 'assistant'; content: string }> };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages array required' }, { status: 400 });
    }

    // Build real-time context
    const ctx = buildDailyContext();
    const systemPrompt = buildCoachSystemPrompt(ctx);

    // Compose full message thread with system context
    const fullMessages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ];

    const provider = getAIProvider();
    const reply = await provider.complete(fullMessages, { temperature: 0.7, maxTokens: 512 });

    return NextResponse.json({ reply, contextDay: ctx.user.cycleDay });
  } catch (error) {
    console.error('[/api/ai/coach] Error:', error);
    return NextResponse.json(
      { error: 'Coach unavailable. Check your AI provider configuration in Settings.' },
      { status: 500 }
    );
  }
}
