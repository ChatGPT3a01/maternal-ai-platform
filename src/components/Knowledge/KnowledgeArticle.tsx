'use client';

import ReactMarkdown from 'react-markdown';
import { AskAIButton } from './AskAIButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import type { KnowledgeArticle as KnowledgeArticleType } from '@/types';
import { Clock } from 'lucide-react';

interface KnowledgeArticleProps {
  article: KnowledgeArticleType;
}

export function KnowledgeArticle({ article }: KnowledgeArticleProps) {
  // 追蹤閱讀進度
  const { scrollDepth } = useReadingProgress({
    sectionId: article.id,
    sectionTitle: article.title,
    estimatedReadTime: article.metadata.readTime,
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* 文章標題和 Metadata */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>約 {article.metadata.readTime} 分鐘閱讀</span>
          </div>
          <span>•</span>
          <span>更新於 {article.metadata.lastUpdated}</span>
          <span>•</span>
          <span className="text-xs">{article.metadata.source}</span>
        </div>
      </div>

      {/* 文章內容 */}
      <div className="space-y-8">
        {article.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 主要內容 */}
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>

                {/* 子章節 */}
                {section.subsections && section.subsections.length > 0 && (
                  <div className="space-y-6 mt-6">
                    {section.subsections.map((subsection) => (
                      <div key={subsection.id} id={subsection.id} className="scroll-mt-20">
                        <h3 className="text-xl font-semibold mb-3 text-pink-600 dark:text-pink-400">
                          {subsection.title}
                        </h3>
                        <div className="prose prose-slate dark:prose-invert max-w-none mb-4">
                          <ReactMarkdown>{subsection.content}</ReactMarkdown>
                        </div>

                        {/* 子章節的詢問 AI 按鈕 */}
                        {subsection.suggestedQuestions.length > 0 && (
                          <AskAIButton
                            sectionId={subsection.id}
                            sectionTitle={`${section.title} - ${subsection.title}`}
                            suggestedQuestions={subsection.suggestedQuestions}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 章節層級的詢問 AI 按鈕 */}
                {section.suggestedQuestions.length > 0 && !section.subsections?.length && (
                  <AskAIButton
                    sectionId={section.id}
                    sectionTitle={section.title}
                    suggestedQuestions={section.suggestedQuestions}
                  />
                )}
              </CardContent>
            </Card>
          </section>
        ))}
      </div>
    </div>
  );
}
