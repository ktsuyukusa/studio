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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateProfile, type ProfileCreationInput, type ProfileCreationOutput } from "@/ai/flows/profile-creation";
import { Loader2, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  experienceSummary: z.string().min(50, { message: "Experience summary must be at least 50 characters." }).max(1000, { message: "Experience summary must be at most 1000 characters."}),
  skills: z.string().min(5, { message: "Please list at least one skill." }),
  desiredProfileTone: z.string().optional().default("professional"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedProfiles, setGeneratedProfiles] = useState<ProfileCreationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      title: "",
      company: "",
      experienceSummary: "",
      skills: "",
      desiredProfileTone: "professional",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    setGeneratedProfiles(null);
    try {
      const result = await generateProfile(data as ProfileCreationInput);
      setGeneratedProfiles(result);
      toast({
        title: "Profiles Generated",
        description: "Your LinkedIn profiles have been successfully generated.",
      });
    } catch (error) {
      console.error("Error generating profile:", error);
      toast({
        title: "Error",
        description: "Failed to generate profiles. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  const copyToClipboard = (text: string, language: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${language} profile copied to clipboard!` });
    }).catch(err => {
      toast({ title: `Failed to copy ${language} profile.`, variant: "destructive" });
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Ken Tanaka" {...field} />
                </FormControl>
                <FormDescription>Your full name as you want it to appear on LinkedIn.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., CEO, Managing Director" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Company</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., GlobalLink Solutions Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experienceSummary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Summary</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Summarize your professional experience, key achievements, and expertise (50-1000 characters)."
                    className="resize-y min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Highlight your most impactful contributions and career milestones.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Skills</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Strategic Planning, International Business, Leadership, SaaS" {...field} />
                </FormControl>
                <FormDescription>List your most relevant skills, separated by commas.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="desiredProfileTone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desired Profile Tone</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., professional, friendly, authoritative" {...field} />
                </FormControl>
                <FormDescription>Default is 'professional'.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Profiles"
            )}
          </Button>
        </form>
      </Form>

      {generatedProfiles && (
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-semibold text-center font-headline">Generated Profiles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-headline">English Profile</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedProfiles.englishProfile, "English")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea readOnly value={generatedProfiles.englishProfile} className="min-h-[200px] resize-none bg-muted/30" />
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-headline">Japanese Profile (日本語プロフィール)</CardTitle>
                 <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedProfiles.japaneseProfile, "Japanese")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea readOnly value={generatedProfiles.japaneseProfile} className="min-h-[200px] resize-none bg-muted/30" lang="ja"/>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
