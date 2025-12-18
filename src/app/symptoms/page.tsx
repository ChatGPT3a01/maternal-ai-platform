'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Send,
  Baby,
  Heart,
  Activity,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useApiKey } from '@/hooks/useApiKey';
import { useChat } from '@/hooks/useChat';
import { ApiKeyModal } from '@/components/Chat/ApiKeyModal';
import type { SymptomCategory } from '@/types';

const SYMPTOM_CATEGORIES: {
  id: SymptomCategory;
  label: string;
  icon: React.ElementType;
  color: string;
  symptoms: string[];
}[] = [
  {
    id: 'pregnancy',
    label: '孕期症狀',
    icon: Heart,
    color: 'text-pink-500',
    symptoms: [
      '孕吐/噁心',
      '頭暈',
      '腹痛',
      '出血',
      '水腫',
      '頻尿',
      '腰痠背痛',
      '失眠',
      '便秘',
      '胎動減少',
    ],
  },
  {
    id: 'labor',
    label: '待產症狀',
    icon: Activity,
    color: 'text-purple-500',
    symptoms: [
      '規則宮縮',
      '落紅',
      '破水',
      '背痛',
      '腹部緊繃',
      '想用力',
      '發冷寒顫',
      '噁心嘔吐',
    ],
  },
  {
    id: 'postpartum',
    label: '產後症狀',
    icon: Heart,
    color: 'text-red-500',
    symptoms: [
      '惡露量過多',
      '傷口疼痛',
      '發燒',
      '乳房脹痛',
      '乳腺炎',
      '情緒低落',
      '排尿困難',
      '便秘',
    ],
  },
  {
    id: 'baby',
    label: '寶寶症狀',
    icon: Baby,
    color: 'text-blue-500',
    symptoms: [
      '黃疸加重',
      '發燒',
      '哭鬧不止',
      '不喝奶',
      '嘔吐',
      '腹瀉',
      '皮膚紅疹',
      '呼吸急促',
      '臍帶發臭',
    ],
  },
];

const URGENT_SYMPTOMS = [
  '大量出血',
  '劇烈腹痛',
  '發燒超過38度',
  '胎動明顯減少',
  '破水',
  '寶寶發燒',
  '寶寶呼吸急促',
  '寶寶嘴唇發紫',
];

export default function SymptomsPage() {
  const { config, isConfigured, saveConfig, isLoading: configLoading } = useApiKey();
  const { sendMessage, isLoading, streamingMessage, currentSession } = useChat(config);

  const [selectedCategory, setSelectedCategory] = useState<SymptomCategory>('pregnancy');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const hasUrgentSymptom = selectedSymptoms.some((s) =>
    URGENT_SYMPTOMS.some((urgent) => s.includes(urgent) || urgent.includes(s))
  );

  const handleSubmit = async () => {
    if (!isConfigured) {
      setShowApiModal(true);
      return;
    }

    if (selectedSymptoms.length === 0) return;

    const categoryLabel = SYMPTOM_CATEGORIES.find((c) => c.id === selectedCategory)?.label;

    const prompt = `我正在進行症狀自我檢查。

類別：${categoryLabel}

我目前的症狀：
${selectedSymptoms.map((s) => `- ${s}`).join('\n')}

${additionalInfo ? `補充說明：${additionalInfo}` : ''}

請幫我評估這些症狀的嚴重程度，說明可能的原因，並給予適當的處理建議。如果需要就醫，請明確指出。`;

    await sendMessage(prompt, true, true);

    // Get the result from the latest message
    const lastMessage = currentSession?.messages[currentSession.messages.length - 1];
    if (lastMessage?.role === 'assistant') {
      setResult(lastMessage.content);
    }
  };

  const currentCategory = SYMPTOM_CATEGORIES.find((c) => c.id === selectedCategory);
  const Icon = currentCategory?.icon || Stethoscope;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Stethoscope className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">症狀自我檢查</h1>
        </div>

        {/* Urgent Warning */}
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>緊急就醫提醒</AlertTitle>
          <AlertDescription>
            如有以下症狀請立即就醫：大量出血、劇烈腹痛、發燒超過38度、胎動明顯減少、破水、
            寶寶發燒、寶寶呼吸急促、寶寶嘴唇發紫
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Symptom Selection */}
          <Card>
            <CardHeader>
              <CardTitle>選擇您的症狀</CardTitle>
              <CardDescription>先選擇類別，再勾選您目前有的症狀</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs
                value={selectedCategory}
                onValueChange={(v) => {
                  setSelectedCategory(v as SymptomCategory);
                  setSelectedSymptoms([]);
                }}
              >
                <TabsList className="grid grid-cols-2 md:grid-cols-4">
                  {SYMPTOM_CATEGORIES.map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                        <CatIcon className={`h-3 w-3 mr-1 ${cat.color}`} />
                        {cat.label.replace('症狀', '')}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {SYMPTOM_CATEGORIES.map((cat) => (
                  <TabsContent key={cat.id} value={cat.id} className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {cat.symptoms.map((symptom) => (
                        <Badge
                          key={symptom}
                          variant={selectedSymptoms.includes(symptom) ? 'default' : 'outline'}
                          className={`cursor-pointer transition-colors ${
                            selectedSymptoms.includes(symptom)
                              ? 'bg-pink-500 hover:bg-pink-600'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => toggleSymptom(symptom)}
                        >
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              {selectedSymptoms.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">已選擇的症狀：</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => toggleSymptom(symptom)}
                      >
                        {symptom} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">補充說明（選填）</label>
                <Textarea
                  placeholder="例如：症狀持續多久、嚴重程度、其他相關資訊..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={3}
                />
              </div>

              {hasUrgentSymptom && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    您選擇的症狀可能需要緊急處理，建議立即就醫！
                  </AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full gap-2"
                onClick={handleSubmit}
                disabled={selectedSymptoms.length === 0 || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    分析中...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    AI 症狀分析
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className={currentCategory?.color} />
                分析結果
              </CardTitle>
            </CardHeader>
            <CardContent>
              {streamingMessage || result ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{streamingMessage || result || ''}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>選擇症狀後點擊「AI 症狀分析」</p>
                  <p className="text-sm mt-2">AI 將幫您評估症狀並提供建議</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Alert className="mt-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            此功能僅供參考，不能取代專業醫療診斷。如有任何疑慮，請諮詢您的醫師。
          </AlertDescription>
        </Alert>

        <ApiKeyModal
          open={showApiModal}
          onOpenChange={setShowApiModal}
          onSave={saveConfig}
          initialConfig={config}
        />
      </div>
    </div>
  );
}
