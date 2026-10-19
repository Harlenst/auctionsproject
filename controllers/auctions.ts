
import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { HttpError } from '../application/errors/HttpError';
import { CreateAuction } from '../application/use-cases/CreateAuction';
import { GetAuctions } from '../application/use-cases/GetAuctions';
import { GetAuction } from '../application/use-cases/GetAuction';
import { PlaceBid } from '../application/use-cases/PlaceBid';
import { CancelAuction } from '../application/use-cases/CancelAuction';
import { CloseAuction } from '../application/use-cases/CloseAuction';
import { paymentRepository } from '../infrastructure/repositories/repositories';
import { Bid } from '../domain/entities/Bid';

import { InMemoryAuctionRepository } from '../infrastructure/repositories/InMemoryAuctionRepository';

const auctionRepository = new InMemoryAuctionRepository();

export const getAuctions = (
    request: Request,
    response: Response
): void => {
    console.log('Consultando subastas', request.query);

    const getAuctions = new GetAuctions(auctionRepository);
    const result = getAuctions.execute();

    response.json({
        ok: true,
        data: result
    });
};

export const getAuction = (
    request: Request,
    response: Response
): void => {
    const { id } = request.params;

    const getAuction = new GetAuction(auctionRepository);
    const result = getAuction.execute(Number(id));

    if (result === undefined) {
        response.status(404).json({
            ok: false,
            code: 'AUCTION_NOT_FOUND',
            message: 'La subasta no fue encontrada'
        });
        return;
    }

    response.json({
        ok: true,
        data: result
    });
};

export const createAuction = (
    request: Request,
    response: Response
): void => {
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
        throw new HttpError(
            401,
            'UNAUTHORIZED',
            'Debes iniciar sesión'
        );
    }

    const {
        articleId,
        categoryId,
        basePrice,
        minimumIncrement,
        createdAt,
        closingAt,
        status
    } = request.body;

    try {
        const createAuction = new CreateAuction(auctionRepository);

        // El vendedor se obtiene del token, no del cuerpo.
        const auction = createAuction.execute(
            articleId,
            user.userId,
            categoryId,
            basePrice,
            minimumIncrement,
            new Date(createdAt),
            new Date(closingAt),
            status
        );

        console.log('Subasta creada:', auction.id);

        response.status(201).json({
            ok: true,
            data: auction
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new HttpError(
                400,
                'AUCTION_CREATION_ERROR',
                error.message
            );
        }

        throw error;
    }
};
export const placeBid = (
    request: Request,
    response: Response
): void => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
        throw new HttpError(
            401,
            'UNAUTHORIZED',
            'Debes iniciar sesión'
        );
    }

    const { amount } = request.body;

    const auction = auctionRepository.getById(Number(id));

    if (auction === undefined) {
        response.status(404).json({
            ok: false,
            code: 'AUCTION_NOT_FOUND',
            message: 'La subasta no fue encontrada'
        });
        return;
    }

    try {
        const bid = new Bid(
            auctionRepository.generateBidId(),
            user.userId,
            auction.id,
            amount,
            new Date()
        );

        const placeBid = new PlaceBid(auctionRepository);
        const result = placeBid.execute(auction, bid);

        console.log('Puja aceptada:', bid.id);

        response.status(201).json({
            ok: true,
            data: result
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new HttpError(
                400,
                'BID_REJECTED',
                error.message
            );
        }

        throw error;
    }
};

export const cancelAuction = (
    request: Request,
    response: Response
): void => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
        throw new HttpError(
            401,
            'UNAUTHORIZED',
            'Debes iniciar sesión'
        );
    }

    const auction = auctionRepository.getById(Number(id));

    if (auction === undefined) {
        response.status(404).json({
            ok: false,
            code: 'AUCTION_NOT_FOUND',
            message: 'La subasta no fue encontrada'
        });
        return;
    }

    if (auction.sellerId !== user.userId) {
        response.status(403).json({
            ok: false,
            code: 'FORBIDDEN',
            message: 'Solo el vendedor puede cancelar su subasta'
        });
        return;
    }

    try {
        const cancelAuction = new CancelAuction();

        const result = cancelAuction.execute(
            auction,
            user.userId
        );

        console.log('Subasta cancelada:', auction.id);

        response.status(200).json({
            ok: true,
            data: result
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new HttpError(
                400,
                'AUCTION_CANCEL_ERROR',
                error.message
            );
        }

        throw error;
    }
};

export const closeAuction = (
    request: Request,
    response: Response
): void => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
        throw new HttpError(
            401,
            'UNAUTHORIZED',
            'Debes iniciar sesión'
        );
    }

    const auction = auctionRepository.getById(Number(id));

    if (auction === undefined) {
        response.status(404).json({
            ok: false,
            code: 'AUCTION_NOT_FOUND',
            message: 'La subasta no fue encontrada'
        });
        return;
    }

    if (auction.sellerId !== user.userId) {
        response.status(403).json({
            ok: false,
            code: 'FORBIDDEN',
            message: 'Solo el vendedor puede cerrar su subasta'
        });
        return;
    }

    try {
        const closeAuction = new CloseAuction(paymentRepository);

        const paymentOrder = closeAuction.execute(
            auction,
            paymentRepository.getOrderById(auction.id) === undefined
                ? auction.id
                : auction.id + 1
        );

        console.log('Subasta cerrada:', auction.id);

        response.status(200).json({
            ok: true,
            data: paymentOrder
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new HttpError(
                400,
                'AUCTION_CLOSE_ERROR',
                error.message
            );
        }

        throw error;
    }
};
