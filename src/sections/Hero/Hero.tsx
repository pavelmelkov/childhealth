import { InfoModal } from '../../components/InfoModal/InfoModal';
import { ImageWithLoader } from '@/components/MediaLoader/MediaLoader';
import { publicPath } from '@/lib/publicPath';

export function Hero() {
  return (
    <header className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="hero__badge">Нейропсихологическая и сенсорно-двигательная поддержка</p>

          <h1 className="hero__title">
            Нейропсихологические занятия для детей в Майкопе
          </h1>

          <p className="hero__subtitle">
            Помогаю детям, которым сложно с движением, вниманием, речью, обучением или
            саморегуляцией. Работаю через нейропсихологические, нейромоторные и телесно-ориентированные
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

          <div className="hero__tips" aria-label="Особенности занятий">
            <span className="hero__tip">Первичное знакомство</span>
            <span className="hero__tip">Запрос семьи</span>
            <span className="hero__tip">Индивидуальный план</span>
            <span className="hero__tip">Тело и движение</span>
            <span className="hero__tip">Внимание и речь</span>
            <span className="hero__tip">Готовность к обучению</span>
            <span className="hero__tip">Обратная связь родителям</span>
            <span className="hero__tip">Рекомендации для дома</span>
          </div>
        </div>

        <div className="hero__visual">
          <figure className="hero__portrait card-glass">
            <ImageWithLoader
              src={publicPath('/about/about.jpg')}
              alt="Мелкова Вера Александровна"
              loading="eager"
              loaderLabel="Загрузка фото"
            />
            <figcaption className="hero__portraitCaption">
              <span>Вера Мелкова</span>
              <small>нейропсихологическая поддержка детей</small>
            </figcaption>
          </figure>
        </div>
      </div>
    </header>
  );
}
