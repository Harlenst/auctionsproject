
function Footer() {
  return (
    <footer className="footer-hs" id="contacto">
      <div className="container">
        <div className="footer-main-hs">
          <div className="footer-brand-hs">
            <a href="#inicio" className="brand-hs">
              <span className="brand-logo">HS</span>

              <span>
                CASA DE SUBASTA
                <small>COLECCIÓN &amp; EXCLUSIVIDAD</small>
              </span>
            </a>

            <p>
              Un espacio para descubrir, compartir y dar valor
              a piezas extraordinarias.
            </p>
          </div>

          <div className="footer-column-hs">
            <h3>Explorar</h3>
            <a href="#subastas">Subastas</a>
            <a href="#categorias">Categorías</a>
            <a href="#como-pujar">Cómo participar</a>
          </div>

          <div className="footer-column-hs">
            <h3>Comunidad</h3>
            <a href="#vender">Vender un artículo</a>
            <a href="#registro">Crear una cuenta</a>
            <a href="#ingresar">Iniciar sesión</a>
          </div>

          <div className="footer-column-hs">
            <h3>Información</h3>
            <a href="#contacto">Contacto</a>
            <a href="#preguntas">Preguntas frecuentes</a>
            <a href="#inicio">Volver arriba ↑</a>
          </div>
        </div>

        <div className="footer-bottom-hs">
          <p>
            © {new Date().getFullYear()} Casa de Subasta HS.
            Todos los derechos reservados.
          </p>

          <span>Diseñado con elegancia.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
