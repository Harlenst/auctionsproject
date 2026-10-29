
import { Bid } from '../../domain/entities/Bid';
import { Auction } from '../../domain/entities/Auction';
import { AuctionRepository } from '../ports/AuctionRepository';
import { PaymentRepository } from '../ports/PaymentRepository';
import { CloseAuction } from './CloseAuction';

export class PlaceBid {

    constructor(
        private repository: AuctionRepository,
        private paymentRepository: PaymentRepository
    ) {}

    async execute(
        auction: Auction,
        bid: Bid
    ): Promise<Bid> {

        // Comprobar si la subasta venció.
        const now = new Date();

        if (
            auction.status.getValue() === 'open' &&
            now >= auction.closingAt
        ) {
            // Obtener una orden existente o generar un nuevo ID.
            const existingOrder =
                this.paymentRepository.getOrderByAuctionId(auction.id);

            const paymentOrderId = existingOrder
                ? existingOrder.id
                : this.paymentRepository.generateOrderId();

            // Cerrar la subasta y generar la orden si hay ganador.
            const closeAuction = new CloseAuction(
                this.paymentRepository
            );

            closeAuction.execute(auction, paymentOrderId);

            // Persistir el cierre en MongoDB.
            await this.repository.save(auction);

            // Rechazar la oferta porque la subasta ya venció.
            throw new Error(
                'La subasta ha finalizado y no acepta nuevas ofertas'
            );
        }

        try {
            auction.placeBid(bid);
        } catch (error) {
            // Conservar los intentos rechazados en MongoDB.
            await this.repository.save(auction);
            throw error;
        }

        // Persistir la oferta aceptada.
        await this.repository.save(auction);

        return bid;
    }
}
