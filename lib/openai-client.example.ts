/**
 * Example usage of SmartAssistant from lib/openai-client.ts
 * These are reference patterns. Adapt as needed for your use cases.
 */

import { SmartAssistant, smartQuery } from '@/lib/openai-client';
const configuredModel = process.env.OPENAI_MODEL || 'gpt-5.4';
type ExampleConversationHistory = Array<{ role: 'user' | 'assistant'; content: string }>;

/**
 * Example 1: Multi-turn conversation with state.
 * Ideal for interactive chat, support tickets, or iterative coding help.
 */
async function multiTurnExample() {
  const assistant = new SmartAssistant({ model: configuredModel });

  // Turn 1
  const response1 = await assistant.chat('Explain React hooks in one sentence.');
  console.log('Assistant:', response1);

  // Turn 2 (context maintained)
  const response2 = await assistant.chat('How do I use useState?');
  console.log('Assistant:', response2);

  // Save history if needed
  const history = assistant.getHistory();
  console.log('Conversation history:', history);
}

/**
 * Example 2: Single-turn stateless query.
 * Ideal for one-off tasks: code generation, linting feedback, docs.
 */
async function singleTurnExample() {
  const response = await smartQuery('Generate TypeScript type for a blog post.', {
    model: configuredModel,
  });
  console.log('Response:', response);
}

/**
 * Example 3: Conversation with reset.
 * Load history, ask follow-ups, then start fresh.
 */
async function resetExample() {
  const assistant = new SmartAssistant({ model: configuredModel });

  await assistant.chat('What is a closure?');
  console.log('History:', assistant.getHistory());

  // Start new conversation
  assistant.reset();
  const response = await assistant.chat('What is async/await?');
  console.log('New conversation:', response);
}

/**
 * Example 4: API route handler pattern (Next.js).
 * POST /api/ask to handle user queries.
 */
export async function handleAskRequest(userMessage: string) {
  try {
    const response = await smartQuery(userMessage, { model: configuredModel });
    return {
      status: 'success',
      data: response,
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Example 5: Code generation helper.
 * Prompt template for consistent code generation.
 */
async function generateCode(description: string) {
  const prompt = `Generate minimal, production-ready TypeScript code for: ${description}. 
Include type definitions and one example usage.`;

  return smartQuery(prompt);
}

/**
 * Example 6: Load and continue conversation from DB/cache.
 */
async function resumeConversation(savedHistory: ExampleConversationHistory) {
  const assistant = new SmartAssistant({ model: configuredModel });
  assistant.loadHistory(savedHistory);

  const response = await assistant.chat('Continue from where we left off...');
  return response;
}

// Uncomment to test:
// multiTurnExample().catch(console.error);
// singleTurnExample().catch(console.error);
