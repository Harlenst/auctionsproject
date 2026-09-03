import { Auction } from '../../domain/entities/Auction';

export interface AuctionRepository {
    getAll(): Auction[];
    getById(id: number): Auction | undefined;
    save(auction: Auction): void;
}