
import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { HttpError } from '../application/errors/HttpError';
import { GetPaymentOrders } from '../application/use-cases/GetPaymentOrders';
import { paymentRepository } from '../infrastructure/repositories/repositories';
import { ExpirePaymentOrder } from '../application/use-cases/ExpirePaymentOrder';

export const getMyPaymentOrders = (
    request: AuthenticatedRequest,
    response: Response
): void => {
    if (!request.user) {
        throw new HttpError(
            401,
            'UNAUTHORIZED',
            'Debes iniciar sesión'
        );
    }

    const getPaymentOrders = new GetPaymentOrders(paymentRepository);
    const orders = getPaymentOrders.execute(request.user.userId);

    response.status(200).json({
        ok: true,
        data: orders
    });
};


export const expireMyPaymentOrder = (
    request: AuthenticatedRequest,
    response: Response
): void => {
    const user = request.user;

    if (!user) {
        throw new HttpError(
            401,
            'UNAUTHORIZED',
            'Debes iniciar sesión'
        );
    }

    const orderId = Number(request.params.id);

    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
        throw new HttpError(
            400,
            'INVALID_ORDER_ID',
            'El ID de la orden no es válido'
        );
    }

    const order = paymentRepository.getOrderById(orderId);

    if (!order) {
        throw new HttpError(
            404,
            'PAYMENT_ORDER_NOT_FOUND',
            'La orden de pago no fue encontrada'
        );
    }

    if (order.winnerId !== user.userId) {
        throw new HttpError(
            403,
            'FORBIDDEN',
            'Solo el ganador puede gestionar esta orden de pago'
        );
    }

    if (order.status === 'confirmed') {
        throw new HttpError(
            400,
            'PAYMENT_ALREADY_CONFIRMED',
            'La orden de pago ya fue confirmada'
        );
    }

    if (new Date() < order.expirationDate) {
        throw new HttpError(
            400,
            'PAYMENT_NOT_EXPIRED',
            'La orden de pago todavía no está vencida'
        );
    }

    const expirePaymentOrder = new ExpirePaymentOrder(
        paymentRepository
    );

    expirePaymentOrder.execute(orderId);

    response.status(200).json({
        ok: true,
        data: order
    });
};

