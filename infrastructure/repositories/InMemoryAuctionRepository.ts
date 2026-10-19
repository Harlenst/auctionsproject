
import { Auction } from '../../domain/entities/Auction';
import { AuctionRepository } from '../../application/ports/AuctionRepository';

export class InMemoryAuctionRepository implements AuctionRepository {
    private auctions: Auction[] = [];
    private lastId = 0;
    private lastBidId = 0;

    getAll(): Auction[] {
        return this.auctions;
    }

    getById(id: number): Auction | undefined {
        return this.auctions.find((auction) => auction.id === id);
    }

    generateId(): number {
        this.lastId += 1;
        return this.lastId;
    }

    generateBidId(): number {
        this.lastBidId += 1;
        return this.lastBidId;
    }

    save(auction: Auction): void {
        const existingAuction = this.getById(auction.id);

        if (existingAuction === undefined) {
            this.auctions.push(auction);
        }

        this.lastId = Math.max(this.lastId, auction.id);
    }
}
