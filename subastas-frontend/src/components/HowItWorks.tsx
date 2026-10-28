
const steps = [
  {
    number: '01',
    icon: '⌕',
    title: 'Descubre',
    description:
      'Explora nuestro catálogo y encuentra piezas únicas que despierten tu interés.'
  },
  {
    number: '02',
    icon: '↗',
    title: 'Participa',
    description:
      'Regístrate, consulta los detalles del artículo y realiza tus pujas.'
  },
  {
    number: '03',
    icon: '♛',
    title: 'Gana',
    description:
      'Si tienes la oferta ganadora al finalizar la subasta, podrás continuar con el proceso de compra.'
  }
];

function HowItWorks() {
  return (
    <section className="how-section-hs" id="como-pujar">
      <div className="container">
        <div className="how-heading-hs">
          <span className="eyebrow-hs">UNA EXPERIENCIA SENCILLA</span>

          <h2>
            ¿Cómo funciona <span>nuestra subasta?</span>
          </h2>

          <p>
            Participar en Casa de Subasta HS es fácil. Sigue estos
            tres pasos y encuentra tu próxima pieza especial.
          </p>
        </div>

        <div className="steps-grid-hs">
          {steps.map((step) => (
            <article className="step-card-hs" key={step.number}>
              <div className="step-top-hs">
                <span className="step-number-hs">{step.number}</span>
                <span className="step-icon-hs">{step.icon}</span>
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
