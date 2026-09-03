export class PaymentEvent {

    id: number;
    orderPaymentId: number;
    status: string;
    createdAt: Date;

    constructor(
        id: number,
        orderPaymentId: number,
        status: string,
        createdAt: Date
    ) {
        this.id = id;
        this.orderPaymentId = orderPaymentId;
        this.status = status;
        this.createdAt = createdAt;
    }
}