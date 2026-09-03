import { Bid } from '../../domain/entities/Bid';
import { Auction } from '../../domain/entities/Auction';
import { AuctionRepository } from '../ports/AuctionRepository';

export class PlaceBid {

    private repository: AuctionRepository;

    constructor(repository: AuctionRepository) {
        this.repository = repository;
    }

    execute(
        auction: Auction,
        bid: Bid
    ): Bid {

        auction.placeBid(bid);

        this.repository.save(auction);

        return bid;
    }
}