import { Bid } from './Bid';
import { RejectedBidAttempt } from './RejectedBidAttempt';
import { Money } from '../value-objects/Money';
import { AuctionStatus } from '../value-objects/AuctionStatus';

export class Auction {

    id: number;
    articleId: number;
    sellerId: number;
    categoryId: number;

    // RN-05: estos datos no pueden modificarse después de publicada la subasta.
    readonly basePrice: Money;
    readonly minimumIncrement: Money;
    readonly closingAt: Date;

    createdAt: Date;
    status: AuctionStatus;
    bids: Bid[];
    rejectedBidAttempts: RejectedBidAttempt[];

    constructor(
        id: number,
        articleId: number,
        sellerId: number,
        categoryId: number,
        basePrice: number,
        minimumIncrement: number,
        createdAt: Date,
        closingAt: Date,
        status: string
    ) {

        // RN-01
        if (basePrice <= 0) {
            throw new Error(
                'El precio base debe ser mayor que cero'
            );
        }

        if (minimumIncrement <= 0) {
            throw new Error(
                'El incremento mínimo debe ser mayor que cero'
            );
        }

        // RN-02
        if (closingAt <= createdAt) {
            throw new Error(
                'La fecha de cierre debe ser posterior a la fecha de publicación'
            );
        }

        const now = new Date();

        if (closingAt <= now) {
            throw new Error(
                'La subasta no puede nacer vencida'
            );
        }

        const duration =
            closingAt.getTime() - createdAt.getTime();

        const oneHour =
            60 * 60 * 1000;

        const thirtyDays =
            30 * 24 * 60 * 60 * 1000;

        // RN-03
        if (duration < oneHour) {
            throw new Error(
                'La duración de la subasta no puede ser menor a una hora'
            );
        }

        if (duration > thirtyDays) {
            throw new Error(
                'La duración de la subasta no puede ser mayor a treinta días'
            );
        }

        this.id = id;
        this.articleId = articleId;
        this.sellerId = sellerId;
        this.categoryId = categoryId;

        this.basePrice = new Money(basePrice);
        this.minimumIncrement = new Money(minimumIncrement);

        this.createdAt = createdAt;
        this.closingAt = closingAt;

        this.status = new AuctionStatus(status);

        this.bids = [];
        this.rejectedBidAttempts = [];
    }

    cancel(): void {

        // RN-04
        if (this.bids.length > 0) {
            throw new Error(
                'La subasta no puede cancelarse porque ya tiene pujas'
            );
        }

        if (this.status.getValue() !== 'open') {
            throw new Error(
                'Solo una subasta abierta puede ser cancelada'
            );
        }

        this.status =
            new AuctionStatus('cancelled');
    }

    registerRejectedBid(
        bid: Bid,
        reason: string
    ): void {

        // RN-12
        const attempt =
            new RejectedBidAttempt(
                this.rejectedBidAttempts.length + 1,
                bid.userId,
                this.id,
                bid.amount.getValue(),
                reason,
                new Date()
            );

        this.rejectedBidAttempts.push(attempt);
    }

    placeBid(bid: Bid): void {

        // RN-06
        if (this.status.getValue() !== 'open') {

            this.registerRejectedBid(
                bid,
                'La subasta no está abierta'
            );

            throw new Error(
                'La subasta no está abierta'
            );
        }

        // RN-07
        if (bid.userId === this.sellerId) {

            this.registerRejectedBid(
                bid,
                'El vendedor no puede pujar en su propia subasta'
            );

            throw new Error(
                'El vendedor no puede pujar en su propia subasta'
            );
        }

        // RN-08
        if (
            this.bids.length === 0 &&
            bid.amount.getValue() < this.basePrice.getValue()
        ) {

            this.registerRejectedBid(
                bid,
                'La primera puja debe ser mayor o igual al precio base'
            );

            throw new Error(
                'La primera puja debe ser mayor o igual al precio base'
            );
        }

        if (this.bids.length > 0) {

            const highestBid =
                this.bids[this.bids.length - 1];

            // RN-10
            if (highestBid.userId === bid.userId) {

                this.registerRejectedBid(
                    bid,
                    'El mejor postor no puede superar su propia puja'
                );

                throw new Error(
                    'El mejor postor no puede superar su propia puja'
                );
            }

            const minimumAmount =
                highestBid.amount.getValue() +
                this.minimumIncrement.getValue();

            // RN-09
            if (bid.amount.getValue() < minimumAmount) {

                this.registerRejectedBid(
                    bid,
                    'La puja debe superar la puja vigente por el incremento mínimo'
                );

                throw new Error(
                    'La puja debe superar la puja vigente por el incremento mínimo'
                );
            }
        }

        // RN-11
        this.bids.push(bid);
    }

    close(): void {

        // RN-16
        if (
            this.status.getValue() === 'closed' ||
            this.status.getValue() === 'deserted'
        ) {
            return;
        }

        if (this.status.getValue() === 'cancelled') {
            throw new Error(
                'Una subasta cancelada no puede cerrarse'
            );
        }

        const now = new Date();

        if (now < this.closingAt) {
            throw new Error(
                'La fecha de cierre de la subasta aún no ha llegado'
            );
        }

        // RN-14
        if (this.bids.length === 0) {

            this.status =
                new AuctionStatus('deserted');

            return;
        }

        // RN-13
        this.status =
            new AuctionStatus('closed');
    }

    getHighestBid(): Bid | null {

        if (this.bids.length === 0) {
            return null;
        }

        return this.bids[this.bids.length - 1];
    }

    getWinner(): Bid | null {

        // RN-13
        if (this.bids.length === 0) {
            return null;
        }

        return this.bids[this.bids.length - 1];
    }

    getPaymentInformation(): {
        winnerId: number;
        amount: number;
        createdAt: Date;
        expirationDate: Date;
    } {

        const winner =
            this.getWinner();

        if (winner === null) {
            throw new Error(
                'La subasta no tiene una puja ganadora'
            );
        }

        // RN-15
        const expirationDate =
            new Date(
                this.closingAt.getTime() +
                48 * 60 * 60 * 1000
            );

        return {
            winnerId: winner.userId,
            amount: winner.amount.getValue(),
            createdAt: new Date(),
            expirationDate: expirationDate
        };
    }
}