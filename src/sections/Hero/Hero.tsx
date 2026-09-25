import { ImageWithLoader } from '@/components/MediaLoader/MediaLoader';
import { publicPath } from '@/lib/publicPath';

export function Hero() {
  return (
    <header className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="hero__badge">Вера Мелкова · Майкоп</p>
          <h1 className="hero__title">Нейропсихологические занятия с детьми</h1>
          <p className="hero__subtitle">
            Работаю с детьми, которым трудно удерживать внимание, координировать
            движения, осваивать речь и учиться.
          </p>
          <div className="hero__actions">
            <a className="btn btn-primary btn-lg" href="#contacts">Связаться со мной</a>
            <a className="btn btn-outline-secondary btn-lg" href="#process">Как проходит первая встреча</a>
          </div>
        </div>
        <div className="hero__visual">
          <figure className="hero__portrait card-glass">
            <ImageWithLoader src={publicPath('/about/about.jpg')} alt="Мелкова Вера Александровна" loading="eager" loaderLabel="Загрузка фото" />
            <figcaption className="hero__portraitCaption">
              <span>Вера Мелкова</span>
              <small>Занятия в Майкопе</small>
            </figcaption>
          </figure>
        </div>
      </div>
    </header>
  );
}
