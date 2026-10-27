
import { Auction } from '../../domain/entities/Auction';

export interface AuctionRepository {
    getAll(): Promise<Auction[]>;
    getById(id: number): Promise<Auction | undefined>;
    generateId(): Promise<number>;
    generateBidId(): Promise<number>;
    save(auction: Auction): Promise<void>;
}
