
import { Request, Response } from 'express';
import { getIO } from '../infrastructure/websocket/SocketServer';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { HttpError } from '../application/errors/HttpError';

import { CreateAuction } from '../application/use-cases/CreateAuction';
import { GetAuctions } from '../application/use-cases/GetAuctions';
import { GetAuction } from '../application/use-cases/GetAuction';
import { PlaceBid } from '../application/use-cases/PlaceBid';
import { CancelAuction } from '../application/use-cases/CancelAuction';
import { CloseAuction } from '../application/use-cases/CloseAuction';
import { paymentRepository } from '../infrastructure/repositories/repositories';
import { MongoAuctionRepository } from '../infrastructure/repositories/MongoAuctionRepository';
import { Bid } from '../domain/entities/Bid';
import { GetAuctionsWithArticles } from '../application/use-cases/GetAuctionsWithArticles';
import { MongoArticleRepository } from '../infrastructure/repositories/MongoArticleRepository';

// Repositorio persistente de subastas
const auctionRepository = new MongoAuctionRepository();
const articleRepository = new MongoArticleRepository();

export const getAuctions = async (
    request: Request,
    response: Response
): Promise<void> => {

    console.log('Consultando subastas', request.query);

    const useCase = new GetAuctionsWithArticles(
        auctionRepository,
        articleRepository
    );

    const result = await useCase.execute();

    response.status(200).json({
        ok: true,
        data: result
    });
};


export const getAuction = async (
    request: Request,
    response: Response
): Promise<void> => {

    const { id } = request.params;

    const useCase = new GetAuction(
        auctionRepository,
        paymentRepository
    ); const result = await useCase.execute(Number(id));

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

export const createAuction = async (
    request: Request,
    response: Response
): Promise<void> => {

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
        const useCase = new CreateAuction(auctionRepository, articleRepository);

        const auction = await useCase.execute(
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

export const placeBid = async (
    request: Request,
    response: Response
): Promise<void> => {

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

    const auction = await auctionRepository.getById(Number(id));

    if (auction === undefined) {
        response.status(404).json({
            ok: false,
            code: 'AUCTION_NOT_FOUND',
            message: 'La subasta no fue encontrada'
        });
        return;
    }

    try {
        const bidId = await auctionRepository.generateBidId();

        const bid = new Bid(
            bidId,
            user.userId,
            auction.id,
            amount,
            new Date()
        );

        const useCase = new PlaceBid(
            auctionRepository,
            paymentRepository
        ); const result = await useCase.execute(auction, bid);

        // Notificar a todos los participantes de esta subasta
        getIO()
            .to(`auction:${auction.id}`)
            .emit('bid:created', {
                auctionId: auction.id,
                bid: result,
                message: 'Se ha registrado una nueva oferta'
            });

        console.log('Puja aceptada:', bid.id);
        console.log('Notificación Socket.IO enviada:', auction.id);

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

export const cancelAuction = async (
    request: Request,
    response: Response
): Promise<void> => {

    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
        throw new HttpError(
            401,
            'UNAUTHORIZED',
            'Debes iniciar sesión'
        );
    }

    const auction = await auctionRepository.getById(Number(id));

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
        const useCase = new CancelAuction();

        const result = useCase.execute(
            auction,
            user.userId
        );

        // Persistir el nuevo estado
        await auctionRepository.save(auction);

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

export const closeAuction = async (
    request: Request,
    response: Response
): Promise<void> => {

    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
        throw new HttpError(
            401,
            'UNAUTHORIZED',
            'Debes iniciar sesión'
        );
    }

    const auction = await auctionRepository.getById(Number(id));

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
        const useCase = new CloseAuction(paymentRepository);

        const paymentOrderId = await paymentRepository.generateOrderId();
        const paymentOrder = useCase.execute(
            auction,
            paymentOrderId
        );

        // Persistir el estado cerrado o desierto
        await auctionRepository.save(auction);

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
