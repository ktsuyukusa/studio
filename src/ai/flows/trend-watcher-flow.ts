
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
  authorAvatar: z.string().url().describe("A placeholder image URL for the author's avatar. Use https://placehold.co/80x80.png."),
  authorAvatarHint: z.string().describe("A data-ai-hint for the author's avatar, e.g., 'professional portrait' or 'business person'."),
  contentSnippet: z.string().describe('A concise summary of the trending post or discussion topic. Max 2-3 sentences.'),
  likes: z.number().int().min(0).describe('A plausible number of likes for such a post.'),
  comments: z.number().int().min(0).describe('A plausible number of comments.'),
  reposts: z.number().int().min(0).describe('A plausible number of reposts or shares.'),
  postUrl: z.string().url().describe('A sample URL representing where such a discussion might occur (e.g., a link to a relevant news category, or a search query like https://www.google.com/search?q=キーワード).'),
  imageUrl: z.string().url().optional().describe("If the post likely contains an image, provide a placeholder image URL (e.g., https://placehold.co/600x300.png)."),
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
提供されたキーワードに基づいて、現在注目されている可能性のある架空のLinkedIn投稿やディスカッショントピックの例を3～5件生成してください。

キーワード: {{{keywords}}}

各トレンド項目には、以下の情報を含めてください：
- id: ユニークなID（例: "trend-1"）
- author: 投稿者の仮名または役職（例：「大手製造業CEO」「DXコンサルタント」）
- authorAvatar: 著者のアバター用のプレースホルダー画像URL (https://placehold.co/80x80.png を使用)
- authorAvatarHint: 著者のアバターのdata-ai-hint (例: 'professional portrait', 'technology expert')
- contentSnippet: 投稿内容の簡潔な要約（2～3文程度）。日本のビジネスリーダーが関心を持つような内容にしてください。
- likes: もっともらしい「いいね！」の数。
- comments: もっともらしいコメント数。
- reposts: もっともらしい再投稿数。
- postUrl: このような議論がなされる可能性のある場所を示すサンプルURL（例：関連ニュースカテゴリへのリンクや、google.comでの検索クエリURLなど https://www.google.com/search?q=トピック）。
- imageUrl: 投稿に画像が含まれそうな場合は、プレースホルダー画像URL (https://placehold.co/600x300.png を使用)。
- imageHint: imageUrlを提供する場合、その画像のdata-ai-hint (例: 'data visualization', 'sustainable energy')

生成される内容は、日本のCEOの関心事（例：デジタルトランスフォーメーション、グローバル戦略、サステナビリティ、リーダーシップ、組織改革、最新技術のビジネス応用など）と関連性が高いものにしてください。
contentSnippetは日本語で生成してください。
author名は日本語、または日本のビジネスシーンで一般的な英語表記（例：Ken Suzuki, CEO of Future Inc.）にしてください。

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
      // Handle cases where the AI might return an empty or unexpected response.
      // For simplicity, returning an empty array, but more robust error handling could be added.
      return { trends: [] };
    }
    // Ensure IDs are unique if the model doesn't guarantee it, though it's asked to.
    return {
      trends: output.trends.map((trend, index) => ({
        ...trend,
        id: trend.id || `trend-${Date.now()}-${index}`, // Fallback ID
      })),
    };
  }
);
