// src/ai/flows/suggested-responses.ts
'use server';

/**
 * @fileOverview A flow for generating suggested comments in Japanese and English for LinkedIn posts.
 *
 * - generateSuggestedResponses - A function that generates suggested comments.
 * - SuggestedResponsesInput - The input type for the generateSuggestedResponses function.
 * - SuggestedResponsesOutput - The return type for the generateSuggestedResponses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestedResponsesInputSchema = z.object({
  postContent: z
    .string()
    .describe('The content of the LinkedIn post to generate comments for.'),
  ceoProfile: z
    .string()
    .describe('Brief profile of the CEO to tailor the comment.'),
});

export type SuggestedResponsesInput = z.infer<typeof SuggestedResponsesInputSchema>;

const SuggestedResponsesOutputSchema = z.object({
  englishComment: z
    .string()
    .describe('A suggested comment in English for the given post.'),
  japaneseComment: z
    .string()
    .describe('A suggested comment in Japanese for the given post.'),
});

export type SuggestedResponsesOutput = z.infer<typeof SuggestedResponsesOutputSchema>;

export async function generateSuggestedResponses(
  input: SuggestedResponsesInput
): Promise<SuggestedResponsesOutput> {
  return suggestedResponsesFlow(input);
}

const suggestedResponsesPrompt = ai.definePrompt({
  name: 'suggestedResponsesPrompt',
  input: {schema: SuggestedResponsesInputSchema},
  output: {schema: SuggestedResponsesOutputSchema},
  prompt: `You are a personal assistant to a CEO, helping them engage on LinkedIn.

Generate a thoughtful and relevant comment in both English and Japanese for the following LinkedIn post.

Post Content: {{{postContent}}}

Consider the CEO's profile when crafting the comment to ensure it aligns with their expertise and perspective.

CEO Profile: {{{ceoProfile}}}

Ensure that the Japanese comment is natural and appropriate for a business context.

Output the comments in the following format:

English Comment: [Suggested English Comment]
Japanese Comment: [Suggested Japanese Comment]`,
});

const suggestedResponsesFlow = ai.defineFlow(
  {
    name: 'suggestedResponsesFlow',
    inputSchema: SuggestedResponsesInputSchema,
    outputSchema: SuggestedResponsesOutputSchema,
  },
  async input => {
    const {output} = await suggestedResponsesPrompt(input);
    return output!;
  }
);
