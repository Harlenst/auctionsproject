import { PaymentEvent } from '../../domain/entities/PaymentEvent';
import { PaymentOrder } from '../../domain/entities/PaymentOrder';

export interface PaymentRepository {

    generateOrderId(): Promise<number>;

    getOrderById(id: number): Promise<PaymentOrder | undefined>;

    getOrderByAuctionId(auctionId: number): Promise<PaymentOrder | undefined>;

    getOrdersByWinnerId(winnerId: number): Promise<PaymentOrder[]>;

    saveOrder(order: PaymentOrder): Promise<void>;

    getEventById(id: number): Promise<PaymentEvent | undefined>;

    saveEvent(event: PaymentEvent): Promise<void>;

    confirmOrderAndSaveEvent(
        order: PaymentOrder,
        event: PaymentEvent
    ): Promise<void>;
}