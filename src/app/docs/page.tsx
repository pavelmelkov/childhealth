import type { Metadata } from 'next';

import LegalPage from '@/views/LegalPage';

export const metadata: Metadata = {
  title: 'Сертификаты нейропсихолога в Майкопе',
  description:
    'Сертификаты, квалификация, согласия и материалы о занятиях по нейрокоррекции, диагностике и сенсорно-двигательной поддержке детей в Майкопе.',
  alternates: {
    canonical: '/docs/',
  },
  openGraph: {
    title: 'Сертификаты нейропсихолога в Майкопе',
    description:
      'Сертификаты, квалификация и материалы о занятиях по нейрокоррекции и диагностике детей в Майкопе.',
    url: '/docs/',
  },
};

export default function DocsPage() {
  return <LegalPage />;
}
