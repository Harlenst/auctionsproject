
function SellSection() {
  return (
    <section className="sell-section-hs" id="vender">
      <div className="container">
        <div className="sell-content-hs">
          <div className="sell-text-hs">
            <span className="eyebrow-hs">
              TU PIEZA PUEDE SER LA PRÓXIMA
            </span>

            <h2>
              Dale una nueva historia a tus <span>objetos especiales.</span>
            </h2>

            <p>
              ¿Tienes un artículo único que merece ser descubierto?
              Publica tu pieza y permite que nuestra comunidad participe
              en su próxima historia.
            </p>

            <a href="#registro" className="btn-hs btn-gold">
              Quiero vender mi artículo
              <span> ↗</span>
            </a>

            <div className="sell-benefits-hs">
              <span>✓ Publicación sencilla</span>
              <span>✓ Mayor visibilidad</span>
              <span>✓ Comunidad de compradores</span>
            </div>
          </div>

          <div className="sell-image-hs">
            <img
              src="https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1000"
              alt="Obra de arte en una galería"
              loading="lazy"
            />

            <div className="sell-image-caption-hs">
              <span>CASA DE SUBASTA HS</span>
              <p>Las piezas extraordinarias merecen una gran historia.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SellSection;
