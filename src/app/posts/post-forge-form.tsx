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
  topic: z.string().min(5, { message: "Topic must be at least 5 characters." }).max(100, {message: "Topic must be at most 100 characters."}),
  keywords: z.string().min(3, { message: "Keywords must be at least 3 characters." }).max(150, {message: "Keywords must be at most 150 characters."}),
  tone: z.string({ required_error: "Please select a tone." }),
});

type PostForgeFormValues = z.infer<typeof postForgeFormSchema>;

const tones = ["professional", "friendly", "authoritative", "inspirational", "informative"];

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
        title: "Posts Generated",
        description: "Your LinkedIn posts have been successfully generated.",
      });
    } catch (error) {
      console.error("Error generating posts:", error);
      toast({
        title: "Error",
        description: "Failed to generate posts. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  const copyToClipboard = (text: string, language: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${language} post copied to clipboard!` });
    }).catch(err => {
      toast({ title: `Failed to copy ${language} post.`, variant: "destructive" });
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
                <FormLabel>Post Topic</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., The Future of AI in Global Business" {...field} />
                </FormControl>
                <FormDescription>What is the main subject of your post?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., artificial intelligence, international trade, innovation" {...field} />
                </FormControl>
                <FormDescription>Relevant keywords to include, separated by commas.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tone of Voice</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone} value={tone} className="capitalize">
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Choose the desired tone for your post.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Posts...
              </>
            ) : (
              "Generate Posts"
            )}
          </Button>
        </form>
      </Form>

      {generatedPosts && (
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-semibold text-center font-headline">Generated Posts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-headline">Japanese Post (日本語投稿)</CardTitle>
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
                <CardTitle className="text-xl font-headline">English Post</CardTitle>
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
