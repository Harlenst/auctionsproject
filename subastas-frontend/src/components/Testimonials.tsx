
const testimonials = [
  {
    id: 1,
    name: 'María G.',
    role: 'Coleccionista',
    text: 'Me encantó la experiencia. Encontré una pieza especial y pude participar en la subasta de una manera muy sencilla.',
    initials: 'MG'
  },
  {
    id: 2,
    name: 'Carlos R.',
    role: 'Comprador',
    text: 'La plataforma tiene una presentación elegante y permite conocer los detalles de cada artículo antes de participar.',
    initials: 'CR'
  },
  {
    id: 3,
    name: 'Andrés P.',
    role: 'Vendedor',
    text: 'Me parece una excelente alternativa para dar visibilidad a artículos que tienen un valor especial.',
    initials: 'AP'
  }
];

function Testimonials() {
  return (
    <section className="testimonials-section-hs">
      <div className="container">
        <div className="testimonials-heading-hs">
          <span className="eyebrow-hs">NUESTRA COMUNIDAD</span>

          <h2>
            Una experiencia que <span>inspira confianza.</span>
          </h2>

          <p>
            Descubre lo que representa una experiencia de subastas
            sencilla, cercana y especial.
          </p>
        </div>

        <div className="testimonials-grid-hs">
          {testimonials.map((testimonial) => (
            <article
              className="testimonial-card-hs"
              key={testimonial.id}
            >
              <div className="testimonial-stars-hs">
                ★★★★★
              </div>

              <p className="testimonial-text-hs">
                “{testimonial.text}”
              </p>

              <div className="testimonial-author-hs">
                <div className="testimonial-avatar-hs">
                  {testimonial.initials}
                </div>

                <div>
                  <h3>{testimonial.name}</h3>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
