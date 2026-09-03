import express, { Router } from 'express';
import {
    createAuction,
    getAuctions,
    getAuction,
    placeBid,
    cancelAuction,
    closeAuction
} from '../controllers/auctions';

const auctionRouter: Router = express.Router();

auctionRouter.get('/auctions', getAuctions);
auctionRouter.get('/auctions/:id', getAuction);
auctionRouter.post('/auctions', createAuction);
auctionRouter.post('/auctions/:id/bids', placeBid);
auctionRouter.patch('/auctions/:id/cancel', cancelAuction);
auctionRouter.patch('/auctions/:id/close', closeAuction);

export default auctionRouter;