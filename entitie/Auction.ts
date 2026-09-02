// Creamos las reglas del negocio en la entidad y no en los controladores,
// para que no se repita el código y sea más fácil de mantener.

import { Bid } from './Bid';

export class Auction {

    id: number;
    articleId: number;
    sellerId: number;
    categoryId: number;
    basePrice: number;
    minimumIncrement: number;
    createdAt: Date;
    closingAt: Date;
    status: string;
    bids: Bid[];

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

        if (basePrice <= 0) {
            throw new Error('Base price must be greater than zero');
        }

        if (minimumIncrement <= 0) {
            throw new Error('Minimum increment must be greater than zero');
        }

        if (closingAt <= createdAt) {
            throw new Error('Closing date must be after creation date');
        }

        const duration = closingAt.getTime() - createdAt.getTime();

        const oneHour = 60 * 60 * 1000;
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;

        if (duration < oneHour) {
            throw new Error('Auction duration cannot be less than one hour');
        }

        if (duration > thirtyDays) {
            throw new Error('Auction duration cannot be more than thirty days');
        }

        this.id = id;
        this.articleId = articleId;
        this.sellerId = sellerId;
        this.categoryId = categoryId;
        this.basePrice = basePrice;
        this.minimumIncrement = minimumIncrement;
        this.createdAt = createdAt;
        this.closingAt = closingAt;
        this.status = status;
        this.bids = [];
    }

    cancel(): void {

        if (this.bids.length > 0) {
            throw new Error('Auction cannot be cancelled because it has bids');
        }

        this.status = 'cancelled';
    }
    placeBid(bid: Bid): void {

    if (this.status !== 'open') {
        throw new Error('Auction is not open');
    }

    if (bid.userId === this.sellerId) {
        throw new Error('Seller cannot bid on their own auction');
    }
}
}