import { KnowledgeArticle } from '@/components/Knowledge/KnowledgeArticle';
import { PageTracker } from '@/components/Tracking/PageTracker';
import laborCareData from '@/data/knowledge/labor-care.json';
import type { KnowledgeArticle as KnowledgeArticleType } from '@/types';

export const metadata = {
  title: '待產注意事項 - 產婦知識平台',
  description: '了解待產時的重要注意事項，包括下床走動、直立姿勢、保持清潔、飲食建議、解尿注意和宮縮減痛方法。',
};

export default function LaborCarePage() {
  return (
    <PageTracker pageName="待產注意事項">
      <div className="container py-8">
        <KnowledgeArticle article={laborCareData as KnowledgeArticleType} />
      </div>
    </PageTracker>
  );
}
