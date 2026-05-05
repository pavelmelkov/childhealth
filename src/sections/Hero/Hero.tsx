import { InfoModal } from '../../components/InfoModal/InfoModal';

export function Hero() {
  return (
    <header className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="hero__badge">Нейропсихологическая и сенсорно-двигательная поддержка</p>

          <h1 className="hero__title">
            Занятия для детей, которым сложно с движением, вниманием, речью или саморегуляцией
          </h1>

          <p className="hero__subtitle">
            Работаю через нейропсихологические, нейромоторные и телесно-ориентированные
            упражнения методом замещающего онтогенеза (последовательно с онтогенеза внутриутробного развития до онтогенеза 1 года и более): движение, баланс, координацию, примитивные рефлексы, элементы
            логопедического массажа и игровые элементы по возрасту ребёнка.
          </p>

          <div className="hero__actions">
            <a className="btn btn-primary btn-lg" href="#contacts">
              Записаться на первичную встречу
            </a>
            <a className="btn btn-outline-secondary btn-lg" href="#services">
              Посмотреть форматы
            </a>
            <div className="hero__info">
              <InfoModal />
            </div>
          </div>

          <ul className="hero__facts">
            <li className="hero__fact">План строится после знакомства с ребёнком и запросом семьи</li>
            <li className="hero__fact">В фокусе: тело, движение, внимание, речь и готовность к обучению</li>
            <li className="hero__fact">Родители получают понятную обратную связь и рекомендации для дома</li>
          </ul>
        </div>

        <div className="hero__visual">
          <div className="hero__card card-glass">
            <div className="hero__cardTitle">Первый шаг - спокойная диагностика запроса</div>
            <div className="hero__cardText">
              Вы рассказываете, что беспокоит: моторика, речь, внимание, поведение,
              обучение или усталость. После этого я подсказываю, какой формат работы
              может быть уместен.
            </div>
            <a className="btn btn-success" href="#contacts">
              Написать
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
