
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import AuctionCard from './AuctionCard';
import type { Auction } from './AuctionCard';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

interface AuctionGridProps {
  onBid: (auction: Auction) => void;
  categoryId?: number;
  heading?: string;
  description?: string;
}

type CategorizedAuction = Auction & {
  categoryId: number;
};

interface BidCreatedEvent {
  auctionId: number;
  bid: Auction['bids'][number];
}

interface OutbidEvent {
  auctionId: number;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'warning';
}

function AuctionGrid({
  onBid,
  categoryId,
  heading = 'Subastas destacadas',
  description = 'Descubre piezas singulares, conoce sus detalles y participa en las subastas disponibles.'
}: AuctionGridProps) {
  const { token } = useAuth();
  const processedBids = useRef(new Set<number>());
  const processedOutbidEvents = useRef(new Set<string>());


  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  function showNotification(
    title: string,
    message: string,
    type: 'success' | 'warning'
  ) {
    const id = Date.now() + Math.random();

    setNotifications((current) => [
      { id, title, message, type },
      ...current
    ]);
  }

  function removeNotification(id: number) {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  }

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

        if (token) {
          socket = io(SOCKET_URL, {
            auth: { token }
          });

          socket.on('connect', () => {
            if (!active) return;

            setConnected(true);

            result.data.forEach((auction: Auction) => {
              socket?.emit('auction:join', auction.id);
            });
          });

          socket.on('disconnect', () => {
            setConnected(false);
          });

          socket.on('connect_error', (err) => {
            console.error(
              'Error de conexión Socket.IO:',
              err.message
            );
            setConnected(false);
          });

          // Cuando alguien realiza una nueva puja.
          socket.on('bid:created', (data: BidCreatedEvent) => {
            if (!active) return;

            // Evitar procesar dos veces la misma puja.
            if (processedBids.current.has(data.bid.id)) {
              console.log('Puja duplicada ignorada:', data.bid.id);
              return;
            }

            processedBids.current.add(data.bid.id);

            setAuctions((current) =>
              current.map((auction) => {
                if (auction.id !== data.auctionId) {
                  return auction;
                }

                return {
                  ...auction,
                  bids: [...auction.bids, data.bid]
                };
              })
            );

            const amount = Number(data.bid.amount);

            showNotification(
              '¡Nueva puja!',
              `Se recibió una oferta de ${Number.isFinite(amount)
                ? amount.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  maximumFractionDigits: 0
                })
                : 'un nuevo valor'
              } en la subasta #${data.auctionId}.`,
              'success'
            );
          });

          // Cuando otro usuario supera una puja.
          socket.on('bid:outbid', (data: {
            auctionId: number;
            newAmount: number;
            message: string;
          }) => {
            if (!active) return;

            const eventKey = `${data.auctionId}-${data.newAmount}`;

            if (processedOutbidEvents.current.has(eventKey)) {
              console.log('Notificación duplicada ignorada:', eventKey);
              return;
            }

            processedOutbidEvents.current.add(eventKey);

            showNotification(
              'Tu puja ha sido superada',
              `${data.message}. Nueva oferta: ${data.newAmount.toLocaleString('es-CO')} COP.`,
              'warning'
            );
          });
        }
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
  }, [token]);

  const visibleAuctions = categoryId === undefined
    ? auctions
    : auctions.filter(
      (auction) =>
        Number((auction as CategorizedAuction).categoryId) === categoryId
    );

  return (
    <section className="auction-section-hs">
      {/* Notificaciones en tiempo real */}
      <div className="auction-notifications">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`auction-notification ${notification.type
              }`}
            role="status"
          >
            <div className="notification-icon">
              {notification.type === 'success' ? '🔔' : '⚠️'}
            </div>

            <div className="notification-content">
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
            </div>

            <button
              type="button"
              onClick={() => removeNotification(notification.id)}
              aria-label="Cerrar notificación"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="container">
        <div className="section-heading-hs">
          <div>
            <span className="eyebrow-hs">
              {categoryId
                ? 'LOTES POR CATEGORÍA'
                : 'SELECCIÓN DE LA SEMANA'}
            </span>

            <h2>{heading}</h2>
          </div>

          <div className="connection-status">
            <span className={connected ? 'online-dot' : 'offline-dot'} />
            {connected
              ? 'SUBASTAS EN VIVO'
              : 'ACTUALIZACIÓN EN VIVO NO DISPONIBLE'}
          </div>
        </div>

        <p className="section-description-hs">
          {description}
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

        {!loading && !error && visibleAuctions.length === 0 && (
          <div className="auction-message">
            <h3>
              {categoryId
                ? 'Todavía no hay subastas en esta categoría'
                : 'Próximamente nuevos lotes'}
            </h3>
            <p>
              {categoryId
                ? 'Estamos preparando nuevas piezas para esta categoría.'
                : 'Estamos preparando nuevas piezas para nuestra comunidad.'}
            </p>
          </div>
        )}

        {!loading && !error && visibleAuctions.length > 0 && (
          <div className="auction-grid-hs">
            {visibleAuctions.map((auction) => (
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
