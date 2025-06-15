'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EmailLinkAuth from '@/components/auth/email-link-auth';
import GoogleAuth from '@/components/auth/google-auth';
import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>('email-link');
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not loading and user is null, show auth page
  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Globalink CEO</h1>
          <p className="text-muted-foreground mt-2">
            AIを活用してLinkedInでの影響力を高めるためのアシスタントツール
          </p>
        </div>

        <Tabs 
          defaultValue={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email-link">メールリンク認証</TabsTrigger>
            <TabsTrigger value="google">Google認証</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email-link" className="mt-6">
            <EmailLinkAuth />
          </TabsContent>
          
          <TabsContent value="google" className="mt-6">
            <GoogleAuth />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
