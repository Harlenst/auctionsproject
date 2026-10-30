
import { Auction } from '../../domain/entities/Auction';
import { Bid } from '../../domain/entities/Bid';
import { RejectedBidAttempt } from '../../domain/entities/RejectedBidAttempt';
import { Money } from '../../domain/value-objects/Money';
import { AuctionStatus } from '../../domain/value-objects/AuctionStatus';

import { AuctionRepository } from '../../application/ports/AuctionRepository';
import { AuctionModel } from '../database/models/AuctionModel';
import { CounterModel } from '../database/models/CounterModel';
export class MongoAuctionRepository implements AuctionRepository {

    async getAll(): Promise<Auction[]> {
        const documents = await AuctionModel.find()
            .lean()
            .exec();

        return documents.map((document: any) => this.toDomain(document));
    }

    async getById(id: number): Promise<Auction | undefined> {
        const document = await AuctionModel.findOne({ id })
            .lean()
            .exec();

        if (!document) {
            return undefined;
        }

        return this.toDomain(document);
    }

    async generateId(): Promise<number> {
        const counter = await CounterModel.findOneAndUpdate(
            { _id: 'auctions' },
            { $inc: { sequence: 1 } },
            {
                upsert: true,
                returnDocument: 'after', setDefaultsOnInsert: true
            }
        );

        if (!counter) {
            throw new Error('No fue posible generar el ID de la subasta');
        }

        return counter.sequence;
    }

    async generateBidId(): Promise<number> {
        const counter = await CounterModel.findOneAndUpdate(
            { _id: 'bids' },
            { $inc: { sequence: 1 } },
            {
                upsert: true,
                returnDocument: 'after', setDefaultsOnInsert: true
            }
        );

        if (!counter) {
            throw new Error('No fue posible generar el ID de la oferta');
        }

        return counter.sequence;
    }

    async save(auction: Auction): Promise<void> {
        await AuctionModel.findOneAndUpdate(
            { id: auction.id },
            {
                $set: {
                    id: auction.id,
                    articleId: auction.articleId,
                    sellerId: auction.sellerId,
                    categoryId: auction.categoryId,
                    basePrice: auction.basePrice.getValue(),
                    minimumIncrement: auction.minimumIncrement.getValue(),
                    createdAt: auction.createdAt,
                    closingAt: auction.closingAt,
                    status: auction.status.getValue(),

                    bids: auction.bids.map(bid => ({
                        id: bid.id,
                        userId: bid.userId,
                        auctionId: bid.auctionId,
                        amount: bid.amount.getValue(),
                        createdAt: bid.createdAt
                    })),

                    rejectedBidAttempts: auction.rejectedBidAttempts.map(attempt => ({
                        id: attempt.id,
                        userId: attempt.userId,
                        auctionId: attempt.auctionId,
                        amount: attempt.amount,
                        reason: attempt.reason,
                        createdAt: attempt.createdAt
                    }))
                }
            },
            {
                upsert: true,
                returnDocument: 'after', runValidators: true
            }
        );
    }

    private toDomain(document: any): Auction {
        const bids = document.bids.map((bid: any) =>
            new Bid(
                bid.id,
                bid.userId,
                bid.auctionId,
                bid.amount,
                new Date(bid.createdAt)
            )
        );

        const rejectedAttempts = document.rejectedBidAttempts.map(
            (attempt: any) =>
                new RejectedBidAttempt(
                    attempt.id,
                    attempt.userId,
                    attempt.auctionId,
                    attempt.amount,
                    attempt.reason,
                    new Date(attempt.createdAt)
                )
        );

        const auction = Object.assign(
            Object.create(Auction.prototype),
            {
                id: document.id,
                articleId: document.articleId,
                sellerId: document.sellerId,
                categoryId: document.categoryId,
                basePrice: new Money(document.basePrice),
                minimumIncrement: new Money(document.minimumIncrement),
                createdAt: new Date(document.createdAt),
                closingAt: new Date(document.closingAt),
                status: new AuctionStatus(document.status),
                bids,
                rejectedBidAttempts: rejectedAttempts
            }
        );

        return auction as Auction;
    }
}
