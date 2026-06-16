import { OfflineLedger } from '@/components/OfflineLedger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudOff } from 'lucide-react';

export default function LedgerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Offline-First Ledger</h1>
        <p className="text-muted-foreground">
          IndexedDB queue · Service Worker sync · Batch POST /api/sync
        </p>
      </div>

      <Card className="border-emerald-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <CloudOff className="h-4 w-4" />
            Offline-First Architecture
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>1. Submit form → POST /api/sync attempt</p>
          <p>2. If offline → falls back to IndexedDB (pending-sync store)</p>
          <p>3. Service Worker detects <code className="text-primary">online</code> event → reads IndexedDB</p>
          <p>4. Batch POST to backend → clears IndexedDB → dispatches sync-complete</p>
        </CardContent>
      </Card>

      <OfflineLedger />
    </div>
  );
}
