
import { Auction } from '../../domain/entities/Auction';

export interface AuctionRepository {
    getAll(): Auction[];
    getById(id: number): Auction | undefined;
    generateId(): number;
    generateBidId(): number;
    save(auction: Auction): void;
}
