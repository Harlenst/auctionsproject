// Creamos las reglas del negocio en la entidad y no en los controladores,
// para que no se repita el código y sea más fácil de mantener.

import { Bid } from './Bid';
import { RejectedBidAttempt } from './RejectedBidAttempt';

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
            throw new Error('Base price must be greater than zero');
        }

        if (minimumIncrement <= 0) {
            throw new Error('Minimum increment must be greater than zero');
        }

        // RN-02
        if (closingAt <= createdAt) {
            throw new Error('Closing date must be after creation date');
        }

        // RN-03
        const duration = closingAt.getTime() - createdAt.getTime();

        const oneHour = 60 * 60 * 1000;
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;

        if (duration < oneHour) {
            throw new Error(
                'Auction duration cannot be less than one hour'
            );
        }

        if (duration > thirtyDays) {
            throw new Error(
                'Auction duration cannot be more than thirty days'
            );
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
        this.rejectedBidAttempts = [];
    }

    // RN-04
    cancel(): void {

        if (this.bids.length > 0) {
            throw new Error(
                'Auction cannot be cancelled because it has bids'
            );
        }

        this.status = 'cancelled';
    }

    // Register a rejected bid attempt
    registerRejectedBid(
        bid: Bid,
        reason: string
    ): void {

        const attempt = new RejectedBidAttempt(
            this.rejectedBidAttempts.length + 1,
            bid.userId,
            this.id,
            bid.amount,
            reason,
            new Date()
        );

        this.rejectedBidAttempts.push(attempt);
    }

    // RN-06 to RN-10
    placeBid(bid: Bid): void {

        // RN-06
        if (this.status !== 'open') {

            this.registerRejectedBid(
                bid,
                'Auction is not open'
            );

            throw new Error('Auction is not open');
        }

        // RN-07
        if (bid.userId === this.sellerId) {

            this.registerRejectedBid(
                bid,
                'Seller cannot bid on their own auction'
            );

            throw new Error(
                'Seller cannot bid on their own auction'
            );
        }

        // RN-08
        if (
            this.bids.length === 0 &&
            bid.amount < this.basePrice
        ) {

            this.registerRejectedBid(
                bid,
                'The first bid must be greater than or equal to the base price'
            );

            throw new Error(
                'The first bid must be greater than or equal to the base price'
            );
        }

        if (this.bids.length > 0) {

            const highestBid =
                this.bids[this.bids.length - 1];

            // RN-10
            if (highestBid.userId === bid.userId) {

                this.registerRejectedBid(
                    bid,
                    'The highest bidder cannot bid again'
                );

                throw new Error(
                    'The highest bidder cannot bid again'
                );
            }

            // RN-09
            const minimumAmount =
                highestBid.amount + this.minimumIncrement;

            if (bid.amount < minimumAmount) {

                this.registerRejectedBid(
                    bid,
                    'Bid must be greater than the current highest bid by the minimum increment'
                );

                throw new Error(
                    'Bid must be greater than the current highest bid by the minimum increment'
                );
            }
        }

        // Accepted bid
        this.bids.push(bid);
    }
}