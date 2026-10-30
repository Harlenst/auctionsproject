
import { Auction } from '../../domain/entities/Auction';
import { AuctionRepository } from '../ports/AuctionRepository';
import { PaymentRepository } from '../ports/PaymentRepository';
import { AuctionEventPublisher } from '../ports/AuctionEventPublisher';
import { CloseAuction } from './CloseAuction';

export class GetAuction {
    constructor(
        private repository: AuctionRepository,
        private paymentRepository: PaymentRepository,
        private eventPublisher?: AuctionEventPublisher
    ) {}

    async execute(id: number): Promise<Auction | undefined> {
        const auction = await this.repository.getById(id);

        if (!auction) {
            return undefined;
        }

        const now = new Date();

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

            // Notificar el cierre automático.
            this.eventPublisher?.auctionClosed(auction);
        }

        return auction;
    }
}
