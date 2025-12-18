'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAIConfig, setAIConfig, removeAIConfig } from '@/lib/utils/storage';
import type { AIConfig, AIProvider, GeminiModel, OpenAIModel } from '@/types';

export function useApiKey() {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedConfig = getAIConfig();
    setConfig(savedConfig);
    setIsLoading(false);
  }, []);

  const saveConfig = useCallback((newConfig: AIConfig) => {
    setAIConfig(newConfig);
    setConfig(newConfig);
  }, []);

  const clearConfig = useCallback(() => {
    removeAIConfig();
    setConfig(null);
  }, []);

  const updateProvider = useCallback((provider: AIProvider) => {
    if (!config) return;

    const defaultModel = provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o';
    const newConfig: AIConfig = {
      ...config,
      provider,
      model: defaultModel,
    };
    saveConfig(newConfig);
  }, [config, saveConfig]);

  const updateModel = useCallback((model: GeminiModel | OpenAIModel) => {
    if (!config) return;

    const newConfig: AIConfig = {
      ...config,
      model,
    };
    saveConfig(newConfig);
  }, [config, saveConfig]);

  const updateApiKey = useCallback((apiKey: string) => {
    if (!config) return;

    const newConfig: AIConfig = {
      ...config,
      apiKey,
    };
    saveConfig(newConfig);
  }, [config, saveConfig]);

  const isConfigured = Boolean(config?.apiKey && config?.provider);

  return {
    config,
    isLoading,
    isConfigured,
    saveConfig,
    clearConfig,
    updateProvider,
    updateModel,
    updateApiKey,
  };
}
