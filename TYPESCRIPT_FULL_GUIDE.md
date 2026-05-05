# Полная инструкция по TypeScript

Этот файл - подробный справочник по TypeScript для проекта на Next.js. Его можно читать сверху вниз или использовать как шпаргалку во время разработки.

## Что такое TypeScript

TypeScript - это JavaScript с типами. Типы помогают заранее увидеть ошибки: неправильные props, неверную форму объекта, опечатки в полях, неправильный результат функции.

TypeScript не заменяет JavaScript. В браузер всё равно попадает JavaScript, а TypeScript проверяется на этапе разработки и сборки.

## Базовые типы

```ts
const title: string = 'Заголовок';
const age: number = 6;
const isVisible: boolean = true;
const empty: null = null;
const notDefined: undefined = undefined;
```

Обычно TypeScript сам понимает тип, поэтому писать тип везде не обязательно:

```ts
const title = 'Заголовок'; // TypeScript сам понял, что это string
```

## Массивы

```ts
const names: string[] = ['Анна', 'Ирина'];
const ages: number[] = [4, 5, 6];
```

Другой вариант записи:

```ts
const names: Array<string> = ['Анна', 'Ирина'];
```

В проекте чаще используют короткий вариант `string[]`.

## Объекты

```ts
type Specialist = {
  name: string;
  experienceYears: number;
  online: boolean;
};

const specialist: Specialist = {
  name: 'Вера Александровна',
  experienceYears: 4,
  online: true,
};
```

Если пропустить поле или написать поле неправильного типа, TypeScript покажет ошибку.

## Необязательные поля

Знак `?` делает поле необязательным.

```ts
type Review = {
  name: string;
  text: string;
  highlight?: string;
};

const review: Review = {
  name: 'Анна',
  text: 'Спасибо за занятия',
};
```

`highlight` можно не указывать.

## Union-типы

Union означает “одно из нескольких значений”.

```ts
type ButtonVariant = 'primary' | 'secondary' | 'success';

const variant: ButtonVariant = 'primary';
```

Так удобно ограничивать набор вариантов:

```tsx
type Props = {
  variant: 'primary' | 'outline' | 'link';
};
```

Если попытаться передать `variant="red"`, TypeScript покажет ошибку.

## Literal-типы

Можно разрешить только конкретные строки или числа:

```ts
type RoutePath = '/' | '/docs' | '/reviews';

const path: RoutePath = '/docs';
```

Это полезно для навигации, табов, статусов и режимов.

## Type и interface

В TypeScript есть `type` и `interface`. В большинстве случаев можно использовать `type`.

```ts
type Props = {
  title: string;
};
```

`interface` часто используют для описания объектов, которые могут расширяться:

```ts
interface Props {
  title: string;
}
```

Для этого проекта правило простое: используй `type`, если нет причины выбирать `interface`.

## Функции

Типы можно указывать у параметров и результата.

```ts
function formatName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
```

Если функция ничего не возвращает:

```ts
function logMessage(message: string): void {
  console.log(message);
}
```

## Async-функции

Асинхронная функция возвращает `Promise`.

```ts
async function loadData(): Promise<string> {
  return 'Готово';
}
```

Если возвращается объект:

```ts
type User = {
  id: number;
  name: string;
};

async function loadUser(): Promise<User> {
  return {
    id: 1,
    name: 'Анна',
  };
}
```

## Unknown вместо any

`any` отключает проверку типов. Его лучше избегать.

Плохо:

```ts
function parseValue(value: any) {
  return value.name;
}
```

Лучше:

```ts
function parseValue(value: unknown) {
  if (typeof value === 'object' && value !== null && 'name' in value) {
    return value.name;
  }

  return null;
}
```

`unknown` заставляет проверить тип перед использованием.

## Типизация React-компонентов

Компонент с props:

```tsx
type Props = {
  title: string;
  children?: React.ReactNode;
};

export function Card({ title, children }: Props) {
  return (
    <article>
      <h3>{title}</h3>
      {children}
    </article>
  );
}
```

`React.ReactNode` подходит для всего, что можно отрисовать: текст, элемент, массив элементов, `null`.

## Типизация children

Если компонент принимает вложенное содержимое:

```tsx
type Props = {
  children: React.ReactNode;
};

export function Container({ children }: Props) {
  return <div className="container">{children}</div>;
}
```

Если `children` необязательный:

```tsx
type Props = {
  children?: React.ReactNode;
};
```

## Типизация событий

Клик по кнопке:

```tsx
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  console.log(event.currentTarget);
}
```

Изменение input:

```tsx
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  console.log(event.target.value);
}
```

Отправка формы:

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
}
```

## useState

Если начальное значение очевидное, тип можно не писать:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

Если значение сначала `null`, тип лучше указать:

```tsx
type User = {
  name: string;
};

const [user, setUser] = useState<User | null>(null);
```

## useRef

Ref на DOM-элемент:

```tsx
const buttonRef = useRef<HTMLButtonElement | null>(null);
```

Ref на input:

```tsx
const inputRef = useRef<HTMLInputElement | null>(null);
```

## Server и Client Components в Next.js

В Next.js компоненты в `src/app` по умолчанию серверные. Они могут рендериться без браузера.

Если компонент использует:

- `useState`
- `useEffect`
- `useRef`
- обработчики событий
- `window`
- `document`
- браузерные библиотеки

то в начале файла нужен маркер:

```tsx
'use client';
```

Пример из проекта:

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

## Типизация страниц Next.js

Обычная страница:

```tsx
export default function Page() {
  return <main>Главная</main>;
}
```

Страница с параметрами маршрута:

```tsx
type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  return <main>{slug}</main>;
}
```

Комментарий: в новых версиях Next `params` может быть `Promise`, поэтому для динамических маршрутов лучше проверять актуальный формат в документации проекта или по ошибке сборки.

## Metadata в Next.js

Для SEO можно экспортировать `metadata`.

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Название страницы',
  description: 'Описание страницы',
};
```

