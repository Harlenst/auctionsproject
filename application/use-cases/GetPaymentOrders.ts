
import { PaymentRepository } from '../ports/PaymentRepository';

export class GetPaymentOrders {
    constructor(private readonly repository: PaymentRepository) {}

    execute(winnerId: number) {
        return this.repository.getOrdersByWinnerId(winnerId);
    }
}
