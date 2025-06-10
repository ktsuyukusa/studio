import AppLayout from '@/components/layout/app-layout';
import CommentAssistForm from './comment-assist-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquarePlus } from 'lucide-react';

export default function CommentAssistPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto shadow-xl">
          <CardHeader className="bg-muted/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquarePlus className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-headline">AI Comment Assist</CardTitle>
            </div>
            <CardDescription className="text-md">
              Get AI-suggested comments in Japanese and English for LinkedIn posts, tailored to your CEO profile.
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
