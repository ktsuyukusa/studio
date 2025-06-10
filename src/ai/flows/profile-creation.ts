// src/ai/flows/profile-creation.ts
'use server';

/**
 * @fileOverview Generates a professional LinkedIn profile in both Japanese and English based on user answers.
 *
 * - generateProfile - A function that handles the profile generation process.
 * - ProfileCreationInput - The input type for the generateProfile function.
 * - ProfileCreationOutput - The return type for the generateProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfileCreationInputSchema = z.object({
  name: z.string().describe('The full name of the user.'),
  title: z.string().describe('The current job title of the user.'),
  company: z.string().describe('The current company of the user.'),
  experienceSummary: z
    .string()
    .describe(
      'A summary of the user\'s professional experience and key achievements.'
    ),
  skills: z
    .string()
    .describe('A comma-separated list of the user\'s skills.'),
  desiredProfileTone: z
    .string()
    .optional()
    .default('professional')
    .describe(
      'The desired tone of the profile (e.g., professional, friendly, authoritative).'
    ),
});
export type ProfileCreationInput = z.infer<typeof ProfileCreationInputSchema>;

const ProfileCreationOutputSchema = z.object({
  englishProfile: z
    .string()
    .describe('The generated LinkedIn profile in English.'),
  japaneseProfile: z
    .string()
    .describe('The generated LinkedIn profile in Japanese.'),
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
  prompt: `You are an expert LinkedIn profile writer, specializing in creating compelling profiles for CEOs.

  Based on the information provided, create a professional LinkedIn profile in both English and Japanese.
  Ensure the profile highlights the user's key achievements and skills, and is tailored to attract relevant connections and opportunities.

  Name: {{{name}}}
  Title: {{{title}}}
  Company: {{{company}}}
  Experience Summary: {{{experienceSummary}}}
  Skills: {{{skills}}}
  Desired Tone: {{{desiredProfileTone}}}

  Output the profiles in the following format:
  {
    "englishProfile": "...",
    "japaneseProfile": "..."
  }`,
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
