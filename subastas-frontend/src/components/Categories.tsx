
const categories = [
  {
    id: 1,
    name: 'Relojes',
    description: 'Elegancia que trasciende el tiempo',
    image:
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=900'
  },
  {
    id: 2,
    name: 'Arte y pintura',
    description: 'Obras con historia y personalidad',
    image:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900'
  },
  {
    id: 3,
    name: 'Joyas',
    description: 'Detalles únicos y exclusivos',
    image:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900'
  },
  {
    id: 4,
    name: 'Coleccionables',
    description: 'Piezas extraordinarias para coleccionar',
    image:
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=900'
  }
];

function Categories() {
  return (
    <section className="categories-section-hs" id="categorias">
      <div className="container">
        <div className="section-heading-hs">
          <div>
            <span className="eyebrow-hs">EXPLORA NUESTRA COLECCIÓN</span>
            <h2>
              Encuentra tu próxima <span>pieza especial</span>
            </h2>
          </div>
        </div>

        <p className="section-description-hs">
          Explora diferentes categorías y descubre artículos
          seleccionados para nuestra comunidad.
        </p>

        <div className="categories-grid-hs">
          {categories.map((category) => (
            <article className="category-card-hs" key={category.id}>
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
              />

              <div className="category-overlay-hs">
                <span className="category-number-hs">
                  0{category.id}
                </span>

                <div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>

                <span className="category-arrow-hs">↗</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
