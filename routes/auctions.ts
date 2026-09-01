import express, { Router } from 'express';
import {
    createAuction,
    getAuctions,
    getAuction,
    placeBid,
    cancelAuction
} from '../controllers/auctions';

const auctionRouter: Router = express.Router();

auctionRouter.get('/auctions', getAuctions);
auctionRouter.get('/auctions/:id', getAuction);
auctionRouter.post('/auctions', createAuction);
auctionRouter.post('/auctions/:id/bids', placeBid);
auctionRouter.patch('/auctions/:id/cancel', cancelAuction);

export default auctionRouter;