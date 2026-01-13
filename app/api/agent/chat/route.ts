import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { io } from 'socket.io-client';

export const runtime = 'nodejs';

const API_ORIGIN = 'http://localhost:7000';
const API_BASE_URL = `${API_ORIGIN.replace(/\/$/, '')}/api/v1`;

function getBearerToken(req: Request) {
    const auth = req.headers.get('authorization') || req.headers.get('Authorization');
    if (!auth) return null;
    const m = /^Bearer\s+(.+)$/i.exec(auth);
    return m?.[1] ?? null;
}

async function createThreadIfNeeded(params: {
    token: string | null;
    agentId?: string;
    threadId?: string;
}) {
    if (params.threadId) return params.threadId;
    if (!params.agentId) return null;

    const res = await fetch(`${API_BASE_URL}/threads`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(params.token ? { Authorization: `Bearer ${params.token}` } : {}),
        },
        body: JSON.stringify({ agentId: params.agentId }),
    }).catch(() => null);

    if (!res || !res.ok) return null;
    const json = await res.json().catch(() => null);
    return json?.thread?._id ?? null;
}

export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));

    const token = getBearerToken(req);
    const agentId: string | undefined = body?.agentId;
    const messages: any[] = Array.isArray(body?.messages) ? body.messages : [];

    // useChat sends all messages; we forward only the latest user message to the agent execution.
    const lastUser = [...messages].reverse().find((m) => m?.role === 'user');
    const userText = (() => {
        const direct = lastUser?.content;
        if (typeof direct === 'string' && direct.trim()) return direct;

        const parts = Array.isArray(lastUser?.parts) ? lastUser.parts : [];
        const fromParts = parts
            .filter((p: any) => p?.type === 'text')
            .map((p: any) => String(p?.text ?? ''))
            .join('')
            .trim();

        return fromParts;
    })();

    const requestedThreadId: string | undefined = body?.threadId;
    const threadId = await createThreadIfNeeded({ token, agentId, threadId: requestedThreadId });

    const stream = createUIMessageStream({
        async execute({ writer }) {
            const emitVisibleError = (message: string) => {
                const textId = `text_error_${Date.now()}`;
                writer.write({ type: 'text-start', id: textId } as any);
                writer.write({ type: 'text-delta', id: textId, delta: message } as any);
                writer.write({ type: 'text-end', id: textId } as any);
            };

            if (threadId) {
                writer.write({
                    type: 'data-thread',
                    data: { threadId },
                    transient: true,
                } as any);
            }

            if (!userText.trim()) {
                writer.write({
                    type: 'error',
                    errorText: 'No user message provided.',
                } as any);
                emitVisibleError('Error: No user message provided.');
                return;
            }

            // Start a real agent execution (worker emits socket events).
            if (!agentId) {
                writer.write({ type: 'error', errorText: 'agentId is required' } as any);
                emitVisibleError('Error: agentId is required.');
                return;
            }

            const runRes = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(agentId)}/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    payload: {
                        task: userText,
                        threadId,
                    },
                }),
            });

            if (!runRes.ok) {
                const err = await runRes.json().catch(() => null);
                writer.write({
                    type: 'error',
                    errorText: err?.error || `Failed to start agent run (${runRes.status})`,
                } as any);
                emitVisibleError(`Error: ${err?.error || `Failed to start agent run (${runRes.status})`}`);
                return;
            }

            const runJson = await runRes.json().catch(() => null);
            const executionId = runJson?.executionId ? String(runJson.executionId) : null;
            if (!executionId) {
                writer.write({
                    type: 'error',
                    errorText: 'Backend did not return executionId',
                } as any);
                emitVisibleError('Error: Backend did not return executionId');
                return;
            }

            const textId = `text_${executionId}`;
            const reasoningId = `reasoning_${executionId}`;
            let textStarted = false;
            let reasoningStarted = false;

            const ensureTextStarted = () => {
                if (textStarted) return;
                textStarted = true;
                writer.write({ type: 'text-start', id: textId } as any);
            };

            const ensureReasoningStarted = () => {
                if (reasoningStarted) return;
                reasoningStarted = true;
                writer.write({ type: 'reasoning-start', id: reasoningId } as any);
            };

            const finishBlocks = () => {
                if (reasoningStarted) writer.write({ type: 'reasoning-end', id: reasoningId } as any);
                if (textStarted) writer.write({ type: 'text-end', id: textId } as any);
            };

            // Subscribe to socket events and translate them to UIMessage stream parts.
            const socket = io(API_ORIGIN, {
                transports: ['websocket', 'polling'],
                auth: token ? { token } : undefined,
            });

            let finished = false;
            const cleanup = () => {
                if (finished) return;
                finished = true;
                try {
                    socket.disconnect();
                } catch {
                    // ignore
                }
            };

            const waitForFinish = await new Promise<void>((resolve) => {
                socket.on('connect', () => {
                    socket.emit('subscribe', agentId);
                });

                socket.on('execution:reasoning_delta', (evt: any) => {
                    if (String(evt?.executionId) !== executionId) return;
                    ensureReasoningStarted();
                    writer.write({ type: 'reasoning-delta', id: reasoningId, delta: String(evt?.delta ?? '') } as any);
                });

                socket.on('execution:response_delta', (evt: any) => {
                    if (String(evt?.executionId) !== executionId) return;
                    ensureTextStarted();
                    writer.write({ type: 'text-delta', id: textId, delta: String(evt?.delta ?? '') } as any);
                });

                // tool call + tool result
                socket.on('execution:action', (evt: any) => {
                    if (String(evt?.executionId) !== executionId) return;

                    const status = evt?.status;
                    const toolName = evt?.type || evt?.functionCall?.name;
                    const toolCallId =
                        evt?.functionCall?.id ||
                        evt?.functionCall?.callId ||
                        evt?.toolCall?.callId ||
                        evt?.toolCall?.functionCallId ||
                        `call_${Date.now()}`;

                    if (status === 'running') {
                        const args = evt?.functionCall?.args;
                        writer.write({
                            type: 'tool-call',
                            toolCallId,
                            toolName,
                            args,
                        } as any);
                        return;
                    }

                    if (status === 'completed') {
                        // Prefer the UI-wrapped toolOutput if present.
                        const result = evt?.toolOutput ?? evt?.functionResponse ?? evt?.result ?? evt;
                        writer.write({
                            type: 'tool-result',
                            toolCallId,
                            toolName,
                            result,
                        } as any);
                    }
                });

                socket.on('execution:completed', (evt: any) => {
                    if (String(evt?.executionId) !== executionId) return;
                    finishBlocks();
                    cleanup();
                    resolve();
                });

                socket.on('connect_error', (err: any) => {
                    writer.write({ type: 'error', errorText: String(err?.message ?? 'socket error') } as any);
                    emitVisibleError(`Error: ${String(err?.message ?? 'socket error')}`);
                    finishBlocks();
                    cleanup();
                    resolve();
                });
            });

            void waitForFinish;
        },
    });

    // Also return thread id as header for callers that want it.
    const headers: Record<string, string> = {};
    if (threadId) headers['x-thread-id'] = threadId;

    return createUIMessageStreamResponse({
        status: 200,
        headers,
        stream,
    });
}
