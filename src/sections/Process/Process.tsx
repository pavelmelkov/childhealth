const steps = [
  { title: 'Разговариваем с родителем', text: 'Вы рассказываете о развитии ребёнка, о том, что вас беспокоит, и о специалистах, у которых он уже наблюдается.' },
  { title: 'Знакомлюсь с ребёнком', text: 'Наблюдаю, как ребёнок двигается, удерживает внимание и реагирует на задания. Обращаю внимание на утомляемость и на то, что ему удаётся.' },
  { title: 'Обсуждаем дальнейшие занятия', text: 'Обсуждаем, над какими трудностями будем работать и какие занятия могут подойти ребёнку.' },
];

export function Process() {
  return (
    <section className="process" id="process">
      <div className="container">
        <h2 className="process__title">Первая встреча</h2>
        <p className="process__subtitle">Начинаем с вашего запроса и знакомства с ребёнком.</p>
        <div className="row g-3">
          {steps.map((step, index) => (
            <div className="col-12 col-md-4" key={step.title}>
              <div className="process__card card-glass">
                <div className="process__step">{index + 1}</div>
                <h3 className="process__cardTitle">{step.title}</h3>
                <p className="process__cardText">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="process__note">
          Если вы обращаетесь именно за диагностикой, её состав и формат нужно обсудить при записи.
        </p>
      </div>
    </section>
  );
}
