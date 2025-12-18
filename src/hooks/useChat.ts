'use client';

import { useState, useCallback, useEffect } from 'react';
import { chatWithGemini, streamChatWithGemini } from '@/lib/ai/gemini';
import { chatWithOpenAI, streamChatWithOpenAI } from '@/lib/ai/openai';
import {
  getChatSessions,
  saveChatSession,
  deleteChatSession,
} from '@/lib/utils/storage';
import type { Message, ChatSession, AIConfig, GeminiModel, OpenAIModel } from '@/types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useChat(config: AIConfig | null) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState<string>('');

  // Load sessions on mount
  useEffect(() => {
    const savedSessions = getChatSessions();
    setSessions(savedSessions);
    if (savedSessions.length > 0) {
      setCurrentSession(savedSessions[0]);
    }
  }, []);

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: generateId(),
      title: '新對話',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCurrentSession(newSession);
    return newSession;
  }, []);

  const selectSession = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  }, [sessions]);

  const deleteSession = useCallback((sessionId: string) => {
    deleteChatSession(sessionId);
    setSessions(prev => prev.filter(s => s.id !== sessionId));

    if (currentSession?.id === sessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId);
      if (remaining.length > 0) {
        setCurrentSession(remaining[0]);
      } else {
        setCurrentSession(null);
      }
    }
  }, [currentSession, sessions]);

  const sendMessage = useCallback(async (
    content: string,
    useStreaming: boolean = true,
    isSymptomCheck: boolean = false
  ) => {
    if (!config) {
      setError('請先設定 API Key');
      return;
    }

    if (!content.trim()) return;

    setError(null);
    setIsLoading(true);
    setStreamingMessage('');

    // Create session if needed
    let session = currentSession;
    if (!session) {
      session = createNewSession();
    }

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...session.messages, userMessage];

    // Update title if first message
    const title = session.messages.length === 0
      ? content.trim().slice(0, 30) + (content.length > 30 ? '...' : '')
      : session.title;

    const updatedSession: ChatSession = {
      ...session,
      title,
      messages: updatedMessages,
      updatedAt: new Date(),
    };

    setCurrentSession(updatedSession);

    try {
      let assistantContent = '';

      if (config.provider === 'gemini') {
        if (useStreaming) {
          assistantContent = await streamChatWithGemini(
            config.apiKey,
            config.model as GeminiModel,
            updatedMessages,
            (chunk) => {
              setStreamingMessage(prev => prev + chunk);
            },
            isSymptomCheck
          );
        } else {
          assistantContent = await chatWithGemini(
            config.apiKey,
            config.model as GeminiModel,
            updatedMessages,
            isSymptomCheck
          );
        }
      } else {
        if (useStreaming) {
          assistantContent = await streamChatWithOpenAI(
            config.apiKey,
            config.model as OpenAIModel,
            updatedMessages,
            (chunk) => {
              setStreamingMessage(prev => prev + chunk);
            },
            isSymptomCheck
          );
        } else {
          assistantContent = await chatWithOpenAI(
            config.apiKey,
            config.model as OpenAIModel,
            updatedMessages,
            isSymptomCheck
          );
        }
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };

      const finalSession: ChatSession = {
        ...updatedSession,
        messages: [...updatedMessages, assistantMessage],
        updatedAt: new Date(),
      };

      setCurrentSession(finalSession);
      saveChatSession(finalSession);
      setSessions(getChatSessions());
      setStreamingMessage('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '發生未知錯誤';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [config, currentSession, createNewSession]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sessions,
    currentSession,
    isLoading,
    error,
    streamingMessage,
    createNewSession,
    selectSession,
    deleteSession,
    sendMessage,
    clearError,
  };
}
