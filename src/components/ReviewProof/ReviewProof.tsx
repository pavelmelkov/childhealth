'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  id: string;
  name: string;
  screenshotSrc?: string;
};

export function ReviewProof({ id, name, screenshotSrc }: Props) {
  const [imageReady, setImageReady] = useState(Boolean(screenshotSrc));
  const portalRoot = typeof document === 'undefined' ? null : document.body;

  if (!screenshotSrc || !imageReady) {
    return (
      <div className="reviews__proof reviews__proof--empty">
        <div className="reviews__proofLabel">Скрин отзыва</div>
        <div className="reviews__proofText">Можно добавить изображение</div>
      </div>
    );
  }

  const modal = (
    <div className="modal fade reviews__proofModalLayer" id={id} tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered reviews__proofModal">
        <div className="modal-content reviews__proofModalContent">
          <div className="modal-header">
            <h5 className="modal-title">Скрин отзыва</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Закрыть"
            />
          </div>
          <div className="modal-body">
            <img src={screenshotSrc} alt={`Скрин отзыва: ${name}`} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="reviews__proof reviews__proofButton"
        data-bs-toggle="modal"
        data-bs-target={`#${id}`}
        aria-label={`Открыть скрин отзыва: ${name}`}
      >
        <img
          src={screenshotSrc}
          alt={`Скрин отзыва: ${name}`}
          loading="lazy"
          onError={() => setImageReady(false)}
        />
        <span className="reviews__proofOverlay">Открыть скрин</span>
      </button>

      {portalRoot ? createPortal(modal, portalRoot) : null}
    </>
  );
}
