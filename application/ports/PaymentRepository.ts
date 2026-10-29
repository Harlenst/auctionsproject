
import { PaymentEvent } from '../../domain/entities/PaymentEvent';
import { PaymentOrder } from '../../domain/entities/PaymentOrder';

export interface PaymentRepository {

    generateOrderId(): number;

    getOrderById(id: number): PaymentOrder | undefined;

    getOrderByAuctionId(auctionId: number): PaymentOrder | undefined;

    getOrdersByWinnerId(winnerId: number): PaymentOrder[];

    saveOrder(order: PaymentOrder): void;

    getEventById(id: number): PaymentEvent | undefined;

    saveEvent(event: PaymentEvent): void;
}
