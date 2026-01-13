'use client';

import { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your Axle AI assistant. I can help you create agents, check executions, manage integrations, and answer questions about your automations. What can I help  you with?'
    }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const value = input;
    setInput('');
    setSending(true);

    try {
      // Streaming via SSE
      const assistantMsg: any = {
        role: 'assistant',
        content: '',
        isStreaming: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      await api.streamMessage(value, (event: any) => {
        if (event.type === 'text_delta') {
          assistantMsg.content += event.data;
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { ...assistantMsg };
            return next;
          });
        }

        if (event.type === 'done') {
          assistantMsg.isStreaming = false;
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { ...assistantMsg };
            return next;
          });
        }

        if (event.type === 'error') {
          assistantMsg.isStreaming = false;
          assistantMsg.content += `\n\nError: ${event.data}`;
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { ...assistantMsg };
            return next;
          });
        }
      });
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong talking to the Axle agent. Please try again.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Unbounded, sans-serif' }}>
          AI Assistant
        </h1>
        <p className="text-muted-foreground">
          Chat with Axle AI to manage your automations
        </p>
      </div>

      <Card className="h-full flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#36B460]/10 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-[#36B460]" />
                </div>
              )}
              <div
                className={`max-w-[70%] px-4 py-3 rounded-lg ${msg.role === 'user'
                    ? 'bg-[#36B460] text-white'
                    : 'bg-muted'
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#36B460]/10 flex items-center justify-center">
                <Bot size={16} className="text-[#36B460]" />
              </div>
              <div className="px-4 py-3 bg-muted rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              disabled={sending}
            />
            <Button
              variant="primary"
              icon={<Send size={16} />}
              onClick={handleSend}
              disabled={sending || !input.trim()}
            >
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
