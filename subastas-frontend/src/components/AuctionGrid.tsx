
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import AuctionCard from './AuctionCard';
import type { Auction } from './AuctionCard';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

interface AuctionGridProps {
  onBid: (auction: Auction) => void;
}

function AuctionGrid({ onBid }: AuctionGridProps) {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let socket: Socket | null = null;
    let active = true;

    async function loadAuctions() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_URL}/auctions`);

        if (!response.ok) {
          throw new Error('No fue posible consultar las subastas.');
        }

        const result = await response.json();

        if (!result.ok || !Array.isArray(result.data)) {
          throw new Error('La respuesta del servidor no es válida.');
        }

        if (!active) return;

        setAuctions(result.data);

        socket = io(SOCKET_URL);

        socket.on('connect', () => {
          setConnected(true);

          result.data.forEach((auction: Auction) => {
            socket?.emit('auction:join', auction.id);
          });
        });

        socket.on('disconnect', () => {
          setConnected(false);
        });

        socket.on('bid:created', (data: {
          auctionId: number;
          bid: Auction['bids'][number];
        }) => {
          setAuctions((current) =>
            current.map((auction) => {
              if (auction.id !== data.auctionId) {
                return auction;
              }

              const exists = auction.bids.some(
                (bid) => bid.id === data.bid.id
              );

              if (exists) return auction;

              return {
                ...auction,
                bids: [...auction.bids, data.bid]
              };
            })
          );
        });

      } catch (err) {
        console.error('Error consultando subastas:', err);

        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Ocurrió un error inesperado.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAuctions();

    return () => {
      active = false;
      socket?.disconnect();
    };
  }, []);

  return (
    <section className="auction-section-hs" id="subastas">
      <div className="container">
        <div className="section-heading-hs">
          <div>
            <span className="eyebrow-hs">
              SELECCIÓN DE LA SEMANA
            </span>

            <h2>
              Subastas <span>destacadas</span>
            </h2>
          </div>

          <div className="connection-status">
            <span className={connected ? 'online-dot' : 'offline-dot'} />
            {connected ? 'SUBASTAS EN VIVO' : 'CONECTANDO...'}
          </div>
        </div>

        <p className="section-description-hs">
          Descubre piezas singulares, conoce sus detalles y participa
          en las subastas disponibles.
        </p>

        {loading && (
          <div className="auction-message">
            <h3>Cargando lotes...</h3>
            <p>Consultando nuestro catálogo de subastas.</p>
          </div>
        )}

        {!loading && error && (
          <div className="auction-message">
            <h3>No pudimos cargar las subastas</h3>
            <p>{error}</p>

            <button
              className="btn-hs btn-gold"
              onClick={() => window.location.reload()}
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        {!loading && !error && auctions.length === 0 && (
          <div className="auction-message">
            <h3>Próximamente nuevos lotes</h3>
            <p>
              Estamos preparando nuevas piezas para nuestra comunidad.
            </p>
          </div>
        )}

        {!loading && !error && auctions.length > 0 && (
          <div className="auction-grid-hs">
            {auctions.map((auction) => (
              <AuctionCard
                key={auction.id}
                auction={auction}
                onBid={onBid}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AuctionGrid;
