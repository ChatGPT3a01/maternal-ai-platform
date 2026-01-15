import { notFound } from 'next/navigation';
import { KnowledgeArticle } from '@/components/Knowledge/KnowledgeArticle';
import { PageTracker } from '@/components/Tracking/PageTracker';
import laborKnowledgeData from '@/data/knowledge/labor-knowledge.json';
import type { KnowledgeArticle as KnowledgeArticleType } from '@/types';

interface PageProps {
  params: {
    section: string;
  };
}

// 生成靜態參數
export async function generateStaticParams() {
  return laborKnowledgeData.sections.map((section) => ({
    section: section.id,
  }));
}

// 生成動態 metadata
export async function generateMetadata({ params }: PageProps) {
  const section = laborKnowledgeData.sections.find(
    (s) => s.id === params.section
  );

  if (!section) {
    return {
      title: '找不到頁面',
    };
  }

  return {
    title: `${section.title} - 待產知識 - 產婦 AI 問答平台`,
    description: section.content.substring(0, 150),
  };
}

export default function LaborKnowledgeSectionPage({ params }: PageProps) {
  // 找到對應的章節
  const section = laborKnowledgeData.sections.find(
    (s) => s.id === params.section
  );

  if (!section) {
    notFound();
  }

  // 建立只包含該章節的文章結構
  const articleData: KnowledgeArticleType = {
    id: section.id,
    title: section.title,
    slug: section.id,
    category: 'labor-knowledge',
    metadata: laborKnowledgeData.metadata,
    sections: [section],
  };

  return (
    <PageTracker pageName={`待產知識 - ${section.title}`}>
      <div className="container py-8">
        <KnowledgeArticle article={articleData} />
      </div>
    </PageTracker>
  );
}
