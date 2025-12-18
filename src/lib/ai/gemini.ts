import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, SYMPTOM_CHECK_PROMPT } from './prompts';
import type { GeminiModel, Message } from '@/types';

export async function chatWithGemini(
  apiKey: string,
  model: GeminiModel,
  messages: Message[],
  isSymptomCheck: boolean = false
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);

  const geminiModel = genAI.getGenerativeModel({
    model: model,
    systemInstruction: isSymptomCheck ? SYMPTOM_CHECK_PROMPT : SYSTEM_PROMPT,
  });

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  const chat = geminiModel.startChat({
    history,
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  const response = result.response;

  return response.text();
}

export async function streamChatWithGemini(
  apiKey: string,
  model: GeminiModel,
  messages: Message[],
  onChunk: (chunk: string) => void,
  isSymptomCheck: boolean = false
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);

  const geminiModel = genAI.getGenerativeModel({
    model: model,
    systemInstruction: isSymptomCheck ? SYMPTOM_CHECK_PROMPT : SYSTEM_PROMPT,
  });

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  const chat = geminiModel.startChat({
    history,
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessageStream(lastMessage.content);

  let fullResponse = '';
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    fullResponse += chunkText;
    onChunk(chunkText);
  }

  return fullResponse;
}
