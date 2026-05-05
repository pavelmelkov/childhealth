export function Process() {
  return (
    <section className="process" id="process">
      <div className="container">
        <h2 className="process__title">Как проходит работа</h2>
        <p className="process__subtitle">
          Занятия строятся не по шаблону, а от запроса семьи и состояния ребёнка.
          Сначала важно понять, что именно мешает: движение, речь, внимание, усталость,
          поведение, трудности обучения или сенсорная перегрузка.
        </p>

        <div className="row g-3">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="process__card card-glass">
              <div className="process__step">1</div>
              <div className="process__cardTitle">Первичное знакомство</div>
              <div className="process__cardText">
                Обсуждаем возраст, особенности развития, жалобы семьи и то, какие
                специалисты уже наблюдают ребёнка.
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="process__card card-glass">
              <div className="process__step">2</div>
              <div className="process__cardTitle">Наблюдение и подбор задач</div>
              <div className="process__cardText">
                Смотрим движение, координацию, внимание, реакцию на задания и нагрузку.
                После этого формируется план занятий.
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="process__card card-glass">
              <div className="process__step">3</div>
              <div className="process__cardTitle">Занятия</div>
              <div className="process__cardText">
                Используем нейропсихологические, сенсомоторные, телесные и игровые
                упражнения в темпе, который подходит ребёнку.
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="process__card card-glass">
              <div className="process__step">4</div>
              <div className="process__cardTitle">Обратная связь семье</div>
              <div className="process__cardText">
                Родители получают понятные комментарии: что получилось, что тренируем
                дальше и какие простые упражнения можно делать дома.
              </div>
            </div>
          </div>
        </div>

        <p className="process__note">
          Фото и видео используются только с согласия родителей и без публикации
          персональных данных ребёнка.
        </p>
      </div>
    </section>
  );
}
