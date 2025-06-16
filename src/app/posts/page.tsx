
import AppLayout from '@/components/layout/app-layout';
import PostForgeForm from './post-forge-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function PostForgePage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto shadow-xl">
          <CardHeader className="bg-muted/30 p-6">
             <div className="flex items-center gap-3 mb-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-md">
                <Image 
                  src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop&crop=faces&auto=format&q=80" 
                  alt="Post Creation" 
                  width={40} 
                  height={40} 
                  className="object-cover"
                />
              </div>
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
