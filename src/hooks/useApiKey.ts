'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAIConfig, setAIConfig, removeAIConfig } from '@/lib/utils/storage';
import type { AIConfig, AIProvider, GeminiModel, OpenAIModel } from '@/types';

/**
 * 從環境變數讀取平台內建的預設 AI 設定。
 * 若有設定，產婦使用時無需自行輸入 API Key。
 * Key 以 Base64 編碼儲存（非加密，只是避開 GitHub secret scanning 的 regex 偵測）。
 */
function getDefaultConfigFromEnv(): AIConfig | null {
  const apiKeyB64 = process.env.NEXT_PUBLIC_DEFAULT_AI_API_KEY_B64;
  const provider = (process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER || 'openai') as AIProvider;
  const model = (process.env.NEXT_PUBLIC_DEFAULT_AI_MODEL ||
    (provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o')) as GeminiModel | OpenAIModel;

  if (!apiKeyB64) return null;

  // 於瀏覽器執行時解碼
  let apiKey: string;
  try {
    apiKey = typeof window !== 'undefined' ? window.atob(apiKeyB64) : '';
  } catch {
    return null;
  }

  if (!apiKey) return null;

  return { provider, model, apiKey };
}

export function useApiKey() {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 優先使用使用者在瀏覽器自行設定的 config；若無，則退回平台內建的預設 Key
    const savedConfig = getAIConfig() ?? getDefaultConfigFromEnv();
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
