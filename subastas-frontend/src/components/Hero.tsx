
function Hero() {
  return (
    <section className="hero-hs" id="inicio">
      <div className="hero-overlay">
        <div className="container hero-layout">
          <div className="hero-text">
            <span className="eyebrow-hs">
              OBJETOS EXTRAORDINARIOS · HISTORIAS QUE PERMANECEN
            </span>

            <h1>
              Hay piezas que
              <br />
              merecen <em>otra historia.</em>
            </h1>

            <p>
              Una selección cuidada de arte, diseño y objetos singulares.
              Puja con confianza, conoce el origen de cada pieza y deja
              que la historia continúe contigo.
            </p>

            <div className="hero-actions">
              <a href="#subastas" className="btn-hs btn-gold">
                Ver subastas activas →
              </a>

              <a href="#como-pujar" className="btn-hs btn-outline">
                Cómo funciona
              </a>
            </div>

            <div className="hero-note">
              CURADURÍA INDEPENDIENTE · COLOMBIA
            </div>
          </div>

          <aside className="hero-feature">
            <img
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=850&q=85"
              alt="Reloj clásico de colección"
            />

            <div className="feature-meta">
              <span>◉ LOTE DESTACADO</span>
              <span>CASA HS</span>
            </div>

            <h2>Omega Seamaster Vintage</h2>

            <div className="feature-bottom">
              <div>
                <small>Una pieza extraordinaria</small>
                <strong>Subasta exclusiva</strong>
              </div>

              <a href="#subastas" className="feature-link">
                Explorar →
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Hero;
