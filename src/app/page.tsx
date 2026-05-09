import type { Metadata } from 'next';

import HomePage from '@/views/HomePage';
import { CITY_NAME, SEO_KEYWORDS, SITE_DESCRIPTION, SPECIALIST_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Нейропсихолог в ${CITY_NAME}е | ${SPECIALIST_NAME}`,
  description: SITE_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  alternates: {
    canonical: '/',
  },
};

export default function Page() {
  return <HomePage />;
}
