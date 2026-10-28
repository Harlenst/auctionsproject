
import { useState } from 'react';

const questions = [
  {
    id: 1,
    question: '¿Qué es Casa de Subasta HS?',
    answer:
      'Es una plataforma digital que permite publicar artículos y participar en subastas en línea mediante ofertas realizadas por los usuarios.'
  },
  {
    id: 2,
    question: '¿Cómo puedo participar en una subasta?',
    answer:
      'Debes registrarte, iniciar sesión, elegir una subasta disponible y realizar una oferta que cumpla con el incremento mínimo establecido.'
  },
  {
    id: 3,
    question: '¿Puedo vender mis propios artículos?',
    answer:
      'Sí. La plataforma contempla la publicación de artículos para que puedan ser asociados a nuevas subastas.'
  },
  {
    id: 4,
    question: '¿Cómo sé si gané una subasta?',
    answer:
      'Al finalizar la subasta se debe verificar cuál fue la oferta válida más alta y el estado final de la subasta.'
  },
  {
    id: 5,
    question: '¿Las ofertas se actualizan en tiempo real?',
    answer:
      'La plataforma utiliza Socket.IO para comunicar nuevas ofertas a los usuarios conectados a una subasta.'
  }
];

function FAQ() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(1);

  return (
    <section className="faq-section-hs">
      <div className="container">
        <div className="faq-layout-hs">
          <div className="faq-heading-hs">
            <span className="eyebrow-hs">¿TIENES DUDAS?</span>

            <h2>
              Preguntas <span>frecuentes.</span>
            </h2>

            <p>
              Encuentra respuestas a las dudas más comunes sobre
              nuestra plataforma de subastas.
            </p>

            <a href="#contacto" className="faq-contact-hs">
              ¿Necesitas ayuda? Contáctanos ↗
            </a>
          </div>

          <div className="faq-list-hs">
            {questions.map((item) => {
              const isOpen = activeQuestion === item.id;

              return (
                <article className="faq-item-hs" key={item.id}>
                  <button
                    className="faq-question-hs"
                    onClick={() =>
                      setActiveQuestion(isOpen ? null : item.id)
                    }
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>

                    <span className="faq-toggle-hs">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-answer-hs">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
