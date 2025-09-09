'use server';

/**
 * @fileOverview Budget suggestion AI agent.
 *
 * - suggestBudget - A function that suggests a budget.
 * - SuggestBudgetInput - The input type for the suggestBudget function.
 * - SuggestBudgetOutput - The return type for the suggestBudget function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBudgetInputSchema = z.object({
  financialGoals: z
    .string()
    .describe('A brief overview of the user\'s financial goals.'),
  transactions: z.array(z.object({
    amount: z.number(),
    category: z.string(),
    description: z.string().optional(),
    date: z.string(),
  })).optional().describe('A list of recent transactions to inform budget suggestions.'),
});
export type SuggestBudgetInput = z.infer<typeof SuggestBudgetInputSchema>;

const SuggestBudgetOutputSchema = z.object({
  weeklyBudget: z.number().describe('A suggested weekly budget based on the user\'s financial goals.'),
  monthlyBudget: z.number().describe('A suggested monthly budget based on the user\'s financial goals.'),
  reasoning: z.string().describe('The reasoning behind the budget suggestions.'),
});
export type SuggestBudgetOutput = z.infer<typeof SuggestBudgetOutputSchema>;

export async function suggestBudget(input: SuggestBudgetInput): Promise<SuggestBudgetOutput> {
  return suggestBudgetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBudgetPrompt',
  input: {schema: SuggestBudgetInputSchema},
  output: {schema: SuggestBudgetOutputSchema},
  prompt: `You are a personal finance advisor. Based on the user's financial goals and recent transactions, suggest a realistic weekly and monthly budget.

Financial Goals: {{{financialGoals}}}

Recent Transactions:
{{#if transactions}}
  {{#each transactions}}
    - Amount: {{{amount}}}, Category: {{{category}}}, Description: {{{description}}}, Date: {{{date}}}
  {{/each}}
{{else}}
  No recent transactions provided.
{{/if}}

Provide a weeklyBudget and monthlyBudget, as well as reasoning for your suggestions.
`,
});

const suggestBudgetFlow = ai.defineFlow(
  {
    name: 'suggestBudgetFlow',
    inputSchema: SuggestBudgetInputSchema,
    outputSchema: SuggestBudgetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