Так сделано в `src/app/layout.tsx`.

## Декларации модулей

Иногда библиотека не имеет типов для конкретного файла импорта.

В проекте есть пример:

```ts
declare module 'bootstrap/dist/js/bootstrap.bundle.min.js';
```

Он лежит в `src/types/bootstrap.d.ts`.

Комментарий: `.d.ts` файлы описывают типы, но не добавляют реальный JS-код.

## Generics

Generics нужны, когда тип заранее неизвестен, но его нужно сохранить.

```ts
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

const firstName = getFirst(['Анна', 'Ирина']); // string | undefined
const firstAge = getFirst([4, 5, 6]); // number | undefined
```

`T` - это переменный тип.

## Utility Types

TypeScript имеет встроенные помощники.

`Partial` делает все поля необязательными:

```ts
type User = {
  name: string;
  age: number;
};

type UserDraft = Partial<User>;
```

`Pick` берёт часть полей:

```ts
type UserName = Pick<User, 'name'>;
```

`Omit` исключает поля:

```ts
type UserWithoutAge = Omit<User, 'age'>;
```

`Record` описывает объект-словарь:

```ts
type Contacts = Record<string, string>;

const contacts: Contacts = {
  telegram: '@example',
  phone: '+79990000000',
};
```

## as const

`as const` делает значения максимально точными и неизменяемыми.

```ts
const routes = ['/', '/docs', '/reviews'] as const;

type Route = typeof routes[number];
```

Теперь `Route` равен `'/' | '/docs' | '/reviews'`.

## Проверка null и undefined

Если значение может отсутствовать:

```ts
type User = {
  name?: string;
};

function getName(user: User) {
  return user.name ?? 'Без имени';
}
```

`??` использует запасное значение, если слева `null` или `undefined`.

## Optional chaining

```ts
const city = user.address?.city;
```

Если `address` отсутствует, ошибки не будет, результатом станет `undefined`.

## Типизация изображений и медиа

Для статических файлов из `public` обычно достаточно строки:

```tsx
<img src="/about/about.jpg" alt="Описание" />
```

Для видео:

```tsx
<video controls src="/media/video1.mp4" />
```

Если создаёшь массив медиа:

```ts
type VideoItem = {
  title: string;
  src: string;
};

const videos: VideoItem[] = [
  {
    title: 'Видео 1',
    src: '/media/video1.mp4',
  },
];
```

## Типизация отзывов в этом проекте

Хороший формат:

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
    highlight: 'Стало легче удерживать внимание',
    text: 'Текст отзыва',
  },
];
```

Если потом добавить новое обязательное поле, TypeScript подсветит все отзывы, где это поле забыли.

## Типизация контактов

```ts
type ContactLink = {
  label: string;
  href: string;
  variant: 'primary' | 'success' | 'outline';
};

const contacts: ContactLink[] = [
  {
    label: 'Telegram',
    href: 'https://t.me/example',
    variant: 'primary',
  },
];
```

Так удобнее поддерживать кнопки контактов, чем держать всё вручную в JSX.

## Частые ошибки TypeScript

Ошибка: `Type 'number' is not assignable to type 'string'`.

Значит, туда, где ждут строку, передали число.

```ts
const title: string = 123; // ошибка
```

Ошибка: `Property 'name' does not exist`.

Значит, у объекта нет такого поля или тип описан неполно.

Ошибка: `Object is possibly 'null'`.

Значит, перед использованием нужно проверить значение.

```ts
if (user) {
  console.log(user.name);
}
```

Ошибка: `Parameter implicitly has an 'any' type`.

Значит, TypeScript не понял тип параметра.

```ts
function handle(value: string) {
  return value.trim();
}
```

## Команды

Запуск разработки:

```bash
npm.cmd run dev
```

Сборка:

```bash
npm.cmd run build
```

Lint:

```bash
npm.cmd run lint
```

Комментарий: на Windows в этом проекте лучше использовать `npm.cmd`, потому что обычный `npm` может блокироваться PowerShell execution policy.

## Рекомендации для этого проекта

- Новые визуальные блоки клади в `src/sections`.
- Маленькие переиспользуемые элементы клади в `src/components`.
- Страницы-контент без маршрутизации можно держать в `src/views`.
- Реальные маршруты создавай через `src/app`.
- Props описывай рядом с компонентом через `type Props`.
- Массивы данных описывай отдельным типом: `Review[]`, `VideoItem[]`, `ContactLink[]`.
- Не используй `any` без крайней необходимости.
- Если компонент использует хуки или браузерный JS, добавляй `'use client'`.
- После изменений запускай `npm.cmd run build`.

## Мини-шаблон нового компонента

```tsx
type Props = {
  title: string;
  text?: string;
};

export function ExampleBlock({ title, text }: Props) {
  return (
    <section className="example">
      <div className="container">
        <h2>{title}</h2>
        {text ? <p>{text}</p> : null}
      </div>
    </section>
  );
}
```

## Мини-шаблон массива карточек

```tsx
type CardItem = {
  title: string;
  text: string;
};

const ITEMS: CardItem[] = [
  {
    title: 'Первый пункт',
    text: 'Описание первого пункта',
  },
  {
    title: 'Второй пункт',
    text: 'Описание второго пункта',
  },
];

export function Cards() {
  return (
    <div>
      {ITEMS.map((item) => (
        <article key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}
```

Комментарий: для `key` лучше использовать стабильное уникальное значение. Если есть `id`, используй `id`.
