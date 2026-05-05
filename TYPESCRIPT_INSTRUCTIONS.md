# Инструкция по TypeScript в проекте

Этот проект уже работает на Next.js и TypeScript. Основные файлы приложения лежат в `src/app`, повторно используемые блоки - в `src/sections`, компоненты - в `src/components`, страницы-контент - в `src/views`.

## Где TypeScript включен

- `tsconfig.json` - главный файл настроек TypeScript.
- `next-env.d.ts` - служебный файл Next.js, руками обычно не редактируется.
- `src/types/bootstrap.d.ts` - декларация для Bootstrap JS, чтобы TypeScript понимал динамический импорт.

Файлы компонентов пишутся с расширением `.tsx`, потому что внутри них есть JSX-разметка.

## Как типизировать props компонента

Для простых компонентов удобно описывать props через `type`.

```tsx
type Props = {
  title: string;
  subtitle?: string; // знак ? значит, что поле необязательное
};

export function SectionTitle({ title, subtitle }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}
```

Комментарий: если компонент получает данные извне, лучше сразу описать их форму. Так редактор подскажет ошибки до запуска сайта.

## Как типизировать массивы данных

Пример уже есть в `src/views/ReviewsPage.tsx`: там описан тип `Review`.

```tsx
type Review = {
  name: string;
  child: string;
  text: string;
  highlight?: string;
};

const REVIEWS: Review[] = [
  {
    name: 'Анна',
    child: 'сын, 6 лет',
    text: 'Текст отзыва',
  },
];
```

Комментарий: запись `Review[]` означает “массив объектов типа Review”.

## Когда нужен client component

В Next.js компоненты по умолчанию серверные. Если компонент использует браузерные эффекты, события или хуки вроде `useEffect`, сверху нужно добавить:

```tsx
'use client';
```

Пример: `src/app/providers/BootstrapClient.tsx`.

```tsx
'use client';

import { useEffect } from 'react';

export function BootstrapClient() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return null;
}
```

Комментарий: Bootstrap-модалки работают в браузере, поэтому JS Bootstrap подключается только на клиенте.

## Как добавлять новые страницы

В App Router страница создается файлом `page.tsx`.

Пример:

```text
src/app/new-page/page.tsx
```

```tsx
export default function NewPage() {
  return <main>Новая страница</main>;
}
```

Так появится маршрут:

```text
/new-page
```

Комментарий: имя папки внутри `src/app` становится частью URL.

## Как добавлять глобальные стили

Глобальные `.scss` стили подключаются через `src/styles/index.scss`, а сам `index.scss` импортируется в `src/app/layout.tsx`.

В компонентах не нужно писать:

```tsx
import './Component.scss';
```

Лучше добавить SCSS-файл в `src/styles/index.scss`:

```scss
@use '../sections/Example/Example';
```

Комментарий: Next.js строже относится к глобальным стилям, поэтому держим их подключение централизованным.

## Команды проверки

Проверить production-сборку:

```bash
npm.cmd run build
```

Проверить lint:

```bash
npm.cmd run lint
```

Запустить dev-сервер:

```bash
npm.cmd run dev
```

Комментарий для Windows/PowerShell: в этом проекте лучше использовать `npm.cmd`, потому что обычный `npm` может упереться в политику выполнения `.ps1` скриптов.

## Практические правила

- Для компонентов с JSX используй `.tsx`.
- Для обычных утилит без JSX используй `.ts`.
- Не используй `any`, если можно описать нормальный тип.
- Не редактируй `next-env.d.ts` вручную.
- Перед завершением изменений запускай `npm.cmd run build`.
- Если добавляешь интерактивность через хуки React, проверь, нужен ли `'use client'`.
