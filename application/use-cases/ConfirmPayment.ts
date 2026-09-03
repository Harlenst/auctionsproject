import { PaymentEvent } from '../../domain/entities/PaymentEvent';
import { PaymentRepository } from '../ports/PaymentRepository';

export class ConfirmPayment {

    private repository: PaymentRepository;

    constructor(repository: PaymentRepository) {
        this.repository = repository;
    }

    execute(
        event: PaymentEvent
    ): void {

        const existingEvent =
            this.repository.getEventById(event.id);

        if (existingEvent !== undefined) {
            return;
        }

        const order =
            this.repository.getOrderById(
                event.orderPaymentId
            );

        if (order === undefined) {
            throw new Error(
                'La orden de pago no fue encontrada'
            );
        }

        if (event.status !== 'confirmed') {
            throw new Error(
                'La notificación de pago no es verificable'
            );
        }

        order.confirm();

        this.repository.saveEvent(event);
        this.repository.saveOrder(order);
    }
}