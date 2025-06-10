
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const profileFormSchema = z.object({
  name: z.string().min(1, { message: "お名前を入力してください。" }),
  title: z.string().min(2, { message: "役職を2文字以上で入力してください。" }),
  company: z.string().min(1, { message: "会社名を入力してください。" }),
  companyProfile: z.string().min(20, { message: "会社概要を20文字以上で入力してください。" }).max(500, { message: "会社概要は500文字以内で入力してください。"}),
  roleAndResponsibilities: z.string().min(20, { message: "役割と責任を20文字以上で入力してください。" }).max(1000, { message: "役割と責任は1000文字以内で入力してください。"}),
  keyAchievements: z.string().min(20, { message: "主要な成果を20文字以上で入力してください。" }).max(1000, { message: "主要な成果は1000文字以内で入力してください。"}),
  leadershipPhilosophy: z.string().min(20, { message: "リーダーシップ哲学を20文字以上で入力してください。" }).max(1000, { message: "リーダーシップ哲学は1000文字以内で入力してください。"}),
  visionForCompany: z.string().min(20, { message: "会社のビジョンを20文字以上で入力してください。" }).max(1000, { message: "会社のビジョンは1000文字以内で入力してください。"}),
  skills: z.string().min(2, { message: "スキルを1つ以上入力してください（カンマ区切り）。" }),
  callToAction: z.string().optional(),
  desiredProfileTone: z.string().optional().default("professional"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const tones = [
  { value: "professional", label: "プロフェッショナル (Professional)" },
  { value: "friendly", label: "フレンドリー (Friendly)" },
  { value: "authoritative", label: "権威的 (Authoritative)" },
  { value: "inspirational", label: "インスピレーショナル (Inspirational)" },
  { value: "thought-provoking", label: "示唆に富む (Thought-provoking)" },
];


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
      companyProfile: "",
      roleAndResponsibilities: "",
      keyAchievements: "",
      leadershipPhilosophy: "",
      visionForCompany: "",
      skills: "",
      callToAction: "",
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
        title: "プロフィールが生成されました",
        description: "LinkedIn用のプロフィールが正常に作成されました。",
      });
    } catch (error) {
      console.error("Error generating profile:", error);
      toast({
        title: "エラー",
        description: "プロフィールの生成に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  const copyToClipboard = (text: string, language: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${language === 'Japanese' ? '日本語' : '英語'}のプロフィールをクリップボードにコピーしました！` });
    }).catch(err => {
      toast({ title: `プロフィールのコピーに失敗しました。`, variant: "destructive" });
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
                <FormLabel>お名前（フルネーム）</FormLabel>
                <FormControl>
                  <Input placeholder="例：山田 太郎" {...field} />
                </FormControl>
                <FormDescription>LinkedInプロフィールに表示されるお名前です。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>現在の役職</FormLabel>
                <FormControl>
                  <Input placeholder="例：代表取締役社長、CEO" {...field} />
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
                <FormLabel>現在の会社名</FormLabel>
                <FormControl>
                  <Input placeholder="例：株式会社グローバルリンクソリューションズ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyProfile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>会社概要</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="あなたの会社について簡潔に説明してください（例：事業内容、設立年、従業員数、企業文化など）。"
                    className="resize-y min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>会社の魅力が伝わるように記述しましょう。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roleAndResponsibilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEOとしての主な役割と責任</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="事業戦略の策定、組織運営、新規市場開拓など、あなたの主な役割と責任を具体的に記述してください。"
                    className="resize-y min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>どのようなリーダーシップを発揮しているかが分かるようにしましょう。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keyAchievements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>主要な成果（3つ程度）</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="これまでのキャリアや現在の会社で達成した主要な成果を3つ程度挙げてください。具体的な事例や数値（例：売上〇〇％向上、新規顧客数〇〇件獲得など）を交えると、より説得力が増します。"
                    className="resize-y min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>あなたの実績をアピールしましょう。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="leadershipPhilosophy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>リーダーシップ哲学・経営において大切にしていること</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="あなたのリーダーシップのスタイルや、経営を行う上で最も重視している価値観、信念などを記述してください。"
                    className="resize-y min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>あなたの人柄や経営者としての考え方を伝えましょう。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visionForCompany"
            render={({ field }) => (
              <FormItem>
                <FormLabel>会社の将来ビジョン</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="あなたの会社を将来どのように成長させたいですか？中期的な目標や長期的な夢、社会にどのような影響を与えたいかなど、今後のビジョンを具体的に記述してください。"
                    className="resize-y min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>将来への展望を語り、共感を呼びましょう。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>スキル・専門分野</FormLabel>
                <FormControl>
                  <Input placeholder="例：戦略立案, 新規事業開発, DX推進, グローバルビジネス" {...field} />
                </FormControl>
                <FormDescription>あなたの専門スキルや強みをカンマ（,）区切りで入力してください。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="callToAction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedInでの繋がり（任意）</FormLabel>
                <FormControl>
                  <Input placeholder="例：新規ビジネスパートナー, 業界専門家との意見交換" {...field} />
                </FormControl>
                <FormDescription>LinkedInでどのような繋がりを求めているか具体的に記述すると、目的の人物と繋がりやすくなります。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="desiredProfileTone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>プロフィールの希望トーン</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="トーンを選択してください" />
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
                <FormDescription>生成されるプロフィールの文体を指定できます。デフォルトは「プロフェッショナル」です。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              "プロフィールを生成する"
            )}
          </Button>
        </form>
      </Form>

      {generatedProfiles && (
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-semibold text-center font-headline">生成されたプロフィール</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-headline">日本語プロフィール</CardTitle>
                 <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedProfiles.japaneseProfile, "Japanese")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea readOnly value={generatedProfiles.japaneseProfile} className="min-h-[200px] resize-none bg-muted/30" lang="ja"/>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-headline">英語プロフィール (English Profile)</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedProfiles.englishProfile, "English")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea readOnly value={generatedProfiles.englishProfile} className="min-h-[200px] resize-none bg-muted/30" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
