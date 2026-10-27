
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">A</span>
          <span>Subasta<span className="brand-highlight">Pro</span></span>
        </div>

        <nav>
          <a href="#inicio">Inicio</a>
          <a href="#subastas">Explorar subastas</a>
          <a href="#como-funciona">Cómo funciona</a>
        </nav>

        <div className="nav-actions">
          <button className="login-button">Iniciar sesión</button>
          <button className="register-button">Crear cuenta</button>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-content">
            <span className="eyebrow">EL MEJOR LUGAR PARA PUJAR</span>
            <h1>Encuentra oportunidades.<br />
              <span>Haz tu mejor oferta.</span>
            </h1>
            <p>
              Descubre artículos exclusivos, participa en subastas
              y consigue lo que buscas al mejor precio.
            </p>
            <a href="#subastas" className="hero-button">
              Explorar subastas →
            </a>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
                alt="Reloj de lujo"
              />
              <div className="hero-card-info">
                <span>SUBASTA DESTACADA</span>
                <h3>Reloj de colección</h3>
                <p>Una oportunidad exclusiva</p>
              </div>
            </div>
          </div>
        </section>

        <section className="auction-section" id="subastas">
          <div className="section-heading">
            <div>
              <span className="eyebrow">DESCUBRE Y PARTICIPA</span>
              <h2>Subastas destacadas</h2>
              <p>Encuentra productos interesantes y realiza tu oferta.</p>
            </div>
            <span className="live-label">
              <span className="live-dot"></span>
              SUBASTAS EN VIVO
            </span>
          </div>

          <div className="empty-state">
            <div className="empty-icon">⌕</div>
            <h3>Estamos preparando las subastas</h3>
            <p>
              Próximamente podrás explorar los productos disponibles
              y competir con otros participantes en tiempo real.
            </p>
          </div>
        </section>

        <section className="how-section" id="como-funciona">
          <span className="eyebrow">FÁCIL Y SEGURO</span>
          <h2>¿Cómo funciona?</h2>

          <div className="steps">
            <article>
              <span>01</span>
              <h3>Explora</h3>
              <p>Encuentra las subastas que más te interesan.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Participa</h3>
              <p>Realiza ofertas y compite por tus productos favoritos.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Gana</h3>
              <p>Conviértete en el ganador de la subasta.</p>
            </article>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand">
          <span className="brand-icon">A</span>
          <span>Subasta<span className="brand-highlight">Pro</span></span>
        </div>
        <p>Una nueva forma de encontrar oportunidades.</p>
      </footer>
    </div>
  );
}

export default App;
