'use client';

import type { ImgHTMLAttributes, VideoHTMLAttributes } from 'react';
import { useEffect, useRef, useState } from 'react';

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

function deferSetLoaded(setLoaded: (loaded: boolean) => void) {
  window.setTimeout(() => setLoaded(true), 0);
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
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;

    if (image?.complete) {
      deferSetLoaded(setLoaded);
      return;
    }

    const timeoutId = window.setTimeout(() => setLoaded(true), 12000);
    return () => window.clearTimeout(timeoutId);
  }, [props.src]);

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
        ref={imageRef}
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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video && video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      deferSetLoaded(setLoaded);
      return;
    }

    const timeoutId = window.setTimeout(() => setLoaded(true), 12000);
    return () => window.clearTimeout(timeoutId);
  }, [props.src]);

  return (
    <span className={getWrapperClassName(wrapperClassName, loaded)}>
      <span className="mediaLoader__placeholder" aria-hidden="true">
        <span className="mediaLoader__spinner" />
        <span className="mediaLoader__text">{loaderLabel}</span>
      </span>
      <video
        {...props}
        className={className}
        ref={videoRef}
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
