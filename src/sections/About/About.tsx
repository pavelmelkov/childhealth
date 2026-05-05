import { ImageWithLoader } from '@/components/MediaLoader/MediaLoader';
import { publicPath } from '@/lib/publicPath';

export function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <h2 className="about__title">О специалисте</h2>

        <div className="row g-4 align-items-start">
          <div className="col-12 col-md-5 col-lg-4">
            <figure className="about__photo card-glass">
              <ImageWithLoader
                src={publicPath('/about/about.jpg')}
                alt="Мелкова Вера Александровна"
                loading="lazy"
                loaderLabel="Загрузка фото"
              />
            </figure>
          </div>

          <div className="col-12 col-md-7 col-lg-5">
            <p className="about__lead">
              Меня зовут Мелкова Вера Александровна. Я работаю с детьми через
              нейропсихологическую, психомоторную и сенсорно-двигательную коррекцию.
            </p>

            <p className="about__text">
              В моей подготовке есть обучение по психомоторной нейропсихологической
              коррекции, диагностике и интеграции примитивных рефлексов, нейромоторной
              готовности к обучению, интеграции нейропсихологических и логопедических
              технологий, а также по массажу шейно-воротниковой зоны и точечному массажу
              в логопедии.
            </p>

            <p className="about__text">
              На практике это помогает выстраивать занятия для детей, которым трудно
              удерживать внимание, координировать движения, включаться в речь и обучение,
              переключаться между заданиями или регулировать состояние. Занятия не
              заменяют медицинскую диагностику и лечение, но могут быть частью бережной
              комплексной поддержки развития.
            </p>
          </div>

          <div className="col-12 col-lg-3">
            <div className="about__card card-glass">
              <ul className="about__list">
                <li><strong>Направления:</strong> нейрокоррекция, сенсомоторика, нейромоторика</li>
                <li><strong>В работе:</strong> баланс, координация, рефлексы, телесные упражнения</li>
                <li><strong>Запросы:</strong> речь, внимание, моторика, обучение, саморегуляция</li>
                <li><strong>Для семьи:</strong> обратная связь и домашние рекомендации</li>
              </ul>

              <div className="about__note">
                Программа подбирается индивидуально после первичного знакомства.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
