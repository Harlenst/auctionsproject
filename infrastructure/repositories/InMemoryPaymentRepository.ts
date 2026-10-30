import { PaymentEvent } from '../../domain/entities/PaymentEvent';
import { PaymentOrder } from '../../domain/entities/PaymentOrder';
import { PaymentRepository } from '../../application/ports/PaymentRepository';

export class InMemoryPaymentRepository implements PaymentRepository {

    private orders: PaymentOrder[] = [];
    private events: PaymentEvent[] = [];

    private nextOrderId = 1;

    async generateOrderId(): Promise<number> {
        return this.nextOrderId++;
    }

    async getOrderById(id: number): Promise<PaymentOrder | undefined> {
        return this.orders.find(order => order.id === id);
    }

    async getOrderByAuctionId(
        auctionId: number
    ): Promise<PaymentOrder | undefined> {
        return this.orders.find(order => order.auctionId === auctionId);
    }

    async getOrdersByWinnerId(
        winnerId: number
    ): Promise<PaymentOrder[]> {
        return this.orders.filter(order => order.winnerId === winnerId);
    }

    async saveOrder(order: PaymentOrder): Promise<void> {
        const existingOrderIndex = this.orders.findIndex(
            existing => existing.id === order.id
        );

        const existingAuctionOrder = this.orders.find(
            existing =>
                existing.auctionId === order.auctionId &&
                existing.id !== order.id
        );

        if (existingAuctionOrder) {
            throw new Error('Ya existe una orden para esta subasta');
        }

        if (existingOrderIndex !== -1) {
            this.orders[existingOrderIndex] = order;
            return;
        }

        this.orders.push(order);
    }

    async getEventById(id: number): Promise<PaymentEvent | undefined> {
        return this.events.find(event => event.id === id);
    }

    async saveEvent(event: PaymentEvent): Promise<void> {
        const existingEvent = this.events.find(
            existing => existing.id === event.id
        );

        if (existingEvent === undefined) {
            this.events.push(event);
        }
    }

    async confirmOrderAndSaveEvent(
        order: PaymentOrder,
        event: PaymentEvent
    ): Promise<void> {

        const existingEvent = this.events.find(
            existing => existing.id === event.id
        );

        if (existingEvent) {
            return;
        }

        const orderIndex = this.orders.findIndex(
            existing => existing.id === order.id
        );

        if (orderIndex === -1) {
            throw new Error('La orden de pago no existe');
        }

        const existingAuctionOrder = this.orders.find(
            existing =>
                existing.auctionId === order.auctionId &&
                existing.id !== order.id
        );

        if (existingAuctionOrder) {
            throw new Error('Ya existe una orden para esta subasta');
        }

        this.orders[orderIndex] = order;
        this.events.push(event);
    }
}