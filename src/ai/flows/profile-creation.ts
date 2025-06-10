
// src/ai/flows/profile-creation.ts
'use server';

/**
 * @fileOverview Generates a professional LinkedIn profile in both Japanese and English based on user answers to a guided questionnaire.
 *
 * - generateProfile - A function that handles the profile generation process.
 * - ProfileCreationInput - The input type for the generateProfile function.
 * - ProfileCreationOutput - The return type for the generateProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfileCreationInputSchema = z.object({
  name: z.string().describe('ユーザーのフルネーム。'),
  title: z.string().describe('ユーザーの現在の役職。'),
  company: z.string().describe('ユーザーの現在の会社名。'),
  companyProfile: z
    .string()
    .describe(
      '会社の簡単な説明（例：事業内容、設立年、従業員数など）。'
    ),
  roleAndResponsibilities: z
    .string()
    .describe('CEOとしての主な役割と責任。'),
  keyAchievements: z
    .string()
    .describe(
      'これまでのキャリアや現在の会社で達成した主要な成果（3つ程度）。具体的な事例や数値を含めるとより効果的です。'
    ),
  leadershipPhilosophy: z
    .string()
    .describe('リーダーシップ哲学や経営において大切にしていること。'),
  visionForCompany: z
    .string()
    .describe('会社を将来どのように成長させたいかのビジョン。'),
  skills: z
    .string()
    .describe(
      '専門スキルや強み（例：戦略立案、新規事業開発、DX推進など）。カンマ区切りで入力。'
    ),
  callToAction: z
    .string()
    .optional()
    .describe(
      '（任意）LinkedInでどのような繋がりを求めているか（例：新しいビジネスパートナー、業界の専門家との意見交換など）。'
    ),
  desiredProfileTone: z
    .string()
    .optional()
    .default('professional')
    .describe(
      'プロフィールの希望するトーン（例：professional, friendly, authoritative）。'
    ),
});
export type ProfileCreationInput = z.infer<typeof ProfileCreationInputSchema>;

const ProfileCreationOutputSchema = z.object({
  englishProfile: z
    .string()
    .describe('生成された英語のLinkedInプロフィール文章。'),
  japaneseProfile: z
    .string()
    .describe('生成された日本語のLinkedInプロフィール文章。'),
});
export type ProfileCreationOutput = z.infer<typeof ProfileCreationOutputSchema>;

export async function generateProfile(
  input: ProfileCreationInput
): Promise<ProfileCreationOutput> {
  return generateProfileFlow(input);
}

const profilePrompt = ai.definePrompt({
  name: 'profilePrompt',
  input: {schema: ProfileCreationInputSchema},
  output: {schema: ProfileCreationOutputSchema},
  prompt: `あなたは、CEO向けの魅力的なLinkedInプロフィールを作成する専門家です。
提供された情報に基づいて、プロフェッショナルなLinkedInプロフィールを英語と日本語の両方で作成してください。
プロフィールは、ユーザーの主要な成果やスキルを強調し、関連性の高いコンタクトや機会を引き付けるように調整してください。

以下の情報を利用して、特に「自己紹介（About）」セクションを充実させてください。各情報を自然に組み込み、説得力のある物語調のプロフィールを目指してください。

基本情報:
- 氏名: {{{name}}}
- 役職: {{{title}}}
- 会社名: {{{company}}}

詳細情報:
- 会社概要: {{{companyProfile}}}
- CEOとしての役割と責任: {{{roleAndResponsibilities}}}
- 主要な成果 (3つ程度): {{{keyAchievements}}}
- リーダーシップ哲学: {{{leadershipPhilosophy}}}
- 会社の将来ビジョン: {{{visionForCompany}}}
- スキル: {{{skills}}}
- LinkedInでの希望する繋がり (任意): {{{callToAction}}}
- プロフィールの希望トーン: {{{desiredProfileTone}}}

最終的なアウトプットは、LinkedInの「自己紹介（About）」セクションにそのまま使えるような、完成された文章にしてください。英語と日本語、両方のプロフィールを生成してください。
日本語のプロフィールは、日本のビジネス文化に適した、自然で丁寧な表現を心がけてください。
英語のプロフィールは、グローバルなビジネスシーンで通用する、プロフェッショナルかつダイナミックな表現を目指してください。
`,
});

const generateProfileFlow = ai.defineFlow(
  {
    name: 'generateProfileFlow',
    inputSchema: ProfileCreationInputSchema,
    outputSchema: ProfileCreationOutputSchema,
  },
  async input => {
    const {output} = await profilePrompt(input);
    return output!;
  }
);
