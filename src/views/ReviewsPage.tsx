import Link from 'next/link';
import { ReviewProof } from '@/components/ReviewProof/ReviewProof';
import { publicPath } from '@/lib/publicPath';
import { reviews } from '@/content/public-copy';

export default function ReviewsPage() {
  return (
    <main className="reviews">
      <div className="container">
        <div className="reviews__top">
          <div>
            <h1 className="reviews__title">Отзывы о работе с Верой</h1>
            <p className="reviews__subtitle">Ниже — краткие пересказы отзывов. В каждой карточке можно открыть исходное сообщение.</p>
          </div>
          <Link className="btn btn-outline-secondary" href="/">← На главную</Link>
        </div>
        <div className="reviews__grid">
          {reviews.map((review) => (
            <article key={review.id} className="reviews__card card-glass">
              <div className="reviews__meta">
                <div className="reviews__person">
                  <span className="reviews__avatar" aria-hidden="true">{review.id}</span>
                  <div>
                    <div className="reviews__name">{review.name}</div>
                    {review.child && <div className="reviews__child">{review.child}</div>}
                  </div>
                </div>
              </div>
              <h2 className="reviews__badge">{review.title}</h2>
              <p className="reviews__child">Кратко об отзыве</p>
              <p className="reviews__text">{review.text}</p>
              <ReviewProof id={'reviewProof' + review.id} name={review.name} screenshotSrc={publicPath('/reviews/review-' + review.id + '.jpg')} />
            </article>
          ))}
        </div>
        <div className="reviews__note card-glass">
          <h2 className="reviews__noteTitle">Хотите добавить отзыв?</h2>
          <p className="reviews__noteText">Можно прислать текст в Telegram. Размещу его на сайте с вашего разрешения, без персональных данных ребёнка.</p>
          <Link className="btn btn-outline-secondary" href="/#contacts">Перейти к контактам</Link>
        </div>
      </div>
    </main>
  );
}
