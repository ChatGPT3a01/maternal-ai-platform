'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatInterface } from '@/components/Chat/ChatInterface';

function ChatPageContent() {
  const searchParams = useSearchParams();
  const question = searchParams.get('question');
  const context = searchParams.get('context');
  const sectionId = searchParams.get('sectionId');

  return (
    <ChatInterface
      initialQuestion={question || undefined}
      questionContext={
        context || sectionId
          ? {
              context: context || undefined,
              sectionId: sectionId || undefined,
            }
          : undefined
      }
    />
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">載入中...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
