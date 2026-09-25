'use client';

import { useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { ImageWithLoader } from '@/components/MediaLoader/MediaLoader';

type Props = {
  id: string;
  name: string;
  screenshotSrc?: string;
};

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ReviewProof({ id, name, screenshotSrc }: Props) {
  const [imageReady, setImageReady] = useState(Boolean(screenshotSrc));
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const portalRoot = mounted ? document.body : null;

  if (!screenshotSrc || !imageReady) {
    return screenshotSrc ? (
      <a href={screenshotSrc} target="_blank" rel="noopener noreferrer">Открыть оригинал отзыва</a>
    ) : null;
  }

  const modal = (
    <div className="modal fade reviews__proofModalLayer" id={id} tabIndex={-1} aria-labelledby={`${id}Title`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered reviews__proofModal">
        <div className="modal-content reviews__proofModalContent">
          <div className="modal-header">
            <h2 className="modal-title fs-5" id={`${id}Title`}>Оригинал отзыва</h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Закрыть"
            />
          </div>
          <div className="modal-body">
            <ImageWithLoader
              src={screenshotSrc}
              alt={`Оригинал отзыва: ${name}`}
              loaderLabel="Загрузка оригинала"
            />
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
        aria-label={`Открыть оригинал отзыва: ${name}`}
      >
        <ImageWithLoader
          src={screenshotSrc}
          alt={`Оригинал отзыва: ${name}`}
          loading="lazy"
          loaderLabel="Загрузка оригинала"
          onError={() => setImageReady(false)}
        />
        <span className="reviews__proofOverlay">Открыть оригинал</span>
      </button>

      {portalRoot ? createPortal(modal, portalRoot) : null}
    </>
  );
}
