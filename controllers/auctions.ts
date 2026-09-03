import { Request, Response } from 'express';

import { CreateAuction } from '../application/use-cases/CreateAuction';
import { GetAuctions } from '../application/use-cases/GetAuctions';
import { GetAuction } from '../application/use-cases/GetAuction';
import { PlaceBid } from '../application/use-cases/PlaceBid';
import { CancelAuction } from '../application/use-cases/CancelAuction';
import { CloseAuction } from '../application/use-cases/CloseAuction';

import { Bid } from '../domain/entities/Bid';

import { InMemoryAuctionRepository } from '../infrastructure/repositories/InMemoryAuctionRepository';
import { InMemoryPaymentRepository } from '../infrastructure/repositories/InMemoryPaymentRepository';

const auctionRepository =
    new InMemoryAuctionRepository();

const paymentRepository =
    new InMemoryPaymentRepository();

export const getAuctions = (
    request: Request,
    response: Response
): void => {

    console.log('Consultando subastas', request.query);

    const getAuctions =
        new GetAuctions(auctionRepository);

    const result =
        getAuctions.execute();

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

    const getAuction =
        new GetAuction(auctionRepository);

    const result =
        getAuction.execute(Number(id));

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

    const {
        articleId,
        sellerId,
        categoryId,
        basePrice,
        minimumIncrement,
        createdAt,
        closingAt,
        status
    } = request.body;

    try {

        const createAuction =
            new CreateAuction(
                auctionRepository
            );

        // RN-01, RN-02 y RN-03 se validan en el dominio.
        const auction =
            createAuction.execute(
                auctionRepository.getAll().length + 1,
                articleId,
                sellerId,
                categoryId,
                basePrice,
                minimumIncrement,
                new Date(createdAt),
                new Date(closingAt),
                status
            );

        console.log(
            'Subasta creada:',
            auction.id
        );

        response.status(201).json({
            ok: true,
            data: auction
        });

    } catch (error) {

        response.status(400).json({
            ok: false,
            code: 'AUCTION_CREATION_ERROR',
            message: error instanceof Error
                ? error.message
                : 'No fue posible crear la subasta'
        });
    }
};

export const placeBid = (
    request: Request,
    response: Response
): void => {

    const { id } = request.params;
    const { userId, amount } = request.body;

    const auction =
        auctionRepository.getById(
            Number(id)
        );

    if (auction === undefined) {
        response.status(404).json({
            ok: false,
            code: 'AUCTION_NOT_FOUND',
            message: 'La subasta no fue encontrada'
        });
        return;
    }

    try {

        const bid =
            new Bid(
                auction.bids.length + 1,
                userId,
                auction.id,
                amount,
                new Date()
            );

        const placeBid =
            new PlaceBid(
                auctionRepository
            );

        // RN-06 a RN-10 se validan en Auction.
        const result =
            placeBid.execute(
                auction,
                bid
            );

        console.log(
            'Puja aceptada:',
            bid.id
        );

        response.status(201).json({
            ok: true,
            data: result
        });

    } catch (error) {

        // RN-12: registra pujas rechazadas.
        console.log(
            'Puja rechazada'
        );

        response.status(400).json({
            ok: false,
            code: 'BID_REJECTED',
            message: error instanceof Error
                ? error.message
                : 'No fue posible registrar la puja'
        });
    }
};

export const cancelAuction = (
    request: Request,
    response: Response
): void => {

    const { id } = request.params;

    const auction =
        auctionRepository.getById(
            Number(id)
        );

    if (auction === undefined) {
        response.status(404).json({
            ok: false,
            code: 'AUCTION_NOT_FOUND',
            message: 'La subasta no fue encontrada'
        });
        return;
    }

    try {

        const cancelAuction =
            new CancelAuction();

        // RN-04 se valida en Auction.
        const result =
            cancelAuction.execute(
                auction
            );

        console.log(
            'Subasta cancelada:',
            auction.id
        );

        response.status(200).json({
            ok: true,
            data: result
        });

    } catch (error) {

        response.status(400).json({
            ok: false,
            code: 'AUCTION_CANCEL_ERROR',
            message: error instanceof Error
                ? error.message
                : 'No fue posible cancelar la subasta'
        });
    }
};

export const closeAuction = (
    request: Request,
    response: Response
): void => {

    const { id } = request.params;

    const auction =
        auctionRepository.getById(
            Number(id)
        );

    if (auction === undefined) {
        response.status(404).json({
            ok: false,
            code: 'AUCTION_NOT_FOUND',
            message: 'La subasta no fue encontrada'
        });
        return;
    }

    try {

        const closeAuction =
            new CloseAuction(
                paymentRepository
            );

        // RN-13, RN-14, RN-15 y RN-16.
        const paymentOrder =
            closeAuction.execute(
                auction,
                paymentRepository.getOrderById(
                    auction.id
                ) === undefined
                    ? auction.id
                    : auction.id + 1
            );

        console.log(
            'Subasta cerrada:',
            auction.id
        );

        response.status(200).json({
            ok: true,
            data: paymentOrder
        });

    } catch (error) {

        response.status(400).json({
            ok: false,
            code: 'AUCTION_CLOSE_ERROR',
            message: error instanceof Error
                ? error.message
                : 'No fue posible cerrar la subasta'
        });
    }
};