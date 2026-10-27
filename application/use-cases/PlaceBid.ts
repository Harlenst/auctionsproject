
import { Bid } from '../../domain/entities/Bid';
import { Auction } from '../../domain/entities/Auction';
import { AuctionRepository } from '../ports/AuctionRepository';

export class PlaceBid {
    private repository: AuctionRepository;

    constructor(repository: AuctionRepository) {
        this.repository = repository;
    }

    async execute(
        auction: Auction,
        bid: Bid
    ): Promise<Bid> {

        try {
            auction.placeBid(bid);
        } catch (error) {
            // Conserva el intento rechazado en MongoDB.
            await this.repository.save(auction);
            throw error;
        }

        await this.repository.save(auction);

        return bid;
    }
}
