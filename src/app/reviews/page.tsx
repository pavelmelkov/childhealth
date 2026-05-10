import type { Metadata } from 'next';

import ReviewsPage from '@/views/ReviewsPage';

export const metadata: Metadata = {
  title: 'Отзывы о нейропсихологе в Майкопе',
  description:
    'Отзывы родителей о занятиях с детьми в Майкопе: нейропсихологическая диагностика, нейрокоррекция, сенсорно-двигательная и нейромоторная поддержка.',
  alternates: {
    canonical: '/reviews/',
  },
  openGraph: {
    title: 'Отзывы о нейропсихологе в Майкопе',
    description:
      'Реальные впечатления родителей о нейропсихологических занятиях и поддержке развития детей в Майкопе.',
    url: '/reviews/',
  },
};

export default function Reviews() {
  return <ReviewsPage />;
}
