'use server';
/**
 * @fileOverview An AI academic advisor flow for the IB Unlocked platform.
 * Optimized for Vercel production stability and academic accuracy.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const maxDuration = 60;

const AIAcademicAdvisorGuidanceInputSchema = z.object({
  question: z.string().describe('The natural language question from the IB student.'),
});
export type AIAcademicAdvisorGuidanceInput = z.infer<typeof AIAcademicAdvisorGuidanceInputSchema>;

const AIAcademicAdvisorGuidanceOutputSchema = z.object({
  answer: z.string().describe('The guidance provided by the AI Academic Advisor.'),
});
export type AIAcademicAdvisorGuidanceOutput = z.infer<typeof AIAcademicAdvisorGuidanceOutputSchema>;

export async function aiAcademicAdvisorGuidance(input: AIAcademicAdvisorGuidanceInput): Promise<AIAcademicAdvisorGuidanceOutput> {
  if (!process.env.GOOGLE_GENAI_API_KEY && process.env.NODE_ENV === 'production') {
    throw new Error('Advisor API configuration missing. Please set GOOGLE_GENAI_API_KEY.');
  }

  try {
    const response = await ai.generate({
      system: `You are an expert IB World School Counselor.
Your guidance must be strictly accurate based on global university entrance standards.

### CRITICAL DISCLAIMER:
- You MUST explicitly state that your advice is for informational purposes only.
- You MUST advise students to ALWAYS verify these requirements with their official school University Counselor and specific university portals before making final decisions.

### CRITICAL KNOWLEDGE:
- Economics: Economics HL is recommended but NOT mandatory.
- Computer Science: Computer Science HL is recommended but NOT mandatory.
- Medicine (UK/Europe): The absolute non-negotiable prerequisites are Chemistry HL and Biology HL. Additionally, an outside-of-school Physics course is recommended.
- The Math Myth: For UK Medicine, Math AA HL is almost NEVER required. AA SL is perfectly acceptable. Do not recommend AA HL for Medicine unless the student targets a math-heavy research track at a specific university.
- Psychology: Psychology HL is recommended but NOT mandatory.
- Global Business: A Social Science HL is recommended. Math is important but grades matter more than specific courses.
- Finance: Economics HL is recommended AND HL Math is recommended. Both Math AI HL and Math AA HL work for Finance.
- Fashion Design: Visual Arts at least SL is recommended, and HL is an option if the student wants to strengthen their portfolio.
- Engineering/Physics: Civil, Mechanical, and Aerospace Engineering REQUIRE Math AA HL and Physics HL.
- Computer Science: REQUIRES Math AA HL. Physics HL and Computer Science HL are recommended but NOT mandatory.
- 4 HLs Policy: Strongly advise against 4 HLs. Universities prefer high scores in 3 HLs (777) over average scores in 4 (6666).

### STYLE:
- Professional, encouraging, and data-driven.
- Always include a polite reminder to check with a professional counselor.`,
      prompt: input.question,
      output: {
        schema: AIAcademicAdvisorGuidanceOutputSchema,
      },
    });

    if (!response.output) throw new Error('AI failed to generate a valid response.');
    return response.output;
  } catch (error) {
    console.error('AI Advisor Execution Error:', error);
    return {
      answer: "I apologize, but I'm currently undergoing some system maintenance. Please verify your environment configuration or try again in a moment. Remember to consult your official school counselor for critical decisions."
    };
  }
}
