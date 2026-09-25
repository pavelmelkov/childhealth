const concerns = [
  { title: 'Внимание и задания', text: 'Ребёнку трудно удерживать внимание, следовать инструкции или переключаться с одного задания на другое.' },
  { title: 'Движение и координация', text: 'Возникают сложности с равновесием, точностью движений или выполнением последовательности действий.' },
  { title: 'Речь и обучение', text: 'Вас беспокоит, как ребёнок осваивает речь, включается в общение или справляется с учебными заданиями.' },
  { title: 'Утомляемость и состояние', text: 'Ребёнок быстро устаёт от заданий, ему трудно справляться с нагрузкой или успокаиваться.' },
];

export function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <h2 className="services__title">С чем можно обратиться</h2>
        <div className="row g-3">
          {concerns.map((item) => (
            <div className="col-12 col-md-6" key={item.title}>
              <div className="services__card card-glass">
                <h3 className="services__cardTitle">{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="services__note">
          Это примеры вопросов для обсуждения, а не признаки для самостоятельной постановки диагноза.
        </p>
      </div>
    </section>
  );
}
