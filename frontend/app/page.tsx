'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Webhook, Wallet, Building2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';

interface HealthCheck {
  status: string;
  timestamp: string;
}

interface WebhookEvent {
  id: string;
  source: string;
  event_type: string;
  created_at: string;
}

const modules = [
  {
    title: 'Webhook Router',
    desc: 'WhatsApp Business API handshake, JSON payload parsing & atomic Postgres writes',
    icon: Webhook,
    href: '/webhooks',
    color: 'text-blue-400',
  },
  {
    title: 'Offline-First Ledger',
    desc: 'IndexedDB queue, Service Worker sync & POST /api/sync batch endpoint',
    icon: Wallet,
    href: '/ledger',
    color: 'text-emerald-400',
  },
  {
    title: 'Property Search',
    desc: 'Custom SQL filter builder with numeric ranges, pagination & sort',
    icon: Building2,
    href: '/properties',
    color: 'text-amber-400',
  },
];

export default function Dashboard() {
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [events, setEvents] = useState<WebhookEvent[]>([]);

  useEffect(() => {
    apiFetch<HealthCheck>('/health')
      .then(setHealth)
      .catch(() => setHealth({ status: 'unreachable', timestamp: new Date().toISOString() }));

    apiFetch<WebhookEvent[]>('/webhooks/events')
      .then(setEvents)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Enterprise B2B Automation Hub · Full-stack MVP
          </p>
        </div>
        {health && (
          <div className="flex items-center gap-2">
            <span className={`status-dot ${health.status === 'healthy' ? 'active' : 'inactive'}`} />
            <span className="text-sm text-muted-foreground">
              API {health.status}
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.href} href={m.href}>
              <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">{m.title}</CardTitle>
                  <Icon className={`h-5 w-5 ${m.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Open <ArrowUpRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Webhook Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No webhook events yet. Go to Webhook Router and send a test payload.
            </p>
          ) : (
            <div className="space-y-2">
              {events.slice(0, 5).map((evt) => (
                <div key={evt.id} className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{evt.source}</Badge>
                    <span className="text-sm font-mono text-muted-foreground">{evt.event_type}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(evt.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
