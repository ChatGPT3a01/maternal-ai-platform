import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import laborKnowledgeData from '@/data/knowledge/labor-knowledge.json';

export const metadata = {
  title: '待產知識 - 產婦知識平台',
  description: '完整的待產知識指南，包含認識產兆、產程進展判斷與處理、非藥物減痛方法等重要資訊。',
};

export default function LaborKnowledgePage() {
  const sections = laborKnowledgeData.sections;

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* 標題 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">待產知識</h1>
          <p className="text-lg text-muted-foreground">
            完整的待產知識指南，幫助您了解產兆、產程進展和各種減痛方法
          </p>
        </div>

        {/* 章節卡片 */}
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => {
            const subsectionCount = section.subsections?.length || 0;

            return (
              <Link
                key={section.id}
                href={`/labor-knowledge/${section.id}/`}
                className="block group"
              >
                <Card className="h-full transition-all hover:shadow-lg hover:border-pink-200 dark:hover:border-pink-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                          {section.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {section.content.substring(0, 100)}...
                        </CardDescription>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors ml-2 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {subsectionCount > 0 && (
                        <>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{subsectionCount} 個主題</span>
                          </div>
                          <span>•</span>
                        </>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>約 8-10 分鐘閱讀</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* 說明文字 */}
        <div className="mt-8 p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg border border-pink-100 dark:border-pink-900">
          <p className="text-sm text-muted-foreground">
            💡 <strong>提示：</strong>每個知識點旁都有「詢問 AI 更多」功能，可以直接向 AI 提問相關問題，獲得更詳細的解答。
          </p>
        </div>
      </div>
    </div>
  );
}
