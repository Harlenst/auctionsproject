
import { Auction } from '../../domain/entities/Auction';
import { Bid } from '../../domain/entities/Bid';

export interface AuctionEventPublisher {
    bidCreated(auctionId: number, bid: Bid): void;

    bidOutbid(
        auctionId: number,
        outbidUserId: number,
        newAmount: number
    ): void;

    auctionClosed(auction: Auction): void;
}
