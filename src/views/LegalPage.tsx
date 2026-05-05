import Link from 'next/link';
import { publicPath } from '@/lib/publicPath';

type Certificate = {
  id: string;
  title: string;
  label: string;
  src: string;
  featured?: boolean;
};

const CERTIFICATES: Certificate[] = [
  {
    id: 'cert1Modal',
    title: 'Сертификат 1',
    label: 'Психомоторная нейропсихологическая коррекция',
    src: publicPath('/docs/sert1.jpg'),
  },
  {
    id: 'cert2Modal',
    title: 'Сертификат 2',
    label: 'Метод сохранения: телесно-ориентированная терапия',
    src: publicPath('/docs/sert2.jpg'),
  },
  {
    id: 'cert3Modal',
    title: 'Сертификат 3',
    label: 'Массаж шейно-воротниковой зоны и точечный массаж в логопедии',
    src: publicPath('/docs/sert3.jpg'),
  },
  {
    id: 'cert4Modal',
    title: 'Сертификат 4',
    label: 'Диагностика и интеграция примитивных рефлексов',
    src: publicPath('/docs/sert4.jpg'),
  },
  {
    id: 'cert5Modal',
    title: 'Сертификат 5',
    label: 'Нейропсихологические и логопедические технологии',
    src: publicPath('/docs/sert5.png'),
  },
  {
    id: 'cert6Modal',
    title: 'Сертификат 6',
    label: 'INPP: нейромоторная готовность к обучению',
    src: publicPath('/docs/sert6.png'),
    featured: true,
  },
];

export default function LegalPage() {
  return (
    <main className="docs">
      <div className="container">
        <div className="docs__top">
          <h1 className="docs__title">Документы и материалы</h1>
          <Link className="btn btn-outline-light" href="/">
            ← На главную
          </Link>
        </div>

        {/* <section className="docs__section card-glass">
          <h2 className="docs__h2">Оферта (условия оказания услуг)</h2>
          <p className="docs__p">
            Здесь размещаем публичную оферту: предмет, стоимость/оплата,
            переносы/отмена, ответственность, порядок оказания услуг, контакты
            исполнителя.
          </p>
          <a className="btn btn-primary" href={publicPath('/docs/oferta.pdf')} download>
            Скачать PDF оферты
          </a>
        </section> */}

        <section className="docs__section card-glass">
          <h2 className="docs__h2">Сертификаты и квалификация</h2>
          <p className="docs__clickHint">Нажмите, чтобы увеличить</p>

          <div className="docs__grid">
            {CERTIFICATES.map((certificate) => (
              <div
                className={certificate.featured ? 'docs__cert docs__cert--featured' : 'docs__cert'}
                key={certificate.id}
              >
                <button
                  type="button"
                  className="docs__certButton"
                  data-bs-toggle="modal"
                  data-bs-target={`#${certificate.id}`}
                  aria-label={`Увеличить ${certificate.label.toLowerCase()}`}
                >
                  <figure className="about__photo card-glass">
                    <img
                      src={certificate.src}
                      alt={`Мелкова Вера Александровна, ${certificate.label.toLowerCase()}`}
                      loading="lazy"
                    />
                  </figure>
                  <span className="docs__certTitle">{certificate.label}</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="docs__section card-glass">
          <h2 className="docs__h2">Видео с занятий (лица размыты)</h2>
          <p className="docs__p">
            Публикуются только при наличии письменного согласия
            родителей/законных представителей.
          </p>

          <div className="docs__grid">
            <div className="docs__video">
              <div className="docs__videoTitle">Видео 1</div>
              <video controls src={publicPath('/media/Timeline_3.mp4')} />
            </div>
            <div className="docs__video">
              <div className="docs__videoTitle">Видео 2</div>
              <video controls src={publicPath('/media/Timeline_2.mov')} />
            </div>
            <div className="docs__video">
              <div className="docs__videoTitle">Видео 3</div>
              <video controls src={publicPath('/media/Timeline_1.mov')} />
            </div>
          </div>
        </section>

        <section className="docs__section card-glass">
          <div className="docs__head">
            <h2 className="docs__h2 m-0">Конфиденциальность и согласия</h2>
            <span className="docs__badge">юридические документы</span>
          </div>

          <p className="docs__p">
            Документы, связанные с персональными данными и публикацией
            фото/видео.
          </p>

          <div className="docs__listGrid">
            <div className="docs__item">
              <div className="docs__itemTitle">Согласие на обработку ПДн</div>
              <div className="docs__itemText" />
              <div className="docs__itemActions">
                <a className="btn btn-outline-light btn-sm" href={publicPath('/docs/consent_pd.pdf')} download>
                  Скачать PDF
                </a>
              </div>
            </div>

            <div className="docs__item">
              <div className="docs__itemTitle">Согласие на фото/видео</div>
              <div className="docs__itemText">
                В процессе занятий с целью фиксации прогресса
              </div>
              <div className="docs__itemActions">
                <a className="btn btn-outline-light btn-sm" href={publicPath('/docs/consent_media.pdf')} download>
                  Скачать PDF
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {CERTIFICATES.map((certificate) => (
        <div
          className="modal fade docs__certModalLayer"
          id={certificate.id}
          tabIndex={-1}
          aria-labelledby={`${certificate.id}Title`}
          aria-hidden="true"
          key={`${certificate.id}-modal`}
        >
          <div className="modal-dialog modal-dialog-centered docs__certModal">
            <div className="modal-content docs__certModalContent">
              <div className="modal-header">
                <h5 className="modal-title" id={`${certificate.id}Title`}>
                  {certificate.label}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Закрыть"
                />
              </div>
              <div className="modal-body">
                <img
                  src={certificate.src}
                  alt={`Мелкова Вера Александровна, ${certificate.label.toLowerCase()}`}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
