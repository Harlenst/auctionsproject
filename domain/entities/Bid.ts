import { Money } from '../value-objects/Money';

export class Bid {

    id: number;
    userId: number;
    auctionId: number;
    amount: Money;
    createdAt: Date;

    constructor(
        id: number,
        userId: number,
        auctionId: number,
        amount: number,
        createdAt: Date
    ) {

        this.id = id;
        this.userId = userId;
        this.auctionId = auctionId;
        this.amount = new Money(amount);
        this.createdAt = createdAt;
    }
}