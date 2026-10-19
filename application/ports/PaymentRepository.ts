
import { PaymentEvent } from '../../domain/entities/PaymentEvent';
import { PaymentOrder } from '../../domain/entities/PaymentOrder';

export interface PaymentRepository {
    getOrderById(id: number): PaymentOrder | undefined;
    getOrdersByWinnerId(winnerId: number): PaymentOrder[];
    saveOrder(order: PaymentOrder): void;
    getEventById(id: number): PaymentEvent | undefined;
    saveEvent(event: PaymentEvent): void;
}
