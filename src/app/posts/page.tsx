
import AppLayout from '@/components/layout/app-layout';
import PostForgeForm from './post-forge-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PenSquare } from 'lucide-react';

export default function PostForgePage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto shadow-xl">
          <CardHeader className="bg-muted/30 p-6">
             <div className="flex items-center gap-3 mb-2">
              <PenSquare className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-headline">AI 投稿作成アシスト</CardTitle>
            </div>
            <CardDescription className="text-md">
              トピックやキーワード、希望のトーンに合わせて、AIがオリジナルの長文LinkedIn投稿を日本語と英語で生成します。
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <PostForgeForm />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
