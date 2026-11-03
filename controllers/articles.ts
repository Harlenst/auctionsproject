
import { Request, Response } from 'express';
import { HttpError } from '../application/errors/HttpError';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { CreateArticle } from '../application/use-cases/CreateArticle';
import { GetArticles } from  '../application/use-cases/GetArticles';
import { GetArticle } from '../application/use-cases/GetArticle';
import { UpdateArticle } from '../application/use-cases/UpdateArticle';
import { MongoArticleRepository } from '../infrastructure/repositories/MongoArticleRepository';

const articleRepository = new MongoArticleRepository();

export const getArticles = async (
    request: Request,
    response: Response
): Promise<void> => {
    const useCase = new GetArticles(articleRepository);
    const result = await useCase.execute();

    response.status(200).json({
        ok: true,
        data: result
    });
};

export const getArticle = async (
    request: Request,
    response: Response
): Promise<void> => {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        throw new HttpError(400, 'INVALID_ARTICLE_ID', 'ID de artículo inválido');
    }

    const useCase = new GetArticle(articleRepository);
    const result = await useCase.execute(id);

    if (!result) {
        response.status(404).json({
            ok: false,
            code: 'ARTICLE_NOT_FOUND',
            message: 'El artículo no fue encontrado'
        });
        return;
    }

    response.status(200).json({
        ok: true,
        data: result
    });
};


export const createArticle = async (
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

    const { name, description, condition, imageUrl } = request.body;

    if (
        typeof name !== 'string' ||
        typeof description !== 'string' ||
        typeof condition !== 'string' ||
        typeof imageUrl !== 'string'
    ) {
        throw new HttpError(
            400,
            'INVALID_ARTICLE_DATA',
            'Todos los campos deben ser cadenas de texto'
        );
    }

    try {
        const useCase = new CreateArticle(articleRepository);

        const article = await useCase.execute(
            user.userId,
            name,
            description,
            condition,
            imageUrl
        );

        response.status(201).json({
            ok: true,
            data: article
        });
    } catch (error) {
        if (error instanceof HttpError) throw error;

        if (error instanceof Error) {
            throw new HttpError(
                400,
                'ARTICLE_CREATION_ERROR',
                error.message
            );
        }

        throw error;
    }
};


export const updateArticle = async (
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

    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        throw new HttpError(
            400,
            'INVALID_ARTICLE_ID',
            'ID de artículo inválido'
        );
    }

    const { name, description, condition, imageUrl } = request.body;

    if (
        typeof name !== 'string' ||
        typeof description !== 'string' ||
        typeof condition !== 'string' ||
        typeof imageUrl !== 'string'
    ) {
        throw new HttpError(
            400,
            'INVALID_ARTICLE_DATA',
            'Todos los campos deben ser cadenas de texto'
        );
    }

    try {
        const useCase = new UpdateArticle(articleRepository);

        const article = await useCase.execute(
            id,
            name,
            description,
            condition,
            imageUrl,
            user.userId
        );

        if (!article) {
            response.status(404).json({
                ok: false,
                code: 'ARTICLE_NOT_FOUND',
                message: 'El artículo no fue encontrado'
            });
            return;
        }

        response.status(200).json({
            ok: true,
            data: article
        });

    } catch (error) {
        if (error instanceof HttpError) throw error;

        if (error instanceof Error) {
            throw new HttpError(
                403,
                'ARTICLE_UPDATE_FORBIDDEN',
                error.message
            );
        }

        throw error;
    }
};
