
import { useEffect, useState } from 'react';

export interface Auction {
  id: number;
  articleId: number;
  sellerId: number;
  categoryId: number;
  basePrice: { value: number };
  minimumIncrement: { value: number };
  createdAt: string;
  closingAt: string;
  status: { value: string };
  bids: {
    id: number;
    userId: number;
    auctionId: number;
    amount: { value: number };
    createdAt: string;
  }[];
  article: {
    id: number;
    name: string;
    description: string;
    condition: string;
    imageUrl: string;
  } | null;
}

interface AuctionCardProps {
  auction: Auction;
  onBid: (auction: Auction) => void;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);
}

function getTimeLeft(date: string): string {
  const difference = new Date(date).getTime() - Date.now();

  if (difference <= 0) return 'Finalizada';

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference % 86400000) / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);
  const seconds = Math.floor((difference % 60000) / 1000);

  const clock = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');

  return days > 0 ? `${days}d ${clock}` : clock;
}

function AuctionCard({ auction, onBid }: AuctionCardProps) {
  const imageUrl = auction.article?.imageUrl?.trim() || '';

  const [timeLeft, setTimeLeft] = useState(
    () => getTimeLeft(auction.closingAt)
  );

  const [imageError, setImageError] = useState(false);

  // Reiniciar el estado de la imagen si cambia su URL.
  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  // Actualizar el contador cada segundo.
  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(getTimeLeft(auction.closingAt));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [auction.closingAt]);

  const bids = auction.bids ?? [];

  const currentPrice = bids.length > 0
    ? Math.max(...bids.map(bid => bid.amount.value))
    : auction.basePrice.value;

  const isActive =
    auction.status.value === 'open' &&
    new Date(auction.closingAt).getTime() > Date.now();

  return (
    <article className="lot">
      <div className="photo">
        {imageUrl && !imageError ? (
          <img
            key={imageUrl}
            src={imageUrl}
            alt={auction.article?.name || 'Artículo de subasta'}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="image-placeholder">
            <span>HS</span>
            <small>
              {imageUrl ? 'No se pudo cargar la imagen' : 'Sin fotografía'}
            </small>
          </div>
        )}

        <span className={`state ${isActive ? 'state-active' : 'state-closed'}`}>
          {isActive ? 'En vivo' : 'Finalizada'}
        </span>
      </div>

      <div className="lot-info">
        <div className="lot-heading">
          <span className="cat">LOTE #{auction.id}</span>

          {auction.article?.condition && (
            <span className="lot-condition">
              {auction.article.condition}
            </span>
          )}
        </div>

        <h3>
          {auction.article?.name || 'Artículo sin información'}
        </h3>

        <p className="lot-description">
          {auction.article?.description || 'Sin descripción disponible'}
        </p>

        <div className="stats">
          <div>
            <small>Oferta actual</small>
            <strong>{formatPrice(currentPrice)}</strong>
          </div>

          <div className="bid-count">
            <small>Pujas</small>
            <strong>{bids.length}</strong>
          </div>
        </div>

        <div className="lot-bottom">
          <div className="lot-time">
            <small>{isActive ? 'Tiempo restante' : 'Estado'}</small>
            <span className="timer">{timeLeft}</span>
          </div>

          <button
            className="bid"
            disabled={!isActive}
            onClick={() => onBid(auction)}
          >
            {isActive ? 'Pujar →' : 'Cerrada'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default AuctionCard;
