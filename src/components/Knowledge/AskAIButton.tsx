'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageCircle, ChevronDown } from 'lucide-react';

interface AskAIButtonProps {
  sectionId: string;
  sectionTitle: string;
  suggestedQuestions: string[];
  variant?: 'default' | 'compact';
}

export function AskAIButton({
  sectionId,
  sectionTitle,
  suggestedQuestions,
  variant = 'default'
}: AskAIButtonProps) {
  const router = useRouter();

  const handleQuestionClick = (question: string) => {
    // 編碼參數
    const params = new URLSearchParams({
      question,
      context: sectionTitle,
      sectionId,
    });

    router.push(`/chat?${params.toString()}`);
  };

  if (suggestedQuestions.length === 0) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageCircle className="h-4 w-4" />
            詢問 AI
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          {suggestedQuestions.map((q, i) => (
            <DropdownMenuItem key={i} onClick={() => handleQuestionClick(q)}>
              {q}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-pink-50 dark:bg-pink-950/20 my-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="h-5 w-5 text-pink-500" />
        <h4 className="font-medium text-sm">想了解更多？</h4>
      </div>
      <div className="space-y-2">
        {suggestedQuestions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start text-left h-auto py-2 px-3 text-sm"
            onClick={() => handleQuestionClick(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
}
