import { Request, Response } from 'express';

import { CreateAuction } from '../application/use-cases/CreateAuction';
import { GetAuctions } from '../application/use-cases/GetAuctions';
import { GetAuction } from '../application/use-cases/GetAuction';
import { PlaceBid } from '../application/use-cases/PlaceBid';
import { CancelAuction } from '../application/use-cases/CancelAuction';
import { CloseAuction } from '../application/use-cases/CloseAuction';

import { Bid } from '../domain/entities/Bid';

import { InMemoryAuctionRepository } from '../infrastructure/repositories/InMemoryAuctionRepository';

const auctionRepository = new InMemoryAuctionRepository();

export const getAuctions = (
    request: Request,
    response: Response
): void => {

    console.log(request.query);

    const getAuctions = new GetAuctions(
        auctionRepository
    );

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

    const getAuction = new GetAuction(
        auctionRepository
    );

    const result = getAuction.execute(
        Number(id)
    );

    if (result === undefined) {
        response.status(404).json({
            ok: false,
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

        const createAuction = new CreateAuction(
            auctionRepository
        );

        const auction = createAuction.execute(
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

        response.status(201).json({
            ok: true,
            data: auction
        });

    } catch (error) {

        response.status(400).json({
            ok: false,
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

    const auction = auctionRepository.getById(
        Number(id)
    );

    if (auction === undefined) {
        response.status(404).json({
            ok: false,
            message: 'La subasta no fue encontrada'
        });
        return;
    }

    try {

        const bid = new Bid(
            auction.bids.length + 1,
            userId,
            auction.id,
            amount,
            new Date()
        );

        const placeBid = new PlaceBid(
            auctionRepository
        );

        const result = placeBid.execute(
            auction,
            bid
        );

        response.status(201).json({
            ok: true,
            data: result
        });

    } catch (error) {

        response.status(400).json({
            ok: false,
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

    const auction = auctionRepository.getById(
        Number(id)
    );

    if (auction === undefined) {
        response.status(404).json({
            ok: false,
            message: 'La subasta no fue encontrada'
        });
        return;
    }

    try {

        const cancelAuction = new CancelAuction();

        const result = cancelAuction.execute(
            auction
        );

        response.status(200).json({
            ok: true,
            data: result
        });

    } catch (error) {

        response.status(400).json({
            ok: false,
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

    const auction = auctionRepository.getById(
        Number(id)
    );

    if (auction === undefined) {
        response.status(404).json({
            ok: false,
            message: 'La subasta no fue encontrada'
        });
        return;
    }

    try {

        const closeAuction = new CloseAuction();

        const paymentOrder = closeAuction.execute(
            auction,
            auction.id
        );

        response.status(200).json({
            ok: true,
            data: paymentOrder
        });

    } catch (error) {

        response.status(400).json({
            ok: false,
            message: error instanceof Error
                ? error.message
                : 'No fue posible cerrar la subasta'
        });
    }
};