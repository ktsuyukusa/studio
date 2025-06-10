
import AppLayout from '@/components/layout/app-layout';
import ProfileForm from './profile-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserSquare } from 'lucide-react';

export default function ProfilePage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto shadow-xl">
          <CardHeader className="bg-muted/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <UserSquare className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-headline">AI プロフィール作成</CardTitle>
            </div>
            <CardDescription className="text-md">
              いくつかの質問にお答えいただくだけで、AIが日本語と英語で魅力的なLinkedInプロフィールを作成します。
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ProfileForm />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
