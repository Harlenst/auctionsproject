import { Request, Response } from 'express';

export const getAuctions = (request: Request, response: Response): void => {

    console.log(request.query);

     response.json({
        ok: true,
        data: []
    });
};

export const getAuction = (request: Request, response: Response): void => {

    const { id } = request.params;

     response.json({
        ok: true,
        data: {
            id: id
        }
    });
};

export const createAuction = (request: Request, response: Response): void => {

    console.log(request.body);

     response.status(201).json({
        ok: true,
        data: request.body
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