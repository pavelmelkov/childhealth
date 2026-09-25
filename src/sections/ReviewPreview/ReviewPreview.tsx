import Link from 'next/link';
import { reviews } from '@/content/public-copy';
import { ReviewProof } from '@/components/ReviewProof/ReviewProof';
import { publicPath } from '@/lib/publicPath';

export function ReviewPreview() {
  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <h2 className="reviews__title">Отзывы о работе с Верой</h2>
        <p className="reviews__subtitle">Короткие пересказы. Исходные сообщения доступны в карточках.</p>
        <div className="reviews__grid">
          {reviews.filter((review) => [3, 5, 6].includes(review.id)).map((review) => (
            <article className="reviews__card card-glass" key={review.id}>
              <h3 className="reviews__badge">{review.title}</h3>
              <p className="reviews__child">{review.name} · Кратко об отзыве</p>
              <p className="reviews__text">{review.short}</p>
              <ReviewProof id={'homeReviewProof' + review.id} name={review.name} screenshotSrc={publicPath('/reviews/review-' + review.id + '.jpg')} />
            </article>
          ))}
        </div>
        <Link className="btn btn-outline-secondary mt-4" href="/reviews/">Все отзывы</Link>
      </div>
    </section>
  );
}
