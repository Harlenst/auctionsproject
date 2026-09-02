export class Bid {

    id: number;
    userId: number;
    auctionId: number;
    amount: number;
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
        this.amount = amount;
        this.createdAt = createdAt;
    }
}