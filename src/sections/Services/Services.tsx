export function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <h2 className="services__title">С чем помогаю ребёнку и семье</h2>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="services__card card-glass">
              <div className="services__cardTitle">Нейропсихологическая и двигательная коррекция</div>
              <ul className="services__list">
                <li>Развитие баланса, координации, схемы тела и моторного планирования</li>
                <li>Работа с вниманием, переключением, темпом выполнения и устойчивостью к нагрузке</li>
                <li>Индивидуальный подбор заданий под возраст, состояние и запрос ребёнка</li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="services__card card-glass">
              <div className="services__cardTitle">Речевая и телесная поддержка</div>
              <ul className="services__list">
                <li>Элементы логопедического и точечного массажа по показаниям и запросу</li>
                <li>Телесно-ориентированные упражнения для снижения напряжения и лучшего контакта с телом</li>
                <li>Игровые задания для включения в речь, контакт, инструкцию и обучение</li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="services__card card-glass">
              <div className="services__cardTitle">Нейропсихологическая диагностика детей</div>
              <ul className="services__list">
                <li>Первичное знакомство с ребёнком, историей развития и запросом семьи</li>
                <li>Разбор трудностей при ЗПР, РАС, ЗРР, речевых и сенсомоторных особенностях</li>
                <li>Наблюдение за вниманием, речью, движением, координацией, поведением и утомляемостью</li>
                <li>Рекомендации по занятиям, домашней поддержке и дальнейшему маршруту</li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="services__card card-glass">
              <div className="services__cardTitle">Занятия с детьми в Майкопе</div>
              <ul className="services__list">
                <li>Индивидуальные и групповые форматы по возрасту, состоянию и цели занятий</li>
                <li>Брифалити/BrainFit, игровые нейроупражнения и сенсомоторные задания</li>
                <li>Понятная обратная связь родителям и рекомендации, которые можно применять дома</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="services__note">
          Формат может быть индивидуальным или групповым. Точная программа подбирается
          после знакомства с ребёнком, запроса семьи и, при наличии, рекомендаций
          врачей или профильных специалистов.
        </p>
      </div>
    </section>
  );
}
