
import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface PublishAuctionProps {
  onBack: () => void;
  onSuccess: () => void;
}

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const categories = [
  { id: 1, name: 'Relojes' },
  { id: 2, name: 'Arte y pintura' },
  { id: 3, name: 'Joyas' },
  { id: 4, name: 'Coleccionables' }
];

function PublishAuction({ onBack, onSuccess }: PublishAuctionProps) {
  const { token } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [categoryId, setCategoryId] = useState('1');
  const [basePrice, setBasePrice] = useState('');
  const [minimumIncrement, setMinimumIncrement] = useState('');
  const [closingAt, setClosingAt] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function readResponse(response: Response) {
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message ||
        result.error ||
        'Ocurrió un error al procesar la solicitud'
      );
    }

    return result;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!token) {
      setError('Debes iniciar sesión para publicar una subasta.');
      return;
    }

    const price = Number(basePrice);
    const increment = Number(minimumIncrement);
    const selectedClosingDate = new Date(closingAt);
    const createdAt = new Date();

    if (price <= 0 || increment <= 0) {
      setError('El precio y el incremento deben ser mayores que cero.');
      return;
    }

    if (Number.isNaN(selectedClosingDate.getTime())) {
      setError('Selecciona una fecha de cierre válida.');
      return;
    }

    const duration =
      selectedClosingDate.getTime() - createdAt.getTime();

    const oneHour = 60 * 60 * 1000;
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    if (duration < oneHour || duration > thirtyDays) {
      setError('La subasta debe durar entre una hora y treinta días.');
      return;
    }

    setLoading(true);

    try {
      // 1. Registrar el artículo.
      const articleResponse = await fetch(`${API_URL}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          condition,
          imageUrl
        })
      });

      const articleResult = await readResponse(articleResponse);

      const article =
        articleResult.data?.article ??
        articleResult.data ??
        articleResult.article ??
        articleResult;

      const articleId = article.id;

      if (!articleId) {
        throw new Error(
          'El artículo se creó, pero no se recibió su identificador.'
        );
      }

      // 2. Crear la subasta asociada al artículo.
      const auctionResponse = await fetch(`${API_URL}/auctions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          articleId,
          categoryId: Number(categoryId),
          basePrice: price,
          minimumIncrement: increment,
          createdAt: createdAt.toISOString(),
          closingAt: selectedClosingDate.toISOString()
        })
      });

      await readResponse(auctionResponse);

      alert('¡Tu artículo y tu subasta fueron publicados correctamente!');
      onSuccess();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible publicar la subasta.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="publish-page">
      <div className="container">
        <button
          type="button"
          className="btn-hs"
          onClick={onBack}
          disabled={loading}
        >
          ← Volver
        </button>

        <div className="section-heading-hs">
          <span className="eyebrow-hs">CASA DE SUBASTA HS</span>
          <h1>Publica tu <span>artículo</span></h1>
          <p>
            Comparte una pieza especial y permite que nuestra comunidad
            participe en su próxima historia.
          </p>
        </div>

        <form className="publish-form-hs" onSubmit={handleSubmit}>
          <h2>Información del artículo</h2>

          <label htmlFor="articleName">Nombre del artículo</label>
          <input
            id="articleName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Reloj clásico"
            required
            maxLength={150}
          />

          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe las características de tu artículo..."
            required
            rows={4}
          />

          <label htmlFor="condition">Estado del artículo</label>
          <input
            id="condition"
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="Ej. Nuevo, usado, excelente estado"
            required
          />

          <label htmlFor="imageUrl">URL de la imagen</label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            required
          />

          <h2>Configuración de la subasta</h2>

          <label htmlFor="category">Categoría</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label htmlFor="basePrice">Precio base (COP)</label>
          <input
            id="basePrice"
            type="number"
            min="1"
            step="1"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            placeholder="Ej. 50000"
            required
          />

          <label htmlFor="minimumIncrement">
            Incremento mínimo (COP)
          </label>
          <input
            id="minimumIncrement"
            type="number"
            min="1"
            step="1"
            value={minimumIncrement}
            onChange={(e) => setMinimumIncrement(e.target.value)}
            placeholder="Ej. 5000"
            required
          />

          <label htmlFor="closingAt">Fecha y hora de cierre</label>
          <input
            id="closingAt"
            type="datetime-local"
            value={closingAt}
            onChange={(e) => setClosingAt(e.target.value)}
            required
          />

          {error && (
            <p className="publish-error-hs" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-hs btn-gold"
            disabled={loading}
          >
            {loading ? 'Publicando...' : 'Publicar subasta ↗'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default PublishAuction;
