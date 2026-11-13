
import { Bid } from '../../domain/entities/Bid';
import { Auction } from '../../domain/entities/Auction';
import { AuctionRepository } from '../ports/AuctionRepository';
import { PaymentRepository } from '../ports/PaymentRepository';
import { AuctionEventPublisher } from '../ports/AuctionEventPublisher';
import { CloseAuction } from './CloseAuction';

export class PlaceBid {
    constructor(
        private repository: AuctionRepository,
        private paymentRepository: PaymentRepository,
        private eventPublisher?: AuctionEventPublisher
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

            await this.repository.save(auction);

            this.eventPublisher?.auctionClosed(auction);

            throw new Error(
                'La subasta ha finalizado y no acepta nuevas ofertas'
            );
        }

        // Identificar al anterior mejor postor.
        const previousHighestBid = auction.getHighestBid();

        const previousHighestBidderId =
            previousHighestBid?.userId ?? null;

        try {
            // Validar y registrar la nueva puja.
            auction.placeBid(bid);
        } catch (error) {
            await this.repository.save(auction);
            throw error;
        }

        // Guardar la subasta actualizada.
        await this.repository.save(auction);

        // Notificar una sola vez a los participantes.
        console.log('PUBLICANDO NUEVA PUJA:', auction.id);

        this.eventPublisher?.bidCreated(
            auction.id,
            bid
        );

        // Avisar al anterior mejor postor.
        if (
            previousHighestBidderId !== null &&
            previousHighestBidderId !== bid.userId
        ) {
            console.log(
                'PUBLICANDO PUJA SUPERADA:',
                previousHighestBidderId
            );

            this.eventPublisher?.bidOutbid(
                auction.id,
                previousHighestBidderId,
                bid.amount.getValue()
            );
        }

        return bid;
    }
}
