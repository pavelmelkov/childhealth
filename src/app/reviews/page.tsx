import type { Metadata } from 'next';

import ReviewsPage from '@/views/ReviewsPage';

export const metadata: Metadata = {
  title: 'Отзывы о работе с Верой Мелковой',
  description: 'Краткие пересказы отзывов о работе с Верой Мелковой и скриншоты исходных сообщений.',
  alternates: {
    canonical: '/reviews/',
  },
  openGraph: {
    title: 'Отзывы о работе с Верой Мелковой',
    description: 'Краткие пересказы отзывов о работе с Верой Мелковой и скриншоты исходных сообщений.',
    url: '/reviews/',
  },
};

export default function Reviews() {
  return <ReviewsPage />;
}
