import { z } from 'zod';
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';

const ActionSchema = z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    type: z.enum(['open_url', 'bulk_open_urls', 'bulk_github_star']),
    url: z.string().url().optional(),
    urls: z.array(z.string().url()).optional(),
    payload: z.record(z.string(), z.any()).optional(),
});

const ResultUiSchema = z.object({
    message: z.string().min(1),
    actions: z.array(ActionSchema).default([]),
    markdownSummary: z.string().min(1),
});

export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));

    const execution = body?.execution;
    if (!execution) {
        return new Response(JSON.stringify({ error: 'execution is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const prompt = `You are an assistant that converts an agent execution into a conversational result view.

INPUT JSON (execution):
${JSON.stringify(execution, null, 2)}

GOALS:
1) Provide a short chat-bubble style message summarizing what the agent did.
2) Provide a structured markdown summary (headings + bullets) suitable to display under a terminal.
3) Infer UI actions the user can take based on tool outputs.

ACTIONS RULES:
- If you find GitHub repositories with html_url or url fields, suggest an action:
  - type=bulk_open_urls with urls=[...]
  - optionally type=bulk_github_star with payload containing repos/fullNames if present.
- If you find any single important link, suggest open_url.
- Keep actions small (0-5).

Return JSON strictly matching the provided schema.`;

    const result = await streamObject({
        model: google('gemini-2.0-flash'),
        schema: ResultUiSchema,
        prompt,
    });

    return result.toTextStreamResponse();
}
