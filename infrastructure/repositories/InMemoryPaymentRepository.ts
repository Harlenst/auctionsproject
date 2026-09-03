import { PaymentEvent } from '../../domain/entities/PaymentEvent';
import { PaymentOrder } from '../../domain/entities/PaymentOrder';
import { PaymentRepository } from '../../application/ports/PaymentRepository';

export class InMemoryPaymentRepository
    implements PaymentRepository {

    private orders: PaymentOrder[] = [];
    private events: PaymentEvent[] = [];

    getOrderById(id: number): PaymentOrder | undefined {
        return this.orders.find((order) => {
            return order.id === id;
        });
    }

    saveOrder(order: PaymentOrder): void {
        const existingOrder = this.getOrderById(order.id);

        if (existingOrder === undefined) {
            this.orders.push(order);
        }
    }

    getEventById(id: number): PaymentEvent | undefined {
        return this.events.find((event) => {
            return event.id === id;
        });
    }

    saveEvent(event: PaymentEvent): void {
        const existingEvent = this.getEventById(event.id);

        if (existingEvent === undefined) {
            this.events.push(event);
        }
    }
}