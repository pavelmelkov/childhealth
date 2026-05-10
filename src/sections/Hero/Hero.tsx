import { InfoModal } from '../../components/InfoModal/InfoModal';
import { ImageWithLoader } from '@/components/MediaLoader/MediaLoader';
import { publicPath } from '@/lib/publicPath';

export function Hero() {
  return (
    <header className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="hero__badge">Детский нейропсихолог в Майкопе</p>

          <h1 className="hero__title">
            Нейропсихологические занятия для развития ребёнка
          </h1>

          <p className="hero__subtitle">
            Помогаю понять, что мешает ребёнку в движении, внимании, речи, обучении
            или саморегуляции, и подобрать бережный маршрут поддержки. В работе
            используются нейропсихологические, нейромоторные и телесно-ориентированные
            упражнения методом замещающего онтогенеза: движение, баланс, координация,
            примитивные рефлексы, элементы логопедического массажа и игровые задания
            по возрасту ребёнка.
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
            <span className="hero__tip">Причины трудностей</span>
            <span className="hero__tip">Запрос семьи</span>
            <span className="hero__tip">Индивидуальный план</span>
            <span className="hero__tip">Тело и движение</span>
            <span className="hero__tip">Внимание и речь</span>
            <span className="hero__tip">Готовность к обучению</span>
            <span className="hero__tip">Сильные стороны ребёнка</span>
            <span className="hero__tip">Обратная связь родителям</span>
            <span className="hero__tip">Рекомендации для дома</span>
          </div>

          <div className="hero__diagnostics" aria-label="С какими диагнозами и трудностями можно обратиться">
            <div className="hero__diagnosticsTitle">Можно обратиться при диагнозе или подозрении:</div>
            <div className="hero__diagnosticsList">
              <span>ЗПР</span>
              <span>РАС</span>
              <span>ЗРР и речевые нарушения</span>
              <span>сенсорные особенности</span>
              <span>моторная неловкость</span>
              <span>трудности внимания</span>
              <span>сложности с обучением</span>
            </div>
            <p className="hero__diagnosticsNote">
              Занятия могут быть частью комплексного маршрута и выстраиваются с учётом
              рекомендаций врачей и профильных специалистов, если ребёнок уже наблюдается.
            </p>
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
              <small>нейропсихологическая и сенсорно-двигательная поддержка детей</small>
            </figcaption>
          </figure>
        </div>
      </div>
    </header>
  );
}
