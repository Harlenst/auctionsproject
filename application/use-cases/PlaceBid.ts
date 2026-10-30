
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

        const now = new Date();

        // Comprobar si la subasta venció.
        if (
            auction.status.getValue() === 'open' &&
            now >= auction.closingAt
        ) {
            const existingOrder =
                await this.paymentRepository.getOrderByAuctionId(
                    auction.id
                );

            const paymentOrderId = existingOrder
                ? existingOrder.id
                : await this.paymentRepository.generateOrderId();

            const closeAuction = new CloseAuction(
                this.paymentRepository
            );

            await closeAuction.execute(auction, paymentOrderId);

            // Persistir el cierre de la subasta.
            await this.repository.save(auction);

            throw new Error(
                'La subasta ha finalizado y no acepta nuevas ofertas'
            );
        }

        try {
            auction.placeBid(bid);
        } catch (error) {
            await this.repository.save(auction);
            throw error;
        }

        await this.repository.save(auction);

        return bid;
    }
}
