import type { Metadata } from 'next';
import { FirebaseProvider } from '@/lib/firebase/firebase-provider';
import { Toaster } from '@/components/ui/toaster';
import { ExamplesNav } from '@/components/examples/examples-nav';

export const metadata: Metadata = {
  title: 'Examples - Globalink CEO',
  description: 'Example implementations of Firebase features',
};

export default function ExamplesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <FirebaseProvider>
        <div className="container mx-auto py-4">
          <ExamplesNav />
          {children}
        </div>
        <Toaster />
      </FirebaseProvider>
    </div>
  );
}
