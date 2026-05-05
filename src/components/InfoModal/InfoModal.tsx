import { useId } from 'react';

type Props = {
  title?: string;
};

export function InfoModal({
  title = 'Что такое сенсорно-двигательная коррекция?',
}: Props) {
  const id = useId();

  return (
    <>
      {/* Триггер */}
      <button
        type="button"
        className="btn btn-link p-0 text-decoration-none d-inline-flex align-items-center gap-2"
        data-bs-toggle="modal"
        data-bs-target={`#${id}`}
        style={{ color: 'rgba(255,255,255,0.78)' }}
      >
        <span
          className="d-inline-flex align-items-center justify-content-center"
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.22)',
            fontSize: 12,
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          ?
        </span>
        <span style={{ fontSize: 14 }}>
          Что такое сенсорно-двигательная коррекция и кому подходит
        </span>
      </button>

      {/* Модалка */}
      <div className="modal fade" id={id} tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg modal-neuro">
          <div className="modal-content modal-neuro__content">
            <div className="modal-header">
              <h5 className="modal-title" style={{ fontWeight: 800 }}>
                {title}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              <div className="neuro-grid">
                <div className="neuro-box">
                  <div className="neuro-box__title">Что это</div>
                  <p className="neuro-muted">
                    <strong>Сенсорно-двигательная коррекция</strong> (нейродвигательные занятия) —
                    это практические занятия через движение и сенсорные упражнения. Цель — поддержать
                    развитие навыков, важных для повседневной активности и обучения: координации,
                    моторного планирования, саморегуляции, устойчивости внимания и темпа работы.
                  </p>

                  <div className="neuro-box__title">Что делаем на занятиях</div>
                  <ul>
                    <li>упражнения на координацию, баланс, ориентацию в пространстве;</li>
                    <li>сенсомоторные задания (крупная/мелкая моторика, контроль движения);</li>
                    <li>упражнения на переключение и темп выполнения;</li>
                    <li>структурированные игровые задания по шагам;</li>
                    <li>обратная связь и рекомендации родителям (по необходимости).</li>
                  </ul>
                </div>

                <div className="neuro-box">
                  <div className="neuro-box__title">Кому может подойти</div>
                  <ul>
                    <li>ЗПР: трудности с освоением навыков, утомляемость, замедленный темп;</li>
                    <li>РАС: сенсорные особенности, трудности с саморегуляцией и адаптацией;</li>
                    <li>речевые нарушения — как поддержка через сенсомоторику и структуру занятий;</li>
                    <li>двигательные/моторные трудности: координация, баланс, точность движений;</li>
                    <li>сложно “держать” инструкцию, планировать действия и доводить до конца.</li>
                  </ul>

                  <div className="neuro-box neuro-box--inner">
                    <div className="neuro-box__title">Важно</div>
                    <div className="neuro-muted">
                      Занятия не заменяют медицинскую диагностику и лечение. Программа подбирается
                      индивидуально после первичного знакомства и запроса семьи.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <a className="btn btn-primary" href="#contacts" data-bs-dismiss="modal">
                Записаться
              </a>
              <button type="button" className="btn btn-outline-light" data-bs-dismiss="modal">
                Понятно
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}