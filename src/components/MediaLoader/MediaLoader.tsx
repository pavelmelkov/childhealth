'use client';

import type { ImgHTMLAttributes, VideoHTMLAttributes } from 'react';
import { useState } from 'react';

type ImageWithLoaderProps = ImgHTMLAttributes<HTMLImageElement> & {
  loaderLabel?: string;
  wrapperClassName?: string;
};

type VideoWithLoaderProps = VideoHTMLAttributes<HTMLVideoElement> & {
  loaderLabel?: string;
  wrapperClassName?: string;
};

function getWrapperClassName(wrapperClassName?: string, loaded?: boolean) {
  return ['mediaLoader', loaded ? 'mediaLoader--loaded' : '', wrapperClassName ?? ''].filter(Boolean).join(' ');
}

export function ImageWithLoader({
  alt,
  className,
  loaderLabel = 'Загрузка изображения',
  onLoad,
  onError,
  wrapperClassName,
  ...props
}: ImageWithLoaderProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <span className={getWrapperClassName(wrapperClassName, loaded)}>
      <span className="mediaLoader__placeholder" aria-hidden="true">
        <span className="mediaLoader__spinner" />
        <span className="mediaLoader__text">{loaderLabel}</span>
      </span>
      <img
        {...props}
        alt={alt}
        className={className}
        onError={(event) => {
          setLoaded(true);
          onError?.(event);
        }}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
      />
    </span>
  );
}

export function VideoWithLoader({
  className,
  loaderLabel = 'Загрузка видео',
  onLoadedData,
  onError,
  wrapperClassName,
  ...props
}: VideoWithLoaderProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <span className={getWrapperClassName(wrapperClassName, loaded)}>
      <span className="mediaLoader__placeholder" aria-hidden="true">
        <span className="mediaLoader__spinner" />
        <span className="mediaLoader__text">{loaderLabel}</span>
      </span>
      <video
        {...props}
        className={className}
        onError={(event) => {
          setLoaded(true);
          onError?.(event);
        }}
        onLoadedData={(event) => {
          setLoaded(true);
          onLoadedData?.(event);
        }}
      />
    </span>
  );
}
