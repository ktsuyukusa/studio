'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';

export default function FirebaseTestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SidebarProvider defaultOpen={true}>
        {children}
      </SidebarProvider>
      <Toaster />
    </div>
  );
}
