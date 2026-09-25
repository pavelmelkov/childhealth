import type { Metadata } from 'next';

import LegalPage from '@/views/LegalPage';

export const metadata: Metadata = {
  title: 'Документы и материалы Веры Мелковой',
  description: 'Документы о дополнительном обучении Веры Мелковой, видео с занятий и согласия для родителей.',
  alternates: {
    canonical: '/docs/',
  },
  openGraph: {
    title: 'Документы и материалы Веры Мелковой',
    description: 'Документы о дополнительном обучении Веры Мелковой, видео с занятий и согласия для родителей.',
    url: '/docs/',
  },
};

export default function DocsPage() {
  return <LegalPage />;
}
