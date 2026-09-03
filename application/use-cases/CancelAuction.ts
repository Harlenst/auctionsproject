import { Auction } from '../../domain/entities/Auction';

export class CancelAuction {
    execute(auction: Auction): Auction {
        auction.cancel();

        return auction;
    }
}