import { Auction } from '../../domain/entities/Auction';
import { PaymentOrder } from '../../domain/entities/PaymentOrder';

export class CloseAuction {

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

        return paymentOrder;
    }
}