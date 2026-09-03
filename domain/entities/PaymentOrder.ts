import { Money } from '../value-objects/Money';

export class PaymentOrder {

    id: number;
    auctionId: number;
    winnerId: number;
    amount: Money;
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

        this.id = id;
        this.auctionId = auctionId;
        this.winnerId = winnerId;

        // RN-21 y RNF-07
        this.amount = new Money(amount);

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

        // RN-17
        this.status = 'confirmed';
    }

    expire(): void {

        if (this.status === 'confirmed') {
            return;
        }

        // RN-20
        this.status = 'expired';
    }
}