import Link from 'next/link';

export function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <h2 className="about__title">Обо мне</h2>
        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-7">
            <p className="about__lead">
              Меня зовут Вера Александровна Мелкова. Я веду нейропсихологические
              и сенсорно-двигательные занятия с детьми в Майкопе.
            </p>
            <p className="about__text">
              Проходила дополнительное обучение по психомоторной нейропсихологической
              коррекции, интеграции нейропсихологических и логопедических технологий,
              диагностике и интеграции примитивных рефлексов.
            </p>
            <p className="about__text">
              В 2026 году прошла обучение по программе «Метод Со-творение Максимовой
              Е. В.» — телесно-ориентированная терапия с опорой на теорию построения
              движений Н. А. Бернштейна. Модуль 1 «Знакомство с методом», 36 часов.
            </p>
            <Link className="btn btn-outline-secondary" href="/docs/">Посмотреть документы об обучении</Link>
          </div>
          <div className="col-12 col-lg-5">
            <div className="about__card card-glass">
              <h3 className="about__cardTitle">На что обращаю внимание</h3>
              <p className="about__cardText">
                Мне важно увидеть и трудности ребёнка, и то, что ему уже удаётся.
                При подборе заданий учитываю его возраст, состояние и вопросы семьи.
              </p>
              <p className="about__cardText">
                Если ребёнок наблюдается у других специалистов, учитываю их рекомендации.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
