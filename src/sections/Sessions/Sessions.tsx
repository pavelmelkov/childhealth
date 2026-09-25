import { InfoModal } from '@/components/InfoModal/InfoModal';
import Link from 'next/link';

export function Sessions() {
  return (
    <section className="services" id="sessions">
      <div className="container">
        <h2 className="services__title">Подходы и содержание занятий</h2>
        <div className="row g-3">
          <div className="col-12 col-lg-7">
            <div className="services__card card-glass">
              <h3 className="services__cardTitle">Работа с телом и движением</h3>
              <p>В телесно-ориентированном подходе внимание направлено на ощущения тела, движение и состояние ребёнка. Для меня важно учитывать не только выполнение упражнения, но и то, как ребёнок себя чувствует.</p>
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
          <h3 className="services__cardTitle">INPP: двигательная основа обучения</h3>
          <p>Прошла курс INPP по оценке нейромоторной готовности к обучению и школьной двигательной программе.</p>
          <p>В программе рассматриваются равновесие, координация, зрительно-двигательные навыки и признаки сохранения примитивных рефлексов — автоматических реакций раннего развития. Скрининговые задания помогают заметить особенности двигательного развития; они не заменяют диагностику.</p>
          <p>Двигательная часть построена на последовательности движений первого года жизни. Она рассчитана на регулярное выполнение в школьных группах с постепенным усложнением упражнений.</p>
          <p>Этот курс — часть моего дополнительного обучения. Его объём и сертификат можно посмотреть в документах.</p>
          <div className="d-flex flex-wrap gap-3">
            <Link className="btn btn-outline-secondary" href="/docs/">Документы об обучении</Link>
            <a className="btn btn-outline-secondary" href="https://www.inpp.org.uk/onedaycourses" target="_blank" rel="noopener noreferrer">О программе на сайте INPP</a>
          </div>
        </div>
        <div className="services__card card-glass mt-4">
          <h3 className="services__cardTitle">Как уточнить условия</h3>
          <p>Занятия проходят в Майкопе. Стоимость, длительность, место встречи и доступное время уточняйте при записи.</p>
          <a className="btn btn-outline-secondary" href="#contacts">Уточнить условия занятий</a>
        </div>
      </div>
    </section>
  );
}
