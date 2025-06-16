'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/app-layout';
import ProfileForm from './profile-form';
import UserProfileForm from '@/components/profile/user-profile-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { UserSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('user-profile');

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto shadow-xl">
          <CardHeader className="bg-muted/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <UserSquare className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-headline">プロフィール管理</CardTitle>
            </div>
            <CardDescription className="text-md">
              あなたのプロフィール情報を管理し、AIを活用してLinkedInプロフィールを作成します。
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="user-profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="user-profile">プロフィール設定</TabsTrigger>
                <TabsTrigger value="ai-profile">AI プロフィール作成</TabsTrigger>
              </TabsList>
              
              <TabsContent value="user-profile">
                <UserProfileForm />
              </TabsContent>
              
              <TabsContent value="ai-profile">
                <ProfileForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
