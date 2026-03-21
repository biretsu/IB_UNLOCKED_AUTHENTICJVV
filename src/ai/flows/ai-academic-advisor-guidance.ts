'use server';
/**
 * @fileOverview An AI academic advisor to help IB students with subject choices and career paths.
 * 
 * This rebuild optimizes the flow for production stability on platforms like Vercel.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIAcademicAdvisorGuidanceInputSchema = z.object({
  question: z
    .string()
    .describe('The natural language question from the IB student.'),
});
export type AIAcademicAdvisorGuidanceInput = z.infer<
  typeof AIAcademicAdvisorGuidanceInputSchema
>;

const AIAcademicAdvisorGuidanceOutputSchema = z.object({
  answer: z.string().describe('The encouraging and clear guidance from the AI academic advisor.'),
});
export type AIAcademicAdvisorGuidanceOutput = z.infer<
  typeof AIAcademicAdvisorGuidanceOutputSchema
>;

/**
 * Main entry point for the AI Academic Advisor.
 * Optimized as a direct server action for Vercel production stability.
 */
export async function aiAcademicAdvisorGuidance(
  input: AIAcademicAdvisorGuidanceInput
): Promise<AIAcademicAdvisorGuidanceOutput> {
  try {
    const response = await ai.generate({
      system: `You are an encouraging, clear, and calm school counselor specializing in International Baccalaureate (IB) education.
Your primary goal is to provide helpful guidance based on real student experiences, academic statistics, and university prerequisites.

### YOUR CORE ADVICE (SENIOR WISDOM):
- **4 HLs Warning:** Taking 4 HLs is generally NOT recommended. Most students drop the 4th by the end of DP1. Only recommend it for students who want to "test" a subject.
- **Subject Enjoyment vs. Prestige:** Students perform better (and get higher total points) with subjects they enjoy rather than subjects they think look "prestigious."
- **The "Jump" Warning:** The difficulty gap from SL to HL is exponential in Math AA, Chemistry, and Physics. It's linear in Economics and English.
- **The ESS Advantage:** ESS is interdisciplinary (Group 3 & 4), which can free up space for another elective (like 2 Arts or 3 Sciences).
- **The "Easy" Myth:** Subjects like Math AI SL or Geography still require consistent work to get a 7. No IB subject is "free."
- **Science Spectrum:** 
    - Physics: Understanding concepts/logic.
    - Biology: Volume of content/memorization.
    - Chemistry: A mix of both, requiring significant time.
- **Arts Dedication:** Visual Arts, Film, and Theatre require significant "studio time" outside of class.
- **University Prereqs:** Engineering/CS usually requires Math AA HL + Physics HL. Medicine requires Bio HL + Chem HL.

### RESPONSE STYLE:
- Be empathetic. IB is stressful; you are the calm in the storm.
- Be specific. If they ask about Medicine, mention Bio/Chem.
- Be realistic but encouraging.`,
      prompt: input.question,
      output: {
        schema: AIAcademicAdvisorGuidanceOutputSchema,
      },
    });

    if (!response.output) {
      throw new Error('No output returned from AI');
    }

    return response.output;
  } catch (error) {
    console.error('Advisor Action Error:', error);
    throw new Error('The advisor is currently busy. Please try again in a moment.');
  }
}
