'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { KeyRound, AlertCircle } from 'lucide-react';
import type { AIConfig, AIProvider, GeminiModel, OpenAIModel } from '@/types';

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: AIConfig) => void;
  initialConfig?: AIConfig | null;
}

const GEMINI_MODELS: { value: GeminiModel; label: string }[] = [
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (推薦)' },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
];

const OPENAI_MODELS: { value: OpenAIModel; label: string }[] = [
  { value: 'gpt-4o', label: 'GPT-4o (推薦)' },
  { value: 'gpt-5.2', label: 'GPT-5.2' },
];

export function ApiKeyModal({
  open,
  onOpenChange,
  onSave,
  initialConfig,
}: ApiKeyModalProps) {
  const [provider, setProvider] = useState<AIProvider>(
    initialConfig?.provider || 'gemini'
  );
  const [apiKey, setApiKey] = useState(initialConfig?.apiKey || '');
  const [model, setModel] = useState<string>(
    initialConfig?.model || 'gemini-2.5-flash'
  );
  const [error, setError] = useState<string | null>(null);

  const handleProviderChange = (value: AIProvider) => {
    setProvider(value);
    setModel(value === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o');
    setError(null);
  };

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('請輸入 API Key');
      return;
    }

    const config: AIConfig = {
      provider,
      apiKey: apiKey.trim(),
      model: model as GeminiModel | OpenAIModel,
    };

    onSave(config);
    onOpenChange(false);
  };

  const models = provider === 'gemini' ? GEMINI_MODELS : OPENAI_MODELS;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            設定 API Key
          </DialogTitle>
          <DialogDescription>
            請輸入您的 AI API Key。您的金鑰只會儲存在您的瀏覽器中，不會傳送到任何伺服器。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">選擇 AI 服務</label>
            <Select value={provider} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Google Gemini</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">選擇模型</label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">API Key</label>
            <Input
              type="password"
              placeholder={
                provider === 'gemini'
                  ? '輸入 Google AI API Key'
                  : '輸入 OpenAI API Key'
              }
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError(null);
              }}
            />
            <p className="text-xs text-muted-foreground">
              {provider === 'gemini' ? (
                <>
                  前往{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Google AI Studio
                  </a>{' '}
                  取得 API Key
                </>
              ) : (
                <>
                  前往{' '}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    OpenAI Platform
                  </a>{' '}
                  取得 API Key
                </>
              )}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>儲存設定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
