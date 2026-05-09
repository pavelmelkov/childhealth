import type { Metadata } from 'next';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/index.scss';
import { Navbar } from '@/sections/Navbar/Navbar';
import { BootstrapClient } from './providers/BootstrapClient';

export const metadata: Metadata = {
  title: 'Мелкова Вера Александровна',
  description: 'Специалист по нейрокоррекции и сенсорно-двигательным занятиям.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
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
        <BootstrapClient />
      </body>
    </html>
  );
}
