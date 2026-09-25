import { faqItems } from '@/content/public-copy';

export function Faq() {
  return (
    <section className="faq" id="faq">
      <div className="container">
        <h2 className="faq__title">Перед записью</h2>
        <div className="faq__grid">
          {faqItems.map((item) => (
            <article className="faq__item card-glass" key={item.question}>
              <h3 className="faq__question">{item.question}</h3>
              <p className="faq__answer">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
