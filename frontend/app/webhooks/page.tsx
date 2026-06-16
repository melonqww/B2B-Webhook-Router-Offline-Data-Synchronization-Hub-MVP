import { WebhookTester } from '@/components/WebhookTester';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from 'lucide-react';

export default function WebhooksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Webhook Router</h1>
        <p className="text-muted-foreground">
          Meta/WhatsApp Business API · SHA256 handshake · Atomic Postgres writes
        </p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Code className="h-4 w-4" />
            GET /api/webhooks — Verification handshake
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="rounded bg-muted p-3 text-xs">
{`?hub.mode=subscribe
&hub.verify_token=supersecret_token_123
&hub.challenge=CHALLENGE_ACCEPTED`}
          </pre>
        </CardContent>
      </Card>

      <WebhookTester />
    </div>
  );
}
