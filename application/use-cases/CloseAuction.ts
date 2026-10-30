
import { Auction } from '../../domain/entities/Auction';
import { PaymentOrder } from '../../domain/entities/PaymentOrder';
import { PaymentRepository } from '../ports/PaymentRepository';

export class CloseAuction {
    constructor(
        private repository: PaymentRepository
    ) {}

    async execute(
        auction: Auction,
        paymentOrderId: number
    ): Promise<PaymentOrder | null> {

        const existingOrder =
            await this.repository.getOrderByAuctionId(auction.id);

        if (existingOrder) {
            return existingOrder;
        }

        const status = auction.status.getValue();

        if (status === 'closed' || status === 'deserted') {
            return null;
        }

        auction.close();

        if (auction.status.getValue() === 'deserted') {
            return null;
        }

        const paymentInformation =
            auction.getPaymentInformation();

        const paymentOrder = new PaymentOrder(
            paymentOrderId,
            auction.id,
            paymentInformation.winnerId,
            paymentInformation.amount,
            paymentInformation.createdAt,
            paymentInformation.expirationDate,
            'pending'
        );

        await this.repository.saveOrder(paymentOrder);

        return paymentOrder;
    }
}
