import { InfoModal } from '@/components/InfoModal/InfoModal';

export function Sessions() {
  return (
    <section className="services" id="sessions">
      <div className="container">
        <h2 className="services__title">Что происходит на занятиях</h2>
        <div className="row g-3">
          <div className="col-12 col-lg-7">
            <div className="services__card card-glass">
              <h3 className="services__cardTitle">Движение и игровые задания</h3>
              <p>Ребёнок выполняет упражнения на равновесие, координацию, контроль движения и переключение внимания. Я подбираю задания с учётом его возраста и состояния.</p>
              <p>В работе использую метод замещающего онтогенеза: последовательность телесных и двигательных упражнений, от базовых к более сложным.</p>
            </div>
          </div>
          <div className="col-12 col-lg-5">
            <div className="services__card card-glass">
              <h3 className="services__cardTitle">Обратная связь родителям</h3>
              <p>Обсуждаем, что получилось у ребёнка и над чем продолжаем работать. При необходимости даю рекомендации для занятий дома.</p>
              <p>Каким будет результат и сколько времени займёт работа, заранее обещать нельзя.</p>
            </div>
          </div>
        </div>
        <div className="mt-3"><InfoModal /></div>
        <div className="services__card card-glass mt-4">
          <h3 className="services__cardTitle">Как уточнить условия</h3>
          <p>Занятия проходят в Майкопе. Стоимость, длительность, место встречи и доступное время уточняйте при записи.</p>
          <a className="btn btn-outline-secondary" href="#contacts">Уточнить условия занятий</a>
        </div>
      </div>
    </section>
  );
}
