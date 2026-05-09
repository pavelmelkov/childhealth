export function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <h2 className="services__title">С чем работаем на занятиях</h2>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="services__card card-glass">
              <div className="services__cardTitle">Нейропсихологическая и двигательная коррекция</div>
              <ul className="services__list">
                <li>Упражнения на баланс, координацию, схему тела и моторное планирование</li>
                <li>Работа с вниманием, переключением, темпом выполнения и устойчивостью к нагрузке</li>
                <li>Подбор заданий под возраст, состояние и конкретный запрос ребёнка</li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="services__card card-glass">
              <div className="services__cardTitle">Речевая и телесная поддержка</div>
              <ul className="services__list">
                <li>Элементы логопедического и точечного массажа по показаниям и запросу</li>
                <li>Телесно-ориентированные упражнения для снижения напряжения и лучшего контакта с телом</li>
                <li>Игровые задания, которые помогают ребёнку включаться в речь, контакт и обучение</li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="services__card card-glass">
              <div className="services__cardTitle">Нейропсихологическая диагностика детей</div>
              <ul className="services__list">
                <li>Первичное знакомство с ребёнком и запросом семьи</li>
                <li>Наблюдение за вниманием, речью, движением, координацией и поведением</li>
                <li>Рекомендации по занятиям, домашней поддержке и дальнейшему маршруту</li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="services__card card-glass">
              <div className="services__cardTitle">Занятия с детьми в Майкопе</div>
              <ul className="services__list">
                <li>Индивидуальные и групповые форматы по возрасту и состоянию ребёнка</li>
                <li>Брифалити/BrainFit, игровые нейроупражнения и сенсомоторные задания</li>
                <li>Понятная обратная связь родителям после занятий</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="services__note">
          Формат может быть индивидуальным или групповым. Точная программа подбирается после знакомства и не заменяет консультации врача или профильных специалистов.
        </p>
      </div>
    </section>
  );
}
