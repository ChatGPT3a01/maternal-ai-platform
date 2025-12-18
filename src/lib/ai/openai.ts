import OpenAI from 'openai';
import { SYSTEM_PROMPT, SYMPTOM_CHECK_PROMPT } from './prompts';
import type { OpenAIModel, Message } from '@/types';

export async function chatWithOpenAI(
  apiKey: string,
  model: OpenAIModel,
  messages: Message[],
  isSymptomCheck: boolean = false
): Promise<string> {
  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });

  const systemPrompt = isSymptomCheck ? SYMPTOM_CHECK_PROMPT : SYSTEM_PROMPT;

  const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
  ];

  const completion = await openai.chat.completions.create({
    model: model,
    messages: openaiMessages,
  });

  return completion.choices[0]?.message?.content || '';
}

export async function streamChatWithOpenAI(
  apiKey: string,
  model: OpenAIModel,
  messages: Message[],
  onChunk: (chunk: string) => void,
  isSymptomCheck: boolean = false
): Promise<string> {
  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const systemPrompt = isSymptomCheck ? SYMPTOM_CHECK_PROMPT : SYSTEM_PROMPT;

  const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
  ];

  const stream = await openai.chat.completions.create({
    model: model,
    messages: openaiMessages,
    stream: true,
  });

  let fullResponse = '';
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    fullResponse += content;
    onChunk(content);
  }

  return fullResponse;
}
