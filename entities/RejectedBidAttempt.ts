export class RejectedBidAttempt {

    id: number;
    userId: number;
    auctionId: number;
    amount : number;
    motivo: string;
    fecha: Date;

    constructor(
        id: number,
        userId: number,
        auctionId: number,
        amount: number,
        motivo: string,
        fecha: Date
    ) {
        this.id = id;
        this.userId = userId;
        this.auctionId = auctionId;
        this.amount = amount;
        this.motivo = motivo;
        this.fecha = fecha;
    }
}