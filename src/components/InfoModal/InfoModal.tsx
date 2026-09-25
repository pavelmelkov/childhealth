import { useId } from 'react';

export function InfoModal({ title = 'Что такое сенсорно-двигательные занятия?' }: { title?: string }) {
  const id = 'neuro-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <>
      <button type="button" className="neuro-help btn btn-link p-0 text-decoration-none d-inline-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target={'#' + id}>
        <span className="neuro-help__icon" aria-hidden="true">?</span>
        <span>Что значит «сенсорно-двигательные»</span>
      </button>
      <div className="modal fade" id={id} tabIndex={-1} aria-labelledby={id + '-title'} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg modal-neuro">
          <div className="modal-content modal-neuro__content">
            <div className="modal-header">
              <h2 className="modal-title fs-5" id={id + '-title'}>{title}</h2>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Закрыть" />
            </div>
            <div className="modal-body">
              <p>Это задания, в которых ребёнок работает с движением и ощущениями своего тела: удерживает равновесие, координирует движения, ориентируется в пространстве.</p>
              <p>Например, на занятиях используются упражнения на баланс, контроль движения и переключение между действиями. Конкретные задания подбираются после знакомства с ребёнком.</p>
              <p className="mb-0">Название подхода само по себе не определяет, какие упражнения подойдут ребёнку и каким будет результат.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Понятно</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
