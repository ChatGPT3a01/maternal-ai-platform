'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calendar,
  Baby,
  Heart,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { usePregnancy } from '@/hooks/usePregnancy';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export default function TrackerPage() {
  const {
    currentStatus,
    isLoading,
    setDueDate,
    setLastPeriodDate,
    clearPregnancyInfo,
  } = usePregnancy();

  const [inputType, setInputType] = useState<'dueDate' | 'lmp'>('dueDate');
  const [dateInput, setDateInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateInput) return;

    if (inputType === 'dueDate') {
      setDueDate(dateInput);
    } else {
      setLastPeriodDate(dateInput);
    }
    setDateInput('');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold">孕期追蹤</h1>
        </div>

        {!currentStatus ? (
          // Input Form
          <Card>
            <CardHeader>
              <CardTitle>設定您的孕期資訊</CardTitle>
              <CardDescription>
                請輸入預產期或末次月經日期，我們將為您計算目前的懷孕週數
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs
                  value={inputType}
                  onValueChange={(v) => setInputType(v as 'dueDate' | 'lmp')}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="dueDate">我知道預產期</TabsTrigger>
                    <TabsTrigger value="lmp">我知道末次月經日期</TabsTrigger>
                  </TabsList>

                  <TabsContent value="dueDate" className="mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">預產期</label>
                      <Input
                        type="date"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="lmp" className="mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">末次月經第一天</label>
                      <Input
                        type="date"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <Button type="submit" className="w-full" disabled={!dateInput}>
                  開始追蹤
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          // Pregnancy Status Display
          <div className="space-y-6">
            {/* Main Status Card */}
            <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Baby className="h-16 w-16 text-pink-500 mx-auto mb-4" />
                  <h2 className="text-4xl font-bold text-pink-600 mb-2">
                    {currentStatus.formattedWeek}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    第 {currentStatus.trimester} 孕期
                  </p>
                  <Badge variant="secondary" className="text-lg px-4 py-1">
                    {currentStatus.milestone}
                  </Badge>
                  <p className="mt-4 text-muted-foreground">
                    {currentStatus.milestoneDescription}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    距離預產期
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600">
                    {currentStatus.daysUntilDue} 天
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    預產期：{format(new Date(currentStatus.dueDate), 'yyyy年MM月dd日', { locale: zhTW })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    孕期進度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <span className="text-sm font-medium">
                        {Math.round((currentStatus.weeks / 40) * 100)}%
                      </span>
                      <span className="text-sm text-muted-foreground">40週</span>
                    </div>
                    <div className="overflow-hidden h-3 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${Math.min((currentStatus.weeks / 40) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checkups */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    已完成的產檢
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentStatus.completedCheckups.length > 0 ? (
                      currentStatus.completedCheckups.map((checkup, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{checkup}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-muted-foreground">尚無完成的產檢</li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                    即將到來的產檢
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentStatus.upcomingCheckups.length > 0 ? (
                      currentStatus.upcomingCheckups.map((checkup, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Clock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{checkup}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-muted-foreground">恭喜！產檢即將完成</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Warning Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                此追蹤器僅供參考，實際週數請以產檢醫師評估為準。
                如有任何不適，請立即就醫。
              </AlertDescription>
            </Alert>

            {/* Reset Button */}
            <div className="text-center">
              <Button
                variant="outline"
                onClick={clearPregnancyInfo}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                重新設定孕期資訊
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
