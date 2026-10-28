
const trustItems = [
  {
    icon: '✦',
    title: 'Piezas seleccionadas',
    description: 'Artículos cuidadosamente presentados'
  },
  {
    icon: '◇',
    title: 'Pujas transparentes',
    description: 'Historial de ofertas verificable'
  },
  {
    icon: '⌑',
    title: 'Experiencia segura',
    description: 'Participación con cuenta registrada'
  },
  {
    icon: '↗',
    title: 'Atención cercana',
    description: 'Acompañamiento durante el proceso'
  }
];

function TrustBar() {
  return (
    <section className="trust-section">
      <div className="container trust-grid">
        {trustItems.map((item) => (
          <article className="trust-item" key={item.title}>
            <span className="trust-icon">{item.icon}</span>

            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TrustBar;
