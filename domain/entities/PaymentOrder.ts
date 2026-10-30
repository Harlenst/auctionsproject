
import { Money } from '../value-objects/Money';

export type PaymentOrderStatus =
    | 'pending'
    | 'confirmed'
    | 'expired';

export class PaymentOrder {
    readonly id: number;
    readonly auctionId: number;
    readonly winnerId: number;
    readonly amount: Money;
    readonly createdAt: Date;
    readonly expirationDate: Date;

    status: PaymentOrderStatus;

    constructor(
        id: number,
        auctionId: number,
        winnerId: number,
        amount: number,
        createdAt: Date,
        expirationDate: Date,
        status: PaymentOrderStatus
    ) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('El ID de la orden debe ser positivo');
        }

        if (!Number.isInteger(auctionId) || auctionId <= 0) {
            throw new Error('El ID de la subasta no es válido');
        }

        if (!Number.isInteger(winnerId) || winnerId <= 0) {
            throw new Error('El ID del ganador no es válido');
        }

        if (Number.isNaN(createdAt.getTime())) {
            throw new Error('La fecha de creación no es válida');
        }

        if (Number.isNaN(expirationDate.getTime())) {
            throw new Error('La fecha de expiración no es válida');
        }

        if (expirationDate <= createdAt) {
            throw new Error(
                'La expiración debe ser posterior a la creación'
            );
        }

        if (!['pending', 'confirmed', 'expired'].includes(status)) {
            throw new Error('El estado de la orden no es válido');
        }

        this.id = id;
        this.auctionId = auctionId;
        this.winnerId = winnerId;
        this.amount = new Money(amount);
        this.createdAt = new Date(createdAt);
        this.expirationDate = new Date(expirationDate);
        this.status = status;
    }

    confirm(): void {
        if (this.status === 'confirmed') {
            return;
        }

        if (this.status === 'expired') {
            throw new Error('La orden de pago está vencida');
        }

        if (new Date() >= this.expirationDate) {
            this.status = 'expired';

            throw new Error(
                'La orden de pago ha superado su fecha de expiración'
            );
        }

        this.status = 'confirmed';
    }

    expire(): void {
        if (this.status === 'confirmed') {
            return;
        }

        if (this.status === 'expired') {
            return;
        }

        this.status = 'expired';
    }
}
