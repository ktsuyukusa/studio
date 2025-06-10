
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generatePost, type GeneratePostInput, type GeneratePostOutput } from "@/ai/flows/post-generation";
import { Loader2, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const postForgeFormSchema = z.object({
  topic: z.string().min(3, { message: "トピックは3文字以上で入力してください。" }).max(100, {message: "トピックは100文字以内で入力してください。"}),
  keywords: z.string().min(2, { message: "キーワードは2文字以上で入力してください。" }).max(150, {message: "キーワードは150文字以内で入力してください。"}),
  tone: z.string({ required_error: "希望のトーンを選択してください。" }),
});

type PostForgeFormValues = z.infer<typeof postForgeFormSchema>;

const tones = [
  { value: "professional", label: "プロフェッショナル (Professional)" },
  { value: "friendly", label: "フレンドリー (Friendly)" },
  { value: "authoritative", label: "権威的 (Authoritative)" },
  { value: "inspirational", label: "インスピレーショナル (Inspirational)" },
  { value: "informative", label: "情報提供型 (Informative)" },
  { value: "thought-provoking", label: "示唆に富む (Thought-provoking)" },
];


export default function PostForgeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratePostOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<PostForgeFormValues>({
    resolver: zodResolver(postForgeFormSchema),
    defaultValues: {
      topic: "",
      keywords: "",
      tone: "professional",
    },
  });

  async function onSubmit(data: PostForgeFormValues) {
    setIsLoading(true);
    setGeneratedPosts(null);
    try {
      const result = await generatePost(data as GeneratePostInput);
      setGeneratedPosts(result);
      toast({
        title: "投稿が生成されました",
        description: "LinkedIn用の投稿が正常に作成されました。",
      });
    } catch (error) {
      console.error("Error generating posts:", error);
      toast({
        title: "エラー",
        description: "投稿の生成に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  const copyToClipboard = (text: string, language: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${language === 'Japanese' ? '日本語' : '英語'}の投稿をクリップボードにコピーしました！` });
    }).catch(err => {
      toast({ title: `投稿のコピーに失敗しました。`, variant: "destructive" });
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>投稿のトピック</FormLabel>
                <FormControl>
                  <Input placeholder="例：グローバルビジネスにおけるAIの未来" {...field} />
                </FormControl>
                <FormDescription>投稿の主なテーマは何ですか？</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>キーワード</FormLabel>
                <FormControl>
                  <Input placeholder="例：人工知能, 国際貿易, イノベーション" {...field} />
                </FormControl>
                <FormDescription>投稿に含めたい関連キーワードをカンマ区切りで入力してください。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>希望のトーン</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="トーンを選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>投稿に希望する文体を選択してください。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                投稿を生成中...
              </>
            ) : (
              "投稿を生成する"
            )}
          </Button>
        </form>
      </Form>

      {generatedPosts && (
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-semibold text-center font-headline">生成された投稿</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-headline">日本語の投稿</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedPosts.japanesePost, "Japanese")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea readOnly value={generatedPosts.japanesePost} className="min-h-[250px] resize-none bg-muted/30" lang="ja" />
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-headline">英語の投稿 (English Post)</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedPosts.englishPost, "English")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea readOnly value={generatedPosts.englishPost} className="min-h-[250px] resize-none bg-muted/30" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
