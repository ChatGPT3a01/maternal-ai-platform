'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ClipboardList,
  Plus,
  Trash2,
  Scale,
  Ruler,
  Baby,
  Milk,
  Syringe,
} from 'lucide-react';
import {
  getBabyRecords,
  saveBabyRecord,
  deleteBabyRecord,
  getFeedingRecords,
  saveFeedingRecord,
  deleteFeedingRecord,
} from '@/lib/utils/storage';
import type { BabyRecord, FeedingRecord } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function BabyPage() {
  const [babyRecords, setBabyRecords] = useState<BabyRecord[]>([]);
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>([]);
  const [activeTab, setActiveTab] = useState('growth');

  // Growth form state
  const [growthDate, setGrowthDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCirc, setHeadCirc] = useState('');
  const [growthDialogOpen, setGrowthDialogOpen] = useState(false);

  // Feeding form state
  const [feedingDate, setFeedingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [feedingTime, setFeedingTime] = useState(format(new Date(), 'HH:mm'));
  const [feedingType, setFeedingType] = useState<'breastfeed' | 'formula' | 'mixed'>('breastfeed');
  const [feedingDuration, setFeedingDuration] = useState('');
  const [feedingAmount, setFeedingAmount] = useState('');
  const [feedingSide, setFeedingSide] = useState<'left' | 'right' | 'both'>('both');
  const [feedingDialogOpen, setFeedingDialogOpen] = useState(false);

  // Load records on mount
  useEffect(() => {
    setBabyRecords(getBabyRecords());
    setFeedingRecords(getFeedingRecords());
  }, []);

  // Save growth record
  const handleSaveGrowth = () => {
    const record: BabyRecord = {
      id: generateId(),
      date: growthDate,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      headCircumference: headCirc ? parseFloat(headCirc) : undefined,
    };

    saveBabyRecord(record);
    setBabyRecords(getBabyRecords());

    // Reset form
    setWeight('');
    setHeight('');
    setHeadCirc('');
    setGrowthDialogOpen(false);
  };

  // Delete growth record
  const handleDeleteGrowth = (id: string) => {
    deleteBabyRecord(id);
    setBabyRecords(getBabyRecords());
  };

  // Save feeding record
  const handleSaveFeeding = () => {
    const record: FeedingRecord = {
      id: generateId(),
      date: feedingDate,
      time: feedingTime,
      type: feedingType,
      duration: feedingDuration ? parseInt(feedingDuration) : undefined,
      amount: feedingAmount ? parseInt(feedingAmount) : undefined,
      side: feedingType === 'breastfeed' ? feedingSide : undefined,
    };

    saveFeedingRecord(record);
    setFeedingRecords(getFeedingRecords());

    // Reset form
    setFeedingDuration('');
    setFeedingAmount('');
    setFeedingDialogOpen(false);
  };

  // Delete feeding record
  const handleDeleteFeeding = (id: string) => {
    deleteFeedingRecord(id);
    setFeedingRecords(getFeedingRecords());
  };

  // Prepare chart data
  const chartData = babyRecords
    .slice()
    .reverse()
    .map((record) => ({
      date: format(new Date(record.date), 'MM/dd'),
      weight: record.weight,
      height: record.height,
      headCirc: record.headCircumference,
    }));

  // Get today's feeding summary
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayFeedings = feedingRecords.filter((r) => r.date === today);
  const todayBreastfeedCount = todayFeedings.filter((r) => r.type === 'breastfeed').length;
  const todayFormulaTotal = todayFeedings
    .filter((r) => r.type === 'formula')
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ClipboardList className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold">寶寶成長紀錄</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 text-center">
              <Scale className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {babyRecords[0]?.weight?.toFixed(2) || '-'} kg
              </p>
              <p className="text-xs text-muted-foreground">最新體重</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Ruler className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {babyRecords[0]?.height?.toFixed(1) || '-'} cm
              </p>
              <p className="text-xs text-muted-foreground">最新身高</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Milk className="h-6 w-6 text-pink-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{todayBreastfeedCount}</p>
              <p className="text-xs text-muted-foreground">今日親餵次數</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Baby className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{todayFormulaTotal} ml</p>
              <p className="text-xs text-muted-foreground">今日配方奶量</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="growth">
              <Scale className="h-4 w-4 mr-2" />
              成長紀錄
            </TabsTrigger>
            <TabsTrigger value="feeding">
              <Milk className="h-4 w-4 mr-2" />
              餵奶紀錄
            </TabsTrigger>
            <TabsTrigger value="vaccine">
              <Syringe className="h-4 w-4 mr-2" />
              疫苗接種
            </TabsTrigger>
          </TabsList>

          {/* Growth Records Tab */}
          <TabsContent value="growth" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>成長曲線</CardTitle>
                  <CardDescription>追蹤寶寶的身高、體重和頭圍</CardDescription>
                </div>
                <Dialog open={growthDialogOpen} onOpenChange={setGrowthDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      新增紀錄
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>新增成長紀錄</DialogTitle>
                      <DialogDescription>記錄寶寶的身高、體重和頭圍</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">日期</label>
                        <Input
                          type="date"
                          value={growthDate}
                          onChange={(e) => setGrowthDate(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">體重 (kg)</label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="例：3.5"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">身高 (cm)</label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="例：50"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">頭圍 (cm)</label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="例：35"
                          value={headCirc}
                          onChange={(e) => setHeadCirc(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setGrowthDialogOpen(false)}>
                        取消
                      </Button>
                      <Button onClick={handleSaveGrowth}>儲存</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {chartData.length > 1 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="weight"
                        stroke="#3b82f6"
                        name="體重 (kg)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="height"
                        stroke="#22c55e"
                        name="身高 (cm)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>新增至少兩筆紀錄後即可顯示成長曲線</p>
                  </div>
                )}

                {/* Records List */}
                <div className="mt-4 space-y-2">
                  {babyRecords.slice(0, 5).map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">
                          {format(new Date(record.date), 'MM/dd')}
                        </span>
                        {record.weight && (
                          <Badge variant="outline">{record.weight} kg</Badge>
                        )}
                        {record.height && (
                          <Badge variant="outline">{record.height} cm</Badge>
                        )}
                        {record.headCircumference && (
                          <Badge variant="outline">頭圍 {record.headCircumference} cm</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGrowth(record.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feeding Records Tab */}
          <TabsContent value="feeding" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>餵奶紀錄</CardTitle>
                  <CardDescription>追蹤寶寶的餵食情況</CardDescription>
                </div>
                <Dialog open={feedingDialogOpen} onOpenChange={setFeedingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      新增紀錄
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>新增餵奶紀錄</DialogTitle>
                      <DialogDescription>記錄寶寶的餵食情況</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">日期</label>
                          <Input
                            type="date"
                            value={feedingDate}
                            onChange={(e) => setFeedingDate(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">時間</label>
                          <Input
                            type="time"
                            value={feedingTime}
                            onChange={(e) => setFeedingTime(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">餵食方式</label>
                        <Select
                          value={feedingType}
                          onValueChange={(v) => setFeedingType(v as any)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="breastfeed">親餵母乳</SelectItem>
                            <SelectItem value="formula">配方奶</SelectItem>
                            <SelectItem value="mixed">混合餵養</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {feedingType === 'breastfeed' && (
                        <>
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">餵食側</label>
                            <Select
                              value={feedingSide}
                              onValueChange={(v) => setFeedingSide(v as any)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">左側</SelectItem>
                                <SelectItem value="right">右側</SelectItem>
                                <SelectItem value="both">雙側</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">時長 (分鐘)</label>
                            <Input
                              type="number"
                              placeholder="例：15"
                              value={feedingDuration}
                              onChange={(e) => setFeedingDuration(e.target.value)}
                            />
                          </div>
                        </>
                      )}
                      {(feedingType === 'formula' || feedingType === 'mixed') && (
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">奶量 (ml)</label>
                          <Input
                            type="number"
                            placeholder="例：60"
                            value={feedingAmount}
                            onChange={(e) => setFeedingAmount(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setFeedingDialogOpen(false)}>
                        取消
                      </Button>
                      <Button onClick={handleSaveFeeding}>儲存</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {feedingRecords.length > 0 ? (
                    feedingRecords.slice(0, 10).map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">
                            {format(new Date(record.date), 'MM/dd')} {record.time}
                          </span>
                          <Badge
                            variant={record.type === 'breastfeed' ? 'default' : 'secondary'}
                          >
                            {record.type === 'breastfeed'
                              ? '親餵'
                              : record.type === 'formula'
                              ? '配方奶'
                              : '混合'}
                          </Badge>
                          {record.duration && (
                            <span className="text-sm text-muted-foreground">
                              {record.duration} 分鐘
                            </span>
                          )}
                          {record.amount && (
                            <span className="text-sm text-muted-foreground">
                              {record.amount} ml
                            </span>
                          )}
                          {record.side && (
                            <span className="text-sm text-muted-foreground">
                              {record.side === 'left' ? '左' : record.side === 'right' ? '右' : '雙側'}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteFeeding(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Milk className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>尚無餵奶紀錄</p>
                      <p className="text-sm mt-2">點擊「新增紀錄」開始記錄</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vaccine Tab */}
          <TabsContent value="vaccine" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>疫苗接種時程</CardTitle>
                <CardDescription>新生兒預防接種建議時程</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { age: '出生24小時內', vaccines: ['B型肝炎免疫球蛋白', 'B型肝炎疫苗第一劑'] },
                    { age: '滿1個月', vaccines: ['B型肝炎疫苗第二劑'] },
                    { age: '滿2個月', vaccines: ['五合一疫苗第一劑', '13價結合型肺炎鏈球菌疫苗第一劑'] },
                    { age: '滿4個月', vaccines: ['五合一疫苗第二劑', '13價結合型肺炎鏈球菌疫苗第二劑'] },
                    { age: '滿5個月', vaccines: ['卡介苗'] },
                    { age: '滿6個月', vaccines: ['B型肝炎疫苗第三劑', '五合一疫苗第三劑'] },
                    { age: '滿12個月', vaccines: ['水痘疫苗第一劑', '麻疹腮腺炎德國麻疹混合疫苗第一劑', '13價結合型肺炎鏈球菌疫苗第三劑'] },
                  ].map((item) => (
                    <div key={item.age} className="border-l-2 border-pink-500 pl-4">
                      <p className="font-medium">{item.age}</p>
                      <ul className="mt-1 space-y-1">
                        {item.vaccines.map((vaccine) => (
                          <li key={vaccine} className="text-sm text-muted-foreground flex items-center gap-2">
                            <Syringe className="h-3 w-3" />
                            {vaccine}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
