'use client';

import Link from 'next/link';
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
  Baby,
  MessageCircle,
  Calendar,
  Stethoscope,
  ClipboardList,
  Heart,
  Shield,
  Clock,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const PRETEST_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfemAG6blD0W_Utb_DjRFUTiWz9L-1kxioGbAD2Fll4cVtDwg/viewform';
const POSTTEST_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfku_2HiZ0oFBvipzmIzhjlgCKeoDaTaqi-QFTHyKqktS74Hg/viewform';

const features = [
  {
    icon: MessageCircle,
    title: 'AI 智慧問答',
    description: '24小時即時回答您的孕產期問題，提供專業衛教資訊',
    href: '/chat',
    color: 'text-pink-500',
  },
  {
    icon: Calendar,
    title: '孕期追蹤',
    description: '追蹤懷孕週數，了解寶寶發育和產檢時程',
    href: '/tracker',
    color: 'text-purple-500',
  },
  {
    icon: Stethoscope,
    title: '症狀自我檢查',
    description: 'AI 協助評估症狀，提供就醫建議',
    href: '/symptoms',
    color: 'text-blue-500',
  },
  {
    icon: ClipboardList,
    title: '寶寶成長紀錄',
    description: '記錄寶寶身高體重、餵奶時間、疫苗接種',
    href: '/baby',
    color: 'text-green-500',
  },
];

const highlights = [
  {
    icon: Shield,
    title: '隱私安全',
    description: 'API Key 只存在您的瀏覽器中，不會上傳到任何伺服器',
  },
  {
    icon: Heart,
    title: '專業知識庫',
    description: '整合衛福部官方衛教手冊，提供可靠的資訊',
  },
  {
    icon: Clock,
    title: '24/7 全天候',
    description: '隨時隨地都可以諮詢，不受時間限制',
  },
];

export default function HomePage() {
  const [showPretestDialog, setShowPretestDialog] = useState(false);
  const [hasCompletedPretest, setHasCompletedPretest] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('maternal-pretest-completed');
    setHasCompletedPretest(completed === 'true');

    if (!completed) {
      const timer = setTimeout(() => {
        setShowPretestDialog(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePretestComplete = () => {
    localStorage.setItem('maternal-pretest-completed', 'true');
    setHasCompletedPretest(true);
    setShowPretestDialog(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Baby className="h-20 w-20 text-pink-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            產婦 AI 問答平台
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            您的孕產期智慧助理，提供專業的衛教諮詢服務，
            陪伴您從懷孕到產後的每一步。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg" className="gap-2 bg-pink-500 hover:bg-pink-600">
                <MessageCircle className="h-5 w-5" />
                開始諮詢
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {!hasCompletedPretest && (
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => setShowPretestDialog(true)}
              >
                <FileText className="h-5 w-5" />
                填寫前測問卷
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">主要功能</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.href} href={feature.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <Icon className={`h-10 w-10 ${feature.color} mb-2`} />
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">平台特色</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <div key={highlight.title} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/30">
                      <Icon className="h-8 w-8 text-pink-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
                  <p className="text-muted-foreground">{highlight.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Knowledge Base Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">知識庫涵蓋範圍</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            整合衛生福利部國民健康署官方衛教手冊內容，提供完整的孕產期照護資訊
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: '孕婦衛教', items: ['產前檢查', '孕期營養', '高危險妊娠', '孕婦運動'] },
              { title: '待產知識', items: ['產兆辨識', '產程進展', '減痛方法', '呼吸技巧'] },
              { title: '產後照護', items: ['傷口照顧', '惡露觀察', '產後運動', '避孕方法'] },
              { title: '新生兒照護', items: ['母乳哺餵', '黃疸觀察', '臍帶護理', '疫苗接種'] },
            ].map((category) => (
              <Card key={category.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {category.items.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Survey Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">使用體驗問卷</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            您的意見對我們很重要！請在使用平台前後填寫問卷，幫助我們改善服務。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href={PRETEST_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="gap-2">
                <FileText className="h-5 w-5" />
                前測問卷（使用前填寫）
              </Button>
            </a>
            <a href={POSTTEST_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="gap-2">
                <FileText className="h-5 w-5" />
                後測問卷（使用後填寫）
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4 bg-muted">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            <strong>免責聲明：</strong>本平台提供的資訊僅供衛教參考，不能取代專業醫療診斷。
            如有任何健康疑慮或緊急情況，請立即就醫諮詢。
          </p>
        </div>
      </section>

      {/* Pretest Dialog */}
      <Dialog open={showPretestDialog} onOpenChange={setShowPretestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-pink-500" />
              歡迎使用產婦 AI 問答平台
            </DialogTitle>
            <DialogDescription>
              在開始使用之前，我們想邀請您填寫一份簡短的前測問卷，
              幫助我們了解您目前對孕產知識的了解程度。
              問卷填寫完全匿名，約需 2-3 分鐘。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowPretestDialog(false)}>
              稍後填寫
            </Button>
            <a href={PRETEST_URL} target="_blank" rel="noopener noreferrer">
              <Button className="w-full sm:w-auto gap-2" onClick={handlePretestComplete}>
                前往填寫問卷
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
