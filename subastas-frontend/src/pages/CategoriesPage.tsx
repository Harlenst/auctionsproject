
import { useState } from 'react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuctionGrid from '../components/AuctionGrid';
import BidModal from '../components/BidModal';

import { categories } from '../components/Categories';
import type { Auction } from '../components/AuctionCard';

interface CategoriesPageProps {
  onLogin: () => void;
  onRegister: () => void;
  onHome: () => void;
  initialCategoryId: number | null;
}

function CategoriesPage({
  onLogin,
  onRegister,
  onHome,
  initialCategoryId
}: CategoriesPageProps) {
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(initialCategoryId);

  const [selectedAuction, setSelectedAuction] =
    useState<Auction | null>(null);

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId
  );

  return (
    <>
      <Navbar
        onLogin={onLogin}
        onRegister={onRegister}
        onHome={onHome}
        onCategories={() => setSelectedCategoryId(null)}
      />

      <main className="categories-page-hs">

        {/* Encabezado */}
        <section className="categories-hero-hs">
          <div className="container">
            <span className="eyebrow-hs">
              CASA DE SUBASTAS HS
            </span>

            <h1>
              Explora nuestras <span>categorías</span>
            </h1>

            <p>
              Encuentra piezas únicas, descubre nuevos lotes
              y participa en subastas exclusivas.
            </p>
          </div>
        </section>

        {/* Catálogo de categorías */}
        <section className="categories-catalog-hs">
          <div className="container">

            <div className="categories-grid-hs">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={`category-card-hs ${
                    selectedCategoryId === category.id
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedCategoryId(category.id)
                  }
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                  />

                  <div className="category-overlay-hs">
                    <span className="category-number-hs">
                      {String(category.id).padStart(2, '0')}
                    </span>

                    <div>
                      <h3>{category.name}</h3>
                      <p>{category.description}</p>
                    </div>

                    <span className="category-arrow-hs">
                      ↗
                    </span>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* Resultados de las categorías */}
        <section className="category-results-hs">
          <div className="container">

            <div className="category-results-heading-hs">
              <div>
                <span className="eyebrow-hs">
                  {selectedCategory
                    ? 'CATEGORÍA SELECCIONADA'
                    : 'NUESTRO CATÁLOGO'}
                </span>

                <h2>
                  {selectedCategory
                    ? `Subastas de ${selectedCategory.name}`
                    : 'Todas las subastas'}
                </h2>
              </div>

              {selectedCategory && (
                <button
                  type="button"
                  className="btn-hs btn-outline"
                  onClick={() => setSelectedCategoryId(null)}
                >
                  Ver todas
                </button>
              )}
            </div>

            <AuctionGrid
              categoryId={selectedCategoryId ?? undefined}
              heading={
                selectedCategory
                  ? `Lotes de ${selectedCategory.name}`
                  : 'Lotes disponibles'
              }
              description={
                selectedCategory
                  ? `Descubre las piezas disponibles en ${selectedCategory.name}.`
                  : 'Explora todas las piezas disponibles en nuestra casa de subastas.'
              }
              onBid={setSelectedAuction}
            />

          </div>
        </section>

      </main>

      <Footer />

      {selectedAuction && (
        <BidModal
          auction={selectedAuction}
          onClose={() => setSelectedAuction(null)}
        />
      )}
    </>
  );
}

export default CategoriesPage;
