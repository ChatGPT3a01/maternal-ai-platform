'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';
import { usePageView } from '@/hooks/usePageView';

const PRETEST_URL = 'https://docs.google.com/forms/d/1pWj9TwGCWUt0cZGmtGdVg2iITi7bbpKc6dXhwyi3qRw/viewform';
const POSTTEST_URL = 'https://docs.google.com/forms/d/1dwJhVsQFOEuR18w3wKZn8Z3Nu4td4OXuPnC_HMFQVZc/viewform';

export default function QuizPage() {
  usePageView('測驗頁面');

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        {/* 標題 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">問卷測驗</h1>
          <p className="text-lg text-muted-foreground">
            透過前測和後測問卷，幫助我們了解您對待產知識的掌握程度
          </p>
        </div>

        {/* 問卷卡片 */}
        <div className="grid gap-6">
          {/* 前測問卷 */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30">
                  <FileText className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">前測問卷</CardTitle>
                  <CardDescription className="mt-2">
                    在開始學習之前，請填寫此問卷以了解您目前對待產知識的了解程度
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">問卷說明</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 問卷不會記錄您的姓名與個人識別資料</li>
                    <li>• 作答內容僅供研究統計分析使用</li>
                    <li>• 預計填寫時間：約 2-3 分鐘</li>
                  </ul>
                </div>
                <a
                  href={PRETEST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full gap-2" size="lg">
                    前往填寫前測問卷
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* 後測問卷 */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">後測問卷</CardTitle>
                  <CardDescription className="mt-2">
                    學習完畢後，請填寫此問卷以評估學習成效
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">填寫時機</h3>
                  <p className="text-sm text-muted-foreground">
                    建議您完成待產注意事項和待產知識的學習後再填寫，以便更準確地評估學習效果。
                  </p>
                </div>
                <a
                  href={POSTTEST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full gap-2" size="lg">
                    前往填寫後測問卷
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 提示訊息 */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900">
          <p className="text-sm">
            💡 <strong>提示：</strong>您的參與對我們的研究非常重要，感謝您撥冗填寫問卷。問卷內容將嚴格保密，僅用於研究分析。
          </p>
        </div>
      </div>
    </div>
  );
}
