
import { Auction } from '../../domain/entities/Auction';
import { AuctionRepository } from '../ports/AuctionRepository';
import { PaymentRepository } from '../ports/PaymentRepository';
import { CloseAuction } from './CloseAuction';

export class GetAuction {
    constructor(
        private repository: AuctionRepository,
        private paymentRepository: PaymentRepository
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
                this.paymentRepository.getOrderByAuctionId(auction.id);

            const paymentOrderId = existingOrder
                ? existingOrder.id
                : this.paymentRepository.generateOrderId();

            const closeAuction = new CloseAuction(
                this.paymentRepository
            );

            closeAuction.execute(auction, paymentOrderId);

            await this.repository.save(auction);
        }

        return auction;
    }
}
