// src/ai/flows/post-generation.ts
'use server';
/**
 * @fileOverview A post generation AI agent.
 *
 * - generatePost - A function that handles the post generation process.
 * - GeneratePostInput - The input type for the generatePost function.
 * - GeneratePostOutput - The return type for the generatePost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePostInputSchema = z.object({
  topic: z.string().describe('The topic of the post to generate.'),
  keywords: z.string().describe('Relevant keywords to include in the post.'),
  tone: z.string().describe('The tone of the post (e.g., professional, friendly, authoritative).'),
});
export type GeneratePostInput = z.infer<typeof GeneratePostInputSchema>;

const GeneratePostOutputSchema = z.object({
  japanesePost: z.string().describe('The generated post in Japanese.'),
  englishPost: z.string().describe('The translated post in English.'),
});
export type GeneratePostOutput = z.infer<typeof GeneratePostOutputSchema>;

export async function generatePost(input: GeneratePostInput): Promise<GeneratePostOutput> {
  return generatePostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePostPrompt',
  input: {schema: GeneratePostInputSchema},
  output: {schema: GeneratePostOutputSchema},
  prompt: `You are an expert content creator specializing in generating engaging LinkedIn posts for CEOs.

You will generate an original long-form post in Japanese based on the provided topic, keywords, and tone. 
Then, you will translate the generated Japanese post into English.

Topic: {{{topic}}}
Keywords: {{{keywords}}}
Tone: {{{tone}}}

Ensure the content is appropriate for LinkedIn and reflects the CEO's expertise.
`,
});

const generatePostFlow = ai.defineFlow(
  {
    name: 'generatePostFlow',
    inputSchema: GeneratePostInputSchema,
    outputSchema: GeneratePostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
