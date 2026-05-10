import type { Metadata } from 'next';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/index.scss';
import { Navbar } from '@/sections/Navbar/Navbar';
import {
  CITY_NAME,
  CONTACT_PHONE,
  SEO_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SPECIALIST_NAME,
  TELEGRAM_URL,
} from '@/lib/seo';
import { BootstrapClient } from './providers/BootstrapClient';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Нейропсихолог в ${CITY_NAME}е | ${SPECIALIST_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `Нейропсихолог в ${CITY_NAME}е | ${SPECIALIST_NAME}`,
    description: SITE_DESCRIPTION,
    url: '/',
    siteName: SITE_NAME,
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: '/about/logo-desktop-cropped.png',
        width: 1506,
        height: 335,
        alt: `${SITE_NAME} - ${SPECIALIST_NAME}`,
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: 'ru-RU',
      description: SITE_DESCRIPTION,
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#specialist`,
      name: SPECIALIST_NAME,
      jobTitle: `Детский нейропсихолог, ${CITY_NAME}`,
      url: SITE_URL,
      image: `${SITE_URL}/about/about.jpg`,
      telephone: CONTACT_PHONE,
      sameAs: [TELEGRAM_URL],
      knowsAbout: SEO_KEYWORDS,
      worksFor: {
        '@id': `${SITE_URL}/#service`,
      },
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#service`,
      name: `${SITE_NAME} - нейропсихолог для детей в ${CITY_NAME}е`,
      url: SITE_URL,
      logo: `${SITE_URL}/icon-192.png`,
      image: `${SITE_URL}/about/logo-desktop-cropped.png`,
      telephone: CONTACT_PHONE,
      description: SITE_DESCRIPTION,
      founder: {
        '@id': `${SITE_URL}/#specialist`,
      },
      areaServed: {
        '@type': 'City',
        name: CITY_NAME,
        containedInPlace: {
          '@type': 'Country',
          name: 'Россия',
        },
      },
      serviceType: [
        'Детский нейропсихолог в Майкопе',
        'Нейрокоррекция для детей',
        'Нейропсихологическая диагностика детей',
        'Психологическая диагностика детей',
        'Поддержка детей с ЗПР',
        'Поддержка детей с РАС',
        'Занятия при ЗРР и речевых нарушениях',
        'Занятия с детьми в Майкопе',
        'Сенсорно-двигательные занятия',
        'Сенсомоторная коррекция детей',
        'Нейромоторная коррекция',
        'Поддержка развития речи и внимания',
        'Брифалити',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Направления нейропсихологической поддержки',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Нейропсихологическая диагностика детей',
              description:
                'Первичное знакомство, наблюдение за вниманием, речью, движением, координацией, поведением и утомляемостью ребёнка.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Нейрокоррекция и сенсорно-двигательные занятия',
              description:
                'Занятия для поддержки баланса, координации, схемы тела, моторного планирования, внимания и саморегуляции.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Поддержка при ЗПР, РАС, ЗРР и речевых нарушениях',
              description:
                'Индивидуальный подбор формата занятий при трудностях развития, речи, внимания, обучения, сенсорных и моторных особенностях.',
            },
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Можно ли обратиться при ЗПР, РАС или ЗРР?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Да. Если ребёнку поставили ЗПР, РАС, ЗРР, есть речевые нарушения, сенсорные особенности, моторная неловкость или трудности внимания, первичная встреча помогает понять запрос семьи и подобрать формат нейропсихологической и сенсорно-двигательной поддержки.',
          },
        },
        {
          '@type': 'Question',
          name: 'Что даёт нейропсихологическая диагностика?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Диагностика показывает, какие функции требуют поддержки: движение, координация, внимание, речь, саморегуляция, переключение и готовность к обучению. После этого формируется индивидуальный план занятий.',
          },
        },
        {
          '@type': 'Question',
          name: 'Как занятия сочетаются с наблюдением у врача?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Если ребёнок наблюдается у врача, логопеда, психолога или других профильных специалистов, нейрокоррекция и сенсомоторные занятия выстраиваются с учётом этого маршрута и помогают шаг за шагом поддерживать развитие важных функций.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <div id="top" />
        <Navbar />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BootstrapClient />
      </body>
    </html>
  );
}
