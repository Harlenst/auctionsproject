import { PaymentRepository } from '../ports/PaymentRepository';

export class ExpirePaymentOrder {

    private repository: PaymentRepository;

    constructor(repository: PaymentRepository) {
        this.repository = repository;
    }

    execute(orderId: number): void {

        const order =
            this.repository.getOrderById(orderId);

        if (order === undefined) {
            throw new Error(
                'La orden de pago no fue encontrada'
            );
        }

        const now = new Date();

        if (now < order.expirationDate) {
            throw new Error(
                'La orden de pago todavía no está vencida'
            );
        }

        order.expire();

        this.repository.saveOrder(order);
    }
}