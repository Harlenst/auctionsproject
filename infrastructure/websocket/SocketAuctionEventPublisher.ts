
import { AuctionEventPublisher } from '../../application/ports/AuctionEventPublisher';
import { Auction } from '../../domain/entities/Auction';
import { Bid } from '../../domain/entities/Bid';
import { getIO } from './SocketServer';

export class SocketAuctionEventPublisher
    implements AuctionEventPublisher {

    bidCreated(auctionId: number, bid: Bid): void {
        getIO()
            .to(`auction:${auctionId}`)
            .emit('bid:created', {
                auctionId,
                bid,
                message: 'Se ha registrado una nueva oferta'
            });
    }

    bidOutbid(
        auctionId: number,
        outbidUserId: number,
        newAmount: number
    ): void {
        getIO()
            .to(`user:${outbidUserId}`)
            .emit('bid:outbid', {
                auctionId,
                newAmount,
                message: 'Tu oferta ha sido superada'
            });
    }

    auctionClosed(auction: Auction): void {
        getIO()
            .to(`auction:${auction.id}`)
            .emit('auction:closed', {
                auctionId: auction.id,
                status: auction.status.getValue(),
                winner: auction.getWinner(),
                message: 'La subasta ha finalizado'
            });
    }
}
