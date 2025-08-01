import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/lib/firebase/firebase-provider';
import ProtectedRoute from '@/components/auth/protected-route';

export const metadata: Metadata = {
  title: 'Globalink CEO',
  description: 'AI-powered LinkedIn assistant for CEOs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseProvider>
          <ProtectedRoute>
            <SidebarProvider defaultOpen={true}>
              {children}
            </SidebarProvider>
            <Toaster />
          </ProtectedRoute>
        </FirebaseProvider>
      </body>
    </html>
  );
}
