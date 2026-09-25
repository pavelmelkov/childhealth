import type { Metadata } from 'next';

import { faqItems } from '@/content/public-copy';
import HomePage from '@/views/HomePage';
import { CITY_NAME, SEO_KEYWORDS, SITE_DESCRIPTION, SPECIALIST_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Занятия с детьми в ${CITY_NAME}е | ${SPECIALIST_NAME}`,
  description: SITE_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  alternates: {
    canonical: '/',
  },
};

export default function Page() {
  return (
    <>
      <HomePage />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question', name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }) }} />
    </>
  );
}
