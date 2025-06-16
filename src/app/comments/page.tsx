
import AppLayout from '@/components/layout/app-layout';
import CommentAssistForm from './comment-assist-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function CommentAssistPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto shadow-xl">
          <CardHeader className="bg-muted/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-md">
                <Image 
                  src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&h=400&fit=crop&crop=faces&auto=format&q=80" 
                  alt="Comment Assistant" 
                  width={40} 
                  height={40} 
                  className="object-cover"
                />
              </div>
              <CardTitle className="text-2xl font-headline">AI コメントアシスト</CardTitle>
            </div>
            <CardDescription className="text-md">
              あなたのCEOプロフィールに合わせて、AIがLinkedIn投稿へのコメントを日本語と英語で提案します。
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <CommentAssistForm />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
