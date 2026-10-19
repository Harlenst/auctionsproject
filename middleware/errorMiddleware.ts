
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../application/errors/HttpError';

export const errorMiddleware = (
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      ok: false,
      code: error.code,
      message: error.message
    });
    return;
  }

  console.error('Error inesperado en la API:', error);

  response.status(500).json({
    ok: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Ocurrió un error interno en el servidor'
  });
};
