
import { Auction } from '../../domain/entities/Auction';
import { AuctionRepository } from '../../application/ports/AuctionRepository';

export class InMemoryAuctionRepository implements AuctionRepository {

    private auctions: Auction[] = [];
    private lastId = 0;
    private lastBidId = 0;

    async getAll(): Promise<Auction[]> {
        return this.auctions;
    }

    async getById(id: number): Promise<Auction | undefined> {
        return this.auctions.find(auction => auction.id === id);
    }

    async generateId(): Promise<number> {
        this.lastId++;
        return this.lastId;
    }

    async generateBidId(): Promise<number> {
        this.lastBidId++;
        return this.lastBidId;
    }

    async save(auction: Auction): Promise<void> {
        const index = this.auctions.findIndex(
            existing => existing.id === auction.id
        );

        if (index === -1) {
            this.auctions.push(auction);
        } else {
            this.auctions[index] = auction;
        }

        this.lastId = Math.max(this.lastId, auction.id);
    }
}
