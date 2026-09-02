import { Request, Response } from 'express';
import { auctions } from '../data/auctions';

export const getAuctions = (request: Request, response: Response): void => {

    console.log(request.query);

    response.json({
        ok: true,
        data: auctions
    });
};
export const getAuction = (request: Request, response: Response): void => {

    const { id } = request.params;

    const result = auctions.filter((auction) => {
        return auction.id.toString() === id;
    });

    response.json({
        ok: true,
        data: result
    });
};

export const createAuction = (request: Request, response: Response): void => {

    const {
        articleName,
        articleDescription,
        articleCondition,
        categoryId,
        basePrice,
        minimumIncrement,
        closingAt
    } = request.body;

    const newAuction = {
        id: auctions.length + 1,
        articleName: articleName,
        articleDescription: articleDescription,
        articleCondition: articleCondition,
        categoryId: categoryId,
        basePrice: basePrice,
        minimumIncrement: minimumIncrement,
        closingAt: closingAt
    };

    auctions.push(newAuction);

    response.status(201).json({
        ok: true,
        data: newAuction
    });
};

export const placeBid = (request: Request, response: Response): void => {

    console.log(request.body);

     response.status(201).json({
        ok: true,
        data: request.body
    });
};

export const cancelAuction = (request: Request, response: Response): void => {

    console.log(request.body);

     response.status(200).json({
        ok: true,
        data: request.body
    });
};