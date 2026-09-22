// lib/ai/provider.ts
// Provider-agnostic AI interface — swap the underlying model without changing app code

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  complete(messages: Message[], options?: CompletionOptions): Promise<string>;
}

// OpenAI-compatible provider (works with OpenAI, Together, Groq, local LLMs, etc.)
class OpenAICompatibleProvider implements AIProvider {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(apiKey: string, baseUrl: string, model: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.model = model;
  }

  async complete(messages: Message[], options: CompletionOptions = {}): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 1024,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`AI provider error ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? '';
  }
}

// Stub provider — works without any API key (used in development / demo)
class StubProvider implements AIProvider {
  async complete(messages: Message[]): Promise<string> {
    const lastUser = messages.filter(m => m.role === 'user').pop()?.content ?? '';
    return `[Stub AI] You asked: "${lastUser.slice(0, 80)}..." — Connect a real AI provider in Settings to enable full coaching intelligence.`;
  }
}

/**
 * Returns the configured AI provider based on environment variables.
 * Falls back to StubProvider if no key is set.
 */
export function getAIProvider(): AIProvider {
  const apiKey =
    process.env.AI_PROVIDER_API_KEY ||
    process.env.AI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.GEMINI_API_KEY;

  let baseUrl = process.env.AI_PROVIDER_BASE_URL;
  let model = process.env.AI_PROVIDER_MODEL || process.env.AI_MODEL || 'gpt-4o';

  // Auto-detect Groq if a Groq key or gsk_ prefix is provided
  if (!baseUrl && (process.env.GROQ_API_KEY || apiKey?.startsWith('gsk_'))) {
    baseUrl = 'https://api.groq.com/openai/v1';
    model = process.env.AI_MODEL || 'llama-3.3-70b-versatile';
  }

  // Auto-detect Gemini OpenAI compatibility endpoint if AI_PROVIDER is gemini
  if (!baseUrl && (process.env.AI_PROVIDER === 'gemini' || process.env.GEMINI_API_KEY)) {
    baseUrl = 'https://generativelanguage.googleapis.com/v1beta/openai';
    model = process.env.AI_MODEL || 'gemini-1.5-flash';
  }

  baseUrl = baseUrl ?? 'https://api.openai.com/v1';

  if (!apiKey) {
    return new StubProvider();
  }

  return new OpenAICompatibleProvider(apiKey, baseUrl, model);
}
