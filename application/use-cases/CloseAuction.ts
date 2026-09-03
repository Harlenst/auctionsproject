import { Auction } from '../../domain/entities/Auction';
import { PaymentOrder } from '../../domain/entities/PaymentOrder';
import { PaymentRepository } from '../ports/PaymentRepository';

export class CloseAuction {

    private repository: PaymentRepository;

    constructor(repository: PaymentRepository) {
        this.repository = repository;
    }

    execute(
        auction: Auction,
        paymentOrderId: number
    ): PaymentOrder | null {

        if (
            auction.status.getValue() === 'closed' ||
            auction.status.getValue() === 'deserted'
        ) {
            return null;
        }

        auction.close();

        if (
            auction.status.getValue() === 'deserted'
        ) {
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

        this.repository.saveOrder(paymentOrder);

        return paymentOrder;
    }
}