'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Send,
  Loader2,
  Plus,
  Trash2,
  Settings,
  Bot,
  User,
  AlertCircle,
} from 'lucide-react';
import { ApiKeyModal } from './ApiKeyModal';
import { useApiKey } from '@/hooks/useApiKey';
import { useChat } from '@/hooks/useChat';
import { useTracking } from '@/hooks/useTracking';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';

interface ChatInterfaceProps {
  initialQuestion?: string;
  questionContext?: {
    context?: string;
    sectionId?: string;
  };
}

export function ChatInterface({ initialQuestion, questionContext }: ChatInterfaceProps) {
  const { config, isConfigured, saveConfig, isLoading: configLoading } = useApiKey();
  const {
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
  } = useChat(config);
  const { recordQuestion } = useTracking();

  const [input, setInput] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);
  const [hasAutoSent, setHasAutoSent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentSession?.messages, streamingMessage]);

  // Show API modal if not configured
  useEffect(() => {
    if (!configLoading && !isConfigured) {
      setShowApiModal(true);
    }
  }, [configLoading, isConfigured]);

  // Auto-send initial question
  useEffect(() => {
    if (
      initialQuestion &&
      !hasAutoSent &&
      isConfigured &&
      !isLoading &&
      currentSession
    ) {
      setHasAutoSent(true);
      sendMessage(initialQuestion);

      // 記錄提問到追蹤系統
      const context = questionContext?.context || questionContext?.sectionId || undefined;
      recordQuestion(initialQuestion, context);
    }
  }, [initialQuestion, hasAutoSent, isConfigured, isLoading, currentSession, questionContext, recordQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');

    // 記錄提問到追蹤系統
    recordQuestion(message);

    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r">
        <div className="p-4">
          <Button
            className="w-full"
            onClick={createNewSession}
          >
            <Plus className="mr-2 h-4 w-4" />
            新對話
          </Button>
        </div>

        <ScrollArea className="h-[calc(100%-8rem)]">
          <div className="space-y-2 p-4 pt-0">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  'group flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-muted',
                  currentSession?.id === session.id && 'bg-muted'
                )}
                onClick={() => selectSession(session.id)}
              >
                <span className="truncate flex-1">{session.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowApiModal(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            API 設定
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {!currentSession?.messages.length && !streamingMessage ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">產婦 AI 問答助理</h2>
              <p className="text-muted-foreground max-w-md">
                您好！我是您的產婦衛教諮詢助理，可以回答關於孕期、待產、產後照護及新生兒照顧的問題。
              </p>
              <div className="mt-6 grid gap-2">
                <p className="text-sm text-muted-foreground">試試問我：</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    '什麼是真陣痛？',
                    '產後如何照顧傷口？',
                    '新生兒黃疸怎麼觀察？',
                    '母乳哺餵有什麼好處？',
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setInput(suggestion);
                        textareaRef.current?.focus();
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {currentSession?.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {streamingMessage && (
                <MessageBubble
                  message={{
                    id: 'streaming',
                    role: 'assistant',
                    content: streamingMessage,
                    timestamp: new Date(),
                  }}
                  isStreaming
                />
              )}
              {isLoading && !streamingMessage && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>思考中...</span>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Error Alert */}
        {error && (
          <div className="px-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button variant="ghost" size="sm" onClick={clearError}>
                  關閉
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="輸入您的問題..."
                className="min-h-[60px] max-h-[200px] resize-none"
                disabled={!isConfigured || isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="h-[60px] w-[60px]"
                disabled={!isConfigured || isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              此為衛教資訊，不能取代專業醫療診斷。如有緊急情況，請立即就醫。
            </p>
          </form>
        </div>
      </div>

      <ApiKeyModal
        open={showApiModal}
        onOpenChange={setShowApiModal}
        onSave={saveConfig}
        initialConfig={config}
      />
    </div>
  );
}

function MessageBubble({
  message,
  isStreaming = false,
}: {
  message: Message;
  isStreaming?: boolean;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <Avatar className={cn('h-8 w-8', isUser ? 'bg-primary' : 'bg-pink-500')}>
        <AvatarFallback>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <Card
        className={cn(
          'max-w-[80%] px-4 py-3',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
