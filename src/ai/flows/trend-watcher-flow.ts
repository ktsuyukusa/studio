
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
  author: z.string().describe('このトレンドを観察または報告している可能性のある情報源や人物の仮名または役職（例：「市場調査アナリスト」「業界レポート」など、キーワードに関連性の高いものが望ましい）'),
  authorAvatar: z.string().describe("A placeholder image URL for the author's avatar. Use https://placehold.co/80x80.png."),
  authorAvatarHint: z.string().describe("A data-ai-hint for the author's avatar, e.g., 'professional portrait' or 'business person'."),
  contentSnippet: z.string().describe('キーワードに関連して観察される具体的なトレンドや議論の主要なポイントを記述してください。これは、市場の動き、消費者行動の変化、技術の採用、規制の動向、業界内の共通認識など、注目すべきパターンや変化点です。例えば、「欧州市場では日本酒のプレミアム化が進んでおり、特に少量生産のクラフト酒への関心が高まっている」や「日本酒の輸出において、SNSを活用したD2Cマーケティングの成功事例が増加傾向にある」といった形式で記述してください。Max 2-3 sentences.'),
  likes: z.number().int().min(0).describe('A plausible number of likes for such a post/trend observation.'),
  comments: z.number().int().min(0).describe('A plausible number of comments related to this trend observation.'),
  reposts: z.number().int().min(0).describe('A plausible number of reposts or shares of this trend observation.'),
  postUrl: z.string().describe('このトレンドに関する追加情報や議論がなされる可能性のある場所を示すサンプルURL（例：関連ニュースカテゴリへのリンクや、google.comでの「キーワード」に関する検索クエリURLなど https://www.google.com/search?q={{{keywords}}}）。'),
  imageUrl: z.string().optional().describe("If the trend or discussion likely has an associated visual, provide a placeholder image URL (e.g., https://placehold.co/600x300.png)."),
  imageHint: z.string().optional().describe("If an imageUrl is provided, add a data-ai-hint for it, e.g., 'business graph' or 'team collaboration', relevant to the '{{{keywords}}}'."),
});

const TrendWatcherOutputSchema = z.object({
  trends: z.array(TrendPostSchema).describe('A list of 3-5 analyzed trends or significant discussion points based on the keywords.'),
});
export type TrendWatcherOutput = z.infer<typeof TrendWatcherOutputSchema>;

export async function generateTrendingTopics(input: TrendWatcherInput): Promise<TrendWatcherOutput> {
  return trendWatcherFlow(input);
}

const trendWatcherPrompt = ai.definePrompt({
  name: 'trendWatcherPrompt',
  input: {schema: TrendWatcherInputSchema},
  output: {schema: TrendWatcherOutputSchema},
  prompt: `あなたは、日本のCEO向けにLinkedIn上の最新ビジネストレンドを分析・特定し、要約する専門家です。
あなたの主な任務は、提供された「キーワード」に**直接関連する**、現在LinkedIn上で注目されている可能性のある**具体的なトレンドの分析結果または注目すべき議論のポイント**を3～5件、CEOが理解しやすい形で生成することです。

キーワード: {{{keywords}}}

**最重要指示:** 生成されるすべてのトレンド項目（特に\`contentSnippet\`）は、上記「キーワード」に密接に関連していなければなりません。一般的なビジネストピックではなく、**キーワードに特化した内容**を優先してください。

各トレンド項目には、以下の情報を含めてください：
- id: ユニークなID（例: "trend-1"）
- author: このトレンドを**観察または報告している**可能性のある情報源や人物の仮名または役職（例：「市場調査アナリスト」「業界レポート」など、キーワードに関連性の高いものが望ましい）
- authorAvatar: 著者のアバター用のプレースホルダー画像URL (https://placehold.co/80x80.png を使用)
- authorAvatarHint: 著者のアバターのdata-ai-hint (例: 'analyst photo', '{{{keywords}}} expert')
- contentSnippet: **キーワードに関連して観察される具体的なトレンドや議論の主要なポイントを記述してください。** これは、市場の動き、消費者行動の変化、技術の採用、規制の動向、業界内の共通認識など、注目すべきパターンや変化点です。例えば、「欧州市場では日本酒のプレミアム化が進んでおり、特に少量生産のクラフト酒への関心が高まっている」や「日本酒の輸出において、SNSを活用したD2Cマーケティングの成功事例が増加傾向にある」といった形式で記述してください。Max 2-3 sentences.
- likes: このトレンド観測に対して、もっともらしい「いいね！」の数。
- comments: このトレンド観測に関連する、もっともらしいコメント数。
- reposts: このトレンド観測の、もっともらしい再投稿数。
- postUrl: このトレンドに関する追加情報や議論がなされる可能性のある場所を示すサンプルURL（例：関連ニュースカテゴリへのリンクや、google.comでの「キーワード」に関する検索クエリURLなど https://www.google.com/search?q={{{keywords}}}）。
- imageUrl: トレンドや議論にキーワードと関連性の高い視覚情報が含まれそうな場合は、プレースホルダー画像URL (https://placehold.co/600x300.png を使用)。
- imageHint: imageUrlを提供する場合、その画像のdata-ai-hint (例: 'sake market analysis graph', 'european trade data', '{{{keywords}}}')

生成される内容は、日本のCEOが提供された「キーワード」について関心を持つであろう具体的なトレンド分析や議論のポイントでなければなりません。
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
        id: trend.id || `trend-${Date.now()}-${index}`, // Ensure ID exists
        authorAvatar: trend.authorAvatar || 'https://placehold.co/80x80.png', // Ensure avatar exists
      })),
    };
  }
);

