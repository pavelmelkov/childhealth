import type { Metadata } from 'next';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/index.scss';
import { Navbar } from '@/sections/Navbar/Navbar';
import { BootstrapClient } from './providers/BootstrapClient';

export const metadata: Metadata = {
  title: 'Мелкова Вера Александровна',
  description: 'Специалист по нейрокоррекции и сенсорно-двигательным занятиям.',
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
