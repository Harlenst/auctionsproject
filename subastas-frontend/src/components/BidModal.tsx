
import { useState, type FormEvent } from 'react';
import type { Auction } from './AuctionCard';
import { useAuth } from '../context/AuthContext';
import { placeBid } from '../services/bidService';

interface BidModalProps {
  auction: Auction;
  onClose: () => void;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);
}

function BidModal({ auction, onClose }: BidModalProps) {
  const { user, token, isAuthenticated } = useAuth();

  const bids = auction.bids ?? [];

  const currentPrice = bids.length > 0
    ? Math.max(...bids.map(bid => bid.amount.value))
    : auction.basePrice.value;

  const minimumNextBid =
    currentPrice + auction.minimumIncrement.value;

  const [amount, setAmount] = useState(String(minimumNextBid));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isSeller = user?.id === auction.sellerId;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!isAuthenticated || !token) {
      setError('Debes iniciar sesión para realizar una puja.');
      return;
    }

    if (isSeller) {
      setError('No puedes pujar en tu propia subasta.');
      return;
    }

    const bidAmount = Number(amount);

    if (!Number.isFinite(bidAmount) || !Number.isInteger(bidAmount)) {
      setError('Introduce un importe válido en pesos colombianos.');
      return;
    }

    if (bidAmount < minimumNextBid) {
      setError(
        `La puja mínima permitida es ${formatPrice(minimumNextBid)}.`
      );
      return;
    }

    try {
      setLoading(true);

      await placeBid(auction.id, bidAmount, token);

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible registrar tu puja.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bid-modal-overlay" onClick={onClose}>
      <section
        className="bid-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bid-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="bid-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        <span className="bid-modal-brand">HS · CASA DE SUBASTA</span>

        {success ? (
          <div className="bid-success">
            <div className="bid-success-icon">✓</div>
            <h2>¡Puja registrada!</h2>
            <p>
              Tu oferta de {formatPrice(Number(amount))} fue enviada
              correctamente.
            </p>
            <button
              className="bid-submit"
              type="button"
              onClick={onClose}
            >
              Continuar
            </button>
          </div>
        ) : (
          <>
            <h2 id="bid-modal-title">Realizar una puja</h2>

            <p className="bid-modal-subtitle">
              {auction.article?.name || `Subasta #${auction.id}`}
            </p>

            <div className="bid-price-summary">
              <div>
                <small>Oferta actual</small>
                <strong>{formatPrice(currentPrice)}</strong>
              </div>

              <div>
                <small>Incremento mínimo</small>
                <strong>
                  {formatPrice(auction.minimumIncrement.value)}
                </strong>
              </div>
            </div>

            {isSeller ? (
              <p className="bid-error">
                Eres el vendedor de este artículo y no puedes pujar.
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor="bid-amount">
                  Tu oferta en pesos colombianos
                </label>

                <input
                  id="bid-amount"
                  type="number"
                  min={minimumNextBid}
                  step="1"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  disabled={loading}
                />

                <p className="bid-minimum">
                  Oferta mínima: {formatPrice(minimumNextBid)}
                </p>

                {error && (
                  <p className="bid-error" role="alert">
                    {error}
                  </p>
                )}

                <button
                  className="bid-submit"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Registrando puja...' : 'Confirmar oferta'}
                </button>
              </form>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default BidModal;
