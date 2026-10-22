
import { Request, Response } from 'express';

import { HttpError } from '../application/errors/HttpError';
import { CreateUser } from '../application/use-cases/CreateUser';
import { LoginUser } from '../application/use-cases/LoginUser';
import { MongoUserRepository } from '../infrastructure/repositories/MongoUserRepository';
import { JwtService } from '../infrastructure/security/JwtService';

const userRepository = new MongoUserRepository();

export const registerUser = async (
    request: Request,
    response: Response
): Promise<void> => {
    const { name, email, password } = request.body;

    try {
        const createUser = new CreateUser(userRepository);
        const user = await createUser.execute(name, email, password);

        response.status(201).json({
            ok: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email.getValue()
            }
        });
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }

        if (error instanceof Error) {
            throw new HttpError(
                400,
                'USER_REGISTRATION_ERROR',
                error.message
            );
        }

        throw error;
    }
};

export const loginUser = async (
    request: Request,
    response: Response
): Promise<void> => {
    const { email, password } = request.body;

    const loginUserUseCase = new LoginUser(
        userRepository,
        new JwtService()
    );

    const { user, token } = await loginUserUseCase.execute(email, password);

    response.status(200).json({
        ok: true,
        data: {
            id: user.id,
            name: user.name,
            email: user.email.getValue(),
            token
        }
    });
};
