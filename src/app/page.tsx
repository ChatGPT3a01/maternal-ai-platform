'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ClipboardCheck,
  BookOpen,
  FileText,
  MessageCircle,
  Baby,
  ArrowRight,
} from 'lucide-react';
import { ProgressIndicator } from '@/components/Knowledge/ProgressIndicator';

const PRETEST_URL = 'https://docs.google.com/forms/d/1pWj9TwGCWUt0cZGmtGdVg2iITi7bbpKc6dXhwyi3qRw/viewform';

// 四大主選單
const mainFeatures = [
  {
    title: '待產注意事項',
    icon: ClipboardCheck,
    href: '/labor-care',
    description: '了解待產時的重要事項與準備',
    color: 'pink',
  },
  {
    title: '待產知識',
    icon: BookOpen,
    href: '/labor-knowledge',
    description: '認識產兆、產程進展、減痛方法',
    color: 'purple',
  },
  {
    title: '測驗',
    icon: FileText,
    href: '/quiz',
    description: '前測與後測問卷',
    color: 'blue',
  },
  {
    title: 'AI 問答',
    icon: MessageCircle,
    href: '/chat',
    description: '24小時智慧諮詢服務',
    color: 'green',
  },
];

const colorClasses = {
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-950/20',
    border: 'border-pink-200 dark:border-pink-800',
    icon: 'text-pink-600 dark:text-pink-400',
    hover: 'hover:border-pink-300 dark:hover:border-pink-700',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-200 dark:border-purple-800',
    icon: 'text-purple-600 dark:text-purple-400',
    hover: 'hover:border-purple-300 dark:hover:border-purple-700',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    hover: 'hover:border-blue-300 dark:hover:border-blue-700',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    hover: 'hover:border-green-300 dark:hover:border-green-700',
  },
};

export default function Home() {
  const [showPretestDialog, setShowPretestDialog] = useState(false);

  useEffect(() => {
    // 檢查是否首次訪問（是否顯示過廣告視窗）
    const hasSeenDialog = localStorage.getItem('maternal-show-pretest-dialog');
    if (!hasSeenDialog) {
      setShowPretestDialog(true);
    }
  }, []);

  const handleClosePretestDialog = () => {
    // 記錄已顯示過，下次不再自動彈出
    localStorage.setItem('maternal-show-pretest-dialog', 'seen');
    setShowPretestDialog(false);
  };

  const handleGoToPretest = () => {
    localStorage.setItem('maternal-show-pretest-dialog', 'seen');
    window.open(PRETEST_URL, '_blank');
    setShowPretestDialog(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 dark:bg-pink-900/30 mb-6">
              <Baby className="h-10 w-10 text-pink-600 dark:text-pink-400" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Baby Landing
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              專業的待產知識學習平台，結合 AI 智慧問答，陪伴您安心迎接寶寶的到來
            </p>
          </div>
        </div>
      </section>

      {/* 學習進度 */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <ProgressIndicator variant="detailed" />
          </div>
        </div>
      </section>

      {/* 四大主選單 */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">探索待產知識</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {mainFeatures.map((feature) => {
                const colors = colorClasses[feature.color as keyof typeof colorClasses];
                const Icon = feature.icon;

                return (
                  <Link key={feature.title} href={feature.href} className="block group">
                    <Card className={`h-full transition-all ${colors.border} ${colors.hover} hover:shadow-lg`}>
                      <CardHeader>
                        <div className={`inline-flex p-3 rounded-lg ${colors.bg} mb-4`}>
                          <Icon className={`h-8 w-8 ${colors.icon}`} />
                        </div>
                        <CardTitle className="text-xl group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors flex items-center justify-between">
                          {feature.title}
                          <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 平台特色 */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">為什麼選擇我們</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-pink-100 dark:bg-pink-900/30 mb-4">
                  <BookOpen className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">完整知識庫</h3>
                <p className="text-muted-foreground">
                  涵蓋待產注意事項、產兆辨識、產程進展、減痛方法等完整資訊
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                  <MessageCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI 智慧問答</h3>
                <p className="text-muted-foreground">
                  每個知識點都能直接詢問 AI，獲得個人化的詳細解答
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">學習追蹤</h3>
                <p className="text-muted-foreground">
                  記錄您的學習進度，透過前後測問卷評估學習成效
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">準備好開始學習了嗎？</h2>
            <p className="text-lg text-muted-foreground mb-8">
              從待產注意事項開始，一步步了解完整的待產知識
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/labor-care/">
                <Button size="lg" className="w-full sm:w-auto">
                  開始學習
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/chat/">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  直接詢問 AI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 前測問卷廣告視窗 */}
      <Dialog open={showPretestDialog} onOpenChange={setShowPretestDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>歡迎使用產婦知識平台</DialogTitle>
            <DialogDescription className="pt-4">
              在開始使用之前，想邀請您填寫一份問卷，幫助我們了解您目前對待產知識的了解程度。
              <br />
              <br />
              問卷不會記錄您的姓名與個人識別資料，作答內容僅供本研究統計分析使用，非常感謝您的協助與參與。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between gap-2">
            <Button variant="ghost" onClick={handleClosePretestDialog} className="flex-1">
              稍後填寫
            </Button>
            <Button onClick={handleGoToPretest} className="flex-1">
              前往填寫問卷
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
