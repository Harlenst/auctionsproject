export class RejectedBidAttempt {

    id: number;
    userId: number;
    auctionId: number;
    amount: number;
    reason: string;
    createdAt: Date;

    constructor(
        id: number,
        userId: number,
        auctionId: number,
        amount: number,
        reason: string,
        createdAt: Date
    ) {
        this.id = id;
        this.userId = userId;
        this.auctionId = auctionId;
        this.amount = amount;
        this.reason = reason;
        this.createdAt = createdAt;
    }
}