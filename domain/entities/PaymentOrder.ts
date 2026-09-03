export class PaymentOrder {

    id: number;
    auctionId: number;
    winnerId: number;
    amount: number;
    createdAt: Date;
    expirationDate: Date;
    status: string;

    constructor(
        id: number,
        auctionId: number,
        winnerId: number,
        amount: number,
        createdAt: Date,
        expirationDate: Date,
        status: string
    ) {
        if (amount < 0) {
            throw new Error(
                'El valor de la orden de pago no puede ser negativo'
            );
        }

        this.id = id;
        this.auctionId = auctionId;
        this.winnerId = winnerId;
        this.amount = amount;
        this.createdAt = createdAt;
        this.expirationDate = expirationDate;
        this.status = status;
    }

    confirm(): void {
        if (this.status === 'confirmed') {
            return;
        }

        if (this.status === 'expired') {
            throw new Error(
                'La orden de pago está vencida'
            );
        }

        this.status = 'confirmed';
    }

    expire(): void {
        if (this.status === 'confirmed') {
            return;
        }

        this.status = 'expired';
    }
}