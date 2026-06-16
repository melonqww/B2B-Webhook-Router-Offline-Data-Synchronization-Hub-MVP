'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { apiFetch } from '@/lib/api';
import { Send, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface Event {
  id: string;
  source: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}

const samplePayload = {
  object: 'whatsapp_business_account',
  entry: [
    {
      id: '123456789',
      changes: [
        {
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: '15551234567',
              phone_number_id: '987654321',
            },
            contacts: [
              {
                profile: { name: 'John Doe' },
                wa_id: '15559876543',
              },
            ],
            messages: [
              {
                from: '15559876543',
                id: 'wamid.ABCDEF123456789',
                timestamp: String(Math.floor(Date.now() / 1000)),
                type: 'text',
                text: { body: 'Hello! I am interested in your services.' },
              },
            ],
          },
          field: 'messages',
        },
      ],
    },
  ],
};

export function WebhookTester() {
  const [token, setToken] = useState('supersecret_token_123');
  const [events, setEvents] = useState<Event[]>([]);
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<'success' | 'error' | null>(null);
  const [customPayload, setCustomPayload] = useState(JSON.stringify(samplePayload, null, 2));

  async function sendWebhook() {
    setSending(true);
    setLastResult(null);
    try {
      let payload;
      try {
        payload = JSON.parse(customPayload);
      } catch {
        setLastResult('error');
        return;
      }
      await apiFetch('/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      setLastResult('success');
      loadEvents();
    } catch {
      setLastResult('error');
    } finally {
      setSending(false);
    }
  }

  async function loadEvents() {
    try {
      const data = await apiFetch<Event[]>('/webhooks/events');
      setEvents(data);
    } catch {}
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Simulate Webhook
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Auth Token</label>
            <Input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Bearer token"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Payload (JSON)</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCustomPayload(JSON.stringify(samplePayload, null, 2))}
              >
                Reset to sample
              </Button>
            </div>
            <textarea
              value={customPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              className="w-full h-64 rounded-md border border-input bg-background p-3 font-mono text-xs"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={sendWebhook} disabled={sending}>
              {sending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send Webhook
            </Button>
            {lastResult === 'success' && (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="h-3 w-3" /> Delivered
              </Badge>
            )}
            {lastResult === 'error' && (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" /> Failed
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{events.length}</Badge>
            Webhook Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events yet. Send a test webhook above.</p>
          ) : (
            <div className="space-y-2">
              {events.map((evt) => (
                <div key={evt.id} className="rounded-lg border bg-muted/20 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{evt.source}</Badge>
                      <span className="text-sm font-mono">{evt.event_type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(evt.created_at).toLocaleString()}
                    </span>
                  </div>
                  <pre className="mt-2 rounded bg-background p-2 text-xs text-muted-foreground overflow-x-auto">
                    {JSON.stringify(evt.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
