
import { Auction } from '../../domain/entities/Auction';

export class CancelAuction {
    execute(auction: Auction, userId: number): Auction {
        if (auction.sellerId !== userId) {
            throw new Error(
                'Solo el vendedor puede cancelar su subasta'
            );
        }

        auction.cancel();

        return auction;
    }
}
