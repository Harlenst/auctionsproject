
import { PaymentEvent } from '../../domain/entities/PaymentEvent';
import { PaymentOrder } from '../../domain/entities/PaymentOrder';
import { PaymentRepository } from '../../application/ports/PaymentRepository';

export class InMemoryPaymentRepository implements PaymentRepository {

    private orders: PaymentOrder[] = [];
    private events: PaymentEvent[] = [];

    private nextOrderId = 1;

    generateOrderId(): number {
        return this.nextOrderId++;
    }

    getOrderById(id: number): PaymentOrder | undefined {
        return this.orders.find(order => order.id === id);
    }

    getOrderByAuctionId(auctionId: number): PaymentOrder | undefined {
        return this.orders.find(order => order.auctionId === auctionId);
    }

    getOrdersByWinnerId(winnerId: number): PaymentOrder[] {
        return this.orders.filter(order => order.winnerId === winnerId);
    }

    saveOrder(order: PaymentOrder): void {
        const existingOrder = this.getOrderById(order.id);
        const existingAuctionOrder = this.getOrderByAuctionId(order.auctionId);

        if (existingOrder || existingAuctionOrder) {
            throw new Error('La orden de pago ya existe');
        }

        this.orders.push(order);
    }

    getEventById(id: number): PaymentEvent | undefined {
        return this.events.find(event => event.id === id);
    }

    saveEvent(event: PaymentEvent): void {
        const existingEvent = this.getEventById(event.id);

        if (existingEvent === undefined) {
            this.events.push(event);
        }
    }
}
