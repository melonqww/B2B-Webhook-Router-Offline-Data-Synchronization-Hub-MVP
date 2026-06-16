import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { SWRegister } from '@/components/SWRegister';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Enterprise B2B Automation Hub',
  description: 'Webhook Router · Offline-First Ledger · Relational Filter Index',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <SWRegister />
          <Sidebar />
          <main className="pl-64 min-h-screen">
            <div className="mx-auto max-w-7xl p-8">
              {children}
            </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
