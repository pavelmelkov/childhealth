import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="nf">
      <div className="container nf__wrap card-glass">
        <div className="nf__code">404</div>
        <h1 className="nf__title">Страница не найдена</h1>
        <p className="nf__text">
          Такой страницы нет. Возможно, ссылка устарела или вы ошиблись в адресе.
        </p>

        <div className="nf__actions">
          <Link className="btn btn-primary" href="/">На главную</Link>
          <Link className="btn btn-outline-secondary" href="/docs/">Документы</Link>
        </div>
      </div>
    </main>
  );
}
