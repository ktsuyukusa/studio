import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/lib/firebase/firebase-provider';

export const metadata: Metadata = {
  title: 'Authentication - Globalink CEO',
  description: 'Sign in to Globalink CEO',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <FirebaseProvider>
        {children}
        <Toaster />
      </FirebaseProvider>
    </div>
  );
}
