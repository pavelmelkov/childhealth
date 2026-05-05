export function Contacts() {
  return (
    <section className="contacts " id="contacts">
      <div className="container">
        <div className="contacts__box card-glass">
          <h2 className="contacts__title">Запись и вопросы</h2>
          <p className="contacts__text">
            Напишите удобным способом — отвечу, уточню запрос и предложу формат занятий.
          </p>

          <div className="contacts__actions">
            <a className="btn btn-primary btn-lg" href="#">
              Telegram
            </a>
            <a className="btn btn-outline-secondary btn-lg" href="#">
              Позвонить
            </a>
          </div>

          <p className="contacts__hint">
            (Ссылки заменим на реальные контакты мамы)
          </p>
        </div>
      </div>
    </section>
  );
}
