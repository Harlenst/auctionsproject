import { Auction } from '../../domain/entities/Auction';
import { AuctionRepository } from '../../application/ports/AuctionRepository';

export class InMemoryAuctionRepository implements AuctionRepository {

    private auctions: Auction[] = [];

    getAll(): Auction[] {
        return this.auctions;
    }

    getById(id: number): Auction | undefined {
        return this.auctions.find((auction) => {
            return auction.id === id;
        });
    }

    save(auction: Auction): void {
        const existingAuction = this.getById(auction.id);

        if (existingAuction === undefined) {
            this.auctions.push(auction);
        }
    }
}