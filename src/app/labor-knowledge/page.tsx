import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen } from 'lucide-react';
import laborKnowledgeData from '@/data/knowledge/labor-knowledge.json';

export const metadata = {
  title: '待產知識 - 產婦知識平台',
  description: '完整的待產知識指南，包含認識產兆、產程進展判斷與處理、非藥物減痛方法等重要資訊。',
};

export default function LaborKnowledgePage() {
  const sections = laborKnowledgeData.sections;

  return (
    <div className="soft-section min-h-screen container py-10">
      <div className="max-w-4xl mx-auto">
        {/* 標題 */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold tracking-wide text-pink-600">KNOWLEDGE HUB</p>
          <h1 className="mb-3 text-4xl font-bold tracking-tight">待產知識</h1>
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
                <Card className="lift-card h-full transition-all hover:border-pink-200 dark:hover:border-pink-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className="mb-3 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-pink-50 px-2 text-xs font-semibold text-pink-600">{String(sections.indexOf(section) + 1).padStart(2, '0')}</span>
                        <CardTitle className="text-xl group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                          {section.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {section.content
                            ? `${section.content.substring(0, 100)}...`
                            : `包含 ${section.subsections?.length ?? 0} 個相關主題`}
                        </CardDescription>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors ml-2 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {subsectionCount > 0 && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{subsectionCount} 個主題</span>
                        </div>
                      </div>
                    )}
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
