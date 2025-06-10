
'use server';
/**
 * @fileOverview A flow for generating insights on business trends relevant to Japanese CEOs.
 *
 * - generateTrendingTopics - A function that generates analyzed trend information.
 * - TrendWatcherInput - The input type for the generateTrendingTopics function.
 * - TrendWatcherOutput - The return type for the generateTrendingTopics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrendWatcherInputSchema = z.object({
  keywords: z.string().describe('Keywords or topics to analyze for trends (e.g., "日本酒 欧州市場", "GX戦略 日本企業").'),
});
export type TrendWatcherInput = z.infer<typeof TrendWatcherInputSchema>;

const TrendAnalysisSchema = z.object({
  id: z.string().describe('A unique identifier for the trend analysis item.'),
  trendTitle: z.string().describe('このトレンドを簡潔に表す日本語のタイトル。'),
  keyTrendPoints: z.array(z.string()).describe('トレンドの主要なポイントを日本語の箇条書きで。3～5点。'),
  trendAnalysis: z.string().describe('このトレンドが日本のCEOにとって何を意味するのか、日本語での簡単な分析や考察。2～3文程度。'),
  potentialNextSteps: z.array(z.string()).optional().describe('このトレンドを踏まえ、CEOが検討しうる具体的な次のステップや情報収集の提案を日本語で。AIが生成。例：「欧州市場に特化した食品展示会への参加を検討」「現地の日本食レストランチェーンとの提携可能性を調査」'),
  sampleSearchQuery: z.string().describe('このトレンドに関する追加情報を検索するためのGoogle検索クエリ例（日本語または英語）。URLエンコードは不要。例: "日本酒 欧州市場 規制"'),
  imageUrl: z.string().optional().describe("トレンド分析に関連する視覚情報があればプレースホルダー画像URL (https://placehold.co/600x300.png を使用)。"),
  imageHint: z.string().optional().describe("imageUrlを提供する場合、その画像のdata-ai-hint (例: '市場分析グラフ', '欧州地図 日本酒')、キーワード「{{{keywords}}}」と関連性のあるもの。"),
});
export type TrendAnalysis = z.infer<typeof TrendAnalysisSchema>;

const TrendWatcherOutputSchema = z.object({
  analyzedTrends: z.array(TrendAnalysisSchema).describe('A list of 3-4 analyzed business trends based on the keywords.'),
});
export type TrendWatcherOutput = z.infer<typeof TrendWatcherOutputSchema>;

export async function generateTrendingTopics(input: TrendWatcherInput): Promise<TrendWatcherOutput> {
  return trendWatcherFlow(input);
}

const trendWatcherPrompt = ai.definePrompt({
  name: 'trendWatcherPrompt',
  input: {schema: TrendWatcherInputSchema},
  output: {schema: TrendWatcherOutputSchema},
  prompt: `あなたは、日本のCEOがグローバル市場、特に指定された「キーワード」に関連するビジネストレンドを理解するのを支援する、シニア・ビジネスアナリストです。
あなたの主な任務は、提供された「キーワード」に基づいて、現在注目すべきビジネス上の**具体的なトレンド分析結果**を3～4件、CEOが行動を起こすための洞察と共に生成することです。

キーワード: {{{keywords}}}

各トレンド分析結果には、以下の情報を必ず含めてください：
- id: ユニークなID（例: "trend-analysis-1"）。
- trendTitle: このトレンドを簡潔に表す日本語のタイトル。
- keyTrendPoints: このトレンドの主要なポイントを日本語の箇条書きで3～5点。各ポイントは具体的で理解しやすいものにしてください。
- trendAnalysis: このトレンドが、キーワード「{{{keywords}}}」に関心を持つ日本のCEOにとって何を意味するのか、どのような影響があるのか、簡単な日本語の分析や考察を2～3文で記述してください。
- potentialNextSteps: (任意) このトレンドを踏まえ、CEOが検討しうる具体的な次のステップや情報収集の提案を日本語で1～2点挙げてください。AIが生成するものであり、実在の企業リスト等を保証するものではありません。例えば、「{{{keywords}}} に関連する欧州の主要な業界展示会への参加を検討する」「{{{keywords}}} 分野の専門家やコンサルタントに意見を求める」といった内容です。もし具体的な提案が困難な場合は、この項目は省略しても構いません。
- sampleSearchQuery: このトレンドに関する追加情報をGoogleで検索するための、効果的な検索クエリ例（日本語または英語）を提示してください。URLエンコードは不要です。例: "日本酒 欧州市場 最新トレンド" や "EU food import regulations sake" など。
- imageUrl: トレンド分析を視覚的に補足する画像が必要な場合は、プレースホルダー画像URL (https://placehold.co/600x300.png を使用)。画像は「{{{keywords}}}」と関連性が高いものにしてください。
- imageHint: imageUrlを提供する場合、その画像のdata-ai-hint。キーワード「{{{keywords}}}」に関連性の高いものを2単語以内で指定してください (例: '日本酒 輸出データ', '欧州規制 資料')。

生成される内容は、LinkedInの投稿のような形式ではなく、純粋なビジネス分析レポートの形式で、客観的かつ洞察に富んだものでなければなりません。
「LinkedIn上の注目トピック」のような文言は使用しないでください。
CEOが迅速に状況を把握し、次の行動を検討できるような、具体的で実用的な情報提供を心がけてください。

最終的なアウトプットは、指定されたJSONスキーマに従ってください。
`,
});

const trendWatcherFlow = ai.defineFlow(
  {
    name: 'trendWatcherFlow',
    inputSchema: TrendWatcherInputSchema,
    outputSchema: TrendWatcherOutputSchema,
  },
  async (input: TrendWatcherInput): Promise<TrendWatcherOutput> => {
    let rawOutputFromPrompt;
    try {
      rawOutputFromPrompt = (await trendWatcherPrompt(input)).output;
    } catch (e) {
      console.error('Error calling trendWatcherPrompt:', e);
      return { analyzedTrends: [] }; // Graceful fallback on prompt error
    }

    if (!rawOutputFromPrompt || !rawOutputFromPrompt.analyzedTrends || !Array.isArray(rawOutputFromPrompt.analyzedTrends)) {
      // Fallback if the AI output structure is not as expected (e.g., missing analyzedTrends or it's not an array)
      return { analyzedTrends: [] };
    }
    
    // At this point, rawOutputFromPrompt.analyzedTrends is an array, but its items might be malformed.
    // We will validate each item and provide defaults.
    const validatedTrends = rawOutputFromPrompt.analyzedTrends.map((trend, index) => {
      const currentTrend = typeof trend === 'object' && trend !== null ? trend : {};
      
      // Ensure keyTrendPoints and potentialNextSteps are arrays, defaulting to empty if not.
      const keyPoints = Array.isArray(currentTrend.keyTrendPoints) ? currentTrend.keyTrendPoints : [];
      const nextSteps = currentTrend.potentialNextSteps && Array.isArray(currentTrend.potentialNextSteps) 
                        ? currentTrend.potentialNextSteps 
                        : undefined; // Keep optional if not a valid array or not present

      return {
        id: String(currentTrend.id || `trend-${Date.now()}-${index}`),
        trendTitle: String(currentTrend.trendTitle || 'タイトル未設定'),
        keyTrendPoints: keyPoints.map(String), // Ensure all items in keyTrendPoints are strings
        trendAnalysis: String(currentTrend.trendAnalysis || '分析未提供'),
        potentialNextSteps: nextSteps ? nextSteps.map(String) : undefined, // Ensure items are strings if array exists
        sampleSearchQuery: String(currentTrend.sampleSearchQuery || ''),
        imageUrl: typeof currentTrend.imageUrl === 'string' ? currentTrend.imageUrl : undefined,
        imageHint: typeof currentTrend.imageHint === 'string' ? currentTrend.imageHint : undefined,
      } as TrendAnalysis; // Assert as TrendAnalysis after defaults and string conversions
    }).filter(trend => trend.trendTitle !== 'タイトル未設定'); // Optionally filter out trends that are too malformed

    return { analyzedTrends: validatedTrends };
  }
);
