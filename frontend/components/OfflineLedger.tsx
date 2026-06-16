'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { apiFetch } from '@/lib/api';
import { savePendingEntry, getPendingEntries, getPendingCount } from '@/lib/indexed-db';
import { Wallet, Plus, CloudOff, Cloud, Loader2, CheckCircle2 } from 'lucide-react';

interface LedgerEntry {
  id: string;
  client_id: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  client_created_at: string;
  created_at: string;
}

export function OfflineLedger() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const [form, setForm] = useState({
    client_id: '',
    amount: '',
    currency: 'USD',
    description: '',
  });

  const checkOnline = useCallback(() => {
    setIsOnline(navigator.onLine);
  }, []);

  const refreshPending = useCallback(async () => {
    const count = await getPendingCount();
    setPendingCount(count);
  }, []);

  const loadEntries = useCallback(async () => {
    try {
      const data = await apiFetch<LedgerEntry[]>('/ledger');
      setEntries(data);
    } catch {}
  }, []);

  useEffect(() => {
    checkOnline();
    loadEntries();
    refreshPending();

    window.addEventListener('online', checkOnline);
    window.addEventListener('offline', checkOnline);
    window.addEventListener('sync-complete', () => {
      loadEntries();
      refreshPending();
    });

    return () => {
      window.removeEventListener('online', checkOnline);
      window.removeEventListener('offline', checkOnline);
    };
  }, [checkOnline, loadEntries, refreshPending]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.client_id || !form.amount) return;

    const entry = {
      client_id: form.client_id,
      amount: parseFloat(form.amount),
      currency: form.currency,
      description: form.description || undefined,
      client_created_at: new Date().toISOString(),
    };

    if (isOnline) {
      try {
        await apiFetch('/sync', {
          method: 'POST',
          body: JSON.stringify({ entries: [entry] }),
        });
        loadEntries();
        setLastSync(new Date().toLocaleTimeString());
      } catch {
        await savePendingEntry(entry);
        refreshPending();
      }
    } else {
      await savePendingEntry(entry);
      refreshPending();
    }

    setForm({ client_id: '', amount: '', currency: 'USD', description: '' });
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const pending = await getPendingEntries();
      if (pending.length === 0) return;

      await apiFetch('/sync', {
        method: 'POST',
        body: JSON.stringify({
          entries: pending.map((e) => ({
            client_id: e.client_id,
            amount: e.amount,
            currency: e.currency,
            description: e.description,
            client_created_at: e.client_created_at,
          })),
        }),
      });

      setLastSync(new Date().toLocaleTimeString());
      await loadEntries();
      await refreshPending();
    } catch (err) {
      console.error('Manual sync failed:', err);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {isOnline ? (
          <Badge variant="success" className="gap-1">
            <Cloud className="h-3 w-3" /> Online
          </Badge>
        ) : (
          <Badge variant="destructive" className="gap-1">
            <CloudOff className="h-3 w-3" /> Offline
          </Badge>
        )}
        {pendingCount > 0 && (
          <Badge variant="warning" className="gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            {pendingCount} pending sync
          </Badge>
        )}
        {lastSync && (
          <span className="text-xs text-muted-foreground">Last sync: {lastSync}</span>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Ledger Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
            <Input
              placeholder="Client ID"
              value={form.client_id}
              onChange={(e) => setForm({ ...form, client_id: e.target.value })}
              className="w-48"
              required
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-32"
              required
            />
            <Input
              placeholder="USD"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
              className="w-20"
              maxLength={3}
            />
            <Input
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-64"
            />
            <Button type="submit">
              <Wallet className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">{entries.length}</Badge>
            Ledger Entries
          </CardTitle>
          {pendingCount > 0 && (
            <Button size="sm" variant="outline" onClick={handleSync} disabled={syncing}>
              {syncing ? (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              ) : (
                <Cloud className="mr-2 h-3 w-3" />
              )}
              Sync Now ({pendingCount})
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No entries yet. Add one above.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-xs">{e.client_id}</TableCell>
                    <TableCell className="font-mono">
                      {e.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{e.currency}</TableCell>
                    <TableCell>
                      {e.status === 'synced' ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Synced
                        </Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(e.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
