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
        this.id = id;
        this.auctionId = auctionId;
        this.winnerId = winnerId;
        this.amount = amount;
        this.createdAt = createdAt;
        this.expirationDate = expirationDate;
        this.status = status;
    }
}