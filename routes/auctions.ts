
import express, { Router } from 'express';

import {
    createAuction,
    getAuctions,
    getAuction,
    placeBid,
    cancelAuction,
    closeAuction
} from '../controllers/auctions';

import { authMiddleware } from '../middleware/authMiddleware';

const auctionRouter: Router = express.Router();

// Consultas públicas.
auctionRouter.get('/auctions', getAuctions);
auctionRouter.get('/auctions/:id', getAuction);

// Operaciones que requieren autenticación.
auctionRouter.post('/auctions', authMiddleware, createAuction);
auctionRouter.post('/auctions/:id/bids', authMiddleware, placeBid);
auctionRouter.patch('/auctions/:id/cancel', authMiddleware, cancelAuction);
auctionRouter.patch('/auctions/:id/close', authMiddleware, closeAuction);

export default auctionRouter;
