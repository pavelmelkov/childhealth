import Link from 'next/link';

type PriceItem = {
  title: string;
  format: string;
  duration: string;
  includes: string[];
  note: string;
};

const PRICE_ITEMS: PriceItem[] = [
  {
    title: 'Индивидуальные занятия',
    format: '1 ребенок',
    duration: 'Длительность и частота подбираются после первичной встречи',
    includes: [
      'индивидуальный план работы',
      'учет возраста, состояния и запроса семьи',
      'рекомендации для домашних упражнений',
    ],
    note: 'Цена будет добавлена позже',
  },
  {
    title: 'Групповые занятия',
    format: 'мини-группа',
    duration: 'Расписание и состав группы согласуются заранее',
    includes: [
      'занятия в малой группе',
      'мягкая адаптация к общему формату',
      'упражнения на внимание, тело, взаимодействие',
    ],
    note: 'Цена будет добавлена позже',
  },
];

export default function PricesPage() {
  return (
    <main className="prices">
      <div className="container">
        <div className="prices__top">
          <div>
            <h1 className="prices__title">Цены на услуги</h1>
            <p className="prices__subtitle">
              Шаблон для индивидуальных и групповых занятий. Актуальные цены появятся здесь позже.
            </p>
          </div>
          <Link className="btn btn-outline-light" href="/">
            ← На главную
          </Link>
        </div>

        <section className="prices__grid" aria-label="Форматы занятий">
          {PRICE_ITEMS.map((item) => (
            <article className="prices__card card-glass" key={item.title}>
              <div className="prices__cardHead">
                <div>
                  <h2 className="prices__h2">{item.title}</h2>
                  <div className="prices__format">{item.format}</div>
                </div>
                <div className="prices__placeholder">Цена уточняется</div>
              </div>

              <p className="prices__duration">{item.duration}</p>

              <div className="prices__includesTitle">Что входит</div>
              <ul className="prices__list">
                {item.includes.map((include) => (
                  <li key={include}>{include}</li>
                ))}
              </ul>

              <div className="prices__note">{item.note}</div>
            </article>
          ))}
        </section>

        <section className="prices__info card-glass">
          <div>
            <h2 className="prices__infoTitle">Перед записью</h2>
            <p className="prices__infoText">
              Формат занятий, частота встреч и подходящая нагрузка обсуждаются индивидуально.
            </p>
          </div>
          <Link className="btn btn-primary" href="/#contacts">
            Связаться
          </Link>
        </section>
      </div>
    </main>
  );
}
