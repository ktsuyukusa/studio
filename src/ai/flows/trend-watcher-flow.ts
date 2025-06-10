
'use server';
/**
 * @fileOverview A flow for generating insights on trending LinkedIn topics for Japanese CEOs.
 *
 * - generateTrendingTopics - A function that generates trending topic examples.
 * - TrendWatcherInput - The input type for the generateTrendingTopics function.
 * - TrendWatcherOutput - The return type for the generateTrendingTopics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrendWatcherInputSchema = z.object({
  keywords: z.string().describe('Keywords or topics to search for trends (e.g., "デジタルトランスフォーメーション 日本", "サステナビリティ経営").'),
});
export type TrendWatcherInput = z.infer<typeof TrendWatcherInputSchema>;

const TrendPostSchema = z.object({
  id: z.string().describe('A unique identifier for the trend post.'),
  author: z.string().describe('The hypothetical author of the post (e.g., "業界アナリスト", "大手企業CEO").'),
  authorAvatar: z.string().describe("A placeholder image URL for the author's avatar. Use https://placehold.co/80x80.png."),
  authorAvatarHint: z.string().describe("A data-ai-hint for the author's avatar, e.g., 'professional portrait' or 'business person'."),
  contentSnippet: z.string().describe('A concise summary of the trending post or discussion topic. Max 2-3 sentences.'),
  likes: z.number().int().min(0).describe('A plausible number of likes for such a post.'),
  comments: z.number().int().min(0).describe('A plausible number of comments.'),
  reposts: z.number().int().min(0).describe('A plausible number of reposts or shares.'),
  postUrl: z.string().describe('A sample URL representing where such a discussion might occur (e.g., a link to a relevant news category, or a search query like https://www.google.com/search?q=キーワード).'),
  imageUrl: z.string().optional().describe("If the post likely contains an image, provide a placeholder image URL (e.g., https://placehold.co/600x300.png)."),
  imageHint: z.string().optional().describe("If an imageUrl is provided, add a data-ai-hint for it, e.g., 'business graph' or 'team collaboration'."),
});

const TrendWatcherOutputSchema = z.object({
  trends: z.array(TrendPostSchema).describe('A list of 3-5 hypothetical trending posts or discussion topics based on the keywords.'),
});
export type TrendWatcherOutput = z.infer<typeof TrendWatcherOutputSchema>;

export async function generateTrendingTopics(input: TrendWatcherInput): Promise<TrendWatcherOutput> {
  return trendWatcherFlow(input);
}

const trendWatcherPrompt = ai.definePrompt({
  name: 'trendWatcherPrompt',
  input: {schema: TrendWatcherInputSchema},
  output: {schema: TrendWatcherOutputSchema},
  prompt: `あなたは、日本のCEO向けにLinkedIn上の最新ビジネストレンドを分析・要約する専門家です。
あなたの主な任務は、提供された「キーワード」に**直接関連する**、現在注目されている可能性のあるLinkedIn上の架空のディスカッショントレンドや投稿の例を3～5件生成することです。

キーワード: {{{keywords}}}

**最重要指示:** 生成されるすべてのトレンド項目（特に\`contentSnippet\`）は、上記「キーワード」に密接に関連していなければなりません。例えば、キーワードが「日本酒 欧州市場」であれば、生成される内容は日本酒の欧州市場におけるトレンド、課題、機会、関連ニュースなどに関するものであるべきです。一般的なビジネストピックではなく、**キーワードに特化した内容**を優先してください。

各トレンド項目には、以下の情報を含めてください：
- id: ユニークなID（例: "trend-1"）
- author: 投稿者の仮名または役職（例：「大手飲料メーカー海外事業部長」「食品業界アナリスト」など、キーワードに関連性の高いものが望ましい）
- authorAvatar: 著者のアバター用のプレースホルダー画像URL (https://placehold.co/80x80.png を使用)
- authorAvatarHint: 著者のアバターのdata-ai-hint (例: 'executive portrait', 'sake expert')
- contentSnippet: **キーワードに関連する**投稿内容やディスカッショントピックの簡潔な日本語の要約（2～3文程度）。日本のビジネスリーダーが当該キーワードについてどのような議論をしているか、または関心を持つ可能性のある内容にしてください。
- likes: もっともらしい「いいね！」の数。
- comments: もっともらしいコメント数。
- reposts: もっともらしい再投稿数。
- postUrl: このような議論がなされる可能性のある場所を示すサンプルURL（例：関連ニュースカテゴリへのリンクや、google.comでの「キーワード」に関する検索クエリURLなど https://www.google.com/search?q={{{keywords}}}）。
- imageUrl: 投稿にキーワードと関連性の高い画像が含まれそうな場合は、プレースホルダー画像URL (https://placehold.co/600x300.png を使用)。
- imageHint: imageUrlを提供する場合、その画像のdata-ai-hint (例: 'sake bottles on display', 'european market chart', '{{{keywords}}}')

生成される内容は、日本のCEOが提供された「キーワード」について関心を持つであろう具体的なトレンドや議論の例でなければなりません。
author名は日本語、または日本のビジネスシーンで一般的な英語表記にしてください。

最終的なアウトプットは、指定されたJSONスキーマに従ってください。
`,
});

const trendWatcherFlow = ai.defineFlow(
  {
    name: 'trendWatcherFlow',
    inputSchema: TrendWatcherInputSchema,
    outputSchema: TrendWatcherOutputSchema,
  },
  async (input: TrendWatcherInput) => {
    const {output} = await trendWatcherPrompt(input);
    if (!output) {
      return { trends: [] };
    }
    return {
      trends: output.trends.map((trend, index) => ({
        ...trend,
        id: trend.id || `trend-${Date.now()}-${index}`,
      })),
    };
  }
);
