
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateSuggestedResponses, type SuggestedResponsesInput, type SuggestedResponsesOutput } from "@/ai/flows/suggested-responses";
import { Loader2, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const commentAssistFormSchema = z.object({
  postContent: z.string().min(20, { message: "投稿内容は20文字以上で入力してください。" }).max(2000, { message: "投稿内容は2000文字以内で入力してください。"}),
  ceoProfile: z.string().min(10, { message: "CEOのプロフィール概要は10文字以上で入力してください。" }).max(500, {message: "CEOのプロフィール概要は500文字以内で入力してください。"}),
});

type CommentAssistFormValues = z.infer<typeof commentAssistFormSchema>;

export default function CommentAssistForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedComments, setSuggestedComments] = useState<SuggestedResponsesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<CommentAssistFormValues>({
    resolver: zodResolver(commentAssistFormSchema),
    defaultValues: {
      postContent: "",
      ceoProfile: "",
    },
  });

  async function onSubmit(data: CommentAssistFormValues) {
    setIsLoading(true);
    setSuggestedComments(null);
    try {
      const result = await generateSuggestedResponses(data as SuggestedResponsesInput);
      setSuggestedComments(result);
      toast({
        title: "コメント案が生成されました",
        description: "AIがコメントの提案を作成しました。",
      });
    } catch (error) {
      console.error("Error generating comments:", error);
      toast({
        title: "エラー",
        description: "コメントの生成に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  const copyToClipboard = (text: string, language: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${language === 'Japanese' ? '日本語' : '英語'}のコメントをクリップボードにコピーしました！` });
    }).catch(err => {
      toast({ title: `コメントのコピーに失敗しました。`, variant: "destructive" });
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="postContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn投稿の内容</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="ここにコメントを書きたいLinkedIn投稿の本文を貼り付けてください..."
                    className="resize-y min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>コメントしたい投稿の本文です。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ceoProfile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEOの簡単なプロフィール／視点</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="CEOの専門分野やコメントする際の視点を簡潔に記述してください（例：「再生可能エネルギーの専門家、持続可能なソリューションに注力」）。"
                    className="resize-y min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>AIがコメントを効果的に調整するのに役立ちます。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                コメント生成中...
              </>
            ) : (
              "コメントを提案する"
            )}
          </Button>
        </form>
      </Form>

      {suggestedComments && (
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-semibold text-center font-headline">提案されたコメント</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-headline">英語のコメント (English Comment)</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(suggestedComments.englishComment, "English")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea readOnly value={suggestedComments.englishComment} className="min-h-[150px] resize-none bg-muted/30" />
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-headline">日本語のコメント</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(suggestedComments.japaneseComment, "Japanese")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea readOnly value={suggestedComments.japaneseComment} className="min-h-[150px] resize-none bg-muted/30" lang="ja" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
