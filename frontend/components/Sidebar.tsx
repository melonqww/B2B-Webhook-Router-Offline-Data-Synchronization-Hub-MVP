'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  Webhook,
  Wallet,
  Building2,
  LayoutDashboard,
  Activity,
  LogIn,
  LogOut,
  User,
  Shield,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/webhooks', label: 'Webhook Router', icon: Webhook },
  { href: '/ledger', label: 'Offline Ledger', icon: Wallet },
  { href: '/properties', label: 'Property Search', icon: Building2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-border px-6">
        <Activity className="h-5 w-5 text-primary" />
        <span className="font-bold tracking-tight">B2B Hub</span>
      </div>

      <nav className="space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-sidebar-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
        {isLoading ? null : user ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs capitalize text-muted-foreground">{user.role}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={logout}>
              <LogOut className="mr-2 h-3 w-3" />
              Sign Out
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="outline" size="sm" className="w-full">
              <LogIn className="mr-2 h-3 w-3" />
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </aside>
  );
}
