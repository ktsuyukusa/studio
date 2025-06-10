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
  postContent: z.string().min(20, { message: "Post content must be at least 20 characters." }).max(2000, { message: "Post content must be at most 2000 characters."}),
  ceoProfile: z.string().min(10, { message: "CEO profile summary must be at least 10 characters." }).max(500, {message: "CEO profile summary must be at most 500 characters."}),
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
        title: "Comments Suggested",
        description: "AI has generated comment suggestions for you.",
      });
    } catch (error) {
      console.error("Error generating comments:", error);
      toast({
        title: "Error",
        description: "Failed to generate comments. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  const copyToClipboard = (text: string, language: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${language} comment copied to clipboard!` });
    }).catch(err => {
      toast({ title: `Failed to copy ${language} comment.`, variant: "destructive" });
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
                <FormLabel>LinkedIn Post Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste the content of the LinkedIn post here..."
                    className="resize-y min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>The content of the post you want to comment on.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ceoProfile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brief CEO Profile/Perspective</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Briefly describe the CEO's expertise or the perspective they should comment from (e.g., 'Expert in renewable energy, focusing on sustainable solutions')."
                    className="resize-y min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This helps the AI tailor the comment effectively.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Comments...
              </>
            ) : (
              "Suggest Comments"
            )}
          </Button>
        </form>
      </Form>

      {suggestedComments && (
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-semibold text-center font-headline">Suggested Comments</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-headline">English Comment</CardTitle>
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
                <CardTitle className="text-xl font-headline">Japanese Comment (日本語コメント)</CardTitle>
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
